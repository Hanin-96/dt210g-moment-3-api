//Initierar hapi
const Hapi = require("@hapi/hapi");

//Hämtar routes
const routes = require('./routes/allRoutes');

//Hämtar databas koppling
const databaseConnection = require('./database/connectDatabase');

//Användning av .env fil för användning av variabler
require("dotenv").config();

const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT || 3000,
        host: 'localhost',
        routes: {
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

    //Koppla till databasen
    databaseConnection();

    server.route({
        method: 'GET',
        path: '/',
        handler: function (request, h) {
            console.log("Hello World!");
            return 'Hello World!';

        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();