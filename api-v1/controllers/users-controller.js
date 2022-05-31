const UserCollection = require("../models/user-model")

exports.create = (req, res) => {
    // check
    if(!req.body) {
        res.status(400)
           .send({message: "Body cannot be empty"})
           return
    }

    // new user
    const user = new UserCollection({
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email
    })
    console.log(user)

    // save in DB
    user.save()
        .then(data => {
            res.status(201)
               .send(`New user created successfully with id: ${user._id}`)
        })
        .catch(err => {
            res.status(500)
               .send({message: err.message || "error creating report"})
        })

}

exports.findUser = (req, res) => {
    
    if(req.params.id) {
        const id = req.params.id

        UserCollection.findById(id)
              .then(data => {
                  if(!data) {
                      res.status(404)
                         .send({message: `user with id ${id} not found`})
                  } else {
                      res.send(data)
                  }
              })
              .catch(err => {
                  res.status(500)
                     .send({message: err.message || `error retriving user with id: ${id}`})
              })
    } else {
       res.status(400)
          .send({message: "user id not provided"})
        }
}

exports.findAllUsers = (req, res) => {
    UserCollection.find()
        .then(users => {
            res.send(users)
        })
        .catch(err => {
            res.status(500)
                .send({message: err.message || "error occurred retriving users informations"})
        })
    
}

exports.update = (req, res) => {
    if(!req.params.id) {
        return res.status(400)
                  .send({ message : "user id can not be empty"})
    }
    if(!req.body) {
        return res.status(400)
                  .send({ message : "body can not be empty"})
    }

    const id = req.params.id;

    UserCollection.findByIdAndUpdate({_id: id}, {
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        },
        { returnOriginal: false }
    )
    .then(data => {
        res.status(200)
           .send(data)
    })
    .catch(err => {
        res.status(500)
           .send({message: err.message || `error updating user with id: ${id}`})
    })
}

// delete report
exports.delete = (req, res) => {
    if(!req.params.id){
        return res.status(400)
                  .send({ message: "id needed in params"})
    }

    const id = req.params.id

    UserCollection.findByIdAndDelete(id)
                    .then(data => {
                        if(!data) {
                            res.status(404)
                            .send({ message:`error deleting user with id: ${id}, it may be already deleted`})
                        } else {
                            res.status(200)
                            .send({ message: "user deleted successfully"})
                        }
                    })
                    .catch(err => {
                        res.status(500)
                        .send({ message: err.message || `error deleting report`})
                    })
    }