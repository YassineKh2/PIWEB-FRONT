const express = require("express");
const router = express.Router();
const Tournament = require("../models/tournament");
const {
  addTournament,
  getAllTournaments,
  getTournamentDetails,
  updateTournament,
  latestTournamentId,
} = require("../controllers/tournamentController");

router.post("/add", addTournament);
router.get("/getTournaments", getAllTournaments);
router.get("/getTournamentDetail/:id",getTournamentDetails);
router.put("/updatetournament",updateTournament);
router.get("/latestTournamentId", latestTournamentId);

module.exports = router;
