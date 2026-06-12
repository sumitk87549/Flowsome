module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // All other plugins go here (if any)
      'react-native-reanimated/plugin', // ← MUST BE THE VERY LAST ENTRY
    ],
  };
};
