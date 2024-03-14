const mongo = require("mongoose");
const Schema = mongo.Schema;
const Match = new Schema({
  win: String,
  loss: String,
  scoreTeam1: String,
  scoreTeam2: String,
  matchDate: Date,
  fixture: String,
  idTeam1: { type: Schema.Types.ObjectId, ref: "Team" },
  idTeam2: { type: Schema.Types.ObjectId, ref: "Team" },
  idTournament: { type: Schema.Types.ObjectId, ref: "Tournament" },
});
module.exports = mongo.model("match", Match);
