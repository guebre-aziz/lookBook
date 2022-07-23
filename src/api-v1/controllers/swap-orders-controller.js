const mongoose = require("mongoose");
const SwapModel = require("../models/swap-order-model");

exports.create = (req, res) => {
  if (!req.body) {
    res.status(400);
    res.send({ message: "Body cannot be empty" });
    return;
  }

  const swapOrder = new SwapModel({
    swapUsersId: [req.body.user1, req.body.user2],
    swapProductsId: [req.body.product1, req.body.product2],
  });

  swapOrder
    .save()
    .then((data) => {
      res
        .status(201)
        .send(`swap order inserted successfully with id: ${swapOrder._id}`);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: err.message || "error inserting swap order" });
    });
};

exports.findSwapById = (req, res) => {
  const id = req.params?.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    res.send({ message: "not valid id" });
    return;
  }

  SwapModel.findById(id, function (err, doc) {
    if (err) {
      res.status(500);
      res.send({
        message: err.message,
      });
    } else if (!doc) {
      res.status(404);
      res.send({
        message: ` swap order with id: ${id} not found`,
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
  if (!req.body) {
    res.status(400);
    res.send({ message: "body can not be empty" });
    return;
  }

  SwapModel.findByIdAndUpdate(
    { _id: id },
    {
      swapUsersId: [req.body.user1, req.body.user2],
      swapProductsId: [req.body.product1, req.body.product2],
    },
    { returnOriginal: false },
    function (err, doc) {
      if (err) {
        res.status(500);
        res.send({
          message: err.message,
        });
      } else if (!doc) {
        res.status(404);
        res.send({
          message: ` swap order with id: ${id} not found`,
        });
      } else {
        res.status(200);
        res.send(doc);
      }
    }
  );
};

exports.remove = (req, res) => {
  const id = req.params?.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    res.send({ message: "not valid id" });
    return;
  }

  SwapModel.findByIdAndDelete(id, function (err, doc) {
    if (err) {
      res.status(500);
      res.send({
        message: err.message,
      });
    } else if (!doc) {
      res.status(404);
      res.send({
        message: ` swap order with id: ${id} not found`,
      });
    } else {
      res.status(200);
      res.send({ message: "swap order deleted successfully" });
    }
  });
};
