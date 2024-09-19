# Monit'o V4 Sensor Decoder

## Overview

This module is designed to decode payloads sent over a LoRaWAN network by a Monit'o V4 IoT device to a sensor dashboard. It handles both standard and batch payloads, extracting parameters and their values to provide meaningful data to the user.

## Features

- **Standard Payload Decoding**: Decodes standard uplink messages containing various sensor readings like voltage, battery level, firmware version, etc.
- **Batch Payload Decoding**: Handles batch reports using Huffman encoding to decode multiple samples efficiently.
- **Error Handling**: Provides detailed error messages and warnings for invalid payloads or decoding issues.
- **Configurable Mapping**: Supports customizable mappings for different sensor types and labels.

## Installation

Simply include the main.js file in your project and require it as needed.

### Importing the Driver

```javascript
const { driver } = require("./main.js");
```

### Decoding an Uplink Payload

```javascript
const input = {
  bytes: [49, 10, 0, 12, 0, 85, 57, 65, 80, 0, 0],
  fPort: 125,
  recvTime: "2023-07-19T07:51:25.508306410Z",
};

const result = driver.decodeUplink(input);
console.log(result);
```

### Expected Output

```json
{
  "data": [
    {
      "variable": "0-70_V",
      "value": 13,
      "date": "2023-07-19T07:51:25.508306410Z"
    }
  ],
  "warnings": []
}
```

## Code Structure

### Modules:

**580**: Handles batch normalization, including Huffman decoding and sample extraction.
**13**: Manages the overall uplink decoding process, invoking standard or batch normalization as needed.
**794**: Performs standard payload normalization, parsing various sensor data types.

### Helper Functions:

- Parsing functions for different data types (e.g., integers, floats).
- Error handling and validation functions.
- Utility functions for bit manipulation and buffer handling.

### Configuration

- **Batch Configuration**: Defined in the batchConfig variable, specifying tag labels, resolutions, sample types, label names, and division factors.
- **Mapping**: The mapping object allows customization of variable names for different sensor types.

## Examples

Several example payloads and their expected outputs are provided in examples.json to help you understand how the decoder works with different types of messages.

## Metadata

The metadata.json file contains important information about the sensor and codec, including:

> Name: Monit'o V4
> Version: 1.0.0
> Codec ID: 0019
> Vendor ID: 0128
> Source URL: GitHub Repository

## Schema Validation

An uplink.schema.json file is included to define the expected structure of the decoded data, useful for validating the output against a JSON schema.

## License

This is a refactored fork from: https://github.com/Watteco/Codec-API-LoRaWAN/tree/main - The original license applies.
