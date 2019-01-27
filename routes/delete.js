const { Anchor } = require("./../models/anchor.js");
const { CoordinateSystem } = require("./../models/coordinate-system.js");
const { APIKEY } = require("./../models/api-key.js");

const deleteAnchor = anchorID => {
  return new Promise((resolve, reject) => {
    console.log(anchorID);
    Anchor.deleteOne({ anchorID: anchorID }).then(
      () => {
        resolve({ message: "anchor deleted" });
      },
      error => {
        reject(error);
      }
    );
  });
};
const deleteKey = apiKey => {
  return new Promise((resolve, reject) => {
    APIKEY.deleteOne({ keyHash: apiKey }).then(
      () => {
        console.log(apiKey);
        Anchor.deleteMany({ apiKey }).then(
          () => {
            CoordinateSystem.deleteMany({ apiKey }).then(
              () => {
                resolve({ message: "key deleted" });
              },
              error => {
                reject(error);
              }
            );
          },
          error => {
            reject(error);
          }
        );
      },
      error => {
        reject(error);
      }
    );
  });
};

module.exports = { deleteKey, deleteAnchor };
