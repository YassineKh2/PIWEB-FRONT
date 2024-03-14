const match = require("../models/match");
const Tournament = require("../models/tournament");
const Team = require("../models/team");

const addMatch = async (req, res, next) => {
  try {
    const newMatch = new match(req.body);
    await newMatch.save();
    res.status(201).json({ match: newMatch });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getTournamentMatches = async (req, res, next) => {
  try {
    const idTournament = req.params.idTournament;

    const matches = await match.find({ idTournament });

    let matchList = [];
    for (let i = 0; i < matches.length; i++) {
      let match = {
        _id: matches[i]._id,
        tournament: await Tournament.findById(matches[i].idTournament),
        team1: await Team.findById(matches[i].idTeam1),
        team2: await Team.findById(matches[i].idTeam2),
        scoreTeam1: matches[i].scoreTeam1,
        scoreTeam2: matches[i].scoreTeam2,
        matchDate: matches[i].matchDate,
        win: matches[i].win,
        loss: matches[i].loss,
        fixture: matches[i].fixture,
      };

      matchList.push(match);
    }
    if (!matches || matches.length === 0) {
      throw new Error("matches not found!");
    }
    res.status(200).json({ matchList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updateMatch = async (req, res, next) => {
  try {
    let id = req.body._id;
    const Match = await match.findByIdAndUpdate(id, req.body);
    res.status(200).json({ Match });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  addMatch,
  getTournamentMatches,
  updateMatch,
};
