const express = require('express');
const router = express.Router();
const Game = require("../models/game");
const log = require("../logger");

//Get All
//curl -X GET http://localhost:4000/api/v1/game
router.get("/", async (req,res) => {
  try{
    const game = await Game.find();
    log.info(`200 || "Got game" - ${req.method} - ${req.ip}`);
    res.status(200).json(game);
  } catch (err) {
    log.error(`500 || ${err || "Internal server error on game get all"} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    res.status(500).json({ message: err.message });
  }

});

//Get One
//curl -X GET http://localhost:4000/api/v1/game/:id
router.get("/:id", getGame, (req,res) => {
  log.info(`200 || "Got game" - ${req.method} - ${req.ip}`);
  res.status(200).json(res.game);
});

// //Create one
// //curl -X POST -H "Content-Type: application/json" -d '{"name":"Kyle" }' http://localhost:4000/api/v1/users/
// router.post("/", async (req,res) => {
//   const user = new User({
//     name: req.body.name,
//   });
//   try{
//     const newUser = await user.save();
//     log.info(`201 || "Created new user" - ${req.method} - ${req.ip}`);
//     res.status(201).json(newUser);
//   } catch (err) {
//     //when user give bad data send 400 because there is something wrong with the request.
//     log.error(`400 || ${err || "Bad request on create user"} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
//     res.status(400).json({ message: err.message });
//   };
// });
//Update One
//curl -X PATCH -H "Content-Type: application/json" -d '{"name":"Chase"}' http://localhost:4000/api/v1/users/:id
router.patch("/:id", getGame, async (req,res) => {
  if(req.body.gameOrder !== null){
    res.game.gameOrder = req.body.gameOrder;
  }
  if(req.body.turn !== null){
    res.user.turn = req.body.turn;
  }

  try{
    const updatedGame = await res.game.save();
    log.info(`200 || "Patched game" - ${req.method} - ${req.ip}`);
    res.status(200).json(updatedGame)
  } catch(err) {
    log.error(`400 || ${err || "Bad request on patch game"} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    res.status(400).json({ message: err.message })
  }
});
// //Delete One
// //curl -X DELETE http://localhost:4000/api/v1/users/:id
// router.delete("/:id", getUser, async (req,res) => {
//   try{
//     //try remove the user
//     await res.user.remove();
//     log.info(`201 || "Deleted user" - ${req.method} - ${req.ip}`);
//     res.status(201).json({ message: "Deleted User " + res.user.name});
//   } catch (err) {
//     log.error(`500 || ${err || "Internal server error on delete uer"} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
//     res.status(500).json({ message: err.message });
//   }
// });

//middleware function to get subscriber
async function getGame(req, res, next){
  let game;
  try{
    game = await Game.findById(req.params.id);
    if(game === null){
      log.error(`404 || ${"Could not find game with id " + req.params.id} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
      return res.status(404).json({ message: "Could not find game with id " + req.params.id})
    }
  } catch(err) {
    log.error(`500 || ${err || "Internal server error on get game"} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    return res.status(500).json({ message: err.message });
  }

  res.game = game;
  next();
}

//exports our routes
module.exports = router
