const userController = require("../controllers/user.controller");

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
        method: "POST",
        path: "/user",
        handler: userController.postUser
    },
    {
        method: "GET",
        path: "/user",
        handler: userController.getUsers
    }


]

//Exporterar route array
module.exports = userRouteArr;