import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  getAllTournaments,
  getTournamentDetails,
} from "../../../../../Services/FrontOffice/apiTournament";
import {
  addMatch,
  getTournamentMatches,
  getTournamentMatchesDraw,
} from "../../../../../Services/FrontOffice/apiMatch";
import { useNavigate, useParams } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { MdOutlineUpcoming as Upcoming } from "react-icons/md";
import { TbPlayFootball as Played } from "react-icons/tb";
import { HiMagnifyingGlass as Loop } from "react-icons/hi2";
import { BiFootball as Football } from "react-icons/bi";
import { AiOutlineFieldTime as Active } from "react-icons/ai";
import TvIcon from "@mui/icons-material/Tv";
import { GiSoccerField } from "react-icons/gi";
import { MdGrade } from "react-icons/md";
import {
  Match,
  SingleEliminationBracket,
} from "@g-loot/react-tournament-brackets";
import { getTeamDetails } from "../../../../../Services/FrontOffice/apiTeam";
import { Card, CardContent } from "@mui/material";

import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import { IoIosFootball } from "react-icons/io";
import { getUserData } from "../../../../../Services/apiUser";
import { getStatsForTournamentwithInfo } from "../../../../../Services/FrontOffice/apiGoalStats";
import { FiPlus } from "react-icons/fi";
function DisplayAllTournaments() {
  const { id } = useParams();
  const [isPopupOpenFixture, setIsPopupOpenFixture] = useState(false);
  const popupRef = useRef(null);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("matches");
  const path = "http://localhost:3000/public/images/teams/";
  const pathTournament = "http://localhost:3000/public/images/tournaments/";
  const socket = useMemo(() => io.connect("http://localhost:3000/"), []);

  const [Tournament, setTournament] = useState({});
  const [AllTournament, setAllTournament] = useState([]);
  const [favoritesTournament, setFavoritesTournament] = useState([]);
  const [favoritesTeams, setFavoritesTeams] = useState([]);
  const [Teams, setTeams] = useState([]);
  const [RealTeams, setRealTeams] = useState([]);
  const [Matches, setMatches] = useState([]);
  const [MatchesDrawGroupStage, setMatchesDrawGroupStage] = useState([]);
  const [MatchesCopy, setMatchesCopy] = useState([]);
  const [RealMatches, setRealMatches] = useState([]);
  const [DrawMatchesGroupStage, setDrawMatchesGroupStage] = useState([]);
  const [userInfo, setUserInfo] = useState();
  const [user, setUser] = useState();
  const [tabChange, setTabChange] = useState();
  const [numberOfGroups, setnumberOfGroups] = useState();
  const [TournamentStats, setTournamentStats] = useState([]);
  const [topScorer, setTopScorer] = useState();
  const [topYellowCards, setTopYellowCards] = useState();
  const [topRedCards, setTopRedCards] = useState();
  const openModalInNewTab = (Allmatch) => {
    const match = selectedMatch;
    const state = { match, Tournament };
    localStorage.setItem("newTabState", JSON.stringify(state));
    const newTab = window.open(
      "/tournament/matchStats",
      "_blank",
      "width=800,height=600"
    );
    setIsPopupOpenFixture(false);
  };

  const getTournaments = async () => {
    const res = await getAllTournaments()
      .then((res) => {
        setAllTournament((prevState) => [res.tournaments]);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getTournaments();
  }, []);
  const getTournamentDetail = async () => {
    try {
      const res = await getTournamentDetails(id);
      setTournament(res.tournaments);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    const userToken = localStorage.getItem("token");

    if (userToken) {
      const decodedToken = jwtDecode(userToken);
      setUserInfo(decodedToken);
      getUserData(decodedToken.userId).then((response) => {
        setUser(response.user);
      });
    }
  }, []);
  useEffect(() => {
    const numbergroup = Tournament.nbTeamPartipate / 4;
    setnumberOfGroups(numbergroup);
  }, [Tournament]);
  const getFavoritesTournament = async (idTournament) => {
    try {
      const res = await getTournamentDetails(idTournament);
      setFavoritesTournament((prevState) => [...prevState, res.tournaments]);
    } catch (err) {
      console.error(err);
    }
  };
  const getFavoritesteams = async (idTeam) => {
    try {
      const res = await getTeamDetails(idTeam);
      setFavoritesTeams((prevState) => [...prevState, res.team]);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    if (user && favoritesTournament.length === 0) {
      user.followedTournaments.map((idTournament) => {
        getFavoritesTournament(idTournament);
      });
      user.followedTeams.map((idteam) => {
        getFavoritesteams(idteam);
      });
    }
  }, [user]);
  const handleOnClickOnFavorite = (tournament) => {
    navigate(`/tournament/details/${tournament._id}`);
    window.location.reload();
  };
  const handleOnClickOnFavoriteTeam = (team) => {
    navigate(`/team/profile/${team._id}`);
  };
  const getAllTournamentMatches = async () => {
    try {
      const res = await getTournamentMatches(id);
      setRealMatches(res.matchList);
      setMatchesCopy(res.matchList);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getTournamentDetail();
  }, []);
  useEffect(() => {
    getAllTournamentMatches();
  }, []);

  const getTournamentStats = async () => {
    try {
      const response = await getStatsForTournamentwithInfo(Tournament._id);
      setTournamentStats(response.goalsList);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (Tournament) {
      getTournamentStats();
    }
  }, [Tournament]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "matches") {
      setTabChange("matches");
    } else if (tab === "draw" && Tournament.tournamentType === "Group Stage") {
      handleDrawPhase();
    } else {
      getAllTournamentMatches();
    }
  };
  useEffect(() => {
    if (Tournament && Tournament.teams) {
      if (Tournament.tournamentType === "Group Stage") {
        const fetchTeamDetails = async () => {
          const teamDetails = await Promise.all(
            Tournament.teamsGroupStage.map(async (team) => {
              try {
                const response = await getTeamDetails(team.teamId);
                // Replace with your API function
                return response.team; // Assuming the team details are in 'team' property
              } catch (error) {
                console.error(
                  `Error fetching team details for team ID ${team.teamId}:`,
                  error
                );
                return null;
              }
            })
          );
          setRealTeams(teamDetails);
        };
        fetchTeamDetails();
      } else {
        const fetchTeamDetails = async () => {
          const teamDetails = await Promise.all(
            Tournament.teams.map(async (teamId) => {
              try {
                const response = await getTeamDetails(teamId);
                // Replace with your API function
                return response.team; // Assuming the team details are in 'team' property
              } catch (error) {
                console.error(
                  `Error fetching team details for team ID ${teamId}:`,
                  error
                );
                return null;
              }
            })
          );
          setRealTeams(teamDetails);
        };

        fetchTeamDetails();
      }
    }
  }, [Tournament]);

  const initializeStats = () => {
    const initialStats = RealTeams.map((team) => ({
      teamId: team._id,
      teamName: team.name,
      teamLogo: team.image,
      points: 0,
      matchesPlayed: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      groupNumber: 0, // Initialize groupNumber to 0
    }));
    return initialStats;
  };

  const [standing, setStanding] = useState([]);
  const [sortStandings, setSortStandings] = useState([]);
  const [GroupStageCompleted, setGroupStageCompleted] = useState(false);
  const [drawPhase, setDrawPhase] = useState(false);
  const updateGroupStageStandings = () => {
    const numberGroups = Tournament.nbTeamPartipate / 4;
    const standings = initializeStats();
    for (let groupNumber = 1; groupNumber <= numberGroups; groupNumber++) {
      const groupMatches = RealMatches.filter(
        (match) => match.groupNumber === groupNumber
      );

      groupMatches.forEach((match) => {
        const team1Id = match.team1._id;
        const team2Id = match.team2._id;
        const scoreTeam1 = parseInt(match.scoreTeam1);
        const scoreTeam2 = parseInt(match.scoreTeam2);
        const team1 = standings.find((team) => team.teamId === team1Id);
        const team2 = standings.find((team) => team.teamId === team2Id);
        if (team1.groupNumber === 0) team1.groupNumber = groupNumber;
        if (team2.groupNumber === 0) team2.groupNumber = groupNumber;
        if (!isNaN(scoreTeam1) && !isNaN(scoreTeam2)) {
          // The match has been played

          if (team1 && team2) {
            if (scoreTeam1 > scoreTeam2) {
              team1.points += 3;
              team1.wins += 1;
              team2.losses += 1;
              team1.goalsFor += scoreTeam1;
              team1.goalsAgainst += scoreTeam2;
              team2.goalsFor += scoreTeam2;
              team2.goalsAgainst += scoreTeam1;
            } else if (scoreTeam1 < scoreTeam2) {
              // Team 2 wins
              team2.points += 3;
              team2.wins += 1;
              team1.losses += 1;
              team1.goalsFor += scoreTeam1;
              team1.goalsAgainst += scoreTeam2;
              team2.goalsFor += scoreTeam2;
              team2.goalsAgainst += scoreTeam1;
              // Update other stats similarly...
            } else {
              // It's a draw
              team1.points += 1;
              team2.points += 1;
              team1.goalsFor += scoreTeam1;
              team1.goalsAgainst += scoreTeam2;
              team2.goalsFor += scoreTeam2;
              team2.goalsAgainst += scoreTeam1;

              // Update other stats similarly...
            }
            team1.goalDifference += scoreTeam1 - scoreTeam2;
            team2.goalDifference += scoreTeam2 - scoreTeam1;
            team1.matchesPlayed++;
            team2.matchesPlayed++;
          }
        }
      });
    }
    for (let i = 0; i < standings.length; i++) {
      if (standings[i].matchesPlayed !== 3) {
        setGroupStageCompleted(false);
      }
      if (i === standings.length - 1 && standings[i].matchesPlayed === 3) {
        setGroupStageCompleted(true);
      }
    }
    setStanding(standings);
  };

  useEffect(() => {
    const addMatchAfterGroupStage = async () => {
      let winners = [];
      let runnerups = [];
      let groups = [];
      let numGroup = numberOfGroups;
      if (GroupStageCompleted === true) {
        let maxPoints = 0;
        let runnerUpPoints = 0;
        while (numGroup > 0) {
          if (!groups[numGroup]) {
            groups[numGroup] = [];
          }
          if (!winners[numGroup]) {
            winners[numGroup] = [];
          }
          if (!runnerups[numGroup]) {
            runnerups[numGroup] = [];
          }
          standing.forEach((team) => {
            if (team.groupNumber === numGroup) {
              groups[numGroup].push(team);
            }
          });
          numGroup--;
        }
        numGroup = numberOfGroups;

        while (numGroup !== 0) {
          groups[numGroup].forEach((team) => {
            if (team.points > maxPoints) {
              runnerups[numGroup] = winners[numGroup];
              maxPoints = team.points;
              winners[numGroup] = [team];
            } else if (
              team.points === maxPoints &&
              team.goalDifference > winners[numGroup][0].goalDifference
            ) {
              runnerups[numGroup] = winners[numGroup];
              maxPoints = team.points;
              winners[numGroup] = [team];
            } else if (team.points > runnerUpPoints) {
              runnerUpPoints = team.points;
              runnerups[numGroup] = [team];
            } else if (team.points === runnerUpPoints) {
              runnerups[numGroup].push(team);
            }
          });
          maxPoints = 0;
          runnerUpPoints = 0;
          numGroup--;
        }
        winners = winners.slice(1);
        runnerups = runnerups.slice(1);
        const numberOfTeamsQualified = runnerups.length + winners.length;
        const numRealMatches = numberOfTeamsQualified / 2;
        let idNextMatch = numberOfTeamsQualified / 2;

        if (
          winners.length === numRealMatches &&
          runnerups.length === numRealMatches
        ) {
          // Remove the first element from each array
          console.log(winners);

          console.log(winners);
          const flattenedWinners = winners.flat();
          const flattenedRunnerups = runnerups.flat();
          const matches = [];
          console.log(flattenedWinners);
          console.log(flattenedRunnerups);

          if (numberOfGroups === 1) {
            for (let i = 0; i < numRealMatches - 1; i++) {
              const winnerTeam = flattenedWinners[i];
              const runnerUpTeam = flattenedRunnerups[i];
              console.log(winnerTeam);
              console.log(runnerUpTeam);
              const matchData = {
                id: i + 1,
                win: "",
                loss: "",
                matchDate: new Date(),
                scoreTeam1: "",
                scoreTeam2: "",
                knockoutStageAfterGroup: "Draw",
                fixture: "",
                idTeam1: winnerTeam.teamId,
                idTeam2: runnerUpTeam.teamId,
                idTournament: Tournament._id,
              };

              matches.push(matchData);
              await addMatch(matchData);
            }
          } else {
            let k = 0;
            let selectedRunnerUps = [];
            for (let i = 0; i < winners.length; i++) {
              const winnerTeam = flattenedWinners[i];
              let runnerUpFound = false;
              // Array to store selected runner-up teams

              for (
                let j = 0;
                j < runnerups.length && runnerUpFound === false;
                j++
              ) {
                const runnerUpTeam = flattenedRunnerups[j]; // Access the first (and only) object in the array

                console.log("Winner Group Number:", winnerTeam.groupNumber);
                console.log(
                  "Runner-Up Group Number:",
                  runnerUpTeam.groupNumber
                );

                if (
                  !selectedRunnerUps.includes(runnerUpTeam) &&
                  winnerTeam.groupNumber !== runnerUpTeam.groupNumber
                ) {
                  k++;
                  console.log("Groups are different");
                  const matchData = {
                    id: matches.length + 1,
                    win: "",
                    loss: "",
                    matchDate: new Date(),
                    nextMatchId: idNextMatch + 1,
                    scoreTeam1: "",
                    scoreTeam2: "",
                    knockoutStageAfterGroup: "Draw",
                    fixture: "",
                    idTeam1: winnerTeam.teamId,
                    idTeam2: runnerUpTeam.teamId,
                    idTournament: Tournament._id,
                  };
                  if (k % 2 === 0 && k != 0) {
                    idNextMatch++;
                  }
                  matches.push(matchData);
                  await addMatch(matchData);
                  selectedRunnerUps.push(runnerUpTeam); // Add the selected runner-up to the list
                  runnerUpFound = true;
                }
              }
            }
          }
          console.log(numberOfTeamsQualified / 2);
          for (let h = 0; h < numRealMatches - 1; h++) {
            if (h % 2 === 0) {
              idNextMatch++;
            }

            if (idNextMatch > numRealMatches * 2 - 1) {
              idNextMatch = null;
            }

            const emptyMatch = {
              id: numRealMatches + h + 1,
              win: "",
              loss: "",
              nextMatchId: idNextMatch,
              matchDate: new Date(),
              scoreTeam1: "",
              scoreTeam2: "",
              knockoutStageAfterGroup: "Draw",
              fixture: "",
              participants: [],
              idTournament: Tournament._id,
            };
            matches.push(emptyMatch);
            await addMatch(emptyMatch);
          }
          setDrawPhase(true);
        }
      }
    };
    const handleMatchesDraw = async () => {
      if (Tournament.tournamentType === "Group Stage") {
        try {
          const response = await getTournamentMatchesDraw(Tournament._id);

          if (response.matchList.length === 0) {
            addMatchAfterGroupStage();
          } else {
            setDrawMatchesGroupStage(response.matchList);
            console.log("they already exits the draw matches");
          }
        } catch (error) {
          // Handle any errors
          console.error(error);
        }
      }
    };
    handleMatchesDraw();
  }, [GroupStageCompleted]);
  const handleDrawPhase = async () => {
    const response = await getTournamentMatchesDraw(Tournament._id);
    setDrawMatchesGroupStage(response.matchList);
  };
  useEffect(() => {
    if (Tournament.tournamentType === "Group Stage") handleDrawPhase();
  }, [drawPhase]);
  useEffect(() => {
    const updatedMatches = [];
    let nextmatch = DrawMatchesGroupStage.length;
    let j = 1;
    let resultTeam1 = "";
    let resultTeam2 = "";
    // Iterate over each match in realMatches
    if (DrawMatchesGroupStage.length !== 0) {
      let loopCounter = 0;
      let Participant = [];
      DrawMatchesGroupStage.forEach((match, index) => {
        if (match.scoreTeam1 > match.scoreTeam2) {
          /*setResultTeam1("WON");
          setResultTeam1("LOST");*/
          resultTeam1 = "Won";
          resultTeam2 = "Lost";
        }
        if (match.scoreTeam1 < match.scoreTeam2) {
          resultTeam2 = "Won";
          resultTeam1 = "Lost";
        }
        if (match.team1 === null && match.team2 === null) {
          Participant = [];
        } else if (match.team1 != null && match.team2 === null) {
          Participant = [
            {
              id: match.team1._id,
              resultText: match.scoreTeam1,
              isWinner: resultTeam1 === "Won" ? true : false,
              status: "PLAYED",
              name: match.team1.name,
            },
            {},
          ];
        } else if (match.team1 === null && match.team2 != null) {
          Participant = [
            {},
            {
              id: match.team2._id,
              resultText: match.scoreTeam2,
              isWinner: resultTeam2 === "Won" ? true : false,
              status: "PLAYED",
              name: match.team2.name,
            },
          ];
        } else if (match.team1 != null && match.team2 != null) {
          Participant = [
            {
              id: match.team1._id,
              resultText: match.scoreTeam1,
              isWinner: resultTeam1 === "Won" ? true : false,
              status: "PLAYED",
              name: match.team1.name,
            },
            {
              id: match.team2._id,
              resultText: match.scoreTeam2,
              isWinner: resultTeam2 === "Won" ? true : false,
              status: "PLAYED",
              name: match.team2.name,
            },
          ];
        }
        const newMatch = {
          id: index + 1,
          nextMatchId: match.nextMatchId,
          tournamentRoundText: "1",
          startTime: match.matchDate,
          state: "DONE",
          participants: Participant,
        };
        loopCounter++;
        resultTeam1 = "";
        resultTeam2 = "";
        if (loopCounter % 2 === 0) {
          nextmatch++;
        }
        updatedMatches.push(newMatch);
      });
    }
    setMatchesDrawGroupStage(updatedMatches);
  }, [DrawMatchesGroupStage]);
  const updateStandings = () => {
    const standings = initializeStats();

    RealMatches.forEach((match) => {
      const team1Id = match.team1._id;
      const team2Id = match.team2._id;
      const scoreTeam1 = parseInt(match.scoreTeam1);
      const scoreTeam2 = parseInt(match.scoreTeam2);

      if (!isNaN(scoreTeam1) && !isNaN(scoreTeam2)) {
        // The match has been played
        if (scoreTeam1 > scoreTeam2) {
          // Team 1 wins

          standings.find((team) => team.teamId === team1Id).points += 3;
          standings.find((team) => team.teamId === team1Id).wins += 1;
          standings.find((team) => team.teamId === team2Id).losses += 1;
          standings.find((team) => team.teamId === team1Id).goalsFor +=
            scoreTeam1;
          standings.find((team) => team.teamId === team2Id).goalsFor +=
            scoreTeam2;
          standings.find((team) => team.teamId === team1Id).goalsAgainst +=
            scoreTeam2;
          standings.find((team) => team.teamId === team2Id).goalsAgainst +=
            scoreTeam1;
          standings.find((team) => team.teamId === team1Id).goalDifference +=
            scoreTeam1 - scoreTeam2;
          standings.find((team) => team.teamId === team2Id).goalDifference +=
            scoreTeam2 - scoreTeam1;
        } else if (scoreTeam1 < scoreTeam2) {
          standings.find((team) => team.teamId === team2Id).points += 3;
          standings.find((team) => team.teamId === team2Id).wins += 1;
          standings.find((team) => team.teamId === team1Id).losses += 1;
          standings.find((team) => team.teamId === team1Id).goalsFor +=
            scoreTeam1;
          standings.find((team) => team.teamId === team2Id).goalsFor +=
            scoreTeam2;
          standings.find((team) => team.teamId === team1Id).goalsAgainst +=
            scoreTeam2;
          standings.find((team) => team.teamId === team2Id).goalsAgainst +=
            scoreTeam1;
          standings.find((team) => team.teamId === team1Id).goalDifference +=
            scoreTeam1 - scoreTeam2;
          standings.find((team) => team.teamId === team2Id).goalDifference +=
            scoreTeam2 - scoreTeam1;
        } else {
          standings.find((team) => team.teamId === team1Id).points += 1;
          standings.find((team) => team.teamId === team2Id).points += 1;
          standings.find((team) => team.teamId === team1Id).draws += 1;
          standings.find((team) => team.teamId === team2Id).draws += 1;
          standings.find((team) => team.teamId === team1Id).goalsFor +=
            scoreTeam1;
          standings.find((team) => team.teamId === team2Id).goalsFor +=
            scoreTeam2;
          standings.find((team) => team.teamId === team1Id).goalsAgainst +=
            scoreTeam2;
          standings.find((team) => team.teamId === team2Id).goalsAgainst +=
            scoreTeam1;
          standings.find((team) => team.teamId === team1Id).goalDifference +=
            scoreTeam1 - scoreTeam2;
          standings.find((team) => team.teamId === team2Id).goalDifference +=
            scoreTeam2 - scoreTeam1;
        }
        standings.find((team) => team.teamId === team1Id).matchesPlayed += 1;
        standings.find((team) => team.teamId === team2Id).matchesPlayed += 1;
      }
    });
    setStanding(standings);
  };
  useEffect(() => {
    if (Tournament.tournamentType === "League") {
      updateStandings();
    }
  }, [RealMatches]);
  useEffect(() => {
    if (Tournament.tournamentType === "Group Stage") {
      updateGroupStageStandings();
    }
  }, [RealMatches]);
  useEffect(() => {
    StandingsSort();
  }, [standing]);

  const StandingsSort = () => {
    const sortedStandings = [...standing].sort((a, b) => {
      // Sort by points in descending order
      if (b.points !== a.points) {
        return b.points - a.points;
      }

      // If points are equal, sort by goal difference in descending order
      return b.goalDifference - a.goalDifference;
    });
    setSortStandings(sortedStandings);
  };

  const itemsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(0);
  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };
  const upcoming = () => {
    let upcoming = MatchesCopy.filter((realmatches) => {
      const currentDate = new Date();
      const matchDate = new Date(realmatches.matchDate);

      return matchDate.getTime() > currentDate.getTime();
    });
    setRealMatches(upcoming);
  };
  const played = () => {
    let played = MatchesCopy.filter((realmatches) => {
      const currentDate = new Date();
      const matchDate = new Date(realmatches.matchDate);
      return matchDate.getTime() < currentDate.getTime();
    });
    setRealMatches(played);
  };
  function active() {
    let active = MatchesCopy.filter((RealMatches) => {
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      const matchdate = new Date(RealMatches.matchDate);
      matchdate.setHours(0, 0, 0, 0);
      return matchdate.getTime() === currentDate.getTime();
    });
    setRealMatches(active);
  }
  function all() {
    setRealMatches(MatchesCopy);
  }
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);

  const handleMatchClick = (match) => {
    setSelectedMatch(match);
    setIsPopupOpen(true);
    getAllTournamentMatches();
  };
  const handleReservationClick = (matchs) => {
    localStorage.setItem('selectedMatch', JSON.stringify(matchs));
navigate('/addReservation');

  };
  

  const handleMatchClickFixture = (match) => {
    setSelectedMatch(match);
    setIsPopupOpenFixture(true);
    getAllTournamentMatches();
  };
  useEffect(() => {
    socket.on("updateScore", (updatedMatch) => {
      setRealMatches((prevMatches) =>
        prevMatches.map((match) =>
          match._id === updatedMatch._id
            ? {
                ...match,
                scoreTeam1: updatedMatch.scoreTeam1,
                scoreTeam2: updatedMatch.scoreTeam2,
                matchDate: updatedMatch.matchDate,
              }
            : match
        )
      );
      if (popupRef.current) {
        popupRef.current.updateProps({
          socket,
          match: updatedMatch,
        });
      }
    });
  }, [socket]);
  const getTournamentStatsUpdated = async (tournamentId) => {
    try {
      const response = await getStatsForTournamentwithInfo(tournamentId);
      setTournamentStats(response.goalsList);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    socket.on("updateTournamentStats", (saveClicked, tournamentId) => {
      console.log(tournamentId);
      getTournamentStatsUpdated(tournamentId);
    });
  }, [socket]);
  useEffect(() => {
    const numberOfTeams = Tournament.nbTeamPartipate || 0;
    const teams = Array.from({ length: numberOfTeams }, (_, index) => ({
      id: `team-${index + 1}`,
      name: `Team ${index + 1}`,
    }));
    setTeams(teams);

    const updatedMatches = [];
    let nextmatch = RealMatches.length;
    let j = 1;
    let resultTeam1 = "";
    let resultTeam2 = "";
    // Iterate over each match in realMatches
    if (RealMatches.length !== 0) {
      let loopCounter = 0;
      let Participant = [];
      RealMatches.forEach((match, index) => {
        if (match.scoreTeam1 > match.scoreTeam2) {
          /*setResultTeam1("WON");
          setResultTeam1("LOST");*/
          resultTeam1 = "Won";
          resultTeam2 = "Lost";
        }
        if (match.scoreTeam1 < match.scoreTeam2) {
          resultTeam2 = "Won";
          resultTeam1 = "Lost";
        }
        if (match.team1 === null && match.team2 === null) {
          Participant = [];
        } else if (match.team1 != null && match.team2 === null) {
          Participant = [
            {
              id: match.team1._id,
              resultText: match.scoreTeam1,
              isWinner: resultTeam1 === "Won" ? true : false,
              status: "PLAYED",
              name: match.team1.name,
            },
            {},
          ];
        } else if (match.team1 === null && match.team2 != null) {
          Participant = [
            {},
            {
              id: match.team2._id,
              resultText: match.scoreTeam2,
              isWinner: resultTeam2 === "Won" ? true : false,
              status: "PLAYED",
              name: match.team2.name,
            },
          ];
        } else if (match.team1 != null && match.team2 != null) {
          Participant = [
            {
              id: match.team1._id,
              resultText: match.scoreTeam1,
              isWinner: resultTeam1 === "Won" ? true : false,
              status: "PLAYED",
              name: match.team1.name,
            },
            {
              id: match.team2._id,
              resultText: match.scoreTeam2,
              isWinner: resultTeam2 === "Won" ? true : false,
              status: "PLAYED",
              name: match.team2.name,
            },
          ];
        }
        const newMatch = {
          id: index + 1,
          nextMatchId: match.nextMatchId,
          tournamentRoundText: "1",
          startTime: match.matchDate,
          state: "DONE",
          participants: Participant,
        };
        loopCounter++;
        resultTeam1 = "";
        resultTeam2 = "";
        if (loopCounter % 2 === 0) {
          nextmatch++;
        }
        updatedMatches.push(newMatch);
      });
    }
    setMatches(updatedMatches);
  }, [RealMatches]);
  const calculateTopScorers = () => {
    const playerGoals = {};
    TournamentStats.forEach((goal) => {
      const playerId = goal.scorer._id;
      const teamId = goal.forTeam._id;

      if (!(playerId in playerGoals)) {
        playerGoals[playerId] = {
          scorer: goal.scorer,
          team: goal.forTeam,
          goals: 0,
        };
      }

      // Check if player is from the same team
      if (playerGoals[playerId].team._id === teamId) {
        playerGoals[playerId].goals += goal.goalNumber;
      } else {
        // If not from the same team, add a new player entry
        const newPlayerId = playerId + "_" + teamId; // Using player id and team id to make it unique
        if (!(newPlayerId in playerGoals)) {
          playerGoals[newPlayerId] = {
            scorer: goal.scorer,
            team: goal.forTeam,
            goals: 0,
          };
        }
        playerGoals[newPlayerId].goals += goal.goalNumber;
      }
    });

    const players = Object.values(playerGoals);
    players.sort((a, b) => b.goals - a.goals);
    setTopScorer(players);
  };
  useEffect(() => {
    calculateTopScorers();
  }, [TournamentStats]);
  const calculateYellowCards = () => {
    const playerYellowCards = {};
    setTopYellowCards([]);

    TournamentStats.forEach((goal) => {
      const playerId = goal.scorer._id;
      const teamId = goal.forTeam._id;

      if (!(playerId in playerYellowCards)) {
        playerYellowCards[playerId] = {
          scorer: goal.scorer,
          team: goal.forTeam,
          yellowCardsNumber: 0,
        };
      }

      // Check if player is from the same team
      if (playerYellowCards[playerId].team._id === teamId) {
        playerYellowCards[playerId].yellowCardsNumber += goal.yellowCardsNumber;
      } else {
        const newPlayerId = playerId + "_" + teamId;
        if (!(newPlayerId in playerYellowCards)) {
          playerYellowCards[newPlayerId] = {
            scorer: goal.scorer,
            team: goal.forTeam,
            yellowCardsNumber: 0,
          };
        }
        playerYellowCards[newPlayerId].yellowCardsNumber +=
          goal.yellowCardsNumber;
      }
    });

    const players = Object.values(playerYellowCards);
    players.sort((a, b) => b.yellowCardsNumber - a.yellowCardsNumber);
    setTopYellowCards(players);
  };

  useEffect(() => {
    calculateYellowCards();
  }, [TournamentStats]);
  const calculateRedCards = () => {
    const playerGoals = {};
    TournamentStats.forEach((goal) => {
      const playerId = goal.scorer._id;
      if (!(playerId in playerGoals)) {
        playerGoals[playerId] = {
          scorer: goal.scorer,
          team: goal.forTeam,
          redCardsNumber: 0,
        };
      }

      playerGoals[playerId].redCardsNumber += goal.redCardsNumber;
    });

    const players = Object.values(playerGoals);
    players.sort((a, b) => b.redCardsNumber - a.redCardsNumber);
    setTopRedCards(players);
  };
  useEffect(() => {
    calculateRedCards();
  }, [TournamentStats]);
  const MatchesComponent = ({ RealMatches, currentPage, handlePageClick }) => {
    const startIndex = currentPage * itemsPerPage;
    const displayedMatches = RealMatches.slice(
      startIndex,
      startIndex + itemsPerPage
    );
    return (
      <div>
        <div className="flex flex-wrap justify-center -ml-24">
          {displayedMatches
            .filter((match) => !match.knockoutStageAfterGroup)
            .map((match, index) => (
              <Card
                key={index}
                onClick={() => handleMatchClick(match)}
                className="w-full max-w-xs mx-2 mb-4"
              >
                <CardContent className="p-4 grid gap-3 text-center">
                  <div className="flex flex-row items-center gap-2 text-sm justify-center">
                    <img
                      alt="Team A logo"
                      className="rounded-full overflow-hidden border object-cover w-8 h-8 ml-2"
                      height="30"
                      src={path + match.team1?.image}
                      style={{
                        aspectRatio: "30/30",
                        objectFit: "cover",
                      }}
                      width="30"
                    />
                    <div className="font-semibold">{match.team1?.name}</div>
                    <div className="text-4xl font-bold mx-2">vs</div>
                    <img
                      alt="Team B logo"
                      className="rounded-full overflow-hidden border object-cover w-8 h-8"
                      height="30"
                      src={path + match.team2?.image}
                      style={{
                        aspectRatio: "30/30",
                        objectFit: "cover",
                      }}
                      width="30"
                    />
                    <div className="font-semibold">{match.team2?.name}</div>
                  </div>
                  <div className="flex items-center justify-center mb-4">
                    {match.scoreTeam1 === "" && match.scoreTeam2 === "" ? (
                      <p>Not Played</p>
                    ) : (
                      <div className="text-xl font-bold">
                        {match.scoreTeam1} - {match.scoreTeam2}
                      </div>
                    )}
                  </div>

                  <div className="text-xs grid gap-0.5">
                    <div>{match.matchDate}</div>
                    <div>{match.matchTime}</div>
                    <div>{match.location}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
       
        <div className="flex justify-center mb-5">
          {/* Previous Button */}
          <a
            href="#"
            className="flex items-center justify-center px-4 h-10 text-base font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-100 dark:border-gray-200 dark:text-gray-950 dark:hover:bg-gray-700 dark:hover:text-white"
            onClick={() => handlePageClick({ selected: currentPage - 1 })}
          >
            <svg
              className="w-3.5 h-3.5 me-2 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 5H1m0 0 4 4M1 5l4-4"
              />
            </svg>
            Previous
          </a>

          {/* Next Button */}
          <a
            href="#"
            className="flex items-center justify-center px-4 h-10 ms-3 text-base font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-100 dark:border-gray-200 dark:text-gray-950 dark:hover:bg-gray-700 dark:hover:text-white"
            onClick={() => handlePageClick({ selected: currentPage + 1 })}
          >
            Next
            <svg
              className="w-3.5 h-3.5 ms-2 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </a>
        </div>
      </div>
    );
  };
  return (
    <div className="">
      {Tournament.tournamentType === "League" && (
        <>
          <div className="flex justify-start items-start pt-8 mb-3 ">
            <div>
              <a className="flex flex-col ml-20 mr-5 min-h-screen bg-[#f6f8ff] border border-gray-200 rounded-lg shadow  dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                <div className="flex mt-4 mb-2 ml-2 mr-2">
                  <MdGrade size={20} className="mr-1" />
                  <p className="text-black font-medium text-[0.9rem]">
                    PINNED TOURNAMENTS
                  </p>
                </div>
                {AllTournament.map((innerArray, index) => (
                  <div key={index} className="w-full">
                    {innerArray.map((tournament) => {
                      return (
                        <div
                          key={tournament._id}
                          className="flex justify-start items-center mb-1 ml-8 hover:bg-gray-200"
                        >
                          <img
                            alt="Team A logo"
                            className="rounded-md overflow-hidden border object-cover w-5 h-5 mr-1"
                            src={pathTournament + tournament.image}
                            style={{
                              aspectRatio: "1/1",
                              objectFit: "cover",
                            }}
                          />
                          <div>
                            <button
                              className="text-[1rem]"
                              onClick={() =>
                                handleOnClickOnFavorite(tournament)
                              }
                            >
                              {tournament.name}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}

                <div className="flex mt-4 mb-2 ml-2 mr-2">
                  <MdGrade size={20} className="mr-1" />
                  <p className="text-black font-medium text-[0.9rem]">
                    FAVORITES TOURNAMENTS
                  </p>
                </div>
                {favoritesTournament.map((tournament) => (
                  <div key={tournament._id} className="w-full">
                    <div className="flex justify-start items-center mb-1 ml-8 hover:bg-gray-200">
                      <img
                        alt="Team A logo"
                        className="rounded-md overflow-hidden border object-cover w-5 h-5 mr-1"
                        src={pathTournament + tournament.image}
                        style={{
                          aspectRatio: "1/1",
                          objectFit: "cover",
                        }}
                      />
                      <div>
                        <button
                          className="text-[1rem]"
                          onClick={() => handleOnClickOnFavorite(tournament)}
                        >
                          {tournament.name}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex mt-4 mb-2 ml-2 mr-2">
                  <MdGrade size={20} className="mr-1" />
                  <p className="text-black font-medium text-[0.9rem]">
                    MY TEAMS
                  </p>
                </div>
                {favoritesTeams.length === 0 ? (
                  <div className="flex justify-start items-center mb-1 ml-8 hover:bg-gray-200">
                    <div className="flex items-center">
                      <FiPlus className="mr-2 text-[#ff0046]" size={18} />
                      <button
                        className="text-[0.9rem] font-semibold font-sans text-[#ff0046]"
                        onClick={() => navigate("/team/all")}
                      >
                        ADD TEAM
                      </button>
                    </div>
                  </div>
                ) : (
                  favoritesTeams.map((team) => (
                    <div key={team._id} className="w-full">
                      <div className="flex justify-start items-center mb-1 ml-8 hover:bg-gray-200">
                        <img
                          alt="Team A logo"
                          className="rounded-md overflow-hidden border object-cover w-5 h-5 mr-1"
                          src={path + team.image}
                          style={{
                            aspectRatio: "1/1",
                            objectFit: "cover",
                          }}
                        />
                        <div>
                          <button
                            className="text-[1rem]"
                            onClick={() => handleOnClickOnFavoriteTeam(team)}
                          >
                            {team.name}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </a>
            </div>
            <div>
              <a
                href="#"
                className="flex  flex-col w-full mb-2  bg-[#f6f8ff] border border-gray-200 rounded-lg shadow  dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
              >
                <div className="flex items-center ml-3 mt-3">
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
                <div className="flex items-center mb-4 ml-6 mt-4">
                  <img
                    alt="Team A logo"
                    className="rounded-md overflow-hidden border object-cover w-16 h-16 mr-4"
                    src={pathTournament + Tournament.image}
                    style={{
                      aspectRatio: "1/1",
                      objectFit: "cover",
                    }}
                  />
                  <div>
                    <h2 className="text-lg font-semibold mb-2">
                      {Tournament.name}
                    </h2>

                    <p className="text-sm text-gray-600">
                      {Tournament.description}
                    </p>
                  </div>
                </div>
                <hr className="border-t  border-white mb-2 " />{" "}
                <div className="flex justify-start gap-2 ml-4 ">
                  <button
                    className={`inline-flex items-center justify-center ${
                      activeTab === "matches"
                        ? "bg-transparent text-[#ff0046] border-b-4 border-[#ff0046]"
                        : "bg-transparent text-[#555e61] hover:text-black"
                    } px-5 py-2 focus:outline-none text-[0.8rem] font-semibold`}
                    onClick={() => handleTabChange("matches")}
                  >
                    <span>Matches</span>
                  </button>
                  <button
                    className={`inline-flex items-center justify-center ${
                      activeTab === "results"
                        ? "bg-transparent text-[#ff0046] border-b-4 border-[#ff0046]"
                        : "bg-transparent text-[#555e61] hover:text-black"
                    } px-5 py-2 focus:outline-none text-[0.8rem] font-semibold`}
                    onClick={() => handleTabChange("results")}
                  >
                    RESULTS
                  </button>
                  <button
                    className={`inline-flex items-center justify-center ${
                      activeTab === "fixtures"
                        ? "bg-transparent text-[#ff0046] border-b-4 border-[#ff0046]"
                        : "bg-transparent text-[#555e61] hover:text-black"
                    } px-5 py-2 focus:outline-none text-[0.8rem] font-semibold`}
                    onClick={() => handleTabChange("fixtures")}
                  >
                    FIXTURES
                  </button>
                  <button
                    className={`inline-flex items-center justify-center ${
                      activeTab === "standings"
                        ? "bg-transparent text-[#ff0046] border-b-4 border-[#ff0046]"
                        : "bg-transparent text-[#555e61] hover:text-black"
                    } px-5 py-2 focus:outline-none text-[0.8rem] font-semibold`}
                    onClick={() => handleTabChange("standings")}
                  >
                    STANDINGS
                  </button>
                </div>
              </a>
              <div className="min-w-[53rem]">
                {activeTab === "matches" && (
                  <div className="">
                    <ul className="flex items-center justify-center space-y-2 space-x-4 text-sm font-medium text-gray-500 dark:text-gray-400 md:me-4 mb-4 md:mb-5">
                      <li>
                        <button
                          onClick={all}
                          className="gap-1 inline-flex items-center mt-2 px-4 py-3 text-[#555e61] hover:text-gray-900 bg-[#f6f8ff] hover:bg-gray-100 rounded-lg active w-full dark:bg-blue-600"
                          aria-current="page"
                        >
                          <Football size={20} className="text-[#555e61]" />
                          All
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={upcoming}
                          className="inline-flex gap-1 items-center px-4 py-3 rounded-lg hover:text-gray-900 bg-[#f6f8ff] hover:bg-gray-100 w-full dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                          <Upcoming size={20} />
                          Upcoming
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={active}
                          className="inline-flex gap-1 items-center px-4 py-3 rounded-lg hover:text-gray-900 bg-[#f6f8ff] hover:bg-gray-100 w-full dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                          <Active size={20} />
                          Active
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={played}
                          className=" gap-1 inline-flex items-center px-4 py-3 rounded-lg hover:text-gray-900 bg-[#f6f8ff] hover:bg-gray-100 w-full dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                          <Played size={20} />
                          Played
                        </button>
                      </li>
                      <li>
                        <a
                          href="#"
                          className=" gap-1 inline-flex items-center px-4 py-3 rounded-lg hover:text-gray-900 bg-[#f6f8ff] hover:bg-gray-100 w-full dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                          <Loop size={20} />
                          Discover
                        </a>
                      </li>
                    </ul>

                    <MatchesComponent
                      RealMatches={RealMatches}
                      currentPage={currentPage}
                      handlePageClick={handlePageClick}
                    />
                  </div>
                )}
                {activeTab === "fixtures" && (
                  <>
                    <div className="flex justify-center  mb-5 ">
                      <div
                        href="#"
                        className="flex flex-col w-full bg-[#f6f8ff] border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                        // Adjust the width as needed
                      >
                        {RealMatches.reduce((acc, match, index) => {
                          const lastGroup = acc[acc.length - 1];
                          if (
                            !lastGroup ||
                            lastGroup[0]?.fixture !== match.fixture
                          ) {
                            // Create a new group for matches with a new fixture number
                            acc.push([match]);
                          } else {
                            // Add the match to the existing group
                            lastGroup.push(match);
                          }
                          return acc;
                        }, []).map((group, groupIndex) => (
                          <div key={groupIndex}>
                            <a
                              href="#"
                              className="mt-2 mb-3 flex flex-col ml-5 mr-5 h-6 bg-white border border-gray-200 rounded-md shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                            >
                              <div className="flex items-center ml-5 mt-1 ">
                                <p className="text-[#555e61] font-medium text-[0.7rem]">
                                  ROUND {group[0].fixture}
                                </p>
                              </div>
                            </a>
                            {group.map((match, matchIndex) => (
                              <>
                                <div className="flex justify-between items-center ml-10">
                                  <div className="flex items-center">
                                    <p className="text-[#555e61]  font-medium mr-3 text-[0.8rem]">
                                      {formatDate(match.matchDate)}
                                    </p>

                                    <div className="flex flex-col">
                                      <div className="flex items-center mb-4">
                                        <img
                                          alt="Team A logo"
                                          className="overflow-hidden border object-cover w-4 h-4 mr-3"
                                          src={path + match.team1.image}
                                          style={{
                                            aspectRatio: "1/1",
                                            objectFit: "cover",
                                          }}
                                        />
                                        <p className="text-[#555e61] font-medium text-[0.8rem]">
                                          {match.team1.name}
                                        </p>
                                      </div>
                                      <div className="flex items-center">
                                        <img
                                          alt="Team A logo"
                                          className="overflow-hidden border object-cover w-4 h-4 mr-3"
                                          src={path + match.team2.image}
                                          style={{
                                            aspectRatio: "1/1",
                                            objectFit: "cover",
                                          }}
                                        />
                                        <p className="text-[#555e61] font-medium text-[0.8rem]">
                                          {match.team2.name}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center mr-20 ">
                                    <div className="flex flex-col">
                                      <div className="flex items-center">
                                        {match.scoreTeam1 !== "" &&
                                        match.scoreTeam2 !== "" ? (
                                          <span className="mx-2 text-black font-semibold text-[13px]">
                                            {match.scoreTeam1}
                                          </span>
                                        ) : (
                                          <span className="mx-2 text-[#555e61]">
                                            -
                                          </span>
                                        )}
                                        <hr className="border-t ml-5 px-5 py-5 border-red transform rotate-90 mr-10" />
                                      </div>
                                      <div className="flex items-center">
                                        {match.scoreTeam1 !== "" &&
                                        match.scoreTeam2 !== "" ? (
                                          <span className="mx-2 text-black font-semibold text-[13px]">
                                            {match.scoreTeam2}
                                          </span>
                                        ) : (
                                          <span className="mx-2 text-[#555e61]">
                                            -
                                          </span>
                                        )}
                                        <hr className="border-t ml-5 px-5 py-5 border-red transform rotate-90 mr-10" />
                                      </div>
                                    </div>
                                    <div className="flex">
                                      <GiSoccerField
                                        onClick={() =>
                                          handleMatchClickFixture(match)
                                        }
                                        size={18}
                                        className="mr-10 cursor-pointer"
                                      />
                                      <TvIcon
                                        className="mt-1"
                                        style={{ fontSize: "small" }}
                                      />
                                    </div>
                                  </div>
                                </div>

                                {isPopupOpenFixture && openModalInNewTab(match)}
                              </>
                            ))}

                            <hr className="border-t px-5 py-2 border-red ml-5 mr-5" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                {activeTab === "results" && (
                  <>
                    <div className="flex justify-center mb-5 ">
                      <div
                        href="#"
                        className="flex flex-col  w-full bg-[#f6f8ff] border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                      >
                        {RealMatches.reduce((acc, match, index) => {
                          const lastGroup = acc[acc.length - 1];
                          if (
                            !lastGroup ||
                            lastGroup[0]?.fixture !== match.fixture
                          ) {
                            // Create a new group for matches with a new fixture number
                            acc.push([match]);
                          } else {
                            // Add the match to the existing group
                            lastGroup.push(match);
                          }
                          return acc;
                        }, []).map((group, groupIndex) => (
                          <div key={groupIndex}>
                            {group.some(
                              (match) =>
                                match.scoreTeam1 !== "" &&
                                match.scoreTeam2 !== ""
                            ) && (
                              <a
                                href="#"
                                className="mt-2 mb-1 flex flex-col ml-5 mr-5 h-6 bg-white border border-gray-200 rounded-md shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                              >
                                <div className="flex items-center ml-5 mt-1 ">
                                  <p className="text-[#555e61] font-medium text-[0.7rem]">
                                    ROUND {group[0].fixture}
                                  </p>
                                </div>
                              </a>
                            )}
                            {group
                              .filter(
                                (match) =>
                                  match.scoreTeam1 !== "" &&
                                  match.scoreTeam2 !== ""
                              )
                              .map((match, matchIndex) => (
                                <>
                                  <div className="flex justify-between items-center ml-10">
                                    <div className="flex items-center">
                                      <p className="text-[#555e61]  font-medium mr-3 text-[0.8rem]">
                                        {formatDate(match.matchDate)}
                                      </p>

                                      <div className="flex flex-col">
                                        <div className="flex items-center mb-4">
                                          <img
                                            alt="Team A logo"
                                            className="overflow-hidden border object-cover w-4 h-4 mr-3"
                                            src={path + match.team1.image}
                                            style={{
                                              aspectRatio: "1/1",
                                              objectFit: "cover",
                                            }}
                                          />
                                          <p className="text-[#555e61] font-medium text-[0.8rem]">
                                            {match.team1.name}
                                          </p>
                                        </div>
                                        <div className="flex items-center">
                                          <img
                                            alt="Team A logo"
                                            className="overflow-hidden border object-cover w-4 h-4 mr-3"
                                            src={path + match.team2.image}
                                            style={{
                                              aspectRatio: "1/1",
                                              objectFit: "cover",
                                            }}
                                          />
                                          <p className="text-[#555e61] font-medium text-[0.8rem]">
                                            {match.team2.name}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center mr-20 ">
                                      <div className="flex flex-col">
                                        <div className="flex items-center">
                                          {match.scoreTeam1 !== "" &&
                                          match.scoreTeam2 !== "" ? (
                                            <span className="mx-2 text-black font-semibold text-[13px]">
                                              {match.scoreTeam1}
                                            </span>
                                          ) : (
                                            <span className="mx-2 text-[#555e61]">
                                              -
                                            </span>
                                          )}
                                          <hr className="border-t ml-5 px-5 py-5 border-red transform rotate-90 mr-10" />
                                        </div>
                                        <div className="flex items-center">
                                          {match.scoreTeam1 !== "" &&
                                          match.scoreTeam2 !== "" ? (
                                            <span className="mx-2 text-black font-semibold text-[13px]">
                                              {match.scoreTeam2}
                                            </span>
                                          ) : (
                                            <span className="mx-2 text-[#555e61]">
                                              -
                                            </span>
                                          )}
                                          <hr className="border-t ml-5 px-5 py-5 border-red transform rotate-90 mr-10" />
                                        </div>
                                      </div>
                                      <div className="flex">
                                        <GiSoccerField
                                          onClick={() =>
                                            handleMatchClickFixture(match)
                                          }
                                          size={18}
                                          className="mr-10 cursor-pointer"
                                        />
                                        <TvIcon
                                          className="mt-1"
                                          style={{ fontSize: "small" }}
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  {isPopupOpenFixture &&
                                    openModalInNewTab(match)}
                                </>
                              ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {activeTab === "standings" && (
                  <>
                    <div className="flex justify-center mb-5 ">
                      <div
                        href="#"
                        className="flex flex-col w-full bg-[#f6f8ff] border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                      >
                        <Table className="lg:max-w-[755px] rounded-xl ml-11 bg-white sm:max-w-[10px] mb-10 mt-5">
                          <TableHead className="  text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                            <TableRow>
                              <TableCell className="w-12">#</TableCell>
                              <TableCell>TEAM</TableCell>
                              <TableCell>MP</TableCell>
                              <TableCell>W</TableCell>
                              <TableCell>D</TableCell>
                              <TableCell>L</TableCell>
                              <TableCell>GF</TableCell>
                              <TableCell>GA</TableCell>
                              <TableCell>GD</TableCell>
                              <TableCell>Pts</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {sortStandings.map((team, index) => (
                              <TableRow key={index} className=" dark:bg-white">
                                <TableCell className="font-bold">
                                  {index + 1}
                                </TableCell>
                                <TableCell className="flex gap-2 items-center">
                                  <div className="flex items-center">
                                    <img
                                      alt="Team logo"
                                      className="rounded-lg"
                                      height="40"
                                      src={path + team?.teamLogo}
                                      style={{
                                        aspectRatio: "40/40",
                                        objectFit: "cover",
                                      }}
                                      width="40"
                                    />
                                    <div className="ml-1">{team.teamName}</div>
                                  </div>
                                </TableCell>
                                <TableCell>{team.matchesPlayed}</TableCell>
                                <TableCell>{team.wins}</TableCell>
                                <TableCell>{team.draws}</TableCell>
                                <TableCell>{team.losses}</TableCell>
                                <TableCell>{team.goalsFor}</TableCell>
                                <TableCell>{team.goalsAgainst}</TableCell>
                                <TableCell>{team.goalDifference}</TableCell>
                                <TableCell className="font-bold">
                                  {team.points}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            <a className="flex flex-col ml-5 w-fit   min-h-screen bg-[#f6f8ff] border border-gray-200 rounded-lg shadow  dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
              <div className="flex mt-4 mb-2 ml-2 mr-5">
                <MdGrade size={20} className="mr-1" />
                <p className="text-black font-medium text-[0.9rem]">
                  TOP SCORERS
                </p>
              </div>
              {topScorer.map(
                (player) =>
                  // Check if player has scored any goals
                  player.goals > 0 && (
                    <div key={player.scorer._id} className="w-full">
                      <div className="flex justify-start items-center mb-1 ml-7 mr-2 hover:bg-gray-200">
                        <img
                          alt="Team A logo"
                          className="rounded-md overflow-hidden border object-cover w-5 h-5 mr-1"
                          src={path + player.team.image}
                          style={{
                            aspectRatio: "1/1",
                            objectFit: "cover",
                          }}
                        />
                        <div>
                          <button className="text-[1rem]">
                            {player.scorer.firstName} : {player.goals}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
              )}

              <div className="flex mt-4 mb-2 ml-2 mr-2">
                <MdGrade size={20} className="mr-1" />
                <p className="text-black font-medium text-[0.9rem]">
                  TOP YELLOW CARDS
                </p>
              </div>
              {topYellowCards.map(
                (player) =>
                  // Check if player has scored any goals
                  player.yellowCardsNumber > 0 && (
                    <div key={player.scorer._id} className="w-full">
                      <div className="flex justify-start items-center mb-1 ml-7 mr-2 hover:bg-gray-200">
                        <img
                          alt="Team A logo"
                          className="rounded-md overflow-hidden border object-cover w-5 h-5 mr-1"
                          src={path + player.team.image}
                          style={{
                            aspectRatio: "1/1",
                            objectFit: "cover",
                          }}
                        />
                        <div>
                          <button className="text-[1rem]">
                            {player.scorer.firstName} :{" "}
                            {player.yellowCardsNumber}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
              )}
              <div className="flex mt-4 mb-2 ml-2 mr-2">
                <MdGrade size={20} className="mr-1" />
                <p className="text-black font-medium text-[0.9rem]">
                  TOP RED CARDS
                </p>
              </div>
              {topRedCards.map(
                (player) =>
                  // Check if player has scored any goals
                  player.redCardsNumber > 0 && (
                    <div key={player.scorer._id} className="w-full">
                      <div className="flex justify-start items-center mb-1 ml-7 mr-2 hover:bg-gray-200">
                        <img
                          alt="Team A logo"
                          className="rounded-md overflow-hidden border object-cover w-5 h-5 mr-1"
                          src={path + player.team.image}
                          style={{
                            aspectRatio: "1/1",
                            objectFit: "cover",
                          }}
                        />
                        <div>
                          <button className="text-[1rem]">
                            {player.scorer.firstName} : {player.redCardsNumber}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
              )}
            </a>
          </div>
        </>
      )}
      {Tournament.tournamentType === "Group Stage" && (
        <>
          <div className="flex justify-start ml-15 items-start pt-8 mb-3">
            <div>
              <a className="flex flex-col min-h-screen  mr-8 bg-[#f6f8ff] border border-gray-200 rounded-lg shadow  dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                <div className="flex mt-4 mb-2 ml-2 mr-2">
                  <MdGrade size={20} className="mr-1" />
                  <p className="text-black font-medium text-[0.9rem]">
                    PINNED TOURNAMENTS
                  </p>
                </div>
                {AllTournament.map((innerArray, index) => (
                  <div key={index} className="w-full">
                    {innerArray.map((tournament) => {
                      return (
                        <div
                          key={tournament._id}
                          className="flex justify-start items-center mb-1 ml-8 hover:bg-gray-200"
                        >
                          <img
                            alt="Team A logo"
                            className="rounded-md overflow-hidden border object-cover w-5 h-5 mr-1"
                            src={pathTournament + tournament.image}
                            style={{
                              aspectRatio: "1/1",
                              objectFit: "cover",
                            }}
                          />
                          <div>
                            <button
                              className="text-[1rem]"
                              onClick={() =>
                                handleOnClickOnFavorite(tournament)
                              }
                            >
                              {tournament.name}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}

                <div className="flex mt-4 mb-2 ml-2 mr-2">
                  <MdGrade size={20} className="mr-1" />
                  <p className="text-black font-medium text-[0.9rem]">
                    FAVORITES TOURNAMENTS
                  </p>
                </div>
                {favoritesTournament.map((tournament) => (
                  <div key={tournament._id} className="w-full">
                    <div className="flex justify-start items-center mb-1 ml-8 hover:bg-gray-200">
                      <img
                        alt="Team A logo"
                        className="rounded-md overflow-hidden border object-cover w-5 h-5 mr-1"
                        src={pathTournament + tournament.image}
                        style={{
                          aspectRatio: "1/1",
                          objectFit: "cover",
                        }}
                      />
                      <div>
                        <button
                          className="text-[1rem]"
                          onClick={() => handleOnClickOnFavorite(tournament)}
                        >
                          {tournament.name}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex mt-4 mb-2 ml-2 mr-2">
                  <MdGrade size={20} className="mr-1" />
                  <p className="text-black font-medium text-[0.9rem]">
                    MY TEAMS
                  </p>
                </div>
                {favoritesTeams.length === 0 ? (
                  <div className="flex justify-start items-center mb-1 ml-8 hover:bg-gray-200">
                    <div className="flex items-center">
                      <FiPlus className="mr-2 text-[#ff0046]" size={18} />
                      <button
                        className="text-[0.9rem] font-semibold font-sans text-[#ff0046]"
                        onClick={() => navigate("/team/all")}
                      >
                        ADD TEAM
                      </button>
                    </div>
                  </div>
                ) : (
                  favoritesTeams.map((team) => (
                    <div key={team._id} className="w-full">
                      <div className="flex justify-start items-center mb-1 ml-8 hover:bg-gray-200">
                        <img
                          alt="Team A logo"
                          className="rounded-md overflow-hidden border object-cover w-5 h-5 mr-1"
                          src={path + team.image}
                          style={{
                            aspectRatio: "1/1",
                            objectFit: "cover",
                          }}
                        />
                        <div>
                          <button
                            className="text-[1rem]"
                            onClick={() => handleOnClickOnFavoriteTeam(team)}
                          >
                            {team.name}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </a>
            </div>
            <div>
              <a
                href="#"
                className="flex flex-col w-full mb-2  bg-[#f6f8ff] border border-gray-200 rounded-lg shadow  dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
              >
                <div className="flex items-center ml-3 mt-3">
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
                <div className="flex items-center mb-4 ml-6 mt-4">
                  <img
                    alt="Team A logo"
                    className="rounded-md overflow-hidden border object-cover w-16 h-16 mr-4"
                    src={pathTournament + Tournament.image}
                    style={{
                      aspectRatio: "1/1",
                      objectFit: "cover",
                    }}
                  />
                  <div>
                    <h2 className="text-lg font-semibold mb-2">
                      {Tournament.name}
                    </h2>

                    <p className="text-sm text-gray-600">
                      {Tournament.description}
                    </p>
                  </div>
                </div>
                <hr className="border-t  border-white mb-2 " />{" "}
                <div className="flex justify-start gap-2 ml-4 ">
                  <button
                    className={`inline-flex items-center justify-center ${
                      activeTab === "matches"
                        ? "bg-transparent text-[#ff0046] border-b-4 border-[#ff0046]"
                        : "bg-transparent text-[#555e61] hover:text-black"
                    } px-5 py-2 focus:outline-none text-[0.8rem] font-semibold`}
                    onClick={() => handleTabChange("matches")}
                  >
                    <span>Matches</span>
                  </button>
                  <button
                    className={`inline-flex items-center justify-center ${
                      activeTab === "results"
                        ? "bg-transparent text-[#ff0046] border-b-4 border-[#ff0046]"
                        : "bg-transparent text-[#555e61] hover:text-black"
                    } px-5 py-2 focus:outline-none text-[0.8rem] font-semibold`}
                    onClick={() => handleTabChange("results")}
                  >
                    RESULTS
                  </button>
                  <button
                    className={`inline-flex items-center justify-center ${
                      activeTab === "fixtures"
                        ? "bg-transparent text-[#ff0046] border-b-4 border-[#ff0046]"
                        : "bg-transparent text-[#555e61] hover:text-black"
                    } px-5 py-2 focus:outline-none text-[0.8rem] font-semibold`}
                    onClick={() => handleTabChange("fixtures")}
                  >
                    FIXTURES
                  </button>
                  <button
                    className={`inline-flex items-center justify-center ${
                      activeTab === "standings"
                        ? "bg-transparent text-[#ff0046] border-b-4 border-[#ff0046]"
                        : "bg-transparent text-[#555e61] hover:text-black"
                    } px-5 py-2 focus:outline-none text-[0.8rem] font-semibold`}
                    onClick={() => handleTabChange("standings")}
                  >
                    STANDINGS
                  </button>
                  {MatchesDrawGroupStage.length > 0 && (
                    <button
                      className={`inline-flex items-center justify-center ${
                        activeTab === "fixturesgroupstage"
                          ? "bg-transparent text-[#ff0046] border-b-4 border-[#ff0046]"
                          : "bg-transparent text-[#555e61] hover:text-black"
                      } px-5 py-2 focus:outline-none text-[0.8rem] font-semibold`}
                      onClick={() => handleTabChange("fixturesgroupstage")}
                    >
                      Fixtures Group Stage
                    </button>
                  )}

                  {MatchesDrawGroupStage.length > 0 && (
                    <button
                      className={`inline-flex items-center justify-center ${
                        activeTab === "draw"
                          ? "bg-transparent text-[#ff0046] border-b-4 border-[#ff0046]"
                          : "bg-transparent text-[#555e61] hover:text-black"
                      } px-5 py-2 focus:outline-none text-[0.8rem] font-semibold`}
                      onClick={() => handleTabChange("draw")}
                    >
                      Draw
                    </button>
                  )}
                </div>
              </a>
              <div className="min-w-[55rem]">
                {activeTab === "matches" && (
                  <div className="">
                    <ul className="flex items-center justify-center space-y-2 space-x-4 text-sm font-medium text-gray-500 dark:text-gray-400 md:me-4 mb-4 md:mb-5">
                      <li>
                        <button
                          onClick={all}
                          className="gap-1 inline-flex items-center mt-2 px-4 py-3 text-[#555e61] hover:text-gray-900 bg-[#f6f8ff] hover:bg-gray-100 rounded-lg active w-full dark:bg-blue-600"
                          aria-current="page"
                        >
                          <Football size={20} className="text-[#555e61]" />
                          All
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={upcoming}
                          className="inline-flex gap-1 items-center px-4 py-3 rounded-lg hover:text-gray-900 bg-[#f6f8ff] hover:bg-gray-100 w-full dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                          <Upcoming size={20} />
                          Upcoming
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={active}
                          className="inline-flex gap-1 items-center px-4 py-3 rounded-lg hover:text-gray-900 bg-[#f6f8ff] hover:bg-gray-100 w-full dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                          <Active size={20} />
                          Active
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={played}
                          className=" gap-1 inline-flex items-center px-4 py-3 rounded-lg hover:text-gray-900 bg-[#f6f8ff] hover:bg-gray-100 w-full dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                          <Played size={20} />
                          Played
                        </button>
                      </li>
                      <li>
                        <a
                          href="#"
                          className=" gap-1 inline-flex items-center px-4 py-3 rounded-lg hover:text-gray-900 bg-[#f6f8ff] hover:bg-gray-100 w-full dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                          <Loop size={20} />
                          Discover
                        </a>
                      </li>
                    </ul>

                    <MatchesComponent
                      RealMatches={RealMatches}
                      currentPage={currentPage}
                      handlePageClick={handlePageClick}
                    />
                  </div>
                )}
                {activeTab === "results" && (
                  <>
                    <div className="flex justify-center mb-5 ">
                      <div
                        href="#"
                        className="flex flex-col w-full bg-[#f6f8ff] border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                      >
                        {RealMatches.reduce((acc, match, index) => {
                          const lastGroup = acc[acc.length - 1];
                          if (
                            !lastGroup ||
                            lastGroup[0]?.groupNumber !== match.groupNumber
                          ) {
                            // Create a new group for matches with a new fixture number
                            acc.push([match]);
                          } else {
                            // Add the match to the existing group
                            lastGroup.push(match);
                          }
                          return acc;
                        }, []).map((group, groupIndex) => (
                          <div key={groupIndex}>
                            {group.some(
                              (match) =>
                                match.scoreTeam1 !== "" &&
                                match.scoreTeam2 !== ""
                            ) && (
                              <a
                                href="#"
                                className="mt-2 mb-1 flex flex-col ml-5 mr-5 h-6 bg-white border border-gray-200 rounded-md shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                              >
                                <div className="flex items-center ml-5 mt-1 ">
                                  <p className="text-[#555e61] font-medium text-[0.7rem]">
                                    GROUP {group[0].groupNumber}
                                  </p>
                                </div>
                              </a>
                            )}
                            {group
                              .filter(
                                (match) =>
                                  match.scoreTeam1 !== "" &&
                                  match.scoreTeam2 !== ""
                              )
                              .map((match, matchIndex) => (
                                <div className="flex justify-between items-center ml-10">
                                  <div className="flex items-center">
                                    <p className="text-[#555e61]  font-medium mr-3 text-[0.8rem]">
                                      {formatDate(match.matchDate)}
                                    </p>

                                    <div className="flex flex-col">
                                      <div className="flex items-center mb-4">
                                        <img
                                          alt="Team A logo"
                                          className="overflow-hidden border object-cover w-4 h-4 mr-3"
                                          src={path + match.team1.image}
                                          style={{
                                            aspectRatio: "1/1",
                                            objectFit: "cover",
                                          }}
                                        />
                                        <p className="text-[#555e61] font-medium text-[0.8rem]">
                                          {match.team1.name}
                                        </p>
                                      </div>
                                      <div className="flex items-center">
                                        <img
                                          alt="Team A logo"
                                          className="overflow-hidden border object-cover w-4 h-4 mr-3"
                                          src={path + match.team2.image}
                                          style={{
                                            aspectRatio: "1/1",
                                            objectFit: "cover",
                                          }}
                                        />
                                        <p className="text-[#555e61] font-medium text-[0.8rem]">
                                          {match.team2.name}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center mr-20 ">
                                    <div className="flex flex-col">
                                      <div className="flex items-center">
                                        {match.scoreTeam1 !== "" &&
                                        match.scoreTeam2 !== "" ? (
                                          <span className="mx-2 text-black font-semibold text-[13px]">
                                            {match.scoreTeam1}
                                          </span>
                                        ) : (
                                          <span className="mx-2 text-[#555e61]">
                                            -
                                          </span>
                                        )}
                                        <hr className="border-t ml-5 px-5 py-5 border-red transform rotate-90 mr-10" />
                                      </div>
                                      <div className="flex items-center">
                                        {match.scoreTeam1 !== "" &&
                                        match.scoreTeam2 !== "" ? (
                                          <span className="mx-2 text-black font-semibold text-[13px]">
                                            {match.scoreTeam2}
                                          </span>
                                        ) : (
                                          <span className="mx-2 text-[#555e61]">
                                            -
                                          </span>
                                        )}
                                        <hr className="border-t ml-5 px-5 py-5 border-red transform rotate-90 mr-10" />
                                      </div>
                                    </div>
                                    <div className="flex">
                                      <GiSoccerField
                                        onClick={() =>
                                          handleMatchClickFixture(match)
                                        }
                                        size={18}
                                        className="mr-10 cursor-pointer"
                                      />
                                      <TvIcon
                                        className="mt-1"
                                        style={{ fontSize: "small" }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                {activeTab === "fixtures" && (
                  <>
                    <div className="flex justify-center mb-5 ">
                      <div
                        href="#"
                        className="flex flex-col w-full bg-[#f6f8ff] border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                      >
                        {RealMatches.reduce((acc, match, index) => {
                          const lastGroup = acc[acc.length - 1];
                          if (
                            !lastGroup ||
                            lastGroup[0]?.groupNumber !== match.groupNumber
                          ) {
                            // Create a new group for matches with a new fixture number
                            acc.push([match]);
                          } else {
                            // Add the match to the existing group
                            lastGroup.push(match);
                          }
                          return acc;
                        }, []).map((group, groupIndex) => (
                          <div key={groupIndex}>
                            <a
                              href="#"
                              className="mt-2 mb-1 flex flex-col ml-5 mr-5 h-6 bg-white border border-gray-200 rounded-md shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                            >
                              <div className="flex items-center ml-5 mt-1 ">
                                <p className="text-[#555e61] font-medium text-[0.7rem]">
                                  GROUP {group[0].groupNumber}
                                </p>
                              </div>
                            </a>
                            {group
                              .filter((match) => !match.knockoutStageAfterGroup)
                              .map((match, matchIndex) => {
                                return (
                                  <>
                                    <div className="flex justify-between items-center ml-10">
                                      <div className="flex items-center">
                                        <p className="text-[#555e61]  font-medium mr-3 text-[0.8rem]">
                                          {formatDate(match.matchDate)}
                                        </p>

                                        <div className="flex flex-col">
                                          <div className="flex items-center mb-4">
                                            <img
                                              alt="Team A logo"
                                              className="overflow-hidden border object-cover w-4 h-4 mr-3"
                                              src={path + match.team1.image}
                                              style={{
                                                aspectRatio: "1/1",
                                                objectFit: "cover",
                                              }}
                                            />
                                            <p className="text-[#555e61] font-medium text-[0.8rem]">
                                              {match.team1.name}
                                            </p>
                                          </div>
                                          <div className="flex items-center">
                                            <img
                                              alt="Team A logo"
                                              className="overflow-hidden border object-cover w-4 h-4 mr-3"
                                              src={path + match.team2.image}
                                              style={{
                                                aspectRatio: "1/1",
                                                objectFit: "cover",
                                              }}
                                            />
                                            <p className="text-[#555e61] font-medium text-[0.8rem]">
                                              {match.team2.name}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex items-center mr-20 ">
                                        <div className="flex flex-col">
                                          <div className="flex items-center">
                                            {match.scoreTeam1 !== "" &&
                                            match.scoreTeam2 !== "" ? (
                                              <span className="mx-2 text-black font-semibold text-[13px]">
                                                {match.scoreTeam1}
                                              </span>
                                            ) : (
                                              <span className="mx-2 text-[#555e61]">
                                                -
                                              </span>
                                            )}
                                            <hr className="border-t ml-5 px-5 py-5 border-red transform rotate-90 mr-10" />
                                          </div>
                                          <div className="flex items-center">
                                            {match.scoreTeam1 !== "" &&
                                            match.scoreTeam2 !== "" ? (
                                              <span className="mx-2 text-black font-semibold text-[13px]">
                                                {match.scoreTeam2}
                                              </span>
                                            ) : (
                                              <span className="mx-2 text-[#555e61]">
                                                -
                                              </span>
                                            )}
                                            <hr className="border-t ml-5 px-5 py-5 border-red transform rotate-90 mr-10" />
                                          </div>
                                        </div>
                                        <div className="flex">
                                          <GiSoccerField
                                            onClick={() =>
                                              handleMatchClickFixture(match)
                                            }
                                            size={18}
                                            className="mr-10 cursor-pointer"
                                          />
                                          <TvIcon
                                            className="mt-1"
                                            style={{ fontSize: "small" }}
                                          />
                                        </div>
                                      </div>
                                    </div>

                                    {isPopupOpenFixture &&
                                      userInfo &&
                                      userInfo.userId === Tournament.creator &&
                                      openModalInNewTab(match)}
                                  </>
                                );
                              })}

                            <hr className="border-t px-5 py-2 border-red ml-5 mr-5" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                {activeTab === "standings" && (
                  <>
                    {Array.from({ length: numberOfGroups }).map(
                      (_, groupIndex) =>
                        groupIndex % 2 === 0 && (
                          <div
                            key={groupIndex}
                            className="flex justify-center mb-5"
                          >
                            <div className="flex">
                              <div
                                href="#"
                                className="flex flex-col  bg-[#f6f8ff] border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                              >
                                {/* Your anchor tag with group info */}
                                <a
                                  href="#"
                                  className="mt-2 flex flex-col ml-5 mr-5 h-8 bg-white border border-gray-200 rounded-md shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    height: "100%",
                                  }}
                                >
                                  <div className="flex items-center">
                                    <p className="text-[#555e61] font-medium text-[0.7rem]">
                                      GROUP {groupIndex + 1}
                                    </p>
                                  </div>
                                </a>
                                {/* Table for the first group */}
                                <Table className="lg:max-w-[550px] bg-white sm:max-w-[10px] mb-10 mt-5">
                                  {/* Table header */}
                                  <TableHead className="text-left  font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                                    <TableRow>
                                      <TableCell className="">#</TableCell>
                                      <TableCell>TEAM</TableCell>
                                      <TableCell>MP</TableCell>
                                      <TableCell>W</TableCell>
                                      <TableCell>D</TableCell>
                                      <TableCell>L</TableCell>
                                      <TableCell>GF</TableCell>
                                      <TableCell>GA</TableCell>
                                      <TableCell>GD</TableCell>
                                      <TableCell>Pts</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {/* Filter standings for the current group and map over them */}
                                    {sortStandings
                                      .filter(
                                        (team) =>
                                          team.groupNumber === groupIndex + 1
                                      )
                                      .map((team, index) => (
                                        <TableRow
                                          key={index}
                                          className="dark:bg-white"
                                        >
                                          {/* Table cells for each team */}
                                          <TableCell className="font-bold">
                                            {index + 1}
                                          </TableCell>
                                          <TableCell className="flex gap-2= items-center">
                                            <div className="flex items-center">
                                              {/* Team logo */}
                                              <img
                                                alt="Team logo"
                                                className="rounded-lg"
                                                height="40"
                                                src={path + team?.teamLogo}
                                                style={{
                                                  aspectRatio: "40/40",
                                                  objectFit: "cover",
                                                }}
                                                width="40"
                                              />
                                              {/* Team name */}
                                              <div className="ml-1">
                                                {team.teamName}
                                              </div>
                                            </div>
                                          </TableCell>
                                          {/* Other statistics for the team */}
                                          <TableCell>
                                            {team.matchesPlayed}
                                          </TableCell>
                                          <TableCell>{team.wins}</TableCell>
                                          <TableCell>{team.draws}</TableCell>
                                          <TableCell>{team.losses}</TableCell>
                                          <TableCell>{team.goalsFor}</TableCell>
                                          <TableCell>
                                            {team.goalsAgainst}
                                          </TableCell>
                                          <TableCell>
                                            {team.goalDifference}
                                          </TableCell>
                                          <TableCell className="font-bold">
                                            {team.points}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                  </TableBody>
                                </Table>
                              </div>
                              {groupIndex + 1 < numberOfGroups && (
                                <div
                                  href="#"
                                  className="flex flex-col ml-5 bg-[#f6f8ff] border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                                >
                                  {/* Your anchor tag with group info */}
                                  <a
                                    href="#"
                                    className="mt-2 flex flex-col ml-5 mr-5 h-8 bg-white border border-gray-200 rounded-md shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      height: "100%",
                                    }}
                                  >
                                    <div className="flex items-center ml-5">
                                      <p className="text-[#555e61] font-medium text-[0.7rem]">
                                        GROUP {groupIndex + 2}
                                      </p>
                                    </div>
                                  </a>
                                  {/* Table for the second group */}
                                  <Table className="lg:max-w-[550px] bg-white sm:max-w-[10px] mb-10 mt-5">
                                    {/* Table header */}
                                    <TableHead className="text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                                      <TableRow>
                                        <TableCell className="w-12">
                                          #
                                        </TableCell>
                                        <TableCell>TEAM</TableCell>
                                        <TableCell>MP</TableCell>
                                        <TableCell>W</TableCell>
                                        <TableCell>D</TableCell>
                                        <TableCell>L</TableCell>
                                        <TableCell>GF</TableCell>
                                        <TableCell>GA</TableCell>
                                        <TableCell>GD</TableCell>
                                        <TableCell>Pts</TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {/* Filter standings for the current group and map over them */}
                                      {sortStandings
                                        .filter(
                                          (team) =>
                                            team.groupNumber === groupIndex + 2
                                        )
                                        .map((team, index) => (
                                          <TableRow
                                            key={index}
                                            className="dark:bg-white"
                                          >
                                            {/* Table cells for each team */}
                                            <TableCell className="font-bold">
                                              {index + 1}
                                            </TableCell>
                                            <TableCell className="flex gap-2 items-center">
                                              <div className="flex items-center">
                                                {/* Team logo */}
                                                <img
                                                  alt="Team logo"
                                                  className="rounded-lg"
                                                  height="40"
                                                  src={path + team?.teamLogo}
                                                  style={{
                                                    aspectRatio: "40/40",
                                                    objectFit: "cover",
                                                  }}
                                                  width="40"
                                                />
                                                {/* Team name */}
                                                <div className="ml-1">
                                                  {team.teamName}
                                                </div>
                                              </div>
                                            </TableCell>
                                            {/* Other statistics for the team */}
                                            <TableCell>
                                              {team.matchesPlayed}
                                            </TableCell>
                                            <TableCell>{team.wins}</TableCell>
                                            <TableCell>{team.draws}</TableCell>
                                            <TableCell>{team.losses}</TableCell>
                                            <TableCell>
                                              {team.goalsFor}
                                            </TableCell>
                                            <TableCell>
                                              {team.goalsAgainst}
                                            </TableCell>
                                            <TableCell>
                                              {team.goalDifference}
                                            </TableCell>
                                            <TableCell className="font-bold">
                                              {team.points}
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              )}
                            </div>
                          </div>
                        )
                    )}
                  </>
                )}
                {MatchesDrawGroupStage.length > 0 && activeTab === "draw" && (
                  <SingleEliminationBracket
                    matches={MatchesDrawGroupStage}
                    matchComponent={Match}
                  />
                )}
                {MatchesDrawGroupStage.length > 0 &&
                  activeTab === "fixturesgroupstage" && (
                    <>
                      <div className="flex justify-center mb-5 ">
                        <div
                          href="#"
                          className="flex flex-col w-full bg-[#f6f8ff] border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                        >
                          {RealMatches.reduce((acc, match, index) => {
                            const lastGroup = acc[acc.length - 1];
                            if (
                              !lastGroup ||
                              lastGroup[0]?.groupNumber !== match.groupNumber
                            ) {
                              // Create a new group for matches with a new fixture number
                              acc.push([match]);
                            } else {
                              // Add the match to the existing group
                              lastGroup.push(match);
                            }
                            return acc;
                          }, []).map((group, groupIndex) => (
                            <div key={groupIndex}>
                              {group
                                .filter(
                                  (match) =>
                                    match.knockoutStageAfterGroup === "Draw" &&
                                    match.team1 !== null &&
                                    match.team2 !== null
                                )
                                .map((match, matchIndex) => {
                                  return (
                                    <>
                                      <div className="flex justify-between items-center ml-10">
                                        <div className="flex items-center">
                                          <p className="text-[#555e61]  font-medium mr-3 text-[0.8rem]">
                                            {formatDate(match.matchDate)}
                                          </p>

                                          <div className="flex flex-col">
                                            <div className="flex items-center mb-4">
                                              <img
                                                alt="Team A logo"
                                                className="overflow-hidden border object-cover w-4 h-4 mr-3"
                                                src={path + match.team1?.image}
                                                style={{
                                                  aspectRatio: "1/1",
                                                  objectFit: "cover",
                                                }}
                                              />
                                              <p className="text-[#555e61] font-medium text-[0.8rem]">
                                                {match.team1?.name}
                                              </p>
                                            </div>
                                            <div className="flex items-center">
                                              <img
                                                alt="Team A logo"
                                                className="overflow-hidden border object-cover w-4 h-4 mr-3"
                                                src={path + match.team2?.image}
                                                style={{
                                                  aspectRatio: "1/1",
                                                  objectFit: "cover",
                                                }}
                                              />
                                              <p className="text-[#555e61] font-medium text-[0.8rem]">
                                                {match.team2?.name}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="flex items-center mr-20 ">
                                          <div className="flex flex-col">
                                            <div className="flex items-center">
                                              {match?.scoreTeam1 !== "" &&
                                              match?.scoreTeam2 !== "" ? (
                                                <span className="mx-2 text-black font-semibold text-[13px]">
                                                  {match?.scoreTeam1}
                                                </span>
                                              ) : (
                                                <span className="mx-2 text-[#555e61]">
                                                  -
                                                </span>
                                              )}
                                              <hr className="border-t ml-5 px-5 py-5 border-red transform rotate-90 mr-10" />
                                            </div>
                                            <div className="flex items-center">
                                              {match?.scoreTeam1 !== "" &&
                                              match?.scoreTeam2 !== "" ? (
                                                <span className="mx-2 text-black font-semibold text-[13px]">
                                                  {match?.scoreTeam2}
                                                </span>
                                              ) : (
                                                <span className="mx-2 text-[#555e61]">
                                                  -
                                                </span>
                                              )}
                                              <hr className="border-t ml-5 px-5 py-5 border-red transform rotate-90 mr-10" />
                                            </div>
                                          </div>
                                          <div className="flex">
                                            <GiSoccerField
                                              onClick={() =>
                                                handleMatchClickFixture(match)
                                              }
                                              size={18}
                                              className="mr-10 cursor-pointer"
                                            />
                                            <TvIcon
                                              className="mt-1"
                                              style={{ fontSize: "small" }}
                                            />
                                          </div>
                                        </div>
                                      </div>

                                      {isPopupOpenFixture &&
                                        userInfo &&
                                        userInfo.userId ===
                                          Tournament.creator &&
                                        openModalInNewTab(match)}
                                    </>
                                  );
                                })}

                              <hr className="border-t px-5 py-2 border-red ml-5 mr-5" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
              </div>
            </div>
            {activeTab !== "standings" && (
              <a className="flex flex-col ml-5 w-fit   min-h-screen bg-[#f6f8ff] border border-gray-200 rounded-lg shadow  dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                <div className="flex mt-4 mb-2 ml-2 mr-5">
                  <MdGrade size={20} className="mr-1" />
                  <p className="text-black font-medium text-[0.9rem]">
                    TOP SCORERS
                  </p>
                </div>
                {topScorer.map(
                  (player) =>
                    // Check if player has scored any goals
                    player.goals > 0 && (
                      <div key={player.scorer._id} className="w-full">
                        <div className="flex justify-start items-center mb-1 ml-7 mr-2 hover:bg-gray-200">
                          <img
                            alt="Team A logo"
                            className="rounded-md overflow-hidden border object-cover w-5 h-5 mr-1"
                            src={path + player.team.image}
                            style={{
                              aspectRatio: "1/1",
                              objectFit: "cover",
                            }}
                          />
                          <div>
                            <button className="text-[1rem]">
                              {player.scorer.firstName} : {player.goals}
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                )}

                <div className="flex mt-4 mb-2 ml-2 mr-2">
                  <MdGrade size={20} className="mr-1" />
                  <p className="text-black font-medium text-[0.9rem]">
                    TOP YELLOW CARDS
                  </p>
                </div>
                {topYellowCards.map(
                  (player) =>
                    // Check if player has scored any goals
                    player.yellowCardsNumber > 0 && (
                      <div key={player.scorer._id} className="w-full">
                        <div className="flex justify-start items-center mb-1 ml-7 mr-2 hover:bg-gray-200">
                          <img
                            alt="Team A logo"
                            className="rounded-md overflow-hidden border object-cover w-5 h-5 mr-1"
                            src={path + player.team.image}
                            style={{
                              aspectRatio: "1/1",
                              objectFit: "cover",
                            }}
                          />
                          <div>
                            <button className="text-[1rem]">
                              {player.scorer.firstName} :{" "}
                              {player.yellowCardsNumber}
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                )}
                <div className="flex mt-4 mb-2 ml-2 mr-2">
                  <MdGrade size={20} className="mr-1" />
                  <p className="text-black font-medium text-[0.9rem]">
                    TOP RED CARDS
                  </p>
                </div>
                {topRedCards.map(
                  (player) =>
                    // Check if player has scored any goals
                    player.redCardsNumber > 0 && (
                      <div key={player.scorer._id} className="w-full">
                        <div className="flex justify-start items-center mb-1 ml-7 mr-2 hover:bg-gray-200">
                          <img
                            alt="Team A logo"
                            className="rounded-md overflow-hidden border object-cover w-5 h-5 mr-1"
                            src={path + player.team.image}
                            style={{
                              aspectRatio: "1/1",
                              objectFit: "cover",
                            }}
                          />
                          <div>
                            <button className="text-[1rem]">
                              {player.scorer.firstName} :{" "}
                              {player.redCardsNumber}
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                )}
              </a>
            )}
          </div>
        </>
      )}

      {Tournament.tournamentType === "Knockout" && Teams.length > 0 && (
        <>
          <div className="flex justify-start ml-20 items-start pt-8 mb-3">
            <div>
              <a className="flex flex-col min-h-screen  mr-8 bg-[#f6f8ff] border border-gray-200 rounded-lg shadow  dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                <div className="flex mt-4 mb-2 ml-2 mr-2">
                  <MdGrade size={20} className="mr-1" />
                  <p className="text-black font-medium text-[0.9rem]">
                    PINNED TOURNAMENTS
                  </p>
                </div>
                {AllTournament.map((innerArray, index) => (
                  <div key={index} className="w-full">
                    {innerArray.map((tournament) => {
                      return (
                        <div
                          key={tournament._id}
                          className="flex justify-start items-center mb-1 ml-8 hover:bg-gray-200"
                        >
                          <img
                            alt="Team A logo"
                            className="rounded-md overflow-hidden border object-cover w-5 h-5 mr-1"
                            src={pathTournament + tournament.image}
                            style={{
                              aspectRatio: "1/1",
                              objectFit: "cover",
                            }}
                          />
                          <div>
                            <button
                              className="text-[1rem]"
                              onClick={() =>
                                handleOnClickOnFavorite(tournament)
                              }
                            >
                              {tournament.name}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}

                <div className="flex mt-4 mb-2 ml-2 mr-2">
                  <MdGrade size={20} className="mr-1" />
                  <p className="text-black font-medium text-[0.9rem]">
                    FAVORITES TOURNAMENTS
                  </p>
                </div>
                {favoritesTournament.map((tournament) => (
                  <div key={tournament._id} className="w-full">
                    <div className="flex justify-start items-center mb-1 ml-8 hover:bg-gray-200">
                      <img
                        alt="Team A logo"
                        className="rounded-md overflow-hidden border object-cover w-5 h-5 mr-1"
                        src={pathTournament + tournament.image}
                        style={{
                          aspectRatio: "1/1",
                          objectFit: "cover",
                        }}
                      />
                      <div>
                        <button
                          className="text-[1rem]"
                          onClick={() => handleOnClickOnFavorite(tournament)}
                        >
                          {tournament.name}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex mt-4 mb-2 ml-2 mr-2">
                  <MdGrade size={20} className="mr-1" />
                  <p className="text-black font-medium text-[0.9rem]">
                    FAVORITES TEAMS
                  </p>
                </div>
                {favoritesTeams.map((team) => (
                  <div key={team._id} className="w-full">
                    <div className="flex justify-start items-center mb-1 ml-8 hover:bg-gray-200">
                      <img
                        alt="Team A logo"
                        className="rounded-md overflow-hidden border object-cover w-5 h-5 mr-1"
                        src={path + team.image}
                        style={{
                          aspectRatio: "1/1",
                          objectFit: "cover",
                        }}
                      />
                      <div>
                        <button
                          className="text-[1rem]"
                          onClick={() => handleOnClickOnFavoriteTeam(team)}
                        >
                          {team.name}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </a>
            </div>
            <div>
              <a
                href="#"
                className="flex  flex-col w-full mb-2  bg-[#f6f8ff] border border-gray-200 rounded-lg shadow  dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
              >
                <div className="flex items-center ml-3 mt-3">
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
                <div className="flex items-center mb-4 ml-6 mt-4">
                  <img
                    alt="Team A logo"
                    className="rounded-md overflow-hidden border object-cover w-16 h-16 mr-4"
                    src={pathTournament + Tournament.image}
                    style={{
                      aspectRatio: "1/1",
                      objectFit: "cover",
                    }}
                  />
                  <div>
                    <h2 className="text-lg font-semibold mb-2">
                      {Tournament.name}
                    </h2>

                    <p className="text-sm text-gray-600">
                      {Tournament.description}
                    </p>
                  </div>
                </div>
                <hr className="border-t  border-white mb-2 " />{" "}
                <div className="flex justify-start gap-2 ml-4 ">
                  <button
                    className={`inline-flex items-center justify-center ${
                      activeTab === "matches"
                        ? "bg-transparent text-[#ff0046] border-b-4 border-[#ff0046]"
                        : "bg-transparent text-[#555e61] hover:text-black"
                    } px-5 py-2 focus:outline-none text-[0.8rem] font-semibold`}
                    onClick={() => handleTabChange("matches")}
                  >
                    <span>Matches</span>
                  </button>
                  <button
                    className={`inline-flex items-center justify-center ${
                      activeTab === "results"
                        ? "bg-transparent text-[#ff0046] border-b-4 border-[#ff0046]"
                        : "bg-transparent text-[#555e61] hover:text-black"
                    } px-5 py-2 focus:outline-none text-[0.8rem] font-semibold`}
                    onClick={() => handleTabChange("results")}
                  >
                    RESULTS
                  </button>
                  <button
                    className={`inline-flex items-center justify-center ${
                      activeTab === "fixtures"
                        ? "bg-transparent text-[#ff0046] border-b-4 border-[#ff0046]"
                        : "bg-transparent text-[#555e61] hover:text-black"
                    } px-5 py-2 focus:outline-none text-[0.8rem] font-semibold`}
                    onClick={() => handleTabChange("fixtures")}
                  >
                    FIXTURES
                  </button>
                  <button
                    className={`inline-flex items-center justify-center ${
                      activeTab === "draw"
                        ? "bg-transparent text-[#ff0046] border-b-4 border-[#ff0046]"
                        : "bg-transparent text-[#555e61] hover:text-black"
                    } px-5 py-2 focus:outline-none text-[0.8rem] font-semibold`}
                    onClick={() => handleTabChange("draw")}
                  >
                    DRAW
                  </button>
                </div>
              </a>
              <div className="min-w-[53rem]">
                {activeTab === "draw" && (
                  <div className="flex justify-center">
                    <SingleEliminationBracket
                      matches={Matches}
                      matchComponent={Match}
                    />
                  </div>
                )}
                {activeTab === "matches" && (
                  <div>
                    <ul className="flex items-center justify-center space-y-2 space-x-4 text-sm font-medium text-gray-500 dark:text-gray-400 md:me-4 mb-4 md:mb-5">
                      <li>
                        <button
                          onClick={all}
                          className="gap-1 inline-flex items-center mt-2 px-4 py-3 text-[#555e61] hover:text-gray-900 bg-[#f6f8ff] hover:bg-gray-100 rounded-lg active w-full dark:bg-blue-600"
                          aria-current="page"
                        >
                          <Football size={20} className="text-[#555e61]" />
                          All
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={upcoming}
                          className="inline-flex gap-1 items-center px-4 py-3 rounded-lg hover:text-gray-900 bg-[#f6f8ff] hover:bg-gray-100 w-full dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                          <Upcoming size={20} />
                          Upcoming
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={active}
                          className="inline-flex gap-1 items-center px-4 py-3 rounded-lg hover:text-gray-900 bg-[#f6f8ff] hover:bg-gray-100 w-full dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                          <Active size={20} />
                          Active
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={played}
                          className=" gap-1 inline-flex items-center px-4 py-3 rounded-lg hover:text-gray-900 bg-[#f6f8ff] hover:bg-gray-100 w-full dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                          <Played size={20} />
                          Played
                        </button>
                      </li>
                      <li>
                        <a
                          href="#"
                          className=" gap-1 inline-flex items-center px-4 py-3 rounded-lg hover:text-gray-900 bg-[#f6f8ff] hover:bg-gray-100 w-full dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
                        >
                          <Loop size={20} />
                          Discover
                        </a>
                      </li>
                    </ul>
                    <MatchesComponent
                      RealMatches={RealMatches}
                      currentPage={currentPage}
                      handlePageClick={handlePageClick}
                    />
                  </div>
                )}
                {activeTab === "fixtures" && (
                  <>
                    <div className="flex justify-center  mb-5 ">
                      <div
                        href="#"
                        className="flex flex-col w-full bg-[#f6f8ff] border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                        // Adjust the width as needed
                      >
                        {RealMatches.reduce((acc, match, index) => {
                          const lastGroup = acc[acc.length - 1];
                          if (
                            !lastGroup ||
                            lastGroup[0]?.fixture !== match.fixture
                          ) {
                            // Create a new group for matches with a new fixture number
                            acc.push([match]);
                          } else {
                            // Add the match to the existing group
                            lastGroup.push(match);
                          }
                          return acc;
                        }, []).map((group, groupIndex) => (
                          <div key={groupIndex}>
                            <a
                              href="#"
                              className="mt-2 mb-3 flex flex-col ml-5 mr-5 h-6 bg-white border border-gray-200 rounded-md shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                            >
                              <div className="flex items-center ml-5 mt-1 ">
                                <p className="text-[#555e61] font-medium text-[0.7rem]">
                                  ROUND {group[0].fixture}
                                </p>
                              </div>
                            </a>

                            {group
                              .filter(
                                (match) =>
                                  match.team1 !== null && match.team2 !== null
                              )
                              .map((match, matchIndex) => (
                                <>
                                  <div className="flex justify-between items-center ml-10">
                                    <div className="flex items-center">
                                      <p className="text-[#555e61]  font-medium mr-3 text-[0.8rem]">
                                        {formatDate(match.matchDate)}
                                      </p>

                                      <div className="flex flex-col">
                                        <div className="flex items-center mb-4">
                                          <img
                                            alt="Team A logo"
                                            className="overflow-hidden border object-cover w-4 h-4 mr-3"
                                            src={path + match.team1.image}
                                            style={{
                                              aspectRatio: "1/1",
                                              objectFit: "cover",
                                            }}
                                          />
                                          <p className="text-[#555e61] font-medium text-[0.8rem]">
                                            {match.team1.name}
                                          </p>
                                        </div>
                                        <div className="flex items-center">
                                          <img
                                            alt="Team A logo"
                                            className="overflow-hidden border object-cover w-4 h-4 mr-3"
                                            src={path + match.team2.image}
                                            style={{
                                              aspectRatio: "1/1",
                                              objectFit: "cover",
                                            }}
                                          />
                                          <p className="text-[#555e61] font-medium text-[0.8rem]">
                                            {match.team2.name}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center mr-20 ">
                                      <div className="flex flex-col">
                                        <div className="flex items-center">
                                          {match.scoreTeam1 !== "" &&
                                          match.scoreTeam2 !== "" ? (
                                            <span className="mx-2 text-black font-semibold text-[13px]">
                                              {match.scoreTeam1}
                                            </span>
                                          ) : (
                                            <span className="mx-2 text-[#555e61]">
                                              -
                                            </span>
                                          )}
                                          <hr className="border-t ml-5 px-5 py-5 border-red transform rotate-90 mr-10" />
                                        </div>
                                        <div className="flex items-center">
                                          {match.scoreTeam1 !== "" &&
                                          match.scoreTeam2 !== "" ? (
                                            <span className="mx-2 text-black font-semibold text-[13px]">
                                              {match.scoreTeam2}
                                            </span>
                                          ) : (
                                            <span className="mx-2 text-[#555e61]">
                                              -
                                            </span>
                                          )}
                                          <hr className="border-t ml-5 px-5 py-5 border-red transform rotate-90 mr-10" />
                                        </div>
                                      </div>
                                      <div className="flex">
                                        <GiSoccerField
                                          onClick={() =>
                                            handleMatchClickFixture(match)
                                          }
                                          size={18}
                                          className="mr-10 cursor-pointer"
                                        />
                                        <TvIcon
                                          className="mt-1"
                                          style={{ fontSize: "small" }}
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  {isPopupOpenFixture &&
                                    openModalInNewTab(match)}
                                </>
                              ))}

                            <hr className="border-t px-5 py-2 border-red ml-5 mr-5" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                {activeTab === "results" && (
                  <>
                    <div className="flex justify-center mb-5 ">
                      <div
                        href="#"
                        className="flex flex-col  w-full bg-[#f6f8ff] border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                      >
                        {RealMatches.reduce((acc, match, index) => {
                          const lastGroup = acc[acc.length - 1];
                          if (
                            !lastGroup ||
                            lastGroup[0]?.fixture !== match.fixture
                          ) {
                            // Create a new group for matches with a new fixture number
                            acc.push([match]);
                          } else {
                            // Add the match to the existing group
                            lastGroup.push(match);
                          }
                          return acc;
                        }, []).map((group, groupIndex) => (
                          <div key={groupIndex}>
                            {group.some(
                              (match) =>
                                match.scoreTeam1 !== "" &&
                                match.scoreTeam2 !== ""
                            ) && (
                              <a
                                href="#"
                                className="mt-2 mb-1 flex flex-col ml-5 mr-5 h-6 bg-white border border-gray-200 rounded-md shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                              >
                                <div className="flex items-center ml-5 mt-1 ">
                                  <p className="text-[#555e61] font-medium text-[0.7rem]">
                                    ROUND {group[0].fixture}
                                  </p>
                                </div>
                              </a>
                            )}
                            {group
                              .filter(
                                (match) =>
                                  match.scoreTeam1 !== "" &&
                                  match.scoreTeam2 !== ""
                              )
                              .map((match, matchIndex) => (
                                <>
                                  <div className="flex justify-between items-center ml-10">
                                    <div className="flex items-center">
                                      <p className="text-[#555e61]  font-medium mr-3 text-[0.8rem]">
                                        {formatDate(match.matchDate)}
                                      </p>

                                      <div className="flex flex-col">
                                        <div className="flex items-center mb-4">
                                          <img
                                            alt="Team A logo"
                                            className="overflow-hidden border object-cover w-4 h-4 mr-3"
                                            src={path + match.team1.image}
                                            style={{
                                              aspectRatio: "1/1",
                                              objectFit: "cover",
                                            }}
                                          />
                                          <p className="text-[#555e61] font-medium text-[0.8rem]">
                                            {match.team1.name}
                                          </p>
                                        </div>
                                        <div className="flex items-center">
                                          <img
                                            alt="Team A logo"
                                            className="overflow-hidden border object-cover w-4 h-4 mr-3"
                                            src={path + match.team2.image}
                                            style={{
                                              aspectRatio: "1/1",
                                              objectFit: "cover",
                                            }}
                                          />
                                          <p className="text-[#555e61] font-medium text-[0.8rem]">
                                            {match.team2.name}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center mr-20 ">
                                      <div className="flex flex-col">
                                        <div className="flex items-center">
                                          {match.scoreTeam1 !== "" &&
                                          match.scoreTeam2 !== "" ? (
                                            <span className="mx-2 text-black font-semibold text-[13px]">
                                              {match.scoreTeam1}
                                            </span>
                                          ) : (
                                            <span className="mx-2 text-[#555e61]">
                                              -
                                            </span>
                                          )}
                                          <hr className="border-t ml-5 px-5 py-5 border-red transform rotate-90 mr-10" />
                                        </div>
                                        <div className="flex items-center">
                                          {match.scoreTeam1 !== "" &&
                                          match.scoreTeam2 !== "" ? (
                                            <span className="mx-2 text-black font-semibold text-[13px]">
                                              {match.scoreTeam2}
                                            </span>
                                          ) : (
                                            <span className="mx-2 text-[#555e61]">
                                              -
                                            </span>
                                          )}
                                          <hr className="border-t ml-5 px-5 py-5 border-red transform rotate-90 mr-10" />
                                        </div>
                                      </div>
                                      <div className="flex">
                                        <GiSoccerField
                                          onClick={() =>
                                            handleMatchClickFixture(match)
                                          }
                                          size={18}
                                          className="mr-10 cursor-pointer"
                                        />
                                        <TvIcon
                                          className="mt-1"
                                          style={{ fontSize: "small" }}
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  {isPopupOpenFixture &&
                                    openModalInNewTab(match)}
                                </>
                              ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div></div>
          </div>
        </>
      )}
    </div>
  );
}
function formatDate(startDate) {
  const date = new Date(startDate);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}.${month}. ${hours}:${minutes}`;
}
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export default DisplayAllTournaments;