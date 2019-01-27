const { APIKEY } = require("./../models/api-key.js");
const validateAuthKey = apiKey => {
  return new Promise((resolve, reject) => {
    APIKEY.findOne({ keyHash: apiKey }).then(
      key => {
        if (!key) {
          reject({ error: "Could not find key" });
        }
        resolve(apiKey);
      },
      error => {
        reject(error);
      }
    );
  });
};

module.exports = { validateAuthKey };
