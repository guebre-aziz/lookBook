const express = require("express");
const multer = require("multer");
const upload = require("../../services/upload");
const route = express.Router();
const usersController = require("../controllers/users-controller");
const productsController = require("../controllers/products-controller");
const swapsController = require("../controllers/swaps-controller");

// users API
route.post("/users", usersController.create);
route.get("/users/searchById/:id", usersController.findUserById);
route.put("/users/:id", usersController.update);
route.delete("/users/:id", usersController.remove);

// products API
route.post("/products", upload, productsController.create);
route.get("/products/searchById/:id", productsController.findProductById);
route.put("/products/:id", upload, productsController.update);
route.delete("/products/:id", productsController.remove);

// swaps API
route.post("/swaps", swapsController.create);
route.get("/swaps/searchById/:id", swapsController.findSwapById);
route.get("/swaps/complexSearch", swapsController.findAllSwaps);
route.put("/swaps/:id", swapsController.update);
route.delete("/swaps/:id", swapsController.remove);

module.exports = route;
