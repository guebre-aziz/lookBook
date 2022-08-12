const productsModel = require("../../api-v1/models/products-model");
const swapsModel = require("../../api-v1/models/swaps-model");
const userModel = require("../../api-v1/models/users-model");

productsModel.createIndex({ name: "text" });
swapsModel.createIndex({ comments: "text" });
userModel.createIndex({ comments: "text" });
