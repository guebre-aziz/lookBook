const { default: mongoose } = require("mongoose");
const UserModel = require("../models/user-model");

exports.create = (req, res) => {
  // check
  if (!req.body) {
    res.status(400);
    res.send({ message: "Body cannot be empty" });
    return;
  }

  // new user
  const user = new UserModel({
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
  });

  // save in DB
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

exports.findUserById = async (req, res) => {
  const id = req.params?.id;

  if (mongoose.Types.ObjectId.isValid(id)) {
    try {
      const userData = await UserModel.findById(id);
      if (!userData) {
        res.status(404);
        res.send({ message: `user with id ${id} not found` });
      } else {
        res.status(200);
        res.send(userData);
      }
    } catch (err) {
      res.status(500);
      res.send({
        message: err.message || `error retriving user with id: ${id}`,
      });
    }
  } else {
    res.status(400);
    res.send({ message: "not valid id" });
  }
};

exports.findAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find();
    res.status(200);
    res.send(users);
  } catch (err) {
    res.status(500);
    res.send({
      message: err.message || "error occurred retriving users informations",
    });
  }
};

exports.update = (req, res) => {
  const id = req.params?.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    res.send({ message: "not valid id" });
    return;
  }
  if (!req.body) {
    res.status(400);
    res.send({ message: "body can not be empty" });
    return;
  }

  UserModel.findByIdAndUpdate(
    { _id: id },
    {
      name: req.body.name,
      surname: req.body.surname,
      email: req.body.email,
    },
    { returnOriginal: false }
  )
    .then((data) => {
      res.status(200);
      res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: err.message || `error updating user with id: ${id}` });
    });
};

// delete report
exports.remove = async (req, res) => {
  const id = req.params?.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    res.send({ message: "not valid id" });
    return;
  }

  UserModel.findByIdAndDelete(id)
    .then((data) => {
      if (!data) {
        res.status(404);
        res.send({
          message: `error deleting user with id: ${id}, it may be already deleted`,
        });
      } else {
        res.status(200);
        res.send({ message: "user deleted successfully" });
      }
    })
    .catch((err) => {
      res.status(500);
      res.send({ message: err.message || `error deleting user` });
    });
};
