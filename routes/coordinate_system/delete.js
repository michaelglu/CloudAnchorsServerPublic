const { Anchor } = require("./../../models/anchor.js");
const { CoordinateSystem } = require("./../../models/coordinate-system.js");

const deleteSystem = systemID => {
  return new Promise((resolve, reject) => {
    CoordinateSystem.deleteOne({ csID: systemID }).then(
      () => {
        console.log(systemID);
        Anchor.deleteMany({ systemID }).then(
          () => {
            resolve("Deleted");
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

module.exports = { deleteSystem };
