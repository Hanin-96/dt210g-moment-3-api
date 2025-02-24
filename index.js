//Initierar hapi
const Hapi = require("@hapi/hapi");

//Hämtar routes
const routes = require('./routes/allRoutes');

//Hämtar databas koppling
const databaseConnection = require('./database/connectDatabase');

//Användning av .env fil för användning av variabler
require("dotenv").config();

const Path = require('path');
const Inert = require('@hapi/inert');
const fs = require('fs');

const init = async () => {
    const UPLOAD_PATH = Path.join(__dirname, 'uploads');

    //Skapar server
    const server = Hapi.server({
        port: process.env.PORT || 3000,
        host: 'localhost',
        routes: {
            files: {
                relativeTo: UPLOAD_PATH
            },
            cors: {
                origin: ['*'],
                credentials: true,
                headers: [
                    "Accept",
                    "Content-Type",
                    "Authorization",
                    "Access-Control-Allow-Origin"
                ]
            }
        }
    });

    //Skapar uploads-katalog om den ej finns
    if (!fs.existsSync(UPLOAD_PATH)) {
        fs.mkdirSync(UPLOAD_PATH);
    }

    // Plugins
    await server.register(Inert);

    //Koppla till databasen
    databaseConnection();

    require('./routes/imageRoute')(server, UPLOAD_PATH);

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();