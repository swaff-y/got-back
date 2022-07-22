const express = require('express');
const router = express.Router();
const User = require("../models/user");
const log = require("../logger");
const Territory = require('../models/Territory');

//Get All
//curl -X GET http://localhost:4000/api/v1/territories
router.get("/", async (req,res) => {
  try{
    const territories = await Territory.find();
    log.info(`200 || "Got all territoriess" - ${req.method} - ${req.ip}`);
    res.status(200).json(territories);
  } catch (err) {
    log.error(`500 || ${err || "Internal server error on users get all"} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    res.status(500).json({ message: err.message });
  }

});

//Get One
//curl -X GET http://localhost:4000/api/v1/territories/:id
router.get("/:id", getTerritory, (req,res) => {
  log.info(`200 || "Got territory" - ${req.method} - ${req.ip}`);
  res.status(200).json(res.territory);
});


//Update One
//curl -X PATCH -H "Content-Type: application/json" -d '{"name":"Chase"}' http://localhost:4000/api/v1/territories/:id
router.patch("/:id", getTerritory, async (req,res) => {
  if(req.body.user){
    res.territory.user = req.body.user;
  }
  if(req.body.color){
    res.territory.color = req.body.color;
  }
  if(req.body.quantity){
    res.territory.quantity = req.body.quantity;
  }

  try{
    const updatedTerritory = await res.territory.save();
    log.info(`200 || "Patched territory" - ${req.method} - ${req.ip}`);
    res.status(200).json(updatedTerritory)
  } catch(err) {
    log.error(`400 || ${err || "Bad request on patch territory"} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    res.status(400).json({ message: err.message })
  }
});

//middleware function to get territory
async function getTerritory(req, res, next){
  let user;
  try{
    territory = await Territory.findById(req.params.id);
    if(territory === null){
      log.error(`404 || ${"Could not find territory with id " + req.params.id} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
      return res.status(404).json({ message: "Could not find territory with id " + req.params.id})
    }
  } catch(err) {
    log.error(`500 || ${err || "Internal server error on get user"} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    return res.status(500).json({ message: err.message });
  }

  res.territory = territory;
  next();
}

//exports our routes
module.exports = router
