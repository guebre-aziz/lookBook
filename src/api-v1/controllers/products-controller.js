const mongoose = require("mongoose");
const ProductModel = require("../models/product-model");
const isEmpty = require("../../utils/isEmpty");

exports.create = (req, res) => {
  if (!req.body) {
    res.status(400);
    res.send({ message: "Body cannot be empty" });
    return;
  }

  const images = [];

  if (!isEmpty(req.files)) {
    req.files.forEach((file) => {
      images.push({
        _id: new mongoose.Types.ObjectId(),
        originalname: file.originalname,
        path: file.path,
        size: file.size,
      });
    });
  }

  const product = new ProductModel({
    name: req.body.name,
    images: images,
  });

  product
    .save()
    .then((data) => {
      res
        .status(201)
        .send(`product created successfully with id: ${product._id}`);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: err.message || "error inserting product" });
    });
};

exports.findProductById = async (req, res) => {
  const id = req.params?.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    res.send({ message: "not valid id" });
    return;
  }

  ProductModel.findById(id, function (err, doc) {
    if (err) {
      res.status(500);
      res.send({
        message: err.message,
      });
    } else if (!doc) {
      res.status(404);
      res.send({
        message: `product with id: ${id} not found`,
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

  const images = [];

  if (!isEmpty(req.files)) {
    req.files.forEach((file) => {
      images.push({
        _id: new mongoose.Types.ObjectId(),
        originalname: file.originalname,
        path: file.path,
        size: file.size,
      });
    });
  }

  ProductModel.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      $push: { images: { $each: images } },
    },
    { returnOriginal: false },
    function (err, doc) {
      if (err) {
        res.status(500);
        res.send({
          message: err.message || `error updating product with id: ${id}`,
        });
      } else if (!doc) {
        res.status(404);
        res.send({
          message: ` product with id: ${id} not found`,
        });
      } else {
        res.status(200);
        res.send(doc);
      }
    }
  );
};

// delete report
exports.remove = (req, res) => {
  const id = req.params?.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    res.send({ message: "not valid id" });
    return;
  }

  ProductModel.findByIdAndDelete(id, function (err, doc) {
    if (err) {
      res.status(500);
      res.send({ message: err.message });
    }
    if (!doc) {
      res.status(404);
      res.send({
        message: `error deleting product with id: ${id}, it may be already deleted`,
      });
    } else {
      res.status(200);
      res.send({ message: "product deleted successfully" });
    }
  });
};
