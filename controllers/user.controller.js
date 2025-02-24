const User = require("../models/user.model")

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