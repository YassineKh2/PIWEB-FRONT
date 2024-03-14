const Team = require("../models/team");
const Match = require("../models/match");
const Tournament = require("../models/tournament");


const addTeam = async (req, res) => {
    try {

            const newTeam = new Team({
                ...req.body,
                image: req.body.imagename, // Save the filename in the database
            });

            await newTeam.save();
            res.status(201).json({ Team: newTeam });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const teamDetail = async (req, res) => {
    try {
      const team = await Team.findById(req.params.id);
      if (!team || team.length === 0) {
        throw new Error("team not found!");
      }
      res.status(200).json({ team });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
const getAllTeams = async (req, res) => {
    try {
        const teams = await Team.find();
        res.status(200).json({teams});
    } catch (error) {
        res.status(500).json({message: error.message});
    }

}
const updateTeam = async (req, res) => {
    try {
        let id = req.body._id;
        const team = await Team.findByIdAndUpdate(id, req.body, {new: true});
        res.status(200).json({team});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const deleteTeam = async (req, res) => {
        let id = req.params.id;
        try{
            const team = await Team.findByIdAndDelete(id);
            res.status(200).json({team});
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    }



const getMatchesByTeam = async (req,res) => {
    let id = req.params.id;
    try{
        const matches = await Match.find({$or: [{idTeam1: id}, {idTeam2: id}]});

        let matchList = [];
        for(let i = 0; i < matches.length; i++){
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
            }

            matchList.push(match);
        }


        res.status(200).json({matchList});
    }catch{
        res.status(500).json({message: message});
    }
}

const getTournamentsByTeam = async (req,res) => {
    let TournamentIds = req.body;
    try{
        const Tournaments = await Tournament.find({_id: {$in: TournamentIds}});

        res.status(200).json({Tournaments});
    }catch{
        res.status(500).json({message: error.message});
    }
}
const getTeamByUser = async (req,res) => {
    let id = req.params.id;
    try{
        const team = await Team.find({creator: id});
        res.status(200).json({team});
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

const getTeam = async (req,res) => {
    let id = req.params.id;
    try{
        const team = await Team.findById(id);
        res.status(200).json({team});
    }catch(error){
        res.status(500).json({message: error.message});
    }
}




module.exports = {
    addTeam,
    getAllTeams,
    updateTeam,
    deleteTeam,
    teamDetail,
    getMatchesByTeam,
    getTournamentsByTeam,
    getTeamByUser,
    getTeam
};