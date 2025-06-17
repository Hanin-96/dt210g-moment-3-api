const Path = require('path');
const fs = require('fs');
const Image = require("../models/image.model");
const User = require('../models/user.model');
const cloudinary = require('../cloudinary.config');
const streamifier = require('streamifier');


exports.uploadFile = () => async (request, h) => {

    const { userId } = request.params; // hämtar in användar id som skickar som parameter
    const file = request.payload.file; // Hämta filen från request payload
    const title = request.payload.title; // Hämta titel från request payload
    const description = request.payload.description;


    if (!file) {
        return h.response({ message: "Ingen fil skickades" }).code(400);
    }

    if (!userId) {
        return h.response({ message: "Ingen användare kunde hittas" }).code(404);
    }

    try {
        const userExists = await User.findById(userId);
        if (!userExists) {
            return h.response({ message: "Ingen användare kunde hittas" }).code(404);
        }
        console.log("Användare:", userExists);

        //Ladda upp via Cloudinary
        const uploadStream = () => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'images',
                        resource_type: 'image',
                    },
                    (error, result) => {
                        if (result) resolve(result);
                        else reject(error);
                    }
                );

                streamifier.createReadStream(file._data).pipe(stream);
            });
        };

        const uploadResult = await uploadStream();
        console.log("Cloudinary upload result:", uploadResult);

        const newImage = new Image({
            fileName: uploadResult.public_id,
            title: title,
            description: description,
            userId: userId,
            imageUrl: uploadResult.secure_url,
            created: Date.now()
        });

        //Uppdaterar användare med url till filen
        const savedImage = await newImage.save();

        return h.response({
            message: "Bild har lagrats",
            savedImage: savedImage,
        }).code(200);


    } catch (error) {
        console.error(error);
        return h.response({ message: error.message }).code(500);
    }
}

exports.getImages = async (request, h) => {
    const images = await Image.find().populate("userId", "username firstname lastname");
    return h.response({ images: images });
}

exports.getImage = async (request, h) => {
    //Bildens namn skickas med
    const { imageId } = request.params;
    try {
        const image = await Image.findById(imageId).populate("userId", "username firstname lastname");

        if (!image) {
            return h.response({ error: "Bilden hittades inte" }).code(404);
        }

        return h.response({
            title: image.title,
            description: image.description,
            imageUrl: image.imageUrl,
            userId: image.userId?._id,
            username: image.userId?.username,
            firstname: image.userId?.firstname,
            lastname: image.userId?.lastname,
            created: image.created

        })
    } catch (error) {
        console.error(error);
        return h.response({ message: error }).code(500);
    }

}

exports.getFile = (uploadPath) => async (request, h) => {
    const { fileName } = request.params;
    try {
        const image = await Image.findOne({ fileName });

        if (!image) {
            return h.response({ message: "Bilden hittades inte" }).code(404);
        }

        //Redirect till Cloudinary URL
        return h.redirect(image.imageUrl);
    } catch (error) {
        return h.response({ message: error.message }).code(500);
    }
};

exports.deleteImage = (uploadPath) => async (request, h) => {
    try {
        const { imageId } = request.params;

        //Hämtar username från token
        const username = request.username;

        const image = await Image.findById(imageId);
        console.log("image:", image);
        console.log("Delete imageId:", imageId);


        if (!image) {
            return h.response({ message: "Bilden finns inte" }).code(404);
        }

        const userExists = await User.findById(image.userId);
        console.log(userExists);

        //Kontrollerar om username från token är samma som äger bilden
        if (username != userExists.username) {
            return h.response({ message: "Användaren har inte tillgång till bilden" }).code(403);
        }

        await cloudinary.uploader.destroy(image.fileName);

        //Radera från databasen
        await Image.findByIdAndDelete(imageId);
        console.log('Bild borttagen:', image.fileName);

        return h.response({ message: "Bildfilen är borttagen" }).code(200);


    } catch (error) {
        console.error(error);
        return h.response(error).code(500);
    }
}

exports.updateImage = async (request, h) => {


    try {
        const { imageId } = request.params;

        //Hämtar username från token
        const username = request.username;

        console.log(username)

        const image = await Image.findById(imageId);
        console.log(image);

        if (!image) {
            return h.response({ message: "Bilden finns inte" }).code(404);
        }

        const userExists = await User.findById(image.userId);
        console.log(userExists);

        //Kontrollerar om username från token är samma som äger bilden
        if (username != userExists.username) {
            return h.response({ message: "Användaren har inte tillgång till bilden" }).code(403);
        }

        const updatedImageInfo = await Image.findByIdAndUpdate(
            imageId,
            request.payload,
            { new: true }
        );

        if (updatedImageInfo) {
            return h.response({
                message: "Bildinformation har uppdaterats",
                updatedImage: updatedImageInfo
            }).code(200);
        } else {
            return h.response("Bilden finns inte").code(404);

        }


    } catch (error) {
        return h.response(error).code(500);
    }


}