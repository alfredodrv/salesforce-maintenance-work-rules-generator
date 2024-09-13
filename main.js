import fs from 'fs/promises';
import path from 'path';
import ical from 'ical-generator';

const getArgumentValue = (argName) => {
  const arg = process.argv.find(arg => arg.startsWith(`${argName}=`));
  return arg ? arg.split('=')[1] : null;
};

const isFlagPresent = (flagName) => {
  return process.argv.includes(flagName);
};

const inputFilePath = getArgumentValue('--input-file-path');
const outputFilePath = getArgumentValue('--output-file-path');
const includePastDue = isFlagPresent('--include-past-due');
const showHelp = isFlagPresent('--help');

const generateRRULE = (maintenancePlan) => {
  const frequencyMapping = {
    'Seconds': 'SECONDLY',
    'Minutes': 'MINUTELY',
    'Hours': 'HOURLY',
    'Days': 'DAILY',
    'Weeks': 'WEEKLY',
    'Months': 'MONTHLY',
    'Years': 'YEARLY'
  };
  const frequencyType = frequencyMapping[maintenancePlan.FrequencyType];

  if (!frequencyType) {
    throw new Error(`Invalid FrequencyType: ${maintenancePlan.FrequencyType}`);
  }

  const calendar = ical();
  calendar.createEvent({
    id: maintenancePlan.Id,
    start: new Date(maintenancePlan.StartDate),
    end: new Date(maintenancePlan.EndDate),
    summary: maintenancePlan.MaintenancePlanTitle,
    description: `Maintenance Plan Number: ${maintenancePlan.MaintenancePlanNumber}`,
    repeating: {
      freq: frequencyType,
      interval: maintenancePlan.Frequency,
      until: maintenancePlan.EndDate
    }
  });

  const calendarString = calendar.toString();
  const lines = calendarString.split(/\r?\n/);
  const rruleLine = lines.find(line => line.startsWith('RRULE:'));
  const rrule = rruleLine ? rruleLine.replace('RRULE:', '').trim() : null;
  return rrule;
};

const generateMaintenanceWorkRules = async () => {
  try {
    const rules = [];
    const data = await fs.readFile(inputFilePath, 'utf-8');
    const maintenancePlans = JSON.parse(data);

    maintenancePlans.forEach((mp) => {
      const isPast = new Date(mp.EndDate).getTime() < Date.now();
      if (!isPast || includePastDue) {
        const rule = {
          NextSuggestedMaintenanceDate: mp.NextSuggestedMaintenanceDate,
          ParentMaintenancePlanId: mp.Id,
          Title: `Rule for ${mp.MaintenancePlanTitle} - ${mp.MaintenancePlanNumber}`,
          Type: 'Calendar',
          RecurrencePattern: generateRRULE(mp),
          SortOrder: 1,
        };

        rules.push(rule);
      }
    });

    await fs.writeFile(path.resolve(outputFilePath), JSON.stringify(rules, null, 2));
    console.log('Maintenance Work Rules generated successfully!', rules.length);

  } catch (error) {
    console.error('Error reading or writing files:', error);
  }
};

if (!!showHelp) {
  console.log(`
    Minimum Maintenace Plan required fields to be able to generate the Maintenance Work Rules:
    - Id
    - NextSuggestedMaintenanceDate
    - MaintenancePlanNumber
    - MaintenancePlanTitle
    - StartDate
    - EndDate
    - Frequency
    - FrequencyType


    Usage: node main.js --input-file-path <input-file-path> --output-file-path <output-file-path> --include-past-due <include-past-due>
    Options:
    --input-file-path: The path to the input file containing the maintenance plans.
    --output-file-path: The path to the output file where the maintenance work rules will be saved.
    --include-past-due: (Optional) Whether to include past due maintenance plans or not. Default is false.

    Morte info: https://github.com/alfredodrv/salesforce-maintenance-work-rules-generator
  `);
} else if (!inputFilePath || !outputFilePath) {
  console.error('Please provide the input file path and the output file path. Use --help for more info.');
} else {
  console.log(`
    Generating Maintenance Work Rules...
    Input File Path: ${inputFilePath}
    Output File Path: ${outputFilePath}
    Include Past Due: ${includePastDue}
  `);

  generateMaintenanceWorkRules();
}