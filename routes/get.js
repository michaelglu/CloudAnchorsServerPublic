const { Anchor } = require("./../models/anchor.js");
const { APIKEY } = require("./../models/api-key.js");

const getAnchor = anchorID => {
  return new Promise((resolve, reject) => {
    Anchor.findOne({ anchorID }).then(
      anchor => {
        resolve(anchor);
      },
      error => {
        reject({ error: error });
      }
    );
  });
};
const getAll = apiKey => {
  return new Promise((resolve, reject) => {
    Anchor.find({ apiKey: apiKey }).then(
      anchor => {
        resolve(anchor);
      },
      error => {
        reject(error);
      }
    );
  });
};

const getAllKeys = adminID => {
  return new Promise((resolve, reject) => {
    if (!adminID || adminID !== process.env.ADMIN) {
      reject({ error: "Invalid access" });
    } else {
      APIKEY.find().then(
        keys => {
          resolve(keys);
        },
        error => {
          reject({ error: error });
        }
      );
    }
  });
};

module.exports = { getAnchor, getAll, getAllKeys };
