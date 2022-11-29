const secrets = require('./Secrets');
const GOOGLE_API_KEY = secrets.GOOGLE_API_KEY;

const foo = ({ config }) => {
  const newConfig = {
    ...config,
    ios: {
      ...config.ios,
      config: {
        googleMapsApiKey: GOOGLE_API_KEY
      } 
    },
    android: {
      ...config.android,
      config: {
        googleMaps: {
          apiKey: GOOGLE_API_KEY
        }
      }

    }
  };
  return newConfig;
};

export default foo;