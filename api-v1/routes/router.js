const express = require("express");
const route = express.Router();
const usersController = require("../controllers/users-controller");
const productsController = require("../controllers/products-controller");
const swapOrdersController = require("../controllers/swap-orders-controller");

// users API
route.post("/users", usersController.create);
route.get("/users/:id", usersController.findUserById);
route.get("/users", usersController.findAllUsers);
route.put("/users/:id", usersController.update);
route.delete("/users/:id", usersController.remove);

//

module.exports = route;
