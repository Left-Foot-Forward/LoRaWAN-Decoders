# Monit'O Sensor Payload Decoder
This JavaScript code decodes a hex string payload from a Monit'O sensor, extracting key sensor data such as battery voltage, shunt voltage, current measurement, RSSI, SNR, temperature, and uplink counter.

## Features
- Decodes the sensor data from a hex payload.
- Extracts and formats battery voltage, shunt voltage, current measurement, RSSI, SNR, temperature, and uplink counter.
- Validates payload length (expects 11 bytes).
- Handles decoding errors and provides error messages.

## Usage
### Input
A hex string payload (expected to be 11 bytes long).

### Output
An object containing the decoded sensor data or error messages if the payload is invalid.

### Example
```javascript
const payload = "110a000c0055393ed376e2";
const decodedData = decodeHexPayload(payload);
console.log(decodedData);
```

### Example Output
```json
{
  "data": {
    "battery_voltage": "4.298 V",
    "shunt_voltage": "0.012 V",
    "current_measurement": "0.085 A",
    "rssi": "57 dBm",
    "snr": "62 dB",
    "temperature": "23.98 °C",
    "uplink_counter": 58850
  },
  "errors": undefined
}
```

## Functions
> decodeHexPayload(hexPayload)
- **Parameters**: hexPayload (string) – The hex string payload from the Monit'O sensor.
- **Returns**: An object with the decoded sensor data or errors if applicable.

> hexToBytes(hex)
- **Parameters**: hex (string) – A hex string.
- **Returns**: An array of bytes.

## Error Handling
The code checks for a valid payload length (11 bytes). If the payload is invalid, an error message is returned.
