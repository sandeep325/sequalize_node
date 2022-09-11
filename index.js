// const sequelize = require("./db/connection");
const Route = require("./Route/routes");
const express = require('express');
const app = express();
const bodyParse = require('body-parser');
const cors = require('cors')


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*" );
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  app.use(bodyParse.json());    
app.use(bodyParse.urlencoded({ extended: false }));
app.use("*",cors())

// Route middleware 
app.use("/api",Route);

// if url not match for api 
app.use((req, res, next) => {
    const error = new Error('URL Not Valid.');
    error.status = 404;
    next(error);
  });


  app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
          error: {
                message: error.message
          }
    });
  }); 

//   api SERVER CREATE 
var port =  8080;
app.listen(port, () => { console.log(`Server is running on:${port}`); });