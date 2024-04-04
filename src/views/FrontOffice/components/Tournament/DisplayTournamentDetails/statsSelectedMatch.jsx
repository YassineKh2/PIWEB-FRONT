import React, { useEffect, useMemo, useState } from "react";
import SoccerLineUp from "react-soccer-lineup";
import {
  getEmptyMatche,
  updateMatchScore,
} from "../../../../../Services/FrontOffice/apiMatch";
import { io } from "socket.io-client";
import { IoIosFootball } from "react-icons/io";

import { jwtDecode } from "jwt-decode";
import StatsPlayer from "./statsPlayer";
import {
  getMatchGoalsForTournament,
  getMatchGoalsForTournamentwithInfo,
} from "../../../../../Services/FrontOffice/apiGoalStats";
import { FaFutbol, FaRegEdit } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import {
  addMatchStats,
  getMatchStatsForTournament,
  updateMatchStats,
} from "../../../../../Services/FrontOffice/apiMatchState";
import { getTeamDetails, updateTeam } from "../../../../../Services/FrontOffice/apiTeam";
function StatsSelectedMatch() {
  const socket = useMemo(() => io.connect("http://localhost:3000/"), []);
  const path = "http://localhost:3000/public/images/teams/";
  const [activeTab, setActiveTab] = useState("summary");
  const [homeTeam, setHomeTeam] = useState([]);
  const [awayTeam, setAwayTeam] = useState([]);
  const [match, setMatch] = useState({});
  const [Tournament, setTournament] = useState({});
  const [numberOfDF, setNumberOfDF] = useState(0);
  const [numberOfM, setNumberOfM] = useState(0);
  const [numberOfCAM, setNumberOfCAM] = useState(0);
  const [numberOfFW, setNumberOfFW] = useState(0);
  const [numberOfDFAway, setNumberOfDFAway] = useState(0);
  const [numberOfMAway, setNumberOfMAway] = useState(0);
  const [numberOfCAMAway, setNumberOfCAMAway] = useState(0);
  const [numberOfFWAway, setNumberOfFWAway] = useState(0);
  const [userInfo, setUserInfo] = useState();

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [TournamentManager, setTournamentManger] = useState(false);
  const [Edit, setEdit] = useState(false);
  const [EditStats, setEditStats] = useState(false);
  const [HomeAwayTeam, setHomeAwayTeam] = useState();
  const [matchGoalsHomeTeamSimpleInfo, setMatchGoalsHomeTeamSimpleInfo] =
    useState([]);
  const [matchGoalsAwayTeamSimpleInfo, setMatchGoalsAwayTeamSimpleInfo] =
    useState([]);
  const [matchGoalsHomeTeam, setMatchGoalsHomeTeam] = useState([]);
  const [matchGoalsAwayTeam, setMatchGoalsAwayTeam] = useState([]);
  const [teamScore1, setTeamScore1] = useState(0);
  const [teamScore2, setTeamScore2] = useState(0);
  const [scoreFirstHalfHomeTeam, setScoreFirstHalfHomeTeam] = useState(0);
  const [scoreSecondHalfHomeTeam, setScoreSecondHalfHomeTeam] = useState(0);
  const [scoreFirstHalfAwayTeam, setScoreFirstHalfAwayTeam] = useState(0);
  const [scoreSecondHalfAwayTeam, setScoreSecondHalfAwayTeam] = useState(0);
  const [matchDateChange, setMatchDateChange] = useState();
  const [getMatchStat, setGetMatchStat] = useState({});
  const [matchArrived, setmatchArrived] = useState(false);
  const [Stats, setStats] = useState({
    goalAttemptsTeam1: 0,
    shotsOnGoalTeam1: 0,
    shotsOffGoalTeam1: 0,
    freeKicksTeam1: 0,
    cornerKicksTeam1: 0,
    OffsidesTeam1: 0,
    throwInsTeam1: 0,
    goalkeeperSavesTeam1: 0,
    goalAttemptsTeam2: 0,
    shotsOnGoalTeam2: 0,
    shotsOffGoalTeam2: 0,
    freeKicksTeam2: 0,
    cornerKicksTeam2: 0,
    OffsidesTeam2: 0,
    throwInsTeam2: 0,
    goalkeeperSavesTeam2: 0,
  });
  const [changeStatsValue, setChangeStatsValue] = useState({
    goalAttemptsTeam1: 0,
    shotsOnGoalTeam1: 0,
    shotsOffGoalTeam1: 0,
    freeKicksTeam1: 0,
    cornerKicksTeam1: 0,
    OffsidesTeam1: 0,
    throwInsTeam1: 0,
    goalkeeperSavesTeam1: 0,
    goalAttemptsTeam2: 0,
    shotsOnGoalTeam2: 0,
    shotsOffGoalTeam2: 0,
    freeKicksTeam2: 0,
    cornerKicksTeam2: 0,
    OffsidesTeam2: 0,
    throwInsTeam2: 0,
    goalkeeperSavesTeam2: 0,
  });
  useEffect(() => {
    const userToken = localStorage.getItem("token");

    if (userToken) {
      const decodedToken = jwtDecode(userToken);
      setUserInfo(decodedToken);
    }
  }, []);
  useEffect(() => {
    // Retrieve state data from localStorage
    const state = localStorage.getItem("newTabState");
    if (state) {
      const parsedState = JSON.parse(state); // Parse the string into a JavaScript object
      setMatch(parsedState.match);
      setTournament(parsedState.Tournament);
    }
  }, []);
  useEffect(() => {
    if (userInfo && Tournament) {
      if (Tournament.creator === userInfo.userId) {
        setTournamentManger(true);
      }
    }
  }, [userInfo]);
  useEffect(() => {
    setmatchArrived(true);
  }, [match]);
  const getMatchStats = async () => {
    try {
      const response = await getMatchStatsForTournament(match._id);
      setGetMatchStat(response.matcheStats);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    if (matchArrived === true) {
      getMatchStats();
    }
  }, [EditStats, matchArrived]);
  useEffect(() => {
    if (getMatchStat && Object.keys(getMatchStat).length !== 0) {
      setChangeStatsValue({
        goalAttemptsTeam1: getMatchStat.goalAttemptsTeam1,
        shotsOnGoalTeam1: getMatchStat.shotsOnGoalTeam1,
        shotsOffGoalTeam1: getMatchStat.shotsOffGoalTeam1,
        freeKicksTeam1: getMatchStat.freeKicksTeam1,
        cornerKicksTeam1: getMatchStat.cornerKicksTeam1,
        OffsidesTeam1: getMatchStat.OffsidesTeam1,
        throwInsTeam1: getMatchStat.throwInsTeam1,
        goalkeeperSavesTeam1: getMatchStat.goalkeeperSavesTeam1,
        goalAttemptsTeam2: getMatchStat.goalAttemptsTeam2,
        shotsOnGoalTeam2: getMatchStat.shotsOnGoalTeam2,
        shotsOffGoalTeam2: getMatchStat.shotsOffGoalTeam2,
        freeKicksTeam2: getMatchStat.freeKicksTeam2,
        cornerKicksTeam2: getMatchStat.cornerKicksTeam2,
        OffsidesTeam2: getMatchStat.OffsidesTeam2,
        throwInsTeam2: getMatchStat.throwInsTeam2,
        goalkeeperSavesTeam2: getMatchStat.goalkeeperSavesTeam2,
      });
      setStats({
        goalAttemptsTeam1: getMatchStat.goalAttemptsTeam1,
        shotsOnGoalTeam1: getMatchStat.shotsOnGoalTeam1,
        shotsOffGoalTeam1: getMatchStat.shotsOffGoalTeam1,
        freeKicksTeam1: getMatchStat.freeKicksTeam1,
        cornerKicksTeam1: getMatchStat.cornerKicksTeam1,
        OffsidesTeam1: getMatchStat.OffsidesTeam1,
        throwInsTeam1: getMatchStat.throwInsTeam1,
        goalkeeperSavesTeam1: getMatchStat.goalkeeperSavesTeam1,
        goalAttemptsTeam2: getMatchStat.goalAttemptsTeam2,
        shotsOnGoalTeam2: getMatchStat.shotsOnGoalTeam2,
        shotsOffGoalTeam2: getMatchStat.shotsOffGoalTeam2,
        freeKicksTeam2: getMatchStat.freeKicksTeam2,
        cornerKicksTeam2: getMatchStat.cornerKicksTeam2,
        OffsidesTeam2: getMatchStat.OffsidesTeam2,
        throwInsTeam2: getMatchStat.throwInsTeam2,
        goalkeeperSavesTeam2: getMatchStat.goalkeeperSavesTeam2,
      });
    }
  }, [getMatchStat]);
  const getMatchGoalsHomeTeam = async () => {
    try {
      let forTeam = match.team1._id;
      const response = await getMatchGoalsForTournamentwithInfo(
        forTeam,
        Tournament._id,
        match._id
      );
      setMatchGoalsHomeTeam(response.goalsList);
    } catch (err) {
      console.error(err);
    }
  };
  const getMatchGoalsAwayTeam = async () => {
    try {
      let forTeam = match.team2._id;
      const response = await getMatchGoalsForTournamentwithInfo(
        forTeam,
        Tournament._id,
        match._id
      );
      setMatchGoalsAwayTeam(response.goalsList);
    } catch (err) {
      console.error(err);
    }
  };
  const getMatchGoalsHomeTeamSimpleInfo = async () => {
    try {
      let forTeam = match.team1._id;
      const response = await getMatchGoalsForTournament(
        forTeam,
        Tournament._id,
        match._id
      );
      setMatchGoalsHomeTeamSimpleInfo(response.goals);
    } catch (err) {
      console.error(err);
    }
  };
  const getMatchGoalsAwayTeamSimpleInfo = async () => {
    try {
      let forTeam = match.team2._id;
      const response = await getMatchGoalsForTournament(
        forTeam,
        Tournament._id,
        match._id
      );
      setMatchGoalsAwayTeamSimpleInfo(response.goals);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    if (Tournament && match && match.team1 && match.team2) {
      getMatchGoalsHomeTeam();
      getMatchGoalsAwayTeam();
      getMatchGoalsHomeTeamSimpleInfo();
      getMatchGoalsAwayTeamSimpleInfo();
    }
  }, [match, activeTab, isPopupOpen]);
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  useEffect(() => {
    if (match && match.team1) {
      setHomeTeam(match.team1.currentLineup);
      setAwayTeam(match.team2.currentLineup);
    }
  }, [match]);

  useEffect(() => {
    socket.on("updateScore", (updatedMatch) => {
      setMatch(updatedMatch);
    });
  }, [socket]);

  const updateMatch = async (e) => {
    e.preventDefault();

    const updatedMatch = {
      ...match,
      scoreTeam1: teamScore1,
      scoreTeam2: teamScore2,
      matchDate: matchDateChange,
    };

    try {
      if (
        Tournament.tournamentType === "Knockout" ||
        match.knockoutStageAfterGroup === "Draw"
      ) {
        if (match.nextMatchId !== null) {
          const emptyMatch = await getEmptyMatche(
            match.nextMatchId,
            match.tournament._id
          );

          let updatedEmptyMatch = [];
          if (updatedMatch.scoreTeam1 > updatedMatch.scoreTeam2) {
            if (!emptyMatch.matchs.hasOwnProperty("idTeam1")) {
              updatedEmptyMatch = {
                ...emptyMatch.matchs,
                idTeam1: updatedMatch.team1._id,
              };
            } else {
              updatedEmptyMatch = {
                ...emptyMatch.matchs,
                idTeam2: updatedMatch.team1._id,
              };
            }
          } else if (updatedMatch.scoreTeam1 < updatedMatch.scoreTeam2) {
            if (!emptyMatch.matchs.hasOwnProperty("idTeam2")) {
              updatedEmptyMatch = {
                ...emptyMatch.matchs,
                idTeam2: updatedMatch.team2._id,
              };
            } else {
              updatedEmptyMatch = {
                ...emptyMatch.matchs,
                idTeam1: updatedMatch.team2._id,
              };
            }
          }
          await updateMatchScore(updatedEmptyMatch);
        }
      }
      await updateMatchScore(updatedMatch);
      const team1 = await getTeamDetails(updatedMatch.team1._id);
      const team2 = await getTeamDetails(updatedMatch.team2._id);
      if(updatedMatch.scoreTeam1 > updatedMatch.scoreTeam2) {
        team1.team.wins++
        team2.team.losses++
      } else if(updatedMatch.scoreTeam1 < updatedMatch.scoreTeam2) {
        team1.team.losses++
        team2.team.wins++
      } else if(updatedMatch.scoreTeam1 === updatedMatch.scoreTeam2)  {
        team1.team.draws++
        team2.team.draws++
      }
     
      await updateTeam(team1.team);
      await updateTeam(team2.team);
      localStorage.setItem("newTabState", JSON.stringify({ match: updatedMatch, Tournament }));
      setEdit(false);
      socket.emit("updateScore", updatedMatch);
      console.log("Update successful");
    } catch (error) {
      console.error("Error updating match:", error);
    }
  };
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [Squad, setSquad] = useState({
    gk: null,
    df: [],
    cdm: [],
    cm: [],
    cam: [],
    fw: [],
  });
  const [awaySquad, setAwaySquad] = useState({
    gk: null,
    df: [],
    cdm: [],
    cm: [],
    cam: [],
    fw: [],
  });
  const statsPlayer = (player) => {
    setSelectedPlayer(player); // Set the selected player
    setIsPopupOpen(true); // Open the popup
    setHomeAwayTeam(true);
  };
  const statsPlayerAway = (player) => {
    setSelectedPlayer(player); // Set the selected player
    setIsPopupOpen(true); // Open the popup
    setHomeAwayTeam(false);
  };

  ///////////////////////////////////////// Home Team
  useEffect(() => {
    let updatedSquad = { ...Squad };
    let DF = 0;
    let M = 0;
    let CAM = 0;
    let FW = 0;
    if (homeTeam && homeTeam.length > 2) {
      homeTeam.forEach((player) => {
        player = {
          ...player,
          onClick: () => {
            if (Tournament.creator === userInfo.userId) {
              statsPlayer(player);
            }
          },
        };
        switch (player.position) {
          case "GK":
            updatedSquad.gk = player;
            break;
          case "FB":
            DF++;
            if (!updatedSquad.df) updatedSquad.df = []; // Ensure df is initialized as an array
            updatedSquad.df.push(player);
            break;
          case "DM":
            M++;
            if (!updatedSquad.cdm) updatedSquad.cdm = []; // Ensure cdm is initialized as an array
            updatedSquad.cdm.push(player);
            break;
          case "M":
            M++;
            if (!updatedSquad.cm) updatedSquad.cm = []; // Ensure cm is initialized as an array
            updatedSquad.cm.push(player);
            break;
          case "cam":
            CAM++;
            if (!updatedSquad.cam) updatedSquad.cam = [];
            updatedSquad.cam.push(player);
            break;
          case "LM":
            FW++;
            if (!updatedSquad.fw) updatedSquad.fw = [];
            updatedSquad.fw.push(player);
            break;
          case "AM":
            FW++;
            if (!updatedSquad.fw) updatedSquad.fw = [];
            updatedSquad.fw.push(player);
            break;
          default:
            break;
        }
      });
      setNumberOfDF(DF);
      setNumberOfM(M);
      setNumberOfCAM(CAM);
      setNumberOfFW(FW);
      setSquad(updatedSquad);
      setTeamXL({ squad: updatedSquad });
    }
  }, [homeTeam]);
  //////////////////////////////////////////////////// Away Team
  useEffect(() => {
    let updatedSquad = { ...awaySquad };
    let DF = 0;
    let M = 0;
    let CAM = 0;
    let FW = 0;
    if (awayTeam && awayTeam.length > 2) {
      // Copy the current state
      awayTeam.forEach((player) => {
        player = {
          ...player,
          onClick: () => {
            if (Tournament.creator === userInfo.userId) {
              statsPlayerAway(player);
            }
          },
        };
        switch (player.position) {
          case "GK":
            updatedSquad.gk = player;
            break;
          case "FB":
            DF++;
            if (!updatedSquad.df) updatedSquad.df = []; // Ensure df is initialized as an array
            updatedSquad.df.push(player);
            break;
          case "DM":
            M++;
            if (!updatedSquad.cdm) updatedSquad.cdm = []; // Ensure cdm is initialized as an array
            updatedSquad.cdm.push(player);
            break;
          case "M":
            M++;
            if (!updatedSquad.cm) updatedSquad.cm = []; // Ensure cm is initialized as an array
            updatedSquad.cm.push(player);
            break;
          case "cam":
            CAM++;
            if (!updatedSquad.cam) updatedSquad.cam = []; // Ensure cam is initialized as an array
            updatedSquad.cam.push(player);
            break;
          case "LM":
            FW++;
            if (!updatedSquad.fw) updatedSquad.fw = []; // Ensure fw is initialized as an array
            updatedSquad.fw.push(player);
            break;
          case "AM":
            FW++;
            if (!updatedSquad.fw) updatedSquad.fw = []; // Ensure fw is initialized as an array
            updatedSquad.fw.push(player);
            break;
          default:
            break;
        }
      });
      setNumberOfDFAway(DF);
      setNumberOfMAway(M);
      setNumberOfCAMAway(CAM);
      setNumberOfFWAway(FW);
      setAwaySquad(updatedSquad);
      setAwayTeamXL({ squad: updatedSquad });
    }
  }, [awayTeam]);
  const [teamXL, setTeamXL] = useState({
    squad: Squad,
  });
  const [awayteamXL, setAwayTeamXL] = useState({
    squad: awaySquad,
  });
  const generateFormationString = (
    numberOfDF,
    numberOfM,
    numberOfCAM,
    numberOfFW
  ) => {
    const numDf = numberOfDF ? numberOfDF : 0;
    const numM = numberOfM ? numberOfM : 0;
    const numCam = numberOfCAM ? numberOfCAM : 0;
    const numFw = numberOfFW ? numberOfFW : 0;

    const formation = `1-${numDf}-${numM}-${numCam}-${numFw}`;

    return formation.replace(/-0/g, "");
  };
  let condition = false;
  const generateAllEvents = () => {
    let allEvents = [];

    // Iterate over each goal and construct the events array
    [...matchGoalsHomeTeam, ...matchGoalsAwayTeam].forEach((goal) => {
      // Check if there are goal minutes and add them to events
      if (goal.goalMinutes && goal.goalMinutes.length > 0) {
        goal.goalMinutes.forEach((minute) => {
          if (minute < 45) {
            allEvents.push({
              minute,
              playerName: goal.scorer,
              team: goal.forTeam,
              type: "goal",
            });
          }
        });
      }

      // Check if there are yellow card minutes and add them to events
      if (
        goal.yellowCardMinutes &&
        goal.yellowCardMinutes > 0 &&
        goal.yellowCardMinutes < 45
      ) {
        allEvents.push({
          minute: goal.yellowCardMinutes, // Assuming only one yellow card per goal
          playerName: goal.scorer,
          team: goal.forTeam,
          type: "yellowCard",
        });
      }

      // Check if there are red card minutes and add them to events
      if (
        goal.RedCardMinutes &&
        goal.RedCardMinutes > 0 &&
        goal.RedCardMinutes < 45
      ) {
        allEvents.push({
          minute: goal.RedCardMinutes, // Assuming only one red card per goal
          playerName: goal.scorer,
          team: goal.forTeam,
          type: "redCard",
        });
      }
    });

    // Sort the events by minute
    allEvents.sort((a, b) => a.minute - b.minute);

    return allEvents;
  };
  useEffect(() => {
    let homeTeamFirstHalfScore = 0;
    let awayTeamFirstHalfScore = 0;
    let homeTeamSecondHalfScore = 0;
    let awayTeamSecondHalfScore = 0;

    [...matchGoalsHomeTeam, ...matchGoalsAwayTeam].forEach((goal) => {
      if (goal.goalMinutes && goal.goalMinutes.length > 0) {
        goal.goalMinutes.forEach((minute) => {
          if (minute < 45) {
            if (goal.forTeam === match.team1._id) {
              homeTeamFirstHalfScore++;
            } else if (goal.forTeam === match.team2._id) {
              awayTeamFirstHalfScore++;
            }
          } else {
            if (goal.forTeam === match.team1._id) {
              homeTeamSecondHalfScore++;
            } else if (goal.forTeam === match.team2._id) {
              awayTeamSecondHalfScore++;
            }
          }
        });
      }
    });

    setScoreFirstHalfHomeTeam(homeTeamFirstHalfScore);
    setScoreFirstHalfAwayTeam(awayTeamFirstHalfScore);
    setScoreSecondHalfHomeTeam(homeTeamSecondHalfScore);
    setScoreSecondHalfAwayTeam(awayTeamSecondHalfScore);
  }, [matchGoalsHomeTeam, matchGoalsAwayTeam]);

  const generateAllEventsSeconHalf = () => {
    let allEvents = [];

    // Iterate over each goal and construct the events array
    [...matchGoalsHomeTeam, ...matchGoalsAwayTeam].forEach((goal) => {
      // Check if there are goal minutes and add them to events
      if (goal.goalMinutes && goal.goalMinutes.length > 0) {
        goal.goalMinutes.forEach((minute) => {
          if (minute > 45) {
            allEvents.push({
              minute,
              playerName: goal.scorer,
              team: goal.forTeam,
              type: "goal",
            });
          }
        });
      }

      // Check if there are yellow card minutes and add them to events
      if (
        goal.yellowCardMinutes &&
        goal.yellowCardMinutes > 0 &&
        goal.yellowCardMinutes > 45
      ) {
        allEvents.push({
          minute: goal.yellowCardMinutes, // Assuming only one yellow card per goal
          playerName: goal.scorer,
          team: goal.forTeam,
          type: "yellowCard",
        });
      }

      // Check if there are red card minutes and add them to events
      if (
        goal.RedCardMinutes &&
        goal.RedCardMinutes > 0 &&
        goal.RedCardMinutes > 45
      ) {
        allEvents.push({
          minute: goal.RedCardMinutes, // Assuming only one red card per goal
          playerName: goal.scorer,
          team: goal.forTeam,
          type: "redCard",
        });
      }
    });

    // Sort the events by minute
    allEvents.sort((a, b) => a.minute - b.minute);

    return allEvents;
  };
  const handleOnClickOnEdit = () => {
    setEdit(true);
    if (match.scoreTeam1 !== "" && match.scoreTeam2 !== "") {
      setTeamScore1(parseInt(match.scoreTeam1));
      setTeamScore2(parseInt(match.scoreTeam2));
    } else {
      setTeamScore1(0);
      setTeamScore2(0);
    }
    setMatchDateChange(match.matchDate);
  };
  const handleOnClickOnEditStats = () => {
    setEditStats(true);
  };
  const handleOnClickOnCancelEdit = () => {
    setEdit(false);
  };
  const handleOnClickOnCancelEditStats = () => {
    setEditStats(false);
    setChangeStatsValue({
      goalAttemptsTeam1: Stats.goalAttemptsTeam1,
      shotsOnGoalTeam1: Stats.shotsOnGoalTeam1,
      shotsOffGoalTeam1: Stats.shotsOffGoalTeam1,
      freeKicksTeam1: Stats.freeKicksTeam1,
      cornerKicksTeam1: Stats.cornerKicksTeam1,
      OffsidesTeam1: Stats.OffsidesTeam1,
      throwInsTeam1: Stats.throwInsTeam1,
      goalkeeperSavesTeam1: Stats.goalkeeperSavesTeam1,
      goalAttemptsTeam2: Stats.goalAttemptsTeam2,
      shotsOnGoalTeam2: Stats.shotsOnGoalTeam2,
      shotsOffGoalTeam2: Stats.shotsOffGoalTeam2,
      freeKicksTeam2: Stats.freeKicksTeam2,
      cornerKicksTeam2: Stats.cornerKicksTeam2,
      OffsidesTeam2: Stats.OffsidesTeam2,
      throwInsTeam2: Stats.throwInsTeam2,
      goalkeeperSavesTeam2: Stats.goalkeeperSavesTeam2,
    });
  };
  function handleDateTimeChange(event) {
    const newValue = event.target.value;
    setMatchDateChange(newValue);
  }
  const handleIncrementMatchTeamScore1 = () => {
    setTeamScore1((prevCount) => prevCount + 1);
  };

  const handleDecrementMatchTeamScore1 = () => {
    if (teamScore1 > 0) {
      setTeamScore1((prevCount) => prevCount - 1);
    }
  };
  const handleIncrementMatchTeamScore2 = () => {
    setTeamScore2((prevCount) => prevCount + 1);
  };

  const handleDecrementMatchTeamScore2 = () => {
    if (teamScore2 > 0) {
      setTeamScore2((prevCount) => prevCount - 1);
    }
  };
  const handleStateIncrementChange = (statName) => {
    setChangeStatsValue((prevStats) => ({
      ...prevStats,
      [statName]: prevStats[statName] + 1,
    }));
  };
  const handleStateUpdateDecrementChange = (statName) => {
    setChangeStatsValue((prevStats) => ({
      ...prevStats,
      [statName]: prevStats[statName] - 1,
    }));
  };
  const saveMatchStats = async () => {
    try {
      setStats({
        goalAttemptsTeam1: changeStatsValue.goalAttemptsTeam1,
        shotsOnGoalTeam1: changeStatsValue.shotsOnGoalTeam1,
        shotsOffGoalTeam1: changeStatsValue.shotsOffGoalTeam1,
        freeKicksTeam1: changeStatsValue.freeKicksTeam1,
        cornerKicksTeam1: changeStatsValue.cornerKicksTeam1,
        OffsidesTeam1: changeStatsValue.OffsidesTeam1,
        throwInsTeam1: changeStatsValue.throwInsTeam1,
        goalkeeperSavesTeam1: changeStatsValue.goalkeeperSavesTeam1,
        goalAttemptsTeam2: changeStatsValue.goalAttemptsTeam2,
        shotsOnGoalTeam2: changeStatsValue.shotsOnGoalTeam2,
        shotsOffGoalTeam2: changeStatsValue.shotsOffGoalTeam2,
        freeKicksTeam2: changeStatsValue.freeKicksTeam2,
        cornerKicksTeam2: changeStatsValue.cornerKicksTeam2,
        OffsidesTeam2: changeStatsValue.OffsidesTeam2,
        throwInsTeam2: changeStatsValue.throwInsTeam2,
        goalkeeperSavesTeam2: changeStatsValue.goalkeeperSavesTeam2,
      });
      const newmatchStats = {
        goalAttemptsTeam1: changeStatsValue.goalAttemptsTeam1,
        shotsOnGoalTeam1: changeStatsValue.shotsOnGoalTeam1,
        shotsOffGoalTeam1: changeStatsValue.shotsOffGoalTeam1,
        freeKicksTeam1: changeStatsValue.freeKicksTeam1,
        cornerKicksTeam1: changeStatsValue.cornerKicksTeam1,
        OffsidesTeam1: changeStatsValue.OffsidesTeam1,
        throwInsTeam1: changeStatsValue.throwInsTeam1,
        goalkeeperSavesTeam1: changeStatsValue.goalkeeperSavesTeam1,
        goalAttemptsTeam2: changeStatsValue.goalAttemptsTeam2,
        shotsOnGoalTeam2: changeStatsValue.shotsOnGoalTeam2,
        shotsOffGoalTeam2: changeStatsValue.shotsOffGoalTeam2,
        freeKicksTeam2: changeStatsValue.freeKicksTeam2,
        cornerKicksTeam2: changeStatsValue.cornerKicksTeam2,
        OffsidesTeam2: changeStatsValue.OffsidesTeam2,
        throwInsTeam2: changeStatsValue.throwInsTeam2,
        goalkeeperSavesTeam2: changeStatsValue.goalkeeperSavesTeam2,
        idMatch: match._id,
      };
      if (getMatchStat !== undefined) {
        await updateMatchStats(getMatchStat._id, newmatchStats);
      } else {
        console.log("hello");
        await addMatchStats(newmatchStats);
      }
      setEditStats(false);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      {match && match.team1 && (
        <div>
          <div className=" inset-0 z-50 overflow-y-auto flex items-center justify-center">
            <div className=" inset-0 bg-opacity-30 dark:bg-opacity-30" />
            <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg dark:bg-gray-900 relative">
              <div
                href="#"
                className="flex  flex-col  mb-2  bg-[#f6f8ff] border mt-6 ml-2 mr-2 border-gray-200 rounded-lg shadow  dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
              >
                <div className="flex justify-between items-center ml-3 mt-3 mb-2">
                  <div className="flex">
                    <IoIosFootball
                      className="text-black mr-2"
                      style={{ fontSize: "1.3rem" }}
                    />
                    <p className="text-black font-medium text-[0.8rem]">
                      FOOTBALL
                    </p>
                    <span className="mx-2 text-gray-400">{">"}</span>
                    <p className="text-black font-medium text-[0.9rem]">
                      {Tournament.city}
                    </p>
                  </div>
                  {TournamentManager && (
                    <div className="mr-5 cursor-pointer flex">
                      <FaRegEdit onClick={handleOnClickOnEdit} />
                      {Edit && (
                        <MdOutlineCancel
                          className="ml-3"
                          size={18}
                          onClick={handleOnClickOnCancelEdit}
                        />
                      )}
                    </div>
                  )}
                </div>
                <hr className="border-t border-white border-solid border-y-2 mb-2 " />{" "}
                <div className="flex flex-col items-center p-6 mt-5">
                  <div className="flex justify-between items-center w-full">
                    <div className="flex flex-col items-center">
                      <div className="border border-gray-300 border-opacity-50 rounded-xl p-5">
                        <img
                          alt="Team B logo"
                          className="rounded-md overflow-hidden object-cover w-10 h-10"
                          src={path + match.team1.image}
                          style={{
                            aspectRatio: "1",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <div className="font-normal font-sans text-[1.2rem]">
                        {match.team1.name}
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="-mt-12 mb-5 text-gray-500 text-[0.8rem] ">
                        {!Edit && formatDate(match.matchDate)}
                        {Edit && (
                          <input
                            type="datetime-local"
                            name="startDate"
                            onChange={handleDateTimeChange}
                            defaultValue={formatDateTime(match.matchDate)}
                            className="mr-2 w-fit rounded-md border border-body-color border-opacity-10 py-3 px-6 text-base font-medium text-body-color placeholder-body-color outline-none focus:border-primary focus:border-opacity-100 focus-visible:shadow-none dark:border-white dark:border-opacity-10 dark:bg-[#242B51] focus:dark:border-opacity-50 mb-4" // Added mb-4 for margin-bottom
                          />
                        )}
                      </div>
                      <div className="flex items-center space-x-4">
                        <>
                          {!Edit && (
                            <div className="text-4xl font-bold">
                              {match.scoreTeam1} - {match.scoreTeam2}
                            </div>
                          )}
                          {Edit && (
                            <div className="relative flex items-center">
                              <div className="flex">
                                <div className="flex flex-col">
                                  <button
                                    type="button"
                                    onClick={handleIncrementMatchTeamScore1}
                                    className="flex-shrink-0 mb-2 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                                  >
                                    <svg
                                      className="w-2.5 h-2.5 text-gray-900 dark:text-white"
                                      aria-hidden="true"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 18 18"
                                    >
                                      <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 1v16M1 9h16"
                                      />
                                    </svg>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={handleDecrementMatchTeamScore1}
                                    className="flex-shrink-0 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                                  >
                                    <svg
                                      className="w-2.5 h-2.5 text-gray-900 dark:text-white"
                                      aria-hidden="true"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 18 2"
                                    >
                                      <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M1 1h16"
                                      />
                                    </svg>
                                  </button>
                                </div>
                                <input
                                  type="text"
                                  className="flex-shrink-0 text-gray-900 dark:text-white border-0 bg-transparent text-sm font-normal focus:outline-none focus:ring-0 max-w-[2.5rem] text-center"
                                  placeholder=""
                                  value={teamScore1}
                                  onChange={(event) =>
                                    setTeamScore1(parseInt(event.target.value))
                                  }
                                  readOnly // Make input read-only to prevent manual input
                                  required
                                />
                              </div>
                              <div className="flex">
                                <input
                                  type="text"
                                  className="flex-shrink-0 text-gray-900 dark:text-white border-0 bg-transparent text-sm font-normal focus:outline-none focus:ring-0 max-w-[2.5rem] text-center"
                                  placeholder=""
                                  value={teamScore2}
                                  onChange={(event) =>
                                    setTeamScore2(parseInt(event.target.value))
                                  }
                                  readOnly // Make input read-only to prevent manual input
                                  required
                                />
                                <div className="flex flex-col">
                                  <button
                                    type="button"
                                    onClick={handleIncrementMatchTeamScore2}
                                    className="flex-shrink-0 mb-2 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                                  >
                                    <svg
                                      className="w-2.5 h-2.5 text-gray-900 dark:text-white"
                                      aria-hidden="true"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 18 18"
                                    >
                                      <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 1v16M1 9h16"
                                      />
                                    </svg>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={handleDecrementMatchTeamScore2}
                                    className="flex-shrink-0  bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                                  >
                                    <svg
                                      className="w-2.5 h-2.5 text-gray-900 dark:text-white"
                                      aria-hidden="true"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 18 2"
                                    >
                                      <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M1 1h16"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      </div>
                      {Edit && <button onClick={updateMatch}>Save</button>}
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="border border-gray-300 border-opacity-50 rounded-xl p-5">
                        <img
                          alt="Team B logo"
                          className="rounded-md overflow-hidden object-cover w-10 h-10"
                          src={path + match.team2.image}
                          style={{
                            aspectRatio: "1",
                            objectFit: "cover",
                          }}
                        />
                      </div>

                      <div className="font-normal font-sans  text-[1.2rem]">
                        {match.team2.name}
                      </div>
                    </div>
                  </div>
                </div>
                <hr className="border-t border-white border-solid border-y-2 mb-2 " />{" "}
                <div className="flex justify-start gap-2 ml-4  mb-3">
                  <button
                    className={`inline-flex items-center justify-center ${
                      activeTab === "summary"
                        ? "bg-transparent text-[#ff0046] border-b-4 border-[#ff0046]"
                        : "bg-transparent text-[#555e61] hover:text-black"
                    } px-5 py-2 focus:outline-none text-[0.8rem] font-semibold`}
                    onClick={() => handleTabChange("summary")}
                  >
                    <span>SUMMARY</span>
                  </button>
                  <button
                    className={`inline-flex items-center justify-center ${
                      activeTab === "stats"
                        ? "bg-transparent text-[#ff0046] border-b-4 border-[#ff0046]"
                        : "bg-transparent text-[#555e61] hover:text-black"
                    } px-5 py-2 focus:outline-none text-[0.8rem] font-semibold`}
                    onClick={() => handleTabChange("stats")}
                  >
                    STATS
                  </button>
                  <button
                    className={`inline-flex items-center justify-center ${
                      activeTab === "lineups"
                        ? "bg-transparent text-[#ff0046] border-b-4 border-[#ff0046]"
                        : "bg-transparent text-[#555e61] hover:text-black"
                    } px-5 py-2 focus:outline-none text-[0.8rem] font-semibold`}
                    onClick={() => handleTabChange("lineups")}
                  >
                    LINEUPS
                  </button>
                </div>
                <div className="">
                  {activeTab === "lineups" && (
                    <>
                      <div className="mb-5">
                        <a
                          href="#"
                          className=" mb-2 flex justify-between ml-3 mr-3 h-5 bg-white border border-gray-200 rounded-md shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                        >
                          <div className="text-[#555e61] text-[0.8rem] ml-2">
                            {generateFormationString(
                              numberOfDF,
                              numberOfM,
                              numberOfCAM,
                              numberOfFW
                            )}
                          </div>
                          <div className="text-[#555e61] text-[0.8rem]">
                            FORMATION
                          </div>
                          <div className="text-[#555e61] text-[0.8rem] mr-2">
                            {generateFormationString(
                              numberOfDFAway,
                              numberOfMAway,
                              numberOfCAMAway,
                              numberOfFWAway
                            )}
                          </div>
                        </a>
                        {/* Properly close the anchor tag */}
                        <SoccerLineUp
                          size={"responsive"}
                          color={"#588f58"}
                          pattern={"squares"}
                          homeTeam={teamXL}
                          awayTeam={awayteamXL}
                        />
                      </div>
                      <a
                        href="#"
                        className=" mb-3 flex justify-center ml-3 mr-3 h-5 bg-white border border-gray-200 rounded-md shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                      >
                        <div className="text-[#555e61] font-semibold text-[0.8rem]">
                          STARTING LINEUPS
                        </div>
                      </a>
                      <div className=" mx-3">
                        <div
                          className={`flex justify-between ${
                            condition ? "bg-gray-black" : "bg-gray-black"
                          }`}
                        >
                          {/* Mapping homeTeam */}
                          <div className="">
                            {homeTeam.map((homePlayer, index) => {
                              const playerGoals =
                                matchGoalsHomeTeamSimpleInfo.filter(
                                  (goal) => goal.scorer === homePlayer.id
                                )[0];
                              const hasGoals =
                                playerGoals && playerGoals.goalNumber > 0;
                              const hasYellowCards =
                                playerGoals &&
                                playerGoals.yellowCardsNumber > 0;
                              const hasRedCards =
                                playerGoals && playerGoals.redCardsNumber > 0;

                              return (
                                <div
                                  key={index}
                                  className={`flex items-center mb-5 ${
                                    index % 2 === 0 ? "even-row" : "odd-row"
                                  }`}
                                >
                                  <p className="text-black font-semibold text-[1rem] mr-2">
                                    <span className="font-[400] mr-1">
                                      {homePlayer.number}
                                    </span>{" "}
                                    {homePlayer.name}
                                  </p>

                                  {hasGoals &&
                                    Array.from({
                                      length: playerGoals.goalNumber,
                                    }).map((_, index) => (
                                      <FaFutbol
                                        key={`goal_${index}`}
                                        className="text-[#555e61] mr-2"
                                      />
                                    ))}

                                  {hasYellowCards &&
                                    Array.from({
                                      length: playerGoals.yellowCardsNumber,
                                    }).map((_, index) => (
                                      <img
                                        key={`yellow_card_${index}`}
                                        className="overflow-hidden object-cover w-3 h-4 mr-2"
                                        src="/images/Yellow_card.png"
                                        alt="Yellow Card"
                                        style={{
                                          aspectRatio: "1",
                                          objectFit: "cover",
                                        }}
                                      />
                                    ))}

                                  {hasRedCards &&
                                    Array.from({
                                      length: playerGoals.redCardsNumber,
                                    }).map((_, index) => (
                                      <img
                                        key={`red_card_${index}`}
                                        className="overflow-hidden object-cover w-3 h-4 mr-2"
                                        src="/images/redcards.png"
                                        alt="Red Card"
                                        style={{
                                          aspectRatio: "1",
                                          objectFit: "cover",
                                        }}
                                      />
                                    ))}
                                </div>
                              );
                            })}
                          </div>
                          {/* Mapping awayTeam */}
                          <div
                            className=""
                            style={{
                              direction: "rtl",
                            }}
                          >
                            {awayTeam.map((awayPlayer, index) => (
                              <div
                                key={index}
                                className="flex items-center mb-5"
                              >
                                <div className="flex items-center">
                                  {/* Player number */}
                                  <p className="text-black font-semibold text-[1rem]">
                                    <span className="font-[400] ml-2">
                                      {awayPlayer.number}
                                    </span>
                                  </p>
                                  {/* Player name */}
                                  <div className="text-black font-semibold text-[1rem]">
                                    {awayPlayer.name}
                                  </div>
                                  {/* Display goal icons */}
                                  {Array.from({
                                    length:
                                      matchGoalsAwayTeamSimpleInfo.find(
                                        (goal) => goal.scorer === awayPlayer.id
                                      )?.goalNumber || 0,
                                  }).map((_, index) => (
                                    <FaFutbol
                                      key={`goal_${index}`}
                                      className="text-[#555e61] mr-2"
                                    />
                                  ))}
                                  {/* Display yellow card icons */}
                                  {Array.from({
                                    length:
                                      matchGoalsAwayTeamSimpleInfo.find(
                                        (goal) => goal.scorer === awayPlayer.id
                                      )?.yellowCardsNumber || 0,
                                  }).map((_, index) => (
                                    <img
                                      key={`yellow_card_${index}`}
                                      className="overflow-hidden object-cover w-3 h-4 mr-2"
                                      src="/images/Yellow_card.png"
                                      style={{
                                        aspectRatio: "1",
                                        objectFit: "cover",
                                      }}
                                    />
                                  ))}
                                  {/* Display red card icons */}
                                  {Array.from({
                                    length:
                                      matchGoalsAwayTeamSimpleInfo.find(
                                        (goal) => goal.scorer === awayPlayer.id
                                      )?.redCardsNumber || 0,
                                  }).map((_, index) => (
                                    <img
                                      key={`red_card_${index}`}
                                      className="overflow-hidden object-cover w-3 h-4 mr-2"
                                      src="/images/redcards.png"
                                      style={{
                                        aspectRatio: "1",
                                        objectFit: "cover",
                                      }}
                                    />
                                  ))}
                                </div>
                                <div style={{ flex: 1 }}></div>
                                {/* This creates a flexible space */}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <a
                        href="#"
                        className=" mb-2 flex justify-center ml-3 mr-3 h-5 bg-white border border-gray-200 rounded-md shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                      >
                        <div className="text-[#555e61] font-semibold text-[0.8rem]">
                          SUBSTITUTES
                        </div>
                      </a>
                      {isPopupOpen && selectedPlayer && (
                        <div>
                          <div className="fixed inset-0 bg-gray-900 bg-opacity-30" />
                          <StatsPlayer
                            match={match}
                            player={selectedPlayer}
                            Tournament={Tournament}
                            HomeAwayTeam={HomeAwayTeam}
                            socket={socket}
                            onClose={() => {
                              setIsPopupOpen(false);
                            }}
                          />
                        </div>
                      )}
                    </>
                  )}
                  {activeTab === "summary" && (
                    <>
                      <a className=" mb-2 flex justify-between ml-3 mr-3 h-5 bg-white border border-gray-200 rounded-md shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                        <div className="text-[#555e61] text-[0.8rem] ml-2">
                          <p>1ST HALF</p>
                        </div>

                        <div className="text-[#555e61] text-[0.8rem] mr-2">
                          <p>
                            {scoreFirstHalfHomeTeam}-{scoreFirstHalfAwayTeam}
                          </p>
                        </div>
                      </a>
                      <div className="">
                        <div className="">
                          {generateAllEvents().map((event, index) => (
                            <div
                              className={
                                event.team === match.team2._id
                                  ? "flex justify-end mr-4"
                                  : "mr-50"
                              }
                              key={index}
                            >
                              <p className="ml-5 mt-5 flex items-center">
                                {event.team === match.team1._id ? (
                                  <>
                                    <span className="minute-class-team1 mr-2 font-semibold text-[0.8rem]">
                                      {event.minute}'
                                    </span>
                                    <span className="player-class-team1 font-semibold text-[1rem] mr-2">
                                      {event.playerName.firstName}{" "}
                                      {event.playerName.lastName.charAt(0)}.
                                    </span>
                                    {event.type === "goal" && (
                                      <FaFutbol
                                        key={`goal_${index}`}
                                        className="text-[#555e61]  mr-2"
                                      />
                                    )}
                                    {event.type === "yellowCard" && (
                                      <img
                                        className="overflow-hidden  object-cover w-3 h-4 mr-2"
                                        src="/images/Yellow_card.png"
                                        style={{
                                          aspectRatio: "1",
                                          objectFit: "cover",
                                        }}
                                      />
                                    )}
                                    {event.type === "redCard" && (
                                      <img
                                        className="overflow-hidden  object-cover w-3 h-4  mr-2"
                                        src="/images/redcards.png"
                                        style={{
                                          aspectRatio: "1",
                                          objectFit: "cover",
                                        }}
                                      />
                                    )}
                                  </>
                                ) : (
                                  <>
                                    {event.type === "goal" && (
                                      <FaFutbol
                                        key={`goal_${index}`}
                                        className="text-[#555e61]  mr-2"
                                      />
                                    )}
                                    {event.type === "yellowCard" && (
                                      <img
                                        className="overflow-hidden  object-cover w-3 h-4 mr-2"
                                        src="/images/Yellow_card.png"
                                        style={{
                                          aspectRatio: "1",
                                          objectFit: "cover",
                                        }}
                                      />
                                    )}
                                    {event.type === "redCard" && (
                                      <img
                                        className="overflow-hidden  object-cover w-3 h-4  mr-2"
                                        src="/images/redcards.png"
                                        style={{
                                          aspectRatio: "1",
                                          objectFit: "cover",
                                        }}
                                      />
                                    )}
                                    <span className="player-class-team1 font-semibold text-[1rem]">
                                      {event.playerName.firstName}{" "}
                                      {event.playerName.lastName.charAt(0)}.
                                    </span>
                                    <span className="minute-class-team2 ml-2 font-semibold text-[0.8rem]">
                                      {event.minute}'
                                    </span>
                                  </>
                                )}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <a className=" mb-2 flex justify-between ml-3 mr-3 h-5 bg-white border border-gray-200 rounded-md shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                        <div className="text-[#555e61] text-[0.8rem] ml-2">
                          <p>2ND HALF</p>
                        </div>

                        <div className="text-[#555e61] text-[0.8rem] mr-2">
                          <p>
                            {scoreSecondHalfHomeTeam}-{scoreSecondHalfAwayTeam}
                          </p>
                        </div>
                      </a>
                      <div className="">
                        <div className="">
                          {generateAllEventsSeconHalf().map((event, index) => (
                            <div
                              className={
                                event.team === match.team2._id
                                  ? "flex justify-end mr-4"
                                  : "mr-50"
                              }
                              key={index}
                            >
                              <p className="ml-5 mt-5 flex items-center">
                                {event.team === match.team1._id ? (
                                  <>
                                    <span className="minute-class-team1 mr-2 font-semibold text-[0.8rem]">
                                      {event.minute}'
                                    </span>
                                    <span className="player-class-team1 font-semibold text-[1rem] mr-2">
                                      {event.playerName.firstName}{" "}
                                      {event.playerName.lastName.charAt(0)}.
                                    </span>
                                    {event.type === "goal" && (
                                      <FaFutbol
                                        key={`goal_${index}`}
                                        className="text-[#555e61]  mr-2"
                                      />
                                    )}
                                    {event.type === "yellowCard" && (
                                      <img
                                        className="overflow-hidden  object-cover w-3 h-4 mr-2"
                                        src="/images/Yellow_card.png"
                                        style={{
                                          aspectRatio: "1",
                                          objectFit: "cover",
                                        }}
                                      />
                                    )}
                                    {event.type === "redCard" && (
                                      <img
                                        className="overflow-hidden  object-cover w-3 h-4  mr-2"
                                        src="/images/redcards.png"
                                        style={{
                                          aspectRatio: "1",
                                          objectFit: "cover",
                                        }}
                                      />
                                    )}
                                  </>
                                ) : (
                                  <>
                                    {event.type === "goal" && (
                                      <FaFutbol
                                        key={`goal_${index}`}
                                        className="text-[#555e61]  mr-2"
                                      />
                                    )}
                                    {event.type === "yellowCard" && (
                                      <img
                                        className="overflow-hidden  object-cover w-3 h-4 mr-2"
                                        src="/images/Yellow_card.png"
                                        style={{
                                          aspectRatio: "1",
                                          objectFit: "cover",
                                        }}
                                      />
                                    )}
                                    {event.type === "redCard" && (
                                      <img
                                        className="overflow-hidden  object-cover w-3 h-4  mr-2"
                                        src="/images/redcards.png"
                                        style={{
                                          aspectRatio: "1",
                                          objectFit: "cover",
                                        }}
                                      />
                                    )}
                                    <span className="player-class-team1 font-semibold text-[1rem]">
                                      {event.playerName.firstName}{" "}
                                      {event.playerName.lastName.charAt(0)}.
                                    </span>
                                    <span className="minute-class-team2 ml-2 font-semibold text-[0.8rem]">
                                      {event.minute}'
                                    </span>
                                  </>
                                )}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                  {activeTab === "stats" && (
                    <>
                      {/* Render match statistics */}
                      {TournamentManager && (
                        <div className="mr-3 cursor-pointer flex justify-end -mt-8 mb-4">
                          <FaRegEdit onClick={handleOnClickOnEditStats} />
                          {EditStats && (
                            <MdOutlineCancel
                              className="ml-3"
                              size={18}
                              onClick={handleOnClickOnCancelEditStats}
                            />
                          )}
                        </div>
                      )}
                      <div className="flex flex-col">
                        <div className="mb-3">
                          <div className="flex justify-between mb-2">
                            <div className=" font-semibold text-[0.8rem] ml-2 flex">
                              {!EditStats && Stats.goalAttemptsTeam1}
                              {EditStats && (
                                <div className="relative flex items-center">
                                  <div className="flex">
                                    <input
                                      type="text"
                                      className="flex-shrink-0 text-gray-900 dark:text-white border-0 bg-transparent text-sm font-normal focus:outline-none focus:ring-0 max-w-[2.5rem] text-center"
                                      placeholder=""
                                      value={changeStatsValue.goalAttemptsTeam1}
                                      onChange={(event) =>
                                        setTeamScore1(
                                          parseInt(event.target.value)
                                        )
                                      }
                                      readOnly // Make input read-only to prevent manual input
                                      required
                                    />
                                    <div className="flex flex-col">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleStateIncrementChange(
                                            "goalAttemptsTeam1"
                                          )
                                        }
                                        className="flex-shrink-0 mb-2 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                                      >
                                        <svg
                                          className="w-2.5 h-2.5 text-gray-900 dark:text-white"
                                          aria-hidden="true"
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 18 18"
                                        >
                                          <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 1v16M1 9h16"
                                          />
                                        </svg>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleStateUpdateDecrementChange(
                                            "goalAttemptsTeam1"
                                          )
                                        }
                                        className="flex-shrink-0 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                                      >
                                        <svg
                                          className="w-2.5 h-2.5 text-gray-900 dark:text-white"
                                          aria-hidden="true"
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 18 2"
                                        >
                                          <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M1 1h16"
                                          />
                                        </svg>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className=" font-semibold text-[0.8rem] ">
                              Goal Attempts
                            </div>
                            <div className=" font-semibold text-[0.8rem] mr-4">
                              {!EditStats && Stats.goalAttemptsTeam2}
                              {EditStats && (
                                <div className="relative flex items-center">
                                  <div className="flex">
                                    <div className="flex flex-col">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleStateIncrementChange(
                                            "goalAttemptsTeam2"
                                          )
                                        }
                                        className="flex-shrink-0 mb-2 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                                      >
                                        <svg
                                          className="w-2.5 h-2.5 text-gray-900 dark:text-white"
                                          aria-hidden="true"
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 18 18"
                                        >
                                          <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 1v16M1 9h16"
                                          />
                                        </svg>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleStateUpdateDecrementChange(
                                            "goalAttemptsTeam2"
                                          )
                                        }
                                        className="flex-shrink-0 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                                      >
                                        <svg
                                          className="w-2.5 h-2.5 text-gray-900 dark:text-white"
                                          aria-hidden="true"
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 18 2"
                                        >
                                          <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M1 1h16"
                                          />
                                        </svg>
                                      </button>
                                    </div>
                                    <input
                                      type="text"
                                      className="flex-shrink-0 text-gray-900 dark:text-white border-0 bg-transparent text-sm font-normal focus:outline-none focus:ring-0 max-w-[2.5rem] text-center"
                                      placeholder=""
                                      value={changeStatsValue.goalAttemptsTeam2}
                                      onChange={(event) =>
                                        setTeamScore1(
                                          parseInt(event.target.value)
                                        )
                                      }
                                      readOnly // Make input read-only to prevent manual input
                                      required
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex">
                            <div className="w-full">
                              <div
                                className="flex flex-col  relative"
                                style={{ direction: "rtl" }}
                              >
                                {Stats.goalAttemptsTeam1 !== 0 && (
                                  <a
                                    href="#"
                                    className="absolute top-0 mb-2 flex justify-end h-3 bg-red-400 border border-gray-200 rounded-md shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                                    style={{
                                      width: `${
                                        (Stats.goalAttemptsTeam1 /
                                          (Stats.goalAttemptsTeam1 +
                                            Stats.goalAttemptsTeam2)) *
                                        100
                                      }%`,
                                      direction: "rtl",
                                    }}
                                  ></a>
                                )}
                                <a
                                  href="#"
                                  className="mb-2 flex justify-start ml-3  h-3 bg-white border border-gray-200 rounded-md shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                                ></a>
                              </div>
                            </div>

                            {/* Contents of the second item */}
                            <div className="w-full">
                              <div className="flex flex-col relative">
                                {/* First a element */}
                                <a
                                  href="#"
                                  className="mb-2 flex justify-between ml-3 mr-1 h-3 bg-white border border-gray-200 rounded-md shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                                ></a>
                                {/* Second a element */}
                                {Stats.goalAttemptsTeam2 !== 0 && (
                                  <a
                                    href="#"
                                    className="absolute top-0 mb-2 flex  ml-3 mr-5 h-3 bg-black border border-gray-200 rounded-md shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                                    style={{
                                      width: `${
                                        (Stats.goalAttemptsTeam2 /
                                          (Stats.goalAttemptsTeam1 +
                                            Stats.goalAttemptsTeam2)) *
                                        100
                                      }%`,
                                    }}
                                  ></a>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="flex justify-between mb-2">
                            <div className=" font-semibold text-[0.8rem] ml-2">
                              {!EditStats && Stats.shotsOnGoalTeam1}
                              {EditStats && (
                                <div className="relative flex items-center">
                                  <div className="flex">
                                    <input
                                      type="text"
                                      className="flex-shrink-0 text-gray-900 dark:text-white border-0 bg-transparent text-sm font-normal focus:outline-none focus:ring-0 max-w-[2.5rem] text-center"
                                      placeholder=""
                                      value={changeStatsValue.shotsOnGoalTeam1}
                                      onChange={(event) =>
                                        setTeamScore1(
                                          parseInt(event.target.value)
                                        )
                                      }
                                      readOnly // Make input read-only to prevent manual input
                                      required
                                    />
                                    <div className="flex flex-col">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleStateIncrementChange(
                                            "shotsOnGoalTeam1"
                                          )
                                        }
                                        className="flex-shrink-0 mb-2 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                                      >
                                        <svg
                                          className="w-2.5 h-2.5 text-gray-900 dark:text-white"
                                          aria-hidden="true"
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 18 18"
                                        >
                                          <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 1v16M1 9h16"
                                          />
                                        </svg>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleStateUpdateDecrementChange(
                                            "shotsOnGoalTeam1"
                                          )
                                        }
                                        className="flex-shrink-0 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                                      >
                                        <svg
                                          className="w-2.5 h-2.5 text-gray-900 dark:text-white"
                                          aria-hidden="true"
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 18 2"
                                        >
                                          <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M1 1h16"
                                          />
                                        </svg>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className=" font-semibold text-[0.8rem] ">
                              Shots on Goal
                            </div>
                            <div className=" font-semibold text-[0.8rem] mr-4">
                              {!EditStats && Stats.shotsOnGoalTeam2}
                              {EditStats && (
                                <div className="relative flex items-center">
                                  <div className="flex">
                                    <div className="flex flex-col">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleStateIncrementChange(
                                            "shotsOnGoalTeam2"
                                          )
                                        }
                                        className="flex-shrink-0 mb-2 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                                      >
                                        <svg
                                          className="w-2.5 h-2.5 text-gray-900 dark:text-white"
                                          aria-hidden="true"
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 18 18"
                                        >
                                          <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 1v16M1 9h16"
                                          />
                                        </svg>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleStateUpdateDecrementChange(
                                            "shotsOnGoalTeam2"
                                          )
                                        }
                                        className="flex-shrink-0 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                                      >
                                        <svg
                                          className="w-2.5 h-2.5 text-gray-900 dark:text-white"
                                          aria-hidden="true"
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 18 2"
                                        >
                                          <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M1 1h16"
                                          />
                                        </svg>
                                      </button>
                                    </div>
                                    <input
                                      type="text"
                                      className="flex-shrink-0 text-gray-900 dark:text-white border-0 bg-transparent text-sm font-normal focus:outline-none focus:ring-0 max-w-[2.5rem] text-center"
                                      placeholder=""
                                      value={changeStatsValue.shotsOnGoalTeam2}
                                      onChange={(event) =>
                                        setTeamScore1(
                                          parseInt(event.target.value)
                                        )
                                      }
                                      readOnly // Make input read-only to prevent manual input
                                      required
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex">
                            <div className="w-full">
                              <div
                                className="flex flex-col  relative"
                                style={{ direction: "rtl" }}
                              >
                                {/* First a element */}

                                {/* Second a element */}
                                {Stats.shotsOnGoalTeam1 !== 0 && (
                                  <a
                                    href="#"
                                    className="absolute top-0 mb-2 flex justify-end h-3 bg-red-400 border border-gray-200 rounded-md shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                                    style={{
                                      width: `${
                                        (Stats.shotsOnGoalTeam1 /
                                          (Stats.shotsOnGoalTeam1 +
                                            Stats.shotsOnGoalTeam2)) *
                                        100
                                      }%`,
                                      direction: "rtl",
                                    }}
                                  ></a>
                                )}
                                <a
                                  href="#"
                                  className="mb-2 flex justify-start ml-3  h-3 bg-white border border-gray-200 rounded-md shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                                ></a>
                              </div>
                            </div>

                            {/* Contents of the second item */}
                            <div className="w-full">
                              <div className="flex flex-col relative">
                                {/* First a element */}
                                <a
                                  href="#"
                                  className="mb-2 flex justify-between ml-3 mr-1 h-3 bg-white border border-gray-200 rounded-md shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                                ></a>
                                {/* Second a element */}
                                {Stats.shotsOnGoalTeam2 !== 0 && (
                                  <a
                                    href="#"
                                    className="absolute top-0 mb-2 flex justify-between ml-3 mr-5 h-3 bg-black border border-gray-200 rounded-md shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                                    style={{
                                      width: `${
                                        (Stats.shotsOnGoalTeam2 /
                                          (Stats.shotsOnGoalTeam1 +
                                            Stats.shotsOnGoalTeam2)) *
                                        100
                                      }%`,
                                    }}
                                  ></a>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="flex justify-between mb-3">
                            <div className=" font-semibold text-[0.8rem] ml-2">
                              {!EditStats && Stats.shotsOffGoalTeam1}
                              {EditStats && (
                                <div className="relative flex items-center">
                                  <div className="flex">
                                    <input
                                      type="text"
                                      className="flex-shrink-0 text-gray-900 dark:text-white border-0 bg-transparent text-sm font-normal focus:outline-none focus:ring-0 max-w-[2.5rem] text-center"
                                      placeholder=""
                                      value={changeStatsValue.shotsOffGoalTeam1}
                                      onChange={(event) =>
                                        setTeamScore1(
                                          parseInt(event.target.value)
                                        )
                                      }
                                      readOnly // Make input read-only to prevent manual input
                                      required
                                    />
                                    <div className="flex flex-col">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleStateIncrementChange(
                                            "shotsOffGoalTeam1"
                                          )
                                        }
                                        className="flex-shrink-0 mb-2 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                                      >
                                        <svg
                                          className="w-2.5 h-2.5 text-gray-900 dark:text-white"
                                          aria-hidden="true"
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 18 18"
                                        >
                                          <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 1v16M1 9h16"
                                          />
                                        </svg>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleStateUpdateDecrementChange(
                                            "shotsOffGoalTeam1"
                                          )
                                        }
                                        className="flex-shrink-0 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                                      >
                                        <svg
                                          className="w-2.5 h-2.5 text-gray-900 dark:text-white"
                                          aria-hidden="true"
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 18 2"
                                        >
                                          <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M1 1h16"
                                          />
                                        </svg>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className=" font-semibold text-[0.8rem] ">
                              Shots off Goal
                            </div>
                            <div className=" font-semibold text-[0.8rem] mr-4">
                              {!EditStats && Stats.shotsOffGoalTeam2}
                              {EditStats && (
                                <div className="relative flex items-center">
                                  <div className="flex">
                                    <div className="flex flex-col">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleStateIncrementChange(
                                            "shotsOffGoalTeam2"
                                          )
                                        }
                                        className="flex-shrink-0 mb-2 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                                      >
                                        <svg
                                          className="w-2.5 h-2.5 text-gray-900 dark:text-white"
                                          aria-hidden="true"
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 18 18"
                                        >
                                          <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 1v16M1 9h16"
                                          />
                                        </svg>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleStateUpdateDecrementChange(
                                            "shotsOffGoalTeam2"
                                          )
                                        }
                                        className="flex-shrink-0 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                                      >
                                        <svg
                                          className="w-2.5 h-2.5 text-gray-900 dark:text-white"
                                          aria-hidden="true"
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 18 2"
                                        >
                                          <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M1 1h16"
                                          />
                                        </svg>
                                      </button>
                                    </div>
                                    <input
                                      type="text"
                                      className="flex-shrink-0 text-gray-900 dark:text-white border-0 bg-transparent text-sm font-normal focus:outline-none focus:ring-0 max-w-[2.5rem] text-center"
                                      placeholder=""
                                      value={changeStatsValue.shotsOffGoalTeam2}
                                      onChange={(event) =>
                                        setTeamScore1(
                                          parseInt(event.target.value)
                                        )
                                      }
                                      readOnly // Make input read-only to prevent manual input
                                      required
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex">
                            <div className="w-full">
                              <div
                                className="flex flex-col  relative"
                                style={{ direction: "rtl" }}
                              >
                                {/* First a element */}

                                {/* Second a element */}
                                {Stats.shotsOffGoalTeam1 !== 0 && (
                                  <a
                                    href="#"
                                    className="absolute top-0 mb-2 flex justify-end h-3 bg-red-400 border border-gray-200 rounded-md shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                                    style={{
                                      width: `${
                                        (Stats.shotsOffGoalTeam1 /
                                          (Stats.shotsOffGoalTeam1 +
                                            Stats.shotsOffGoalTeam2)) *
                                        100
                                      }%`,
                                      direction: "rtl",
                                    }}
                                  ></a>
                                )}
                                <a
                                  href="#"
                                  className="mb-2 flex justify-start ml-3  h-3 bg-white border border-gray-200 rounded-md shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                                ></a>
                              </div>
                            </div>

                            {/* Contents of the second item */}
                            <div className="w-full">
                              <div className="flex flex-col relative">
                                {/* First a element */}
                                <a
                                  href="#"
                                  className="mb-2 flex justify-between ml-3 mr-1 h-3 bg-white border border-gray-200 rounded-md shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                                ></a>
                                {/* Second a element */}
                                {Stats.shotsOffGoalTeam2 !== 0 && (
                                  <a
                                    href="#"
                                    className="absolute top-0 mb-2 flex justify-between ml-3 mr-5 h-3 bg-black border border-gray-200 rounded-md shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                                    style={{
                                      width: `${
                                        (Stats.shotsOffGoalTeam2 /
                                          (Stats.shotsOffGoalTeam1 +
                                            Stats.shotsOffGoalTeam2)) *
                                        100
                                      }%`,
                                    }}
                                  ></a>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="flex justify-between mb-3">
                            <div className=" font-semibold text-[0.8rem] ml-2">
                              {!EditStats && Stats.freeKicksTeam1}
                              {EditStats && (
                                <div className="relative flex items-center">
                                  <div className="flex">
                                    <input
                                      type="text"
                                      className="flex-shrink-0 text-gray-900 dark:text-white border-0 bg-transparent text-sm font-normal focus:outline-none focus:ring-0 max-w-[2.5rem] text-center"
                                      placeholder=""
                                      value={changeStatsValue.freeKicksTeam1}
                                      onChange={(event) =>
                                        setTeamScore1(
                                          parseInt(event.target.value)
                                        )
                                      }
                                      readOnly // Make input read-only to prevent manual input
                                      required
                                    />
                                    <div className="flex flex-col">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleStateIncrementChange(
                                            "freeKicksTeam1"
                                          )
                                        }
                                        className="flex-shrink-0 mb-2 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                                      >
                                        <svg
                                          className="w-2.5 h-2.5 text-gray-900 dark:text-white"
                                          aria-hidden="true"
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 18 18"
                                        >
                                          <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 1v16M1 9h16"
                                          />
                                        </svg>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleStateUpdateDecrementChange(
                                            "freeKicksTeam1"
                                          )
                                        }
                                        className="flex-shrink-0 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                                      >
                                        <svg
                                          className="w-2.5 h-2.5 text-gray-900 dark:text-white"
                                          aria-hidden="true"
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 18 2"
                                        >
                                          <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M1 1h16"
                                          />
                                        </svg>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className=" font-semibold text-[0.8rem] ">
                              Free Kicks
                            </div>
                            <div className=" font-semibold text-[0.8rem] mr-4">
                              {!EditStats && Stats.freeKicksTeam2}
                              {EditStats && (
                                <div className="relative flex items-center">
                                  <div className="flex">
                                    <div className="flex flex-col">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleStateIncrementChange(
                                            "freeKicksTeam2"
                                          )
                                        }
                                        className="flex-shrink-0 mb-2 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                                      >
                                        <svg
                                          className="w-2.5 h-2.5 text-gray-900 dark:text-white"
                                          aria-hidden="true"
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 18 18"
                                        >
                                          <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 1v16M1 9h16"
                                          />
                                        </svg>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleStateUpdateDecrementChange(
                                            "freeKicksTeam2"
                                          )
                                        }
                                        className="flex-shrink-0 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                                      >
                                        <svg
                                          className="w-2.5 h-2.5 text-gray-900 dark:text-white"
                                          aria-hidden="true"
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 18 2"
                                        >
                                          <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M1 1h16"
                                          />
                                        </svg>
                                      </button>
                                    </div>
                                    <input
                                      type="text"
                                      className="flex-shrink-0 text-gray-900 dark:text-white border-0 bg-transparent text-sm font-normal focus:outline-none focus:ring-0 max-w-[2.5rem] text-center"
                                      placeholder=""
                                      value={changeStatsValue.freeKicksTeam2}
                                      onChange={(event) =>
                                        setTeamScore1(
                                          parseInt(event.target.value)
                                        )
                                      }
                                      readOnly // Make input read-only to prevent manual input
                                      required
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex">
                            <div className="w-full">
                              <div
                                className="flex flex-col  relative"
                                style={{ direction: "rtl" }}
                              >
                                {/* First a element */}

                                {/* Second a element */}
                                {Stats.freeKicksTeam1 !== 0 && (
                                  <a
                                    href="#"
                                    className="absolute top-0 mb-2 flex justify-end h-3 bg-red-400 border border-gray-200 rounded-md shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                                    style={{
                                      width: `${
                                        (Stats.freeKicksTeam1 /
                                          (Stats.freeKicksTeam1 +
                                            Stats.freeKicksTeam2)) *
                                        100
                                      }%`,
                                      direction: "rtl",
                                    }}
                                  ></a>
                                )}
                                <a
                                  href="#"
                                  className="mb-2 flex justify-start ml-3 h-3 bg-white border border-gray-200 rounded-md shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                                ></a>
                              </div>
                            </div>

                            {/* Contents of the second item */}
                            <div className="w-full">
                              <div className="flex flex-col relative">
                                {/* First a element */}
                                <a
                                  href="#"
                                  className="mb-2 flex justify-between ml-3 mr-1 h-3 bg-white border border-gray-200 rounded-md shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                                ></a>
                                {/* Second a element */}
                                {Stats.freeKicksTeam2 !== 0 && (
                                  <a
                                    href="#"
                                    className="absolute top-0 mb-2 flex justify-between ml-3 mr-5 h-3 bg-black border border-gray-200 rounded-md shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                                    style={{
                                      width: `${
                                        (Stats.freeKicksTeam2 /
                                          (Stats.freeKicksTeam1 +
                                            Stats.freeKicksTeam2)) *
                                        100
                                      }%`,
                                    }}
                                  ></a>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="flex justify-between mb-3">
                            <div className=" font-semibold text-[0.8rem] ml-2">
                              {!EditStats && Stats.cornerKicksTeam1}
                              {EditStats && (
                                <div className="relative flex items-center">
                                  <div className="flex">
                                    <input
                                      type="text"
                                      className="flex-shrink-0 text-gray-900 dark:text-white border-0 bg-transparent text-sm font-normal focus:outline-none focus:ring-0 max-w-[2.5rem] text-center"
                                      placeholder=""
                                      value={changeStatsValue.cornerKicksTeam1}
                                      onChange={(event) =>
                                        setTeamScore1(
                                          parseInt(event.target.value)
                                        )
                                      }
                                      readOnly // Make input read-only to prevent manual input
                                      required
                                    />
                                    <div className="flex flex-col">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleStateIncrementChange(
                                            "cornerKicksTeam1"
                                          )
                                        }
                                        className="flex-shrink-0 mb-2 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                                      >
                                        <svg
                                          className="w-2.5 h-2.5 text-gray-900 dark:text-white"
                                          aria-hidden="true"
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 18 18"
                                        >
                                          <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 1v16M1 9h16"
                                          />
                                        </svg>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleStateUpdateDecrementChange(
                                            "cornerKicksTeam1"
                                          )
                                        }
                                        className="flex-shrink-0 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                                      >
                                        <svg
                                          className="w-2.5 h-2.5 text-gray-900 dark:text-white"
                                          aria-hidden="true"
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 18 2"
                                        >
                                          <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M1 1h16"
                                          />
                                        </svg>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className=" font-semibold text-[0.8rem] ">
                              Corner Kicks
                            </div>
                            <div className=" font-semibold text-[0.8rem] mr-4">
                              {!EditStats && Stats.cornerKicksTeam2}
                              {EditStats && (
                                <div className="relative flex items-center">
                                  <div className="flex">
                                    <div className="flex flex-col">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleStateIncrementChange(
                                            "cornerKicksTeam2"
                                          )
                                        }
                                        className="flex-shrink-0 mb-2 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                                      >
                                        <svg
                                          className="w-2.5 h-2.5 text-gray-900 dark:text-white"
                                          aria-hidden="true"
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 18 18"
                                        >
                                          <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 1v16M1 9h16"
                                          />
                                        </svg>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleStateUpdateDecrementChange(
                                            "cornerKicksTeam2"
                                          )
                                        }
                                        className="flex-shrink-0 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                                      >
                                        <svg
                                          className="w-2.5 h-2.5 text-gray-900 dark:text-white"
                                          aria-hidden="true"
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 18 2"
                                        >
                                          <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M1 1h16"
                                          />
                                        </svg>
                                      </button>
                                    </div>
                                    <input
                                      type="text"
                                      className="flex-shrink-0 text-gray-900 dark:text-white border-0 bg-transparent text-sm font-normal focus:outline-none focus:ring-0 max-w-[2.5rem] text-center"
                                      placeholder=""
                                      value={changeStatsValue.cornerKicksTeam2}
                                      onChange={(event) =>
                                        setTeamScore1(
                                          parseInt(event.target.value)
                                        )
                                      }
                                      readOnly // Make input read-only to prevent manual input
                                      required
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex">
                            <div className="w-full">
                              <div
                                className="flex flex-col  relative"
                                style={{ direction: "rtl" }}
                              >
                                {/* First a element */}

                                {/* Second a element */}
                                {Stats.cornerKicksTeam1 !== 0 && (
                                  <a
                                    href="#"
                                    className="absolute top-0 mb-2 flex justify-end h-3 bg-red-400 border border-gray-200 rounded-md shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                                    style={{
                                      width: `${
                                        (Stats.cornerKicksTeam1 /
                                          (Stats.cornerKicksTeam1 +
                                            Stats.cornerKicksTeam2)) *
                                        100
                                      }%`,
                                      direction: "rtl",
                                    }}
                                  ></a>
                                )}
                                <a
                                  href="#"
                                  className="mb-2 flex justify-start ml-3  h-3 bg-white border border-gray-200 rounded-md shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                                ></a>
                              </div>
                            </div>

                            {/* Contents of the second item */}
                            <div className="w-full">
                              <div className="flex flex-col relative">
                                {/* First a element */}
                                <a
                                  href="#"
                                  className="mb-2 flex justify-between ml-3 mr-1 h-3 bg-white border border-gray-200 rounded-md shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                                ></a>
                                {/* Second a element */}
                                {Stats.cornerKicksTeam2 !== 0 && (
                                  <a
                                    href="#"
                                    className="absolute top-0 mb-2 flex justify-between ml-3 mr-5 h-3 bg-black border border-gray-200 rounded-md shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                                    style={{
                                      width: `${
                                        (Stats.cornerKicksTeam2 /
                                          (Stats.cornerKicksTeam1 +
                                            Stats.cornerKicksTeam2)) *
                                        100
                                      }%`,
                                    }}
                                  ></a>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="flex justify-between mb-3">
                            <div className=" font-semibold text-[0.8rem] ml-2">
                              {!EditStats && Stats.OffsidesTeam1}
                              {EditStats && (
                                <div className="relative flex items-center">
                                  <div className="flex">
                                    <input
                                      type="text"
                                      className="flex-shrink-0 text-gray-900 dark:text-white border-0 bg-transparent text-sm font-normal focus:outline-none focus:ring-0 max-w-[2.5rem] text-center"
                                      placeholder=""
                                      value={changeStatsValue.OffsidesTeam1}
                                      onChange={(event) =>
                                        setTeamScore1(
                                          parseInt(event.target.value)
                                        )
                                      }
                                      readOnly // Make input read-only to prevent manual input
                                      required
                                    />
                                    <div className="flex flex-col">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleStateIncrementChange(
                                            "OffsidesTeam1"
                                          )
                                        }
                                        className="flex-shrink-0 mb-2 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                                      >
                                        <svg
                                          className="w-2.5 h-2.5 text-gray-900 dark:text-white"
                                          aria-hidden="true"
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 18 18"
                                        >
                                          <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 1v16M1 9h16"
                                          />
                                        </svg>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleStateUpdateDecrementChange(
                                            "OffsidesTeam1"
                                          )
                                        }
                                        className="flex-shrink-0 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                                      >
                                        <svg
                                          className="w-2.5 h-2.5 text-gray-900 dark:text-white"
                                          aria-hidden="true"
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 18 2"
                                        >
                                          <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M1 1h16"
                                          />
                                        </svg>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className=" font-semibold text-[0.8rem] ">
                              Offsides
                            </div>
                            <div className=" font-semibold text-[0.8rem] mr-4">
                              {!EditStats && Stats.OffsidesTeam2}
                              {EditStats && (
                                <div className="relative flex items-center">
                                  <div className="flex">
                                    <div className="flex flex-col">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleStateIncrementChange(
                                            "OffsidesTeam2"
                                          )
                                        }
                                        className="flex-shrink-0 mb-2 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                                      >
                                        <svg
                                          className="w-2.5 h-2.5 text-gray-900 dark:text-white"
                                          aria-hidden="true"
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 18 18"
                                        >
                                          <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 1v16M1 9h16"
                                          />
                                        </svg>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleStateUpdateDecrementChange(
                                            "OffsidesTeam2"
                                          )
                                        }
                                        className="flex-shrink-0 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                                      >
                                        <svg
                                          className="w-2.5 h-2.5 text-gray-900 dark:text-white"
                                          aria-hidden="true"
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 18 2"
                                        >
                                          <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M1 1h16"
                                          />
                                        </svg>
                                      </button>
                                    </div>
                                    <input
                                      type="text"
                                      className="flex-shrink-0 text-gray-900 dark:text-white border-0 bg-transparent text-sm font-normal focus:outline-none focus:ring-0 max-w-[2.5rem] text-center"
                                      placeholder=""
                                      value={changeStatsValue.OffsidesTeam2}
                                      onChange={(event) =>
                                        setTeamScore1(
                                          parseInt(event.target.value)
                                        )
                                      }
                                      readOnly // Make input read-only to prevent manual input
                                      required
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex">
                            <div className="w-full">
                              <div
                                className="flex flex-col  relative"
                                style={{ direction: "rtl" }}
                              >
                                {/* First a element */}

                                {/* Second a element */}
                                {Stats.OffsidesTeam1 !== 0 && (
                                  <a
                                    href="#"
                                    className="absolute top-0 mb-2 flex justify-end h-3 bg-red-400 border border-gray-200 rounded-md shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                                    style={{
                                      width: `${
                                        (Stats.OffsidesTeam1 /
                                          (Stats.OffsidesTeam1 +
                                            Stats.OffsidesTeam2)) *
                                        100
                                      }%`,
                                      direction: "rtl",
                                    }}
                                  ></a>
                                )}
                                <a
                                  href="#"
                                  className="mb-2 flex justify-start ml-3  h-3 bg-white border border-gray-200 rounded-md shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                                ></a>
                              </div>
                            </div>

                            {/* Contents of the second item */}
                            <div className="w-full">
                              <div className="flex flex-col relative">
                                {/* First a element */}
                                <a
                                  href="#"
                                  className="mb-2 flex justify-between ml-3 mr-1 h-3 bg-white border border-gray-200 rounded-md shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                                ></a>
                                {/* Second a element */}
                                {Stats.OffsidesTeam2 !== 0 && (
                                  <a
                                    href="#"
                                    className="absolute top-0 mb-2 flex justify-between ml-3 mr-5 h-3 bg-black border border-gray-200 rounded-md shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                                    style={{
                                      width: `${
                                        (Stats.OffsidesTeam2 /
                                          (Stats.OffsidesTeam1 +
                                            Stats.OffsidesTeam2)) *
                                        100
                                      }%`,
                                    }}
                                  ></a>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="flex justify-between mb-3">
                            <div className=" font-semibold text-[0.8rem] ml-2">
                              {!EditStats && Stats.throwInsTeam1}
                              {EditStats && (
                                <div className="relative flex items-center">
                                  <div className="flex">
                                    <input
                                      type="text"
                                      className="flex-shrink-0 text-gray-900 dark:text-white border-0 bg-transparent text-sm font-normal focus:outline-none focus:ring-0 max-w-[2.5rem] text-center"
                                      placeholder=""
                                      value={changeStatsValue.throwInsTeam1}
                                      onChange={(event) =>
                                        setTeamScore1(
                                          parseInt(event.target.value)
                                        )
                                      }
                                      readOnly // Make input read-only to prevent manual input
                                      required
                                    />
                                    <div className="flex flex-col">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleStateIncrementChange(
                                            "throwInsTeam1"
                                          )
                                        }
                                        className="flex-shrink-0 mb-2 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                                      >
                                        <svg
                                          className="w-2.5 h-2.5 text-gray-900 dark:text-white"
                                          aria-hidden="true"
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 18 18"
                                        >
                                          <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 1v16M1 9h16"
                                          />
                                        </svg>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleStateUpdateDecrementChange(
                                            "throwInsTeam1"
                                          )
                                        }
                                        className="flex-shrink-0 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                                      >
                                        <svg
                                          className="w-2.5 h-2.5 text-gray-900 dark:text-white"
                                          aria-hidden="true"
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 18 2"
                                        >
                                          <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M1 1h16"
                                          />
                                        </svg>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className=" font-semibold text-[0.8rem] ">
                              Throw-ins
                            </div>
                            <div className=" font-semibold text-[0.8rem] mr-4">
                              {!EditStats && Stats.throwInsTeam2}
                              {EditStats && (
                                <div className="relative flex items-center">
                                  <div className="flex">
                                    <div className="flex flex-col">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleStateIncrementChange(
                                            "throwInsTeam2"
                                          )
                                        }
                                        className="flex-shrink-0 mb-2 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                                      >
                                        <svg
                                          className="w-2.5 h-2.5 text-gray-900 dark:text-white"
                                          aria-hidden="true"
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 18 18"
                                        >
                                          <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 1v16M1 9h16"
                                          />
                                        </svg>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleStateUpdateDecrementChange(
                                            "throwInsTeam2"
                                          )
                                        }
                                        className="flex-shrink-0 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                                      >
                                        <svg
                                          className="w-2.5 h-2.5 text-gray-900 dark:text-white"
                                          aria-hidden="true"
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 18 2"
                                        >
                                          <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M1 1h16"
                                          />
                                        </svg>
                                      </button>
                                    </div>
                                    <input
                                      type="text"
                                      className="flex-shrink-0 text-gray-900 dark:text-white border-0 bg-transparent text-sm font-normal focus:outline-none focus:ring-0 max-w-[2.5rem] text-center"
                                      placeholder=""
                                      value={changeStatsValue.throwInsTeam2}
                                      onChange={(event) =>
                                        setTeamScore1(
                                          parseInt(event.target.value)
                                        )
                                      }
                                      readOnly // Make input read-only to prevent manual input
                                      required
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex">
                            <div className="w-full">
                              <div
                                className="flex flex-col  relative"
                                style={{ direction: "rtl" }}
                              >
                                {/* First a element */}

                                {/* Second a element */}
                                {Stats.throwInsTeam1 !== 0 && (
                                  <a
                                    href="#"
                                    className="absolute top-0 mb-2 flex justify-end h-3 bg-red-400 border border-gray-200 rounded-md shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                                    style={{
                                      width: `${
                                        (Stats.throwInsTeam1 /
                                          (Stats.throwInsTeam1 +
                                            Stats.throwInsTeam2)) *
                                        100
                                      }%`,
                                      direction: "rtl",
                                    }}
                                  ></a>
                                )}
                                <a
                                  href="#"
                                  className="mb-2 flex justify-start ml-3  h-3 bg-white border border-gray-200 rounded-md shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                                ></a>
                              </div>
                            </div>

                            {/* Contents of the second item */}
                            <div className="w-full">
                              <div className="flex flex-col relative">
                                {/* First a element */}
                                <a
                                  href="#"
                                  className="mb-2 flex justify-between ml-3 mr-1 h-3 bg-white border border-gray-200 rounded-md shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                                ></a>
                                {/* Second a element */}
                                {Stats.throwInsTeam2 !== 0 && (
                                  <a
                                    href="#"
                                    className="absolute top-0 mb-2 flex justify-between ml-3 mr-5 h-3 bg-black border border-gray-200 rounded-md shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                                    style={{
                                      width: `${
                                        (Stats.throwInsTeam2 /
                                          (Stats.throwInsTeam1 +
                                            Stats.throwInsTeam2)) *
                                        100
                                      }%`,
                                    }}
                                  ></a>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="flex justify-between mb-3">
                            <div className=" font-semibold text-[0.8rem] ml-2">
                              {!EditStats && Stats.goalkeeperSavesTeam1}
                              {EditStats && (
                                <div className="relative flex items-center">
                                  <div className="flex">
                                    <input
                                      type="text"
                                      className="flex-shrink-0 text-gray-900 dark:text-white border-0 bg-transparent text-sm font-normal focus:outline-none focus:ring-0 max-w-[2.5rem] text-center"
                                      placeholder=""
                                      value={
                                        changeStatsValue.goalkeeperSavesTeam1
                                      }
                                      onChange={(event) =>
                                        setTeamScore1(
                                          parseInt(event.target.value)
                                        )
                                      }
                                      readOnly // Make input read-only to prevent manual input
                                      required
                                    />
                                    <div className="flex flex-col">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleStateIncrementChange(
                                            "goalkeeperSavesTeam1"
                                          )
                                        }
                                        className="flex-shrink-0 mb-2 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                                      >
                                        <svg
                                          className="w-2.5 h-2.5 text-gray-900 dark:text-white"
                                          aria-hidden="true"
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 18 18"
                                        >
                                          <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 1v16M1 9h16"
                                          />
                                        </svg>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleStateUpdateDecrementChange(
                                            "goalkeeperSavesTeam1"
                                          )
                                        }
                                        className="flex-shrink-0 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                                      >
                                        <svg
                                          className="w-2.5 h-2.5 text-gray-900 dark:text-white"
                                          aria-hidden="true"
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 18 2"
                                        >
                                          <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M1 1h16"
                                          />
                                        </svg>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className=" font-semibold text-[0.8rem] ">
                              Goalkeeper Saves
                            </div>
                            <div className=" font-semibold text-[0.8rem] mr-4">
                              {!EditStats && Stats.goalkeeperSavesTeam2}
                              {EditStats && (
                                <div className="relative flex items-center">
                                  <div className="flex">
                                    <div className="flex flex-col">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleStateIncrementChange(
                                            "goalkeeperSavesTeam2"
                                          )
                                        }
                                        className="flex-shrink-0 mb-2 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                                      >
                                        <svg
                                          className="w-2.5 h-2.5 text-gray-900 dark:text-white"
                                          aria-hidden="true"
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 18 18"
                                        >
                                          <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 1v16M1 9h16"
                                          />
                                        </svg>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleStateUpdateDecrementChange(
                                            "goalkeeperSavesTeam2"
                                          )
                                        }
                                        className="flex-shrink-0 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                                      >
                                        <svg
                                          className="w-2.5 h-2.5 text-gray-900 dark:text-white"
                                          aria-hidden="true"
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 18 2"
                                        >
                                          <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M1 1h16"
                                          />
                                        </svg>
                                      </button>
                                    </div>
                                    <input
                                      type="text"
                                      className="flex-shrink-0 text-gray-900 dark:text-white border-0 bg-transparent text-sm font-normal focus:outline-none focus:ring-0 max-w-[2.5rem] text-center"
                                      placeholder=""
                                      value={
                                        changeStatsValue.goalkeeperSavesTeam2
                                      }
                                      onChange={(event) =>
                                        setTeamScore1(
                                          parseInt(event.target.value)
                                        )
                                      }
                                      readOnly 
                                      required
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex">
                            <div className="w-full">
                              <div
                                className="flex flex-col  relative"
                                style={{ direction: "rtl" }}
                              >
                                {Stats.goalkeeperSavesTeam1 !== 0 && (
                                  <a
                                    href="#"
                                    className="absolute top-0 mb-2 flex justify-end h-3 bg-red-400 border border-gray-200 rounded-md shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                                    style={{
                                      width: `${
                                        (Stats.goalkeeperSavesTeam1 /
                                          (Stats.goalkeeperSavesTeam1 +
                                            Stats.goalkeeperSavesTeam2)) *
                                        100
                                      }%`,
                                      direction: "rtl",
                                    }}
                                  ></a>
                                )}
                                <a
                                  href="#"
                                  className="mb-2 flex justify-start ml-3  h-3 bg-white border border-gray-200 rounded-md shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                                ></a>
                              </div>
                            </div>

                            {/* Contents of the second item */}
                            <div className="w-full">
                              <div className="flex flex-col relative">
                                {/* First a element */}
                                <a
                                  href="#"
                                  className="mb-2 flex justify-between ml-3 mr-1 h-3 bg-white border border-gray-200 rounded-md shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                                ></a>
                                {/* Second a element */}
                                {Stats.goalkeeperSavesTeam2 !== 0 && (
                                  <a
                                    href="#"
                                    className="absolute top-0 mb-2 flex justify-between ml-3 mr-5 h-3 bg-black border border-gray-200 rounded-md shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                                    style={{
                                      width: `${
                                        (Stats.goalkeeperSavesTeam2 /
                                          (Stats.goalkeeperSavesTeam1 +
                                            Stats.goalkeeperSavesTeam2)) *
                                        100
                                      }%`,
                                    }}
                                  ></a>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        {EditStats && (
                          <button onClick={saveMatchStats}>Save</button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
function formatDate(startDate) {
  const date = new Date(startDate);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}.${month}.${year} ${hours}:${minutes}`;
}
function formatDateTime(dateTimeString) {
  const date = new Date(dateTimeString);
  const year = date.getFullYear();
  let month = (date.getMonth() + 1).toString().padStart(2, "0");
  let day = date.getDate().toString().padStart(2, "0");
  let hours = date.getHours().toString().padStart(2, "0");
  let minutes = date.getMinutes().toString().padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export default StatsSelectedMatch;
