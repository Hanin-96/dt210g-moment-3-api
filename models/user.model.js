//User modell

const Mongoose = require("mongoose");

const bCrypt = require("bcrypt");

//Schema för User
const userSchema = new Mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        unique: false,
        trim: true
    },
    lastname: {
        type: String,
        required: true,
        unique: false,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        unique: false,
        trim: true
    },
    created: {
        type: Date,
        default: Date.now
    },

});

//Hashning av lösenord innan lagring i databasen
userSchema.pre("save", async function (next) {
    try {
        if (this.isNew || this.isModified("user_password")) {
            //Användning av Bcrypt för hashning
            const hashedPassword = await bCrypt.hash(this.password, 10);
            this.password = hashedPassword;
        }

        next();

    } catch (error) {
        next(error);
        console.error(error);

    }
});

//Jämföra hashad lösenord
userSchema.methods.comparePassword = async function (password) {
    try {
        //returnerar true om hashade lösenord som är lagrad i databas stämmer
        return await bCrypt.compare(password, this.password);

    } catch (error) {
        throw error;
    }
}

//Inloggning User
//Endast username och password skickas in vid inloggning
userSchema.statics.login = async function (username, password) {
    try {
        //Letar om användaren finns lagrad
        const user = await this.findOne({ username });
        if (!user) {
            throw new Error("Fel Användarnamn/Lösenord")
        }

        //Kollar om lösenordet matchar
        const passwordMatch = await user.comparePassword(password);

        if (!passwordMatch) {
            throw new Error("Fel Användarnamn/Lösenord");
        } else {
            return user;
        }
    } catch (error) {
        throw error;
    }
};

const User = Mongoose.model("User", userSchema);
module.exports = User;
