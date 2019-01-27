const { CoordinateSystem } = require("./../../models/coordinate-system.js");
const { ObjectId } = require("mongodb");

const createSystem = body => {
  return new Promise((resolve, reject) => {
    const systemOptions = {
      csID: new ObjectId(),
      apiKey: body.apiKey,
      point1: body.point1,
      point2: body.point2,
      point3: body.point3,
      point4: body.point4
    };
    const system = new CoordinateSystem(systemOptions);
    system.save().then(
      () => {
        resolve({ message: "system posted", csID: systemOptions.csID });
      },
      error => {
        reject(error);
      }
    );
  });
};
module.exports = { createSystem };
