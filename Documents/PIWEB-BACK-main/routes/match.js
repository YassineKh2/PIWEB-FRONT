const express = require("express");
const router = express.Router();
const { addMatch, getTournamentMatches, updateMatch } = require("../controllers/matchController");

router.post("/addMatch", addMatch);
router.get("/getMatches/:idTournament", getTournamentMatches);
router.put("/updatematch",updateMatch);

module.exports = router;
