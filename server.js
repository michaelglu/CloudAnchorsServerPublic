const express = require("express");
const app = express();
const { mongoose } = require("./config/mongoose");
const { getAnchor, getAll, getAllKeys } = require("./routes/get.js");
const { createAnchor, createKey } = require("./routes/post.js");
const { deleteKey, deleteAnchor } = require("./routes/delete.js");
const bodyParser = require("body-parser");
const { validateAuthKey } = require("./config/auth-key.js");
const { createSystem } = require("./routes/coordinate_system/post.js");
const { getAnchorsInSystem } = require("./routes/coordinate_system/get.js");
const { deleteSystem } = require("./routes/coordinate_system/delete.js");
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("/getAnchor to get anchor, /postAnchor to post anchor");
});

app.get("/getAnchor/:id", (req, res) => {
  validateAuthKey(req.header("api_key")).then(
    success => {
      getAnchor(req.params.id).then(
        success => {
          res.send(success);
        },
        error => {
          res.status(500).send(error);
        }
      );
    },
    error => {
      res.status(500).send(error);
    }
  );
});
app.get("/getAll", (req, res) => {
  validateAuthKey(req.header("api_key")).then(
    success => {
      getAll(req.header("api_key")).then(
        anchors => {
          res.send(anchors);
        },
        error => {
          res.status(500).send(error);
        }
      );
    },
    error => {
      res.status(500).send(error);
    }
  );
});

app.delete("/deleteAnchor", (req, res) => {
  validateAuthKey(req.header("api_key")).then(
    success => {
      deleteAnchor(req.header("anchorID")).then(
        success => {
          res.send(success);
        },
        error => {
          res.status(500).send(error);
        }
      );
    },
    error => {
      res.send(error);
    }
  );
});

app.post("/postAnchor", (req, res) => {
  validateAuthKey(req.body.anchor.apiKey).then(
    success => {
      createAnchor(req.body.anchor).then(
        success => {
          res.send(success);
        },
        error => {
          res.status(500).send(error);
        }
      );
    },
    error => {
      res.status(500).send(error);
    }
  );
});

//________________________________Coordinate Systems____________________________
app.post("/coordinateSystems/post", (req, res) => {
  validateAuthKey(req.header("api_key")).then(
    success => {
      createSystem(req.body.system).then(
        success => {
          res.send(success);
        },
        error => {
          res.status(500).send(error);
        }
      );
    },
    error => {
      res.status(500).send(error);
    }
  );
});
app.patch("/coordinateSystems/get", (req, res) => {
  validateAuthKey(req.header("api_key")).then(
    success => {
      getAnchorsInSystem(req.body).then(
        anchors => {
          res.send(anchors);
        },
        error => {
          res.status(500).send(error);
        }
      );
    },
    error => {
      res.status(500).send(error);
    }
  );
});
app.delete("/coordinateSystems/delete", (req, res) => {
  validateAuthKey(req.header("api_key")).then(
    success => {
      deleteSystem(req.header("systemID")).then(
        message => {
          res.send(message);
        },
        error => {
          res.status(500).send(error);
        }
      );
    },
    error => {
      res.status(500).send(error);
    }
  );
});
//__________________________________AUTH KEYS___________________________________

app.get("/getAllKeys", (req, res) => {
  getAllKeys(req.header("admin")).then(
    anchors => {
      res.send(anchors);
    },
    error => {
      res.status(500).send(error);
    }
  );
});

app.post("/postKey", (req, res) => {
  createKey(req.body.key).then(
    success => {
      res.send(success);
    },
    error => {
      res.status(500).send(error);
    }
  );
});

app.delete("/deleteKey", (req, res) => {
  deleteKey(req.header("api_key")).then(
    message => {
      res.send(message);
    },
    error => {
      res.status(500).send(error);
    }
  );
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on 3000`);
});
