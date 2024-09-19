// main.js

// Define the driver object in an IIFE (Immediately Invoked Function Expression)
var driver = (() => {
  // Define modules to be used within the driver
  var modules = {
    // Module for batch normalization
    580: (module) => {
      // Define constants and sample types
      const SAMPLE_TYPE_6 = 6;
      const SAMPLE_TYPE_10 = 10;
      const SAMPLE_TYPE_12 = 12;
      const MAX_HUFFMAN_LENGTH = 14;

      // Mapping of sample types to their sizes
      let sampleSizes = {
        0: 0,
        1: 1,
        2: 4,
        3: 4,
        4: 8,
        5: 8,
        [SAMPLE_TYPE_6]: 16,
        7: 16,
        8: 24,
        9: 24,
        [SAMPLE_TYPE_10]: 32,
        11: 32,
        [SAMPLE_TYPE_12]: 32,
      };

      // Huffman tables for decoding
      let huffmanTables = [
        [
          { sz: 2, lbl: 0 },
          { sz: 2, lbl: 1 },
          { sz: 2, lbl: 3 },
          { sz: 3, lbl: 5 },
          { sz: 4, lbl: 9 },
          { sz: 5, lbl: 17 },
          { sz: 6, lbl: 33 },
          { sz: 7, lbl: 65 },
          { sz: 8, lbl: 129 },
          { sz: 10, lbl: 512 },
          { sz: 11, lbl: 1026 },
          { sz: 11, lbl: 1027 },
          { sz: 11, lbl: 1028 },
          { sz: 11, lbl: 1029 },
          { sz: 11, lbl: 1030 },
          { sz: 11, lbl: 1031 },
        ],
        // ... Other Huffman tables
      ];

      // Helper function to create uncompressed samples
      function createUncompressedSample(
        bufferHelper,
        sampleType,
        label,
        relativeTimestamp
      ) {
        return {
          uncompressSamples: [
            {
              data_relative_timestamp: relativeTimestamp,
              data: {
                value: getValue(bufferHelper, sampleType),
                label: label,
              },
            },
          ],
          codingType: 0,
          codingTable: 0,
          resolution: null,
        };
      }

      // Function to find index in argument list
      function findLabelIndex(argList, labelObj) {
        for (let i = 0; i < argList.length; i++) {
          if (argList[i].taglbl === labelObj.lbl) return i;
        }
        throw new Error("Batch: Cannot find label in argList");
      }

      // ... Additional helper functions and implementation details

      // Export the module functions
      module.exports = {
        normalisation_batch: function (args) {
          // Implementation of batch normalization
          // ...
          // Return the processed data
          return processedData;
        },
      };
    },

    // Module for decoding uplink messages
    13: (module, exports, require) => {
      // Import required modules
      const standardNormalization = require(794);
      const batchNormalization = require(580);

      // Export the decoding function
      exports.watteco_decodeUplink = function (input, batch1, batch2) {
        const bytes = input.bytes;
        const fPort = input.fPort;
        const recvTime = input.recvTime;

        try {
          // Try standard normalization
          let normalizedData = standardNormalization.normalisation_standard(
            input,
            batch1
          );
          let payload = normalizedData.payload;

          if (normalizedData.type !== "batch") {
            return {
              data: normalizedData.data,
              warnings: normalizedData.warning,
            };
          } else {
            // Handle batch normalization
            let args = {
              batch1: batch1[0],
              batch2: batch1[1],
              payload: payload,
              date: recvTime,
            };
            try {
              return {
                data: batchNormalization.normalisation_batch(args),
                warnings: [],
              };
            } catch (error) {
              return { error: error.message, warnings: [] };
            }
          }
        } catch (error) {
          return { error: error.message, warnings: [] };
        }
      };
    },

    // Module for standard normalization
    794: (module) => {
      // Define the Error class for validation
      class ValidationError extends Error {
        constructor(message) {
          super(message);
          this.name = "ValidationError";
        }
      }

      // Helper functions for parsing and decoding
      // ...

      // Export the standard normalization function
      module.exports = {
        normalisation_standard: function (input, mapping) {
          // Implementation of standard normalization
          // ...
          // Return the processed data
          return processedData;
        },
      };
    },
  };

  // Module cache
  var moduleCache = {};

  // Require function to load modules
  function requireModule(moduleId) {
    var cachedModule = moduleCache[moduleId];
    if (cachedModule !== undefined) {
      return cachedModule.exports;
    }
    var module = (moduleCache[moduleId] = { exports: {} });
    modules[moduleId](module, module.exports, requireModule);
    return module.exports;
  }

  // Main driver object
  var driver = {};

  // Self-invoking function to initialize the driver
  (() => {
    var exports = driver;
    // Import the decoding module
    let decoder = requireModule(13);

    // Configuration for decoding
    let batchConfig = [
      3,
      [
        {
          taglbl: 0,
          resol: 0.02,
          sampletype: 12,
          lblname: "0-100_mV",
          divide: 1,
        },
        { taglbl: 1, resol: 17, sampletype: 12, lblname: "0-70_V", divide: 1 },
        {
          taglbl: 2,
          resol: 100,
          sampletype: 6,
          lblname: "battery_voltage",
          divide: 1000,
        },
        {
          taglbl: 3,
          resol: 100,
          sampletype: 6,
          lblname: "external_level",
          divide: 1000,
        },
      ],
    ];

    let mapping = {
      analog: ["0-100_mV", "0-70_V"],
    };

    // Decode uplink function
    exports.decodeUplink = function (input) {
      return decoder.watteco_decodeUplink(input, batchConfig, mapping);
    };
  })();

  // Return the driver object
  return driver;
})();

// Export the driver module
exports.driver = driver;
