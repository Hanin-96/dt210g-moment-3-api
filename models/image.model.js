//User modell

const { required } = require("@hapi/joi/lib/base");
const Mongoose = require("mongoose");

//Schema för Image
const imageSchema = new Mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: false,
        trim: true
    },
    description: {
        type: String,
        required: true,
        unique: false,
        trim: true
    },
    fileName: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    imageUrl: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    userId: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
});


const Image = Mongoose.model("Image", imageSchema);
module.exports = Image;
