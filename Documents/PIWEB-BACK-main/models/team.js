const mongo = require("mongoose");
const Schema = mongo.Schema;
const Team = new Schema({
    name: String,
    nameAbbreviation: String,
    foundedIn: Date,
    country: String,
    state: String,
    city: String,
    image: String,
    description: String,
    slogan: String,
    nickname: String,
    wins: { type: Number, default: 0 },
    losses:{ type: Number, default: 0 },
    draws: { type: Number, default: 0 },
    trophies: { type: [], default: [] },
    ranking: { type: Number, default: 1000 },
    creator:{ type: Schema.Types.ObjectId, ref: 'User' },
    managers:[{ type: Schema.Types.ObjectId, ref: 'User' }],
    tournaments: [{ type: Schema.Types.ObjectId, ref: 'Tournament' }]
});
module.exports = mongo.model("team", Team);
