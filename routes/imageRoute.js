
const imageController = require("../controllers/image.controller");
const authToken = require("../authToken");

const imageRouteArr = (uploadPath) => [
    {
        //Ladda upp ny bildfil som inloggad användare
        method: "POST",
        path: "/upload/{userId}",
        options: {
            payload: {
                output: "stream",
                parse: true,
                allow: "multipart/form-data",
                multipart: { output: 'stream' }
            },
                pre: [
                {
                    method: authToken
                }

            ]

        },
        handler: imageController.uploadFile(uploadPath)
    },
    {
        //Hämta alla bild url
        method: 'GET',
        path: '/images',
        handler: imageController.getImages
    },
    {
        //Hämta specifik bild
        method: 'GET',
        path: '/file/{fileName}',
        handler: imageController.getFile(uploadPath)
    },
    {
        //Hämta specifik bild
        method: 'GET',
        path: '/image/{imageId}',
        handler: imageController.getImage
    },
    {
        //Radera bild
        method: 'DELETE',
        path: '/image/{imageId}',
        options: {
            pre: [
                {
                    method: authToken
                }
            ]
        },
        handler: imageController.deleteImage(uploadPath)
    },
    {
        //Uppdatera info under bild
        method: 'PUT',
        path: '/image/{imageId}',
        options: {
            pre: [
                {
                    method: authToken
                }

            ]
        },
        handler: imageController.updateImage
    },

]

module.exports = imageRouteArr;