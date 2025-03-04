const { token } = require("@hapi/jwt");
const User = require("../models/user.model");

//JWT autentisering
const jwt = require('jsonwebtoken');
const { error } = require("@hapi/joi/lib/base");

exports.getUsers = async (request, h) => {

    try {
        const users = await User.find();
        return h.response({
            message: "Lagrade användare",
            users: users
        }).code(200);

    } catch (error) {
        return h.response({ message: 'Något gick fel på serversidan' }).code(500);
    }

}

exports.postUser = async (request, h) => {

    try {
        const user = new User(request.payload);
        const newUser = await user.save();
        return h.response({
            message: "Lagrade användare",
            newUser: newUser
        }).code(200);

    } catch (error) {
        return h.response({ message: 'Något gick fel på serversidan' }).code(500);
    }
}

//Inloggning
exports.loginUser = async (request, h) => {

    try {
        const { username, password } = request.payload;

        const user = await User.findOne({ username });
        if (!user) {
            return h.response({ error: "Fel Användarnamn/Lösenord" }).code(400);
        }

        //Kontroll av lösenord
        const passwordMatch = await user.comparePassword(password);

        //Om lösenord ej stämmer
        if (!passwordMatch) {
            return h.response({ error: "Fel Användarnamn/Lösenord" }).code(400);

        } else {
            //Skapa token för inloggning ifall lösenord stämmer
            const payload = { username: username };

            //Generera token
            const token = generateToken(user);

            //console.log("Du är inloggad");
            return h
                .response({
                    message: 'Du är inloggad',
                    token: token,
                    user: user
                }).code(200);

        }

    } catch (error) {
        return h.response({ message: 'Något gick fel på serversidan' + error }).code(500);
    }
}

exports.getUserPage = async (request, h) => {
    try {
        const username = request.username;

        const user = await User.findOne({username});
        console.log(user)

        if (!user) {
            return h.response({ message: "Användare hittades inte" }).code(404);
        }

        return h.response({
            message: "Du har tillgång till skyddad data",
            user: user,
            token: token
        }).code(200);
    }
    catch (error) {
        return h.response({ message: 'Något gick fel på serversidan' }).code(500);
    }

}

//Genererar ny token JWT
const generateToken = (user) => {
    const payload = { username: user.username };

    // Generate the token using the payload and the secret key
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        algorithm: 'HS256',
        expiresIn: '30min'
    });
    return token;

}