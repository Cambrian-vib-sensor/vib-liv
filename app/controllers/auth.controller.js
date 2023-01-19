const db = require("../models");
const Auth = db.auth;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../../config/auth.config");

exports.bulkcreate = (req, res)=> {
  // Validate request
  if (!req.body.auths) {
      res.status(400).send({
      message: "Auth array can not be empty!"
      });
      return;
  }

  // Save sensors array in the database
  Auth.bulkCreate(req.body.auths)
      .then(data => {
      res.send(data);
      })
      .catch(err => {
      res.status(500).send({
          message:
          err.message || "Some error occurred while creating the auth array."
      });
  });
};

exports.findAll = (req, res)=> {
    Auth.findAll({
      include: {model: db.client}
    })
    .then((data) => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving auth info."
      });
    });
};

exports.findOne = (req, res)=> {
    const id = req.params.id;

    Auth.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find auth with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving auth with id=" + id
      });
    });
};

exports.signup = (req, res) => {
    // Save User to Database
    Auth.create({
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 8),
      role: req.body.role,
      status: 'A',
      client_id: req.body.client_id
    })
    .then(user => {
      console.log(user);
      res.send({ message: "User is registered successfully!", id: user.id });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
}

exports.signin = (req, res)=> {
  Auth.findOne({
    where: {
      username: req.body.username,
      status: 'A'
    }
  }).then(user =>{
    if (!user){
      return res.status(404).send({
        message: "Email address not found!"
      })
    }

    console.log(req.body.password);

    var isValidPwd = bcrypt.compareSync(req.body.password, user.password);

    if (!isValidPwd) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!"
      });
    }

    var token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400 // 24 hour
    });

    res.status(200).send({
      id: user.id,
      username: user.username,
      role: user.role,
      client: user.client_id,
      accessToken: token
    });
  }).catch(err=>{
    res.status(500).send({ message: err.message });
  })
}

exports.update = (req, res)=> {
  Auth.update({
    username: req.body.username,
    password: (req.currentPassword !== req.body.password) ? bcrypt.hashSync(req.body.password, 8) : req.currentPassword,
    role: req.body.role,
    status: req.body.status,
    client_id: req.body.client_id
  }, { where: {id: req.params.id} }).then(num => {
    if (num == 1) res.send({ message: "User details updated successfully!" });
    else res.send({message: "No change in user data"});
  })
  .catch(err => {
    res.status(500).send({ message: err.message });
  }); 
};

exports.delete = (req, res)=> {
  Auth.update({
    status: 'D',
  }, { where: {id: req.params.id} }).then(num => {
    if (num == 1) res.send({ message: "User deleted successfully!" });
    else res.send({message: "User already deleted"});
  })
  .catch(err=>{
    res.status(500).send({ message: err.message });
  })
};

exports.deleteAll = (req, res)=> {

};
