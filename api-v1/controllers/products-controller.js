const mongoose = require("mongoose");
const ProductModel = require("../models/product-model");

exports.create = (req, res) => {
  // check
  if (!req.body) {
    res.status(400);
    res.send({ message: "Body cannot be empty" });
    return;
  }

  const images = [];

  if (req.files) {
    req.files.forEach((file) => {
      images.push({
        _id: new mongoose.Types.ObjectId(),
        originalname: file.originalname,
        path: file.path,
        size: file.size,
      });
    });
  }

  // new user
  const product = new ProductModel({
    name: req.body.name,
    images: images,
  });

  // save in DB
  product
    .save()
    .then((data) => {
      res
        .status(201)
        .send(`product inserted successfully with id: ${product._id}`);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: err.message || "error inserting product" });
    });
};

exports.findProductById = async (req, res) => {
  const id = req.params?.id;

  if (mongoose.Types.ObjectId.isValid(id)) {
    try {
      const productData = await ProductModel.findById(id);
      if (!productData) {
        res.status(404);
        res.send({ message: `product with id ${id} not found` });
      } else {
        res.status(200);
        res.send(productData);
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

exports.update = (req, res) => {
  const id = req.params?.id;
  console.log(req.body);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    res.send({ message: "not valid id" });
    return;
  }
  if (Object.keys(req.body).length === 0) {
    res.status(400);
    res.send({ message: "body can not be empty" });
    return;
  }

  const images = [];

  console.log(req.files);

  if (req.files) {
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
    { _id: id },
    {
      name: req.body.name,
      $push: { images: { $each: images } },
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
exports.remove = (req, res) => {
  const id = req.params?.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    res.send({ message: "not valid id" });
    return;
  }

  ProductModel.findByIdAndDelete(id)
    .then((data) => {
      if (!data) {
        res.status(404);
        res.send({
          message: `error deleting product with id: ${id}, it may be already deleted`,
        });
      } else {
        res.status(200);
        res.send({ message: "product deleted successfully" });
      }
    })
    .catch((err) => {
      res.status(500);
      res.send({ message: err.message || `error deleting product` });
    });
};
