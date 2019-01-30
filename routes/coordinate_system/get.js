const { Anchor } = require("./../../models/anchor.js");
const { CoordinateSystem } = require("./../../models/coordinate-system.js");
const { positionUser } = require("./../../config/positioningAlg.js");
const getAnchorsInSystem = body => {
  return new Promise((resolve, reject) => {
    CoordinateSystem.findOne({ csID: body.csID }).then(
      system => {
        if (!system) {
          reject("Coordinate System not found");
        } else {
          Anchor.find({ systemID: system.csID }).then(
            anchors => {
              console.log(anchors);
              positionUser(
                system,
                body.point1,
                body.point2,
                body.point3,
                body.point4,
                anchors
              ).then(
                transformed => resolve(transformed),
                error => reject(error)
              );
            },
            error => {
              reject(error);
            }
          );
        }
      },
      error => {
        reject(error);
      }
    );
  });
};
module.exports = { getAnchorsInSystem };
