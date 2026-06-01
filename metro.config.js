const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts = ['jsx', 'js', 'ts', 'tsx', 'cjs', 'json'];

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'firebase/auth') {
    return context.resolveRequest(context, 'firebase/auth/cordova', platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
