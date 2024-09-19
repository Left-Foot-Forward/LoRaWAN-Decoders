/**
 * Function to decode hex payload from Monit'O sensor
 * @param {String} hexPayload - The hex string payload from the sensor
 * @returns {Object} - Decoded sensor data
 */
function decodeHexPayload(hexPayload) {
  let bytes = hexToBytes(hexPayload);
  let data = {};
  let errors = [];

  try {
    if (bytes.length !== 11) {
      throw new Error("Invalid payload length. Expected 11 bytes.");
    }

    // Battery Voltage (Bytes 0-1, big-endian)
    let batteryVoltageRaw = (bytes[0] << 8) | bytes[1];
    data.battery_voltage = (batteryVoltageRaw / 1000).toFixed(3) + " V";

    // Shunt Voltage (Bytes 2-3, big-endian)
    let shuntVoltageRaw = (bytes[2] << 8) | bytes[3];
    data.shunt_voltage = (shuntVoltageRaw / 1000).toFixed(3) + " V";

    // Current Measurement (Bytes 4-5, big-endian)
    let currentRaw = (bytes[4] << 8) | bytes[5];
    data.current_measurement = (currentRaw / 1000).toFixed(3) + " A";

    // RSSI (Byte 6)
    let rssiRaw = bytes[6];
    data.rssi = rssiRaw + " dBm";

    // SNR (Byte 7)
    let snrRaw = bytes[7];
    data.snr = snrRaw + " dB";

    // Temperature (Bytes 8-9, big-endian)
    let temperatureRaw = (bytes[8] << 8) | bytes[9];
    data.temperature = (temperatureRaw / 100).toFixed(2) + " °C";

    // Uplink Counter (Bytes 10-11)
    let uplinkCounterRaw = (bytes[10] << 8) | bytes[11];
    data.uplink_counter = uplinkCounterRaw;
  } catch (error) {
    errors.push(error.message);
  }

  return {
    data: data,
    errors: errors.length ? errors : undefined,
  };
}

/**
 * Helper function to convert hex string to byte array
 * @param {String} hex - Hex string
 * @returns {Array} - Byte array
 */
function hexToBytes(hex) {
  let bytes = [];
  for (let c = 0; c < hex.length; c += 2) {
    bytes.push(parseInt(hex.substr(c, 2), 16));
  }
  return bytes;
}

// Example usage
const payload = "110a000c0055393ed376e2";
const decodedData = decodeHexPayload(payload);
console.log(decodedData);
