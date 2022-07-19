const express = require('express');
//want to use the router portion of express
const router = express.Router();

//curl -X GET http://localhost:4000/api/v1
router.get("/", (req,res) => {

    res.status(200).json({ "message":"success"});

});

//exports our routes
module.exports = router
