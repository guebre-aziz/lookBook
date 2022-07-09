const UserCollection = require("../models/user-model")

// Defining methods for the restaurantsController
module.exports = {
  
  findById: function (req, res) {
    UserCollection.findById(req.params.id)
      .then((dbModel) => res.json(dbModel))
      .catch((err) => res.status(404).json(err));
  },
};