var mongoose = require("mongoose"),
Schema = mongoose.Schema;


var Network = new Schema({
    Name: {
        type: String
    },
    NielsenCode: {
        type: String
    },
    IsTurnerNetwork: {
        type: Boolean
    },
    ScarlettCode: String,
})

var Schedule = new Schema({
    ExternalId: {
        type: Number
    },
    StartDate: {
        type: Date
    },
    EndDate: {
        type: Date
    },
    Network: {
        type: String
    },
    Title: {
        Name: {
            type: String
        },
        SeriesName: {
            type: String
        },
        ReleaseYear: {
            type: Number
        },
        Rating: {
            type: String
        },
        Genre: {
            type: String
        },
        Type: {
            type: String
        },
        Storyline: {
            type: String
        }
    },
    Platform: {
        type: String
    },
    Source: {
        type: String
    }
});

mongoose.model('Schedule', Schedule, "schedule");
mongoose.model('Network', Network, "network");