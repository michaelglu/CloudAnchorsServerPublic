const { Anchor } = require("./../models/anchor.js");
const { APIKEY } = require("./../models/api-key.js");
const { ObjectId } = require("mongodb");

const createAnchor = body => {
  return new Promise((resolve, reject) => {
    const anchorOptions = {
      anchorID: new ObjectId(),
      authKey: body.authKey,
      translation: body.translation,
      rotation: body.rotation,
      scale: body.scale,
      picturePath: body.picturePath,
      apiKey: body.apiKey,
      systemID: body.systemID
    };
    const anchor = new Anchor(anchorOptions);
    anchor.save().then(
      () => {
        resolve({ message: "anchor posted", id: anchorOptions.anchorID });
      },
      error => {
        reject({ error: error });
      }
    );
  });
};

const createKey = body => {
  return new Promise((resolve, reject) => {
    if (body.admin !== process.env.ADMIN) {
      //process.env.ADMIN
      reject("Invalid Access Privilidges");
    } else {
      //  console.log("fired");
      const key = body.key;
      if (!key) {
        reject("API Key not provided");
      } else {
        console.log("fired");
        const apiKey = new APIKEY({ keyHash: key });
        apiKey.save().then(
          () => {
            resolve({ message: "Anchor Created", key: apiKey.keyHash });
          },
          error => {
            reject({ error: error });
          }
        );
      }
    }
  });
};

module.exports = { createAnchor, createKey };
