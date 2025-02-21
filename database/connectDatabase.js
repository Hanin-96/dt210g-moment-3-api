//Initierar Mongoose
const Mongoose = require('mongoose');

//Användning av .env fil för användning av variabler
require("dotenv").config();

//Mongo DB databas anslutning med Mongoose
const databaseConnection = () => {
    Mongoose.connect(process.env.DATABASE).then(() => {
        console.log("Connected with MongoDB");
    }).catch((error) => {
        console.error("Failed to connect to MongoDB" + error)
    });
}

//Exporterar databasanslutningen
module.exports = databaseConnection;