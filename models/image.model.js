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
    user: {
        type: Mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },

});


const Image = Mongoose.model("image", imageSchema);
module.exports = Image;
