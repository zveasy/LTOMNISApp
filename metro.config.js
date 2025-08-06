const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */

// Determine which port Metro should run on. Default to 8084 (chosen to avoid common
// conflicts) but allow overriding via the standard RCT_METRO_PORT env variable so
// it stays in sync with Xcode and CLI commands.
const port = process.env.RCT_METRO_PORT ? Number(process.env.RCT_METRO_PORT) : 8084;

const config = {
  server: {
    // Tell Metro which port to listen on
    port,

  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);

