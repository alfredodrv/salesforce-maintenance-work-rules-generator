# Maintenance Work Rules Generator

This repository provides a Node.js script to generate Maintenance Work Rules based on Maintenance Plans extracted from Salesforce. The script reads an input file with Maintenance Plan data, processes each plan to create a recurrence pattern (RRULE), and then generates a corresponding set of Maintenance Work Rules.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
  - [Required Fields](#required-fields)
  - [Command Line Options](#command-line-options)
  - [Example Command](#example-command)
- [Salesforce Fields](#salesforce-fields)
- [Contributing](#contributing)
- [License](#license)

---

## Prerequisites

- **Node.js**: Make sure you have [Node.js](https://nodejs.org/) installed on your machine.
- **Salesforce Data**: Maintenance Plan data from Salesforce, including specific fields necessary for generating Maintenance Work Rules.

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/eduardo-olivares/maintenance-work-rules-generator.git
   cd maintenance-work-rules-generator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

---

## Usage

The script accepts an input file with Maintenance Plans in JSON format and generates an output file containing Maintenance Work Rules. You can run the script using the following command:

```bash
node main.js --input-file-path <input-file-path> --output-file-path <output-file-path> [--include-past-due]
```

### Required Fields

The input Maintenance Plans should include the following fields to generate the Maintenance Work Rules:

- `Id`: Unique identifier of the Maintenance Plan.
- `NextSuggestedMaintenanceDate`: The next suggested maintenance date.
- `MaintenancePlanNumber`: A unique number for the maintenance plan.
- `MaintenancePlanTitle`: The title or name of the maintenance plan.
- `StartDate`: The start date of the maintenance plan.
- `EndDate`: The end date of the maintenance plan.
- `Frequency`: How often the maintenance occurs (number).
- `FrequencyType`: The unit of the frequency (e.g., "Days", "Weeks").

### Command Line Options

- `--input-file-path <input-file-path>`: **(Required)** The path to the input file containing the maintenance plans in JSON format.
- `--output-file-path <output-file-path>`: **(Required)** The path where the output file with the generated Maintenance Work Rules will be saved.
- `--include-past-due`: **(Optional)** Include past-due maintenance plans in the output. If not specified, only future maintenance plans will be processed.
- `--help`: Display help and usage instructions.

### Example Command

```bash
node main.js --input-file-path ./input/maintenance-plans.json --output-file-path ./output/work-rules.json --include-past-due
```

This command generates Maintenance Work Rules from the input JSON file `maintenance-plans.json` and saves the output in `work-rules.json`. It includes plans that are past their end date as well.

---

## Salesforce Fields

The following Salesforce fields can be queried to retrieve the data required for this script. Ensure your Salesforce data includes these fields:

### Sample SOQL Queries:

```sql
SELECT Id, MaintenancePlanNumber, MaintenancePlanTitle, NextSuggestedMaintenanceDate, EndDate, Frequency, FrequencyType, StartDate
FROM MaintenancePlan
```

These fields will be processed by the script to create a Maintenance Work Rule with recurrence patterns based on the frequency of each maintenance plan.

### Additional References:
- [Salesforce Maintenance Plan Object](https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_event.htm)
- [iCal RRULE Generation](https://sebbo2002.github.io/ical-generator/develop/reference/classes/ICalEvent.html#repeating)

---

## Contributing

Contributions are welcome! If you have any improvements or suggestions, feel free to open a pull request or an issue on GitHub.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

## Acknowledgements

This project uses the following libraries:
- [ical-generator](https://sebbo2002.github.io/ical-generator/): For generating calendar events and RRULEs.
- [fs/promises](https://nodejs.org/api/fs.html#fspromisesreadfile): For file operations.

---

This README provides all the essential details about the script, including how to run it, what fields are required, and how to customize it for different use cases. Feel free to adapt this document to match your specific needs or project requirements.