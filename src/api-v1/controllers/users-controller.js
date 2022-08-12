const isEmpty = require("../../utils/isEmpty");
const { default: mongoose } = require("mongoose");
const UserModel = require("../models/user-model");
const ObjectId = mongoose.Types.ObjectId;

exports.create = async (req, res) => {
  try {
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

    await user.save().then((data) => {
      res.status(201);
      res.send(`New user created successfully with id: ${user._id}`);
    });
  } catch (err) {
    res.status(500);
    res.send({ message: err.message || "error creating report" });
  }
};

exports.findUserById = async (req, res) => {
  try {
    const id = req.params?.id;

    if (!ObjectId.isValid(id)) {
      res.status(400);
      res.send({ message: "not valid id" });
      return;
    }

    const user = await UserModel.findById(id);

    if (user) {
      res.status(200);
      res.send(user);
    } else {
      res.status(404);
      res.send({
        message: ` user with id: ${id} not found`,
      });
    }
  } catch (err) {
    res.status(500);
    res.send({
      message: err.message,
    });
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params?.id;

    if (!ObjectId.isValid(id)) {
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

    const user = await UserModel.findByIdAndUpdate(id, data);

    if (user) {
      res.status(200);
      res.send(user);
    } else {
      res.status(404);
      res.send({
        message: ` user with id: ${id} not found`,
      });
    }
  } catch (err) {
    res.status(500);
    res.send({
      message: err.message || `error updating user with id: ${id}`,
    });
  }
};

// delete report
exports.remove = async (req, res) => {
  try {
    const id = req.params?.id;

    if (!ObjectId.isValid(id)) {
      res.status(400);
      res.send({ message: "not valid id" });
      return;
    }

    const user = await UserModel.findByIdAndDelete(id);

    if (user) {
      res.status(200);
      res.send({ message: "user deleted successfully" });
    } else {
      res.status(404);
      res.send({
        message: `error deleting product with id: ${id}, it may be already deleted`,
      });
    }
  } catch (err) {
    res.status(500);
    res.send({ message: err.message });
  }
};
