//to use env we need to use dotenv
//.config method pull all of our ENV variables from our .env file
require("dotenv").config();
const PORT = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;
const BASE_URL = "/api/v1/";
const log = require("./logger");
const cors = require("cors");

const express = require('express');
const app = express();
const mongoose = require('mongoose');

//connect to our database
mongoose.connect(DATABASE_URL,{ useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', (error) => log.error(error));
db.once('open', () => log.info('connected to database'));

//setup server to use JSON
app.use(express.json());

//routes
const indexController = require("./controllers/index");
const usersController = require("./controllers/users");
const territoriesController = require("./controllers/territories");
const gameController = require("./controllers/game");

const corsOpts = {
    origin: '*',

    methods: [
      'GET',
      'POST',
      'PUT',
      'DELETE',
      'PATCH'
    ],

    allowedHeaders: [
      'Content-Type',
      'token'
    ],
  };

//Routes
try {
    app.use(cors(corsOpts));
    app.use(BASE_URL, indexController);
    app.use("/", indexController);
    //endpoints
    app.use(BASE_URL+"users", usersController);
    app.use(BASE_URL+"territories", territoriesController);
    app.use(BASE_URL+"game", gameController);
} catch (error) {
    log.error(`Fatal || ${ "Error on routes - " + error || "Internal server error"}`);
}

app.listen(PORT, () => log.info(`server running on port || ${PORT}`));
