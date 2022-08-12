const mongoose = require("mongoose");
const SwapModel = require("../models/swap-model");
const isEmpty = require("../../utils/isEmpty");
const buildMatch = require("../../utils/buildMatch");
const ObjectId = mongoose.Types.ObjectId;

exports.create = async (req, res) => {
  try {
    if (isEmpty(req.body)) {
      res.status(400);
      res.send({ message: "Body cannot be empty" });
      return;
    }

    const swapOrder = new SwapModel({
      swapUsersId: [new ObjectId(req.body.user1), new ObjectId(req.body.user2)],
      swapProductsId: [
        new ObjectId(req.body.product1),
        new ObjectId(req.body.product2),
      ],
    });

    await swapOrder.save().then((data) => {
      res.status(201);
      res.send(`swap order inserted successfully with id: ${swapOrder._id}`);
    });
  } catch (err) {
    res.status(500);
    res.send({ message: err.message || "error inserting swap order" });
  }
};

exports.findSwapById = async (req, res) => {
  try {
    const id = req.params?.id;

    if (!ObjectId.isValid(id)) {
      res.status(400);
      res.send({ message: "not valid id" });
      return;
    }

    const swap = await SwapModel.findById(id);

    if (swap) {
      res.status(200);
      res.send(swap);
    } else {
      res.status(404);
      res.send({
        message: ` swap order with id ${id} not found`,
      });
    }
  } catch (err) {
    res.status(500);
    res.send({
      message: err.message,
    });
  }
};

exports.findAllSwaps = async (req, res) => {
  const query = [req.query.searchKey];
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  const queryMatch = buildMatch(query);

  try {
    const swaps = await SwapModel.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "swapProductsId",
          foreignField: "_id",
          as: "products",
        },
      },
      {
        $match: {
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      { $match: { "products.name": queryMatch } },
    ]).sort({ createdAt: -1 });

    if (!isEmpty(swaps)) {
      res.status(200);
      res.send(swaps);
    } else {
      res.status(404);
      res.send({
        message: ` swaps not found`,
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
    if (!req.body) {
      res.status(400);
      res.send({ message: "body can not be empty" });
      return;
    }

    const swap = await SwapModel.findByIdAndUpdate(
      id,
      {
        swapUsersId: [
          new ObjectId(req.body.user1),
          new ObjectId(req.body.user2),
        ],
        swapProductsId: [
          new ObjectId(req.body.product1),
          new ObjectId(req.body.product2),
        ],
      },
      { returnOriginal: false }
    );

    if (swap) {
      res.status(200);
      res.send(swap);
    } else {
      res.status(404);
      res.send({
        message: ` swap order with id ${id} not found`,
      });
    }
  } catch (err) {
    res.status(500);
    res.send({
      message: err.message,
    });
    console.log(err);
  }
};

exports.remove = async (req, res) => {
  try {
    const id = req.params?.id;

    if (!ObjectId.isValid(id)) {
      res.status(400);
      res.send({ message: "not valid id" });
      return;
    }

    const swap = await SwapModel.findByIdAndDelete(id);

    if (swap) {
      res.status(200);
      res.send({ message: "swap deleted successfully" });
    } else {
      res.status(404);
      res.send({
        message: `error deleting swap with id ${id}, it may be already deleted`,
      });
    }
  } catch (err) {
    res.status(500);
    res.send({ message: err.message });
  }
};
