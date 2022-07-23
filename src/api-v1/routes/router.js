const express = require("express");
const multer = require("multer");
const upload = require("../../services/upload");
const route = express.Router();
const usersController = require("../controllers/users-controller");
const productsController = require("../controllers/products-controller");
const swapOrdersController = require("../controllers/swap-orders-controller");

// users API
route.post("/users", usersController.create);
route.get("/users/:id", usersController.findUserById);
route.put("/users/:id", usersController.update);
route.delete("/users/:id", usersController.remove);

// products API
route.post("/products", upload, productsController.create);
route.get("/products/:id", productsController.findProductById);
route.put("/products/:id", upload, productsController.update);
route.delete("/products/:id", productsController.remove);

// swap API
route.post("/swap", swapOrdersController.create);
route.get("/swap/:id", swapOrdersController.findSwapById);
route.put("/swap/:id", swapOrdersController.update);
route.delete("/swap/:id", swapOrdersController.remove);

module.exports = route;
