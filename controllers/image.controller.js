const Path = require('path');
const fs = require('fs');
const Image = require("../models/image.model");

exports.uploadFile = (uploadPath) => async (request, h) => {

    const { imageId } = request.params; // hämtar in användar id som skickar som parameter
    const file = request.payload.file; // Hämta filen från request payload
    const title = request.payload.title; // Hämta titel från request payload
    const description = request.payload.description;


    if (!file) {
        return h.response({ message: "No file was sent" }).code(400);
    }

    try {
        const fileName = `${Date.now()}-${file.hapi.filename}`; // ger unikt namn med timestamp
        console.log(fileName);
        // Kombinerar sökväg till uppladdningsmapp (uploadPath) med filnamnet för att skapa sökvägen där filen ska sparas.
        const path = Path.join(uploadPath, fileName);
        console.log(path)
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
            created: Date.now()
        });

        //Uppdatera användare med url till filen
        const uploadedImage = await newImage.save();

            console.log("uploadedImage: " + uploadedImage);
        //return { url: "http://localhost:5000/upload/" + fileName };
        return h.response({
            message: "Image has been saved",
            savedImage: uploadedImage
        }).code(200);

        //const uploadedImageSaved = await image.save();


        //returnera url till bilden
        return h.response({ uploadedImageSaved: uploadedImageSaved })

    } catch (error) {
        console.error(error);
        return h.response({ message: error }).code(500);
    }
}

exports.getImages = () => async (request, h) => {
    const images = await Image.find();
    return h.response({ images: images });
}

exports.getFile = (uploadPath) => async (request, h) => {
    const { fileName } = request.params; // bildens namn skickas med
    const filePath = Path.join(uploadPath, fileName);
    console.log(fileName);
    console.log(filePath);
    if (!fs.existsSync(filePath)) {
        return h.response({ message: 'File not found' }).code(404);
    }
    //console.log(images.title);

    return h.file(filePath); // Returnerar filen från servern
}