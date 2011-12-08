var mongoose = require("mongoose"),
Schema = mongoose.Schema;


var Network = new Schema({
    Name: {
        type: String,
		index: true
    },
    NielsenCode: {
        type: String
    },
    IsTurnerNetwork: {
        type: Boolean
    },
    ScarlettCode: {
        type: String
    },
    Code: {
        type: String
    },
    LogoUrl: {
	type: String
    },
})

 var Schedule = new Schema({
    ExternalId: {
        type: Number
    },
    StartDate: {
        type: Date,
		index: true
    },
    EndDate: {
        type: Date,
		index: true
    },
    Network: {
        type: String,
		index: true
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
        type: String,
		index: true
    },
    Source: {
        type: String,
		index: true
    }
});

mongoose.model('Schedule', Schedule, "schedule");
mongoose.model('Network', Network, "network");
