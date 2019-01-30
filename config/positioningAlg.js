const request = require("request");
const mathjs = require("mathjs");

const positionUser = (
  system,
  user_point1,
  user_point2,
  user_point3,
  user_point4,
) => {
  return new Promise((resolve, reject) => {
    console.log("System:" + system);
    requestBody = makeRequestBody(
      system,
      user_point1.rad,
      user_point2.rad,
      user_point3.rad,
      user_point4.rad
    );
    console.log(requestBody);
    request(
      {
        method: "POST",
        url: "https://trilateration.herokuapp.com/trilaterate/",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      },
      (error, response, body) => {
        if (error) {
          reject(error);
        } else {
          console.log("Trilateration results:\n" + body);
          let jBody = JSON.parse(body);
          console.log(JSON.stringify(jBody));
          transformedOrigin = shiftOrigin(system, jBody);
          console.log("System:\n" + JSON.stringify(system));
          console.log("Shifted\n" + JSON.stringify(transformedOrigin));
          const transformationMatrix = getTransformationMatrix(
            transformedOrigin,
            { point1: user_point1, point2: user_point2, point3: user_point3 }
          );
          console.log("MATRIX:\n" + transformationMatrix);
          resolve({ Shift: jBody, matrix: transformationMatrix });
        }
      }
    );
  });
};

const makeRequestBody = (system, rad1, rad2, rad3, rad4) => {
  requestBody = {
    point1: {
      x: system.point1.translation[0],
      y: system.point1.translation[1],
      z: system.point1.translation[2],
      rad: rad1
    },
    point2: {
      x: system.point2.translation[0],
      y: system.point2.translation[1],
      z: system.point2.translation[2],
      rad: rad2
    },
    point3: {
      x: system.point3.translation[0],
      y: system.point3.translation[1],
      z: system.point3.translation[2],
      rad: rad3
    },
    point4: {
      x: system.point4.translation[0],
      y: system.point4.translation[1],
      z: system.point4.translation[2],
      rad: rad4
    }
  };
  return requestBody;
};
const shiftOrigin = (origin, shift) => {
  shifted = {
    point1: shiftPoint(origin.point1, shift),
    point2: shiftPoint(origin.point2, shift),
    point3: shiftPoint(origin.point3, shift),
    point4: shiftPoint(origin.point4, shift)
  };
  return shifted;
};
const shiftPoint = (point, shift) => {
  shifted = point.translation.slice(0);
  shifted[0] -= shift.x;
  shifted[1] -= shift.y;
  shifted[2] -= shift.z;
  return shifted;
};

const getTransformationMatrix = (space1, space2) => {
  let original = mathjs.matrix([
    [space1.point1[0], space1.point2[0], space1.point3[0]],
    [space1.point1[1], space1.point2[1], space1.point3[1]],
    [space1.point1[2], space1.point2[2], space1.point3[2]]
  ]);
  let transformed = mathjs.matrix([
    [space2.point1.x, space2.point2.x, space2.point3.x],
    [space2.point1.y, space2.point2.y, space2.point3.y],
    [space2.point1.z, space2.point2.z, space2.point3.z]
  ]);
  console.log(original + "\n det=" + mathjs.det(original));
  console.log("Transformed");
  console.log(transformed + "\n det=" + mathjs.det(transformed));
  let inverse = mathjs.inv(original);
  console.log("Inverse:\n" + inverse);
  let transMat = mathjs.multiply(transformed, inverse);
  console.log("TransMat:\n" + transMat);
  return transMat;
};

module.exports = { positionUser };
