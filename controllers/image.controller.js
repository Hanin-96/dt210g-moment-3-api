const Path = require('path');
const fs = require('fs');
const Image = require("../models/image.model");
const User = require('../models/user.model');

exports.uploadFile = (uploadPath) => async (request, h) => {

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

        //Filuppladdningen får unikt namn med timestamp
        const fileName = `${Date.now()}-${file.hapi.filename}`;

        // Kombinerar sökväg till uppladdningsmapp med filnamnet för att skapa sökvägen där filen ska sparas.
        const path = Path.join(uploadPath, fileName);

        console.log("Image saved at: " + path);

        /* 
        Initierar writeSteam för att kunna skriva data till sökvägen ovan.
        Detta öppnar filen i skrivläge. Om filen inte finns skapas den, och om den finns skrivs den över.
        */
        const writeStream = fs.createWriteStream(path);

        // Skriver data (lagrar filen) på den valda platsen
        await new Promise((resolve, reject) => {
            file.pipe(writeStream)
                .on('finish', resolve)
                .on('error', reject);
        });

        const newImage = new Image({
            fileName: fileName,
            title: title,
            description: description,
            userId: userId,
            created: Date.now()
        });

        //Uppdaterar användare med url till filen
        const uploadedImage = await newImage.save();

        return h.response({
            message: "Bild har lagrats",
            savedImage: uploadedImage,
        }).code(200);

        //const uploadedImageSaved = await image.save();


        //Returnerar url till bilden
        //return h.response({ uploadedImageSaved: uploadedImageSaved })

    } catch (error) {
        console.error(error);
        return h.response({ message: error }).code(500);
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

        const imageUrl = image.fileName;

        return h.response({
            title: image.title,
            description: image.description,
            fileName: imageUrl,
            userId: image.userId?._id,
            username: image.userId?.username,
            firstname: image.userId?.firstname,
            lastname: image.userId?.lastname

        })
    } catch (error) {
        console.error(error);
        return h.response({ message: error }).code(500);
    }

}

exports.getFile = (uploadPath) => async (request, h) => {
    //Bildens namn skickas med
    const { fileName } = request.params;
    try {
        const image = await Image.findOne({ fileName });

        if (!image) {
            return h.response({ error: "Bilden hittades inte" }).code(404);
        }

        const filePath = Path.join(uploadPath, fileName);

        if (!fs.existsSync(filePath)) {
            return h.response({ message: 'Fil kunde ej hittas' }).code(404);
        }

        return h.file(filePath); // Returnerar filen från servern

    } catch (error) {
        console.error(error);
        return h.response({ message: error }).code(500);
    }

}

exports.deleteImage = (uploadPath) => async (request, h) => {
    try {
        const { imageId } = request.params;

        //Hämtar username från token
        const username = request.username;

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

        const fileName = image.fileName;  // Hämta filnamnet från databasen
        const filePath = Path.join(uploadPath, fileName);

        if (!fs.existsSync(filePath)) {
            return h.response({ message: 'Fil kunde ej hittas' }).code(404);
        }

        if (!image) {
            return h.response({ message: "Bilden finns inte i databasen" }).code(404);
        }

        // Ta bort bildposten från databasen
        await Image.findByIdAndDelete(imageId);
        console.log('Bild borttagen:', fileName);

        //Ta bort bildfil från serverns filssystem
        try {
            await fs.promises.unlink(filePath);
            return h.response({ message: "Bildfilen är borttagen" }).code(200);
        } catch (error) {
            return h.response({ message: "Det gick inte att ta bort bildfilen" }).code(500);
        }

    } catch (error) {
        console.error(error);
        return h.response(err).code(500);
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