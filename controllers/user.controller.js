const User = require("../models/user.model");

//JWT autentisering
const jwt = require('jsonwebtoken');

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

            const response = {
                message: "Användare är inloggad",
                token: token
            }
            //console.log("Du är inloggad");
            return h
                .response({ message: 'Du är inloggad', response }).code(200);

        }

    } catch (error) {
        return h.response({ message: 'Något gick fel på serversidan' + error }).code(500);
    }
}

exports.getUserPage = async (request, h) => {
    try {
        const username = request.username;

        const user = await User.findOne(username);

        if (!user) {
            return h.response({ message: "Användare hittades inte" }).code(404);
        }

        return h.response({
            message: "Du har tillgång till skyddad data",
            user: user
        }).code(200);
    }
    catch (err) {
        return h.response({ message: 'Något gick fel på serversidan' }).code(500);
    }

}

//Genererar ny token JWT
const generateToken = (user) => {
    const payload = { user_name: user.user_name };

    // Generate the token using the payload and the secret key
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        algorithm: 'HS256',
        expiresIn: '10min'
    });
    return token;

}