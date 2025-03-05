const userController = require("../controllers/user.controller");
const authToken = require("../authToken");

/*
module.exports = () => {
    server.route({
        method: "GET",
        path: "/user",
        handler: userController.getUsers
    })
}

module.exports = () => {
    server.route({
        method: "POST",
        path: "/user",
        handler: userController.postUser
    })
}
    */

const userRouteArr = [
    {
        //Lägg till ny användare
        method: "POST",
        path: "/user",
        handler: userController.postUser
    },
    {
        //Hämta användare
        method: "GET",
        path: "/user",
        options: {
            pre: [
                {
                    method: authToken
                }

            ]
        },
        handler: userController.getUsers
    },
    {
        //Logga in användare
        method: "POST",
        path: "/login",
        handler: userController.loginUser
    },
    {
        //Hämta skyddad data som användare
        method: "GET",
        path: "/userpage",
        options: {
            pre: [
                {
                    method: authToken
                }

            ]
        },
        handler: userController.getUserPage
    }


]

//Exporterar route array
module.exports = userRouteArr;