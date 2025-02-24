
const imageController = require("../controllers/image.controller")

module.exports = (server, uploadPath) => {
    server.route({
        method: "POST",
        path: "/upload",
        options : {
            payload: {
                output: "stream",
                parse: true,
                allow: "multipart/form-data",
                multipart: { output: 'stream' }
            }

        },
        handler: imageController.uploadFile(uploadPath)
    })

    // Route för att hämta profilbild
    server.route({
        method: 'GET',
        path: '/upload',
        handler: imageController.getImages()
    });

    // Route för att hämta profilbild
    server.route({
        method: 'GET',
        path: '/upload/{fileName}',
        handler: imageController.getFile(uploadPath)
    });
}

//module.exports = imageRouteArr;