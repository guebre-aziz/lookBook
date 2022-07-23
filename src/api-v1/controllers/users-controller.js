const isEmpty = require("../../utils/isEmpty");
const { default: mongoose } = require("mongoose");
const UserModel = require("../models/user-model");

exports.create = (req, res) => {
  if (isEmpty(req.body)) {
    res.status(400);
    res.send({ message: "Body cannot be empty" });
    return;
  }

  const user = new UserModel({
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
  });

  user
    .save()
    .then((data) => {
      res.status(201);
      res.send(`New user created successfully with id: ${user._id}`);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message || "error creating report" });
    });
};

exports.findUserById = (req, res) => {
  const id = req.params?.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    res.send({ message: "not valid id" });
    return;
  }

  UserModel.findById(id, function (err, doc) {
    if (err) {
      res.status(500);
      res.send({
        message: err.message,
      });
    } else if (!doc) {
      res.status(404);
      res.send({
        message: ` user with id: ${id} not found`,
      });
    } else {
      res.status(200);
      res.send(doc);
    }
  });
};

exports.update = (req, res) => {
  const id = req.params?.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    res.send({ message: "not valid id" });
    return;
  }
  if (isEmpty(req.body)) {
    res.status(400);
    res.send({ message: "body can not be empty" });
    return;
  }

  const data = {
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
  };

  UserModel.findByIdAndUpdate(
    id,
    data,
    { returnOriginal: false },
    function (err, doc) {
      if (err) {
        res.status(500);
        res.send({
          message: err.message || `error updating user with id: ${id}`,
        });
      } else if (!doc) {
        res.status(404);
        res.send({
          message: ` user with id: ${id} not found`,
        });
      } else {
        res.status(200);
        res.send(doc);
      }
    }
  );
};

// delete report
exports.remove = async (req, res) => {
  const id = req.params?.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    res.send({ message: "not valid id" });
    return;
  }

  UserModel.findByIdAndDelete(id, function (err, doc) {
    if (err) {
      res.status(500);
      res.send({ message: err.message });
    }
    if (!doc) {
      res.status(404);
      res.send({
        message: `error deleting user with id: ${id}, it may be already deleted`,
      });
    } else {
      res.status(200);
      res.send({ message: "user deleted successfully" });
    }
  });
};
