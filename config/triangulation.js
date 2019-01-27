const request = require("request");
const mathjs = require("mathjs");
const triangulate = (system, rad1, rad2, rad3, rad4, anchors) => {
  return new Promise((resolve, reject) => {
    console.log("System:" + system);
    console.log(anchors);
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
          let jbody = JSON.parse(body);
          //jBody: x,y,z location of 2nd user in space
          let transAnchors = addVectors([jbody.x, jbody.y, jbody.z], anchors);
          //transAnchors: anchors from whivh x,y,z location of user 2 is subtracted
          let transformedPoints = {
            pt1: system.point1.translation.slice(0),
            pt2: system.point2.translation.slice(0),
            pt3: system.point3.translation.slice(0),
            pt4: system.point4.translation.slice(0)
          };
          transformedPoints.pt1[0] += jbody.x;
          transformedPoints.pt1[1] += jbody.y;
          transformedPoints.pt1[2] += jbody.z;

          transformedPoints.pt2[0] += jbody.x;
          transformedPoints.pt2[1] += jbody.y;
          transformedPoints.pt2[2] += jbody.z;

          transformedPoints.pt3[0] += jbody.x;
          transformedPoints.pt3[1] += jbody.y;
          transformedPoints.pt3[2] += jbody.z;

          transformedPoints.pt4[0] += jbody.x;
          transformedPoints.pt4[1] += jbody.y;
          transformedPoints.pt4[2] += jbody.z;
          console.log(
            "transformedPoints:\n" + JSON.stringify(transformedPoints)
          );

          console.log(transAnchors);
          let transMatrix = getTransformationMatrix(
            {
              po1: system.point1.translation,
              po2: system.point2.translation,
              po3: system.point3.translation,
              po4: system.point4.translation
            },
            transformedPoints
          );

          const finalAnchors = transformAnchors(transAnchors, transMatrix);
          resolve(finalAnchors);
        }
      }
    );
  });
};
const addVectors = (target, anchors) => {
  console.log(JSON.stringify(target));
  anchors.forEach(anchor => {
    console.log("_______anchor_______\n" + anchor.translation);
    let sum = anchor.translation.map(function(num, idx) {
      return num - target[idx];
    });
    anchor.translation = sum;
    console.log("___Transformed___\n" + anchor.translation);
  });
  return anchors;
};
const getTransformationMatrix = (
  { po1, po2, po3, po4 },
  { pt1, pt2, pt3, pt4 }
) => {
  let original = pickMatrix(po1, po2, po3, po4);
  let transformed = pickMatrix(pt1, pt2, pt3, pt4);
  console.log("Original");
  console.log(original + "\n det=" + mathjs.det(original));
  console.log("Transformed");
  console.log(transformed + "\n det=" + mathjs.det(transformed));
  let inverse = mathjs.inv(original);
  console.log("Inverse:\n" + inverse);
  let transMat = mathjs.multiply(transformed, inverse);
  console.log("TransMat:\n" + transMat);
  return transMat;
};
//How do I make sure matrix is invertible? Replace 1-3 by 4 until works?
const pickMatrix = (p1, p2, p3, p4) => {
  return mathjs.matrix([
    [p1[0], p2[0], p3[0]],
    [p1[1], p2[1], p3[1]],
    [p1[2], p2[2], p3[2]]
  ]);
};

const transformAnchors = (anchors, transMat) => {
  console.log("Transforming anchors with: " + transMat);
  anchors.forEach(anchor => {
    console.log("_______anchor_______\n" + anchor.translation);
    let transformed = mathjs.multiply(
      transMat,
      mathjs.transpose(anchor.translation)
    );
    anchor.translation = [
      transformed.subset(mathjs.index(0)),
      transformed.subset(mathjs.index(1)),
      transformed.subset(mathjs.index(2))
    ];
    console.log("___Transformed___\n" + anchor.translation);
  });
  return anchors;
};

module.exports = { triangulate, addVectors };
