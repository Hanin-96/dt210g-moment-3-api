//JWT autentisering
const jwt = require('jsonwebtoken');

//Validering av token för åtkomst till skyddad route
const authToken = async (request, h) => {
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null || !token) {
        return h.response({ message: "Token missing" }).code(401);
    }

    //console.log(token);

    //Verfierar token
    try {
        // Verifiera token synkront utan callback
        const verifiedData = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Spara användarinformation i request-objektet
        request.username = verifiedData.username;
        console.log("Verifierad data: " + verifiedData.username)

        return h.continue;

    } catch (error) {
        console.error('JWT-verifieringsfel:', error);
        return h.response({ message: "Ogiltig JWT", error: error.message }).code(403);
    }
}

//Exportera modulen
module.exports = authToken;

