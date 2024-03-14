const mongo = require("mongoose");
const Schema = mongo.Schema;
const Tournament = new Schema({
  name: String,
  description: String,
  startDate: Date,
  endDate: Date,
  location: String,
  image: String,
  tournamentType: String,
  nbTeamPartipate: Number,
  country: String,
  state: String,
  city: String, 
  teams: [{ type: Schema.Types.ObjectId, ref: "Team" }],
});
module.exports = mongo.model("tournament", Tournament);
