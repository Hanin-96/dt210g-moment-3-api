# DT210G Fördjupad frontend-utveckling Moment 3
Detta repository innehåller kod för API Webbtjänst skapad med ramverket Hapi.

## API Länk
En liveversion av APIet finns inte tillgänglig, den körs lokalt.

## PinCollect
Jag valde skapa ett API som innehåller användarautentisering och bilduppladdning.

## Databas
APIet använder NoSQL MongoDB och Mongose. Databasen innehåller följande struktur på data som skapas i ett schema i modulen Mongoose:

```
Image:

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
    userId: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

```

```
User:

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
    }
});

```


