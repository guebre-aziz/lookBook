const mongoose = require("mongoose");
const ProductModel = require("../models/product-model");
const ObjectId = mongoose.Types.ObjectId;
const isEmpty = require("../../utils/isEmpty");

exports.create = async (req, res) => {
  try {
    if (isEmpty(req.body)) {
      res.status(400);
      res.send({ message: "Body cannot be empty" });
      return;
    }

    const images = [];

    if (!isEmpty(req.files)) {
      req.files.forEach((file) => {
        images.push({
          _id: new ObjectId(),
          originalname: file.originalname,
          path: file.path,
          size: file.size,
        });
      });
    }

    const product = new ProductModel({
      name: req.body.name,
      userId: new ObjectId(req.body.createdBy),
      images: images,
    });

    await product.save().then((data) => {
      res.status(201);
      res.send(`product created successfully with id: ${product._id}`);
    });
  } catch (err) {
    res.status(500);
    res.send({ message: err.message || "error inserting product" });
  }
};

exports.findProductById = async (req, res) => {
  try {
    const id = req.params?.id;
    if (!ObjectId.isValid(id)) {
      res.status(400);
      res.send({ message: "not valid id" });
      return;
    }

    const product = await ProductModel.findById(id);

    if (product) {
      res.status(200);
      res.send(product);
    } else {
      res.status(404);
      res.send({
        message: `product with id: ${id} not found`,
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

    const images = [];

    if (!isEmpty(req.files)) {
      req.files.forEach((file) => {
        images.push({
          _id: new ObjectId(),
          originalname: file.originalname,
          path: file.path,
          size: file.size,
        });
      });
    }

    const product = await ProductModel.findByIdAndUpdate(
      id,
      {
        name: req.body.name,
        userId: new ObjectId(req.body.userId),
        $push: { images: { $each: images } },
      },
      { returnOriginal: false }
    );

    if (product) {
      res.status(200);
      res.send(product);
    } else {
      res.status(404);
      res.send({
        message: ` product with id: ${id} not found`,
      });
    }
  } catch (err) {
    res.status(500);
    res.send({
      message: err.message,
    });
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

    const product = await ProductModel.findByIdAndDelete(id);

    if (product) {
      res.status(200);
      res.send({ message: "product deleted successfully" });
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
