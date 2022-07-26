const express = require('express');
const router = express.Router();
const User = require("../models/user");
const log = require("../logger");

//Get All
//curl -X GET http://localhost:4000/api/v1/users
router.get("/", async (req,res) => {
  try{
    const users = await User.find();
    log.info(`200 || "Got all users" - ${req.method} - ${req.ip}`);
    res.status(200).json(users);
  } catch (err) {
    log.error(`500 || ${err || "Internal server error on users get all"} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    res.status(500).json({ message: err.message });
  }

});

//Get One
//curl -X GET http://localhost:4000/api/v1/users/:id
router.get("/:id", getUser, (req,res) => {
  log.info(`200 || "Got user" - ${req.method} - ${req.ip}`);
  res.status(200).json(res.user);
});

//Create one
//curl -X POST -H "Content-Type: application/json" -d '{"name":"Kyle" }' http://localhost:4000/api/v1/users/
router.post("/", async (req,res) => {
  const user = new User({
    name: req.body.name,
  });
  try{
    const newUser = await user.save();
    log.info(`201 || "Created new user" - ${req.method} - ${req.ip}`);
    res.status(201).json(newUser);
  } catch (err) {
    //when user give bad data send 400 because there is something wrong with the request.
    log.error(`400 || ${err || "Bad request on create user"} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    res.status(400).json({ message: err.message });
  };
});
//Update One
//curl -X PATCH -H "Content-Type: application/json" -d '{"quantity":"23"}' http://localhost:4000/api/v1/users/:id
router.patch("/:id", getUser, async (req,res) => {
  log.info(`User - ${res.user}`);
  log.info(`body - ${req.body}`);
  if(req.body.quantity !== null){
    res.user.quantity = req.body.quantity
  }

  try{
    const updatedUser = await res.user.save();
    log.info(`200 || "Patched user" - ${req.method} - ${req.ip}`);
    res.status(200).json(updatedUser)
  } catch(err) {
    log.error(`400 || ${err || "Bad request on patch user"} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    res.status(400).json({ message: err.message })
  }
});
//Delete One
//curl -X DELETE http://localhost:4000/api/v1/users/:id
router.delete("/:id", getUser, async (req,res) => {
  try{
    //try remove the user
    await res.user.remove();
    log.info(`201 || "Deleted user" - ${req.method} - ${req.ip}`);
    res.status(201).json({ message: "Deleted User " + res.user.name});
  } catch (err) {
    log.error(`500 || ${err || "Internal server error on delete uer"} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    res.status(500).json({ message: err.message });
  }
});

//middleware function to get subscriber
async function getUser(req, res, next){
  let user;
  try{
    user = await User.findById(req.params.id);
    if(user === null){
      log.error(`404 || ${"Could not find user with id " + req.params.id} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
      return res.status(404).json({ message: "Could not find user with id " + req.params.id})
    }
  } catch(err) {
    log.error(`500 || ${err || "Internal server error on get user"} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    return res.status(500).json({ message: err.message });
  }

  res.user = user;
  next();
}

//exports our routes
module.exports = router
