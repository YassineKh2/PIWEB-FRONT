import React, { useEffect, useRef, useState } from "react";
import { getTournamentDetails } from "../../../../../Services/FrontOffice/apiTournament";
import { getTournamentMatches } from "../../../../../Services/FrontOffice/apiMatch";
import { useParams } from "react-router-dom";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
import {
  Score,
  Side,
  StyledMatch,
  Team,
  TopText,
  BottomText,
  Wrapper,
  Line,
  Anchor,
} from "@g-loot/react-tournament-brackets/dist/esm/components/match/styles";
import {
  Match,
  SVGViewer,
  SingleEliminationBracket,
} from "@g-loot/react-tournament-brackets";
import { getTeamDetails } from "../../../../../Services/FrontOffice/apiTeam";
import { Card, CardContent } from "@mui/material";
import ReactPaginate from "react-paginate";
import Popup from "reactjs-popup";
import Popupcontent from "./popup";
import { io } from "socket.io-client";

function DisplayAllTournaments() {
  const { id } = useParams();
  const popupRef = useRef(null);
  const [activeTab, setActiveTab] = useState("matches");
  const socket = io.connect("http://localhost:3000/");
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  const [Tournament, setTournament] = useState({});
  const [Teams, setTeams] = useState([]);
  const [RealTeams, setRealTeams] = useState([]);
  const [Matches, setMatches] = useState([]);
  const [MatchesCopy, setMatchesCopy] = useState([]);
  const [RealMatches, setRealMatches] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const getTournamentDetail = async () => {
    try {
      const res = await getTournamentDetails(id);
      setTournament(res.tournaments);
    } catch (err) {
      console.error(err);
    }
  };
  const getAllTournamentMatches = async () => {
    try {
      const res = await getTournamentMatches(Tournament._id);
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
  }, [Tournament]);

  useEffect(() => {
    if (Tournament && Tournament.teams) {
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
  }, [Tournament]);
  const changeScore = (teamId, score) => {
    console.log(teamId, score);
  };
  useEffect(() => {
    const numberOfTeams = Tournament.nbTeamPartipate || 0;
    const teams = Array.from({ length: numberOfTeams }, (_, index) => ({
      id: `team-${index + 1}`, // Assign a unique id to each team
      name: `Team ${index + 1}`,
    }));
    setTeams(teams);

    // Update Matches with dynamic team information
    const updatedMatches = [
      {
        id: 1,
        nextMatchId: 3, // Id for the nextMatch in the bracket, if it's final match it must be null OR undefined
        tournamentRoundText: "1", // Text for Round Header
        startTime: "2021-05-30",
        state: "DONE",
        participants: [
          {
            id: "TEAM 1", // Unique identifier of any kind
            resultText: "WON", // Any string works
            isWinner: false,
            status: "PLAYED", // 'PLAYED' | 'NO_SHOW' | 'WALK_OVER' | 'NO_PARTY' | null
            name: "giacomo123",
          },
          {
            id: "TEAM 2", // Unique identifier of any kind
            resultText: "WON", // Any string works
            isWinner: true,
            status: "PLAYED", // 'PLAYED' | 'NO_SHOW' | 'WALK_OVER' | 'NO_PARTY' | null
            name: "giacomo123",
          },
        ],
      },
      {
        id: 2,
        nextMatchId: 3, // Id for the nextMatch in the bracket, if it's final match it must be null OR undefined
        tournamentRoundText: "4", // Text for Round Header
        startTime: "2021-05-30",
        state: "DONE",
        participants: [
          {
            id: "TEAM 3", // Unique identifier of any kind
            resultText: "11", // Any string works
            isWinner: true,
            status: "PLAYED", // 'PLAYED' | 'NO_SHOW' | 'WALK_OVER' | 'NO_PARTY' | null
            name: "Real madrid",
          },
          {
            id: "TEAM 4", // Unique identifier of any kind
            resultText: "1", // Any string works
            isWinner: false,
            status: "PLAYED", // 'PLAYED' | 'NO_SHOW' | 'WALK_OVER' | 'NO_PARTY' | null
            name: "Barcelona",
          },
        ],
      },
      {
        id: 3,
        nextMatchId: null, // Id for the nextMatch in the bracket, if it's final match it must be null OR undefined
        tournamentRoundText: "1", // Text for Round Header
        startTime: "2021-05-30",
        state: "DONE",
        participants: [
          {
            id: "TEAM 2", // Unique identifier of any kind
            resultText: "WON", // Any string works
            isWinner: true,
            status: "PLAYED", // 'PLAYED' | 'NO_SHOW' | 'WALK_OVER' | 'NO_PARTY' | null
            name: "giacomo123",
          },
          {
            id: "TEAM 3", // Unique identifier of any kind
            resultText: "WON", // Any string works
            isWinner: false,
            status: "PLAYED", // 'PLAYED' | 'NO_SHOW' | 'WALK_OVER' | 'NO_PARTY' | null
            name: "giacomo123",
          },
        ],
      },

      // ConsultTeams more matches as needed
    ];

    setMatches(updatedMatches);
  }, [Tournament]);
  const initializeStats = () => {
    const initialStats = RealTeams.map((team) => ({
      teamId: team._id,
      teamName: team.name,
      points: 0,
      matchesPlayed: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
    }));
    return initialStats;
  };
  const [standing, setStanding] = useState([]);
  const [sortStandings, setSortStandings] = useState([]);
  const updateStandings = () => {
    const standings = initializeStats(); // Assuming you have an initializeStats function
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
          standings.find((team) => team.teamId === team1Id).goalsFor += scoreTeam1;
          standings.find((team) => team.teamId === team2Id).goalsFor += scoreTeam2;
          standings.find((team) => team.teamId === team1Id).goalsAgainst += scoreTeam2;
          standings.find((team) => team.teamId === team2Id).goalsAgainst += scoreTeam1;
          standings.find((team) => team.teamId === team1Id).goalDifference += (scoreTeam1-scoreTeam2);
          standings.find((team) => team.teamId === team2Id).goalDifference += (scoreTeam2-scoreTeam1);

        } else if (scoreTeam1 < scoreTeam2) {
          
          standings.find((team) => team.teamId === team2Id).points += 3;
          standings.find((team) => team.teamId === team2Id).wins += 1;
          standings.find((team) => team.teamId === team1Id).losses += 1;
          standings.find((team) => team.teamId === team1Id).goalsFor += scoreTeam1;
          standings.find((team) => team.teamId === team2Id).goalsFor += scoreTeam2;
          standings.find((team) => team.teamId === team1Id).goalsAgainst += scoreTeam2;
          standings.find((team) => team.teamId === team2Id).goalsAgainst += scoreTeam1;
          standings.find((team) => team.teamId === team1Id).goalDifference += (scoreTeam1-scoreTeam2);
          standings.find((team) => team.teamId === team2Id).goalDifference += (scoreTeam2-scoreTeam1);
        } else {
          
          standings.find((team) => team.teamId === team1Id).points += 1;
          standings.find((team) => team.teamId === team2Id).points += 1;
          standings.find((team) => team.teamId === team1Id).draws += 1;
          standings.find((team) => team.teamId === team2Id).draws += 1;
          standings.find((team) => team.teamId === team1Id).goalsFor += scoreTeam1;
          standings.find((team) => team.teamId === team2Id).goalsFor += scoreTeam2;
          standings.find((team) => team.teamId === team1Id).goalsAgainst += scoreTeam2;
          standings.find((team) => team.teamId === team2Id).goalsAgainst += scoreTeam1;
          standings.find((team) => team.teamId === team1Id).goalDifference += (scoreTeam1-scoreTeam2);
          standings.find((team) => team.teamId === team2Id).goalDifference += (scoreTeam2-scoreTeam1);
        }
        standings.find((team) => team.teamId === team1Id).matchesPlayed += 1;
        standings.find((team) => team.teamId === team2Id).matchesPlayed += 1;
        
      }
    });
    setStanding(standings);
  };
  useEffect(() => {
    updateStandings();
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
  const MatchesComponent = ({ RealMatches, currentPage, handlePageClick }) => {
    const startIndex = currentPage * itemsPerPage;
    const displayedMatches = RealMatches.slice(
      startIndex,
      startIndex + itemsPerPage
    );

    return (
      <div>
        <div className="flex flex-wrap justify-center">
          {displayedMatches.map((match, index) => (
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
                    src="/images/placeholderTeam.png"
                    style={{
                      aspectRatio: "30/30",
                      objectFit: "cover",
                    }}
                    width="30"
                  />
                  <div className="font-semibold">{match.team1.name}</div>
                  <div className="text-4xl font-bold mx-2">vs</div>
                  <img
                    alt="Team B logo"
                    className="rounded-full overflow-hidden border object-cover w-8 h-8"
                    height="30"
                    src="/images/placeholderTeam.png"
                    style={{
                      aspectRatio: "30/30",
                      objectFit: "cover",
                    }}
                    width="30"
                  />
                  <div className="font-semibold">{match.team2.name}</div>
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
          <div className="flex justify-center gap-4 mt-4">
            <button
              className={`${
                activeTab === "matches"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              } px-4 py-2 rounded-md focus:outline-none mb-5`}
              onClick={() => handleTabChange("matches")}
            >
              Matches
            </button>
            <button
              className={`${
                activeTab === "standings"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              } px-4 py-2 rounded-md focus:outline-none mb-5`}
              onClick={() => handleTabChange("standings")}
            >
              Standings
            </button>
          </div>

          {activeTab === "matches" && (
            <div className="flex flex-wrap justify-center">
              <ul className="flex-column  space-y space-y-4 text-sm font-medium text-gray-500 dark:text-gray-400 md:me-4 mb-4 md:mb-0">
                <li>
                  <button
                    onClick={all}
                    className="gap-1 inline-flex items-center px-4 py-3 text-white bg-blue-700 rounded-lg active w-full dark:bg-blue-600"
                    aria-current="page"
                  >
                    <Football size={20} />
                    All
                  </button>
                </li>
                <li>
                  <button
                    onClick={upcoming}
                    className="inline-flex gap-1 items-center px-4 py-3 rounded-lg hover:text-gray-900 bg-gray-50 hover:bg-gray-100 w-full dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    <Upcoming size={20} />
                    Upcoming
                  </button>
                </li>
                <li>
                  <button
                    onClick={active}
                    className="inline-flex gap-1 items-center px-4 py-3 rounded-lg hover:text-gray-900 bg-gray-50 hover:bg-gray-100 w-full dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    <Active size={20} />
                    Active
                  </button>
                </li>
                <li>
                  <button
                    onClick={played}
                    className=" gap-1 inline-flex items-center px-4 py-3 rounded-lg hover:text-gray-900 bg-gray-50 hover:bg-gray-100 w-full dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    <Played size={20} />
                    Played
                  </button>
                </li>
                <li>
                  <a
                    href="#"
                    className=" gap-1 inline-flex items-center px-4 py-3 rounded-lg hover:text-gray-900 bg-gray-50 hover:bg-gray-100 w-full dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
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
              {isPopupOpen && selectedMatch && (
                <div>
                  <div className="fixed inset-0 bg-gray-900 bg-opacity-30" />
                  <Popupcontent
                    ref={popupRef}
                    match={selectedMatch}
                    onClose={() => {
                      setIsPopupOpen(false);
                      setSelectedMatch(null);
                    }}
                    socket={socket}
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === "standings" && (
            <div className="flex flex-wrap justify-center mb-10">
              <div className="overflow-x-auto lg:w-3/12 xl:w-9/12 ">
                <div className="bg-gradient-to-r from-[#2f2f7f] to-[#5c57d7] text-white py-2 px-4 rounded-t-lg">
                  <h2 className="text-lg font-semibold">{Tournament.name}</h2>
                </div>
                <Table className="min-w-[600px] bg-white">
                  <TableHead className="-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                    <TableRow>
                      <TableCell className="w-12" />
                      <TableCell>Team</TableCell>
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
                        <TableCell className="font-bold">{index + 1}</TableCell>
                        <TableCell className="flex gap-2 items-center">
                          <div className="flex items-center">
                            <img
                              alt="Team logo"
                              className="rounded-lg"
                              height="40"
                              src={`/images/download (2).jpg`}
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
          )}
        </>
      )}

      {Tournament.tournamentType === "Group Stage" && <p>Group Stage</p>}
      {Tournament.tournamentType === "Knockout" && Teams.length > 0 && (
        <>
          <p>Knockout</p>
          <SingleEliminationBracket
            matches={Matches}
            matchComponent={({
              match,
              onMatchClick,
              onPartyClick,
              onMouseEnter,
              onMouseLeave,
              topParty,
              bottomParty,
              topWon,
              bottomWon,
              topHovered,
              bottomHovered,
              topText,
              bottomText,
              connectorColor,
              computedStyles,
              teamNameFallback,
              resultFallback,
            }) =>
              _jsxs(Wrapper, {
                children: [
                  _jsxs(
                    "div",
                    Object.assign(
                      {
                        style: {
                          display: "flex",
                          justifyContent: "space-between",
                        },
                      },
                      {
                        children: [
                          _jsx(TopText, { children: topText }),
                          (match.href || typeof onMatchClick === "function") &&
                            _jsx(
                              Anchor,
                              Object.assign(
                                {
                                  href: match.href,
                                  onClick: (event) =>
                                    onMatchClick === null ||
                                    onMatchClick === void 0
                                      ? void 0
                                      : onMatchClick({
                                          match,
                                          topWon,
                                          bottomWon,
                                          event,
                                        }),
                                },
                                {
                                  children: _jsx(TopText, {
                                    children: "Match Details",
                                  }),
                                }
                              )
                            ),
                        ],
                      }
                    )
                  ),
                  _jsxs(StyledMatch, {
                    children: [
                      _jsxs(
                        Side,
                        Object.assign(
                          {
                            onMouseEnter: () => onMouseEnter(topParty.id),
                            onMouseLeave: onMouseLeave,
                            won: topWon,
                            hovered: topHovered,
                            onClick: () =>
                              onPartyClick === null || onPartyClick === void 0
                                ? void 0
                                : onPartyClick(topParty, topWon),
                          },
                          {
                            children: [
                              _jsx(Team, {
                                children:
                                  topParty === null || topParty === void 0
                                    ? void 0
                                    : topParty.name,
                              }),
                              <input
                                type="text"
                                onChange={(event) =>
                                  changeScore(topParty.id, event.target.value)
                                }
                                value={topParty.resultText}
                                style={{
                                  display: "flex",
                                  height: "100%",
                                  padding: "0 1rem",
                                  alignItems: "center",
                                  width: "20%",
                                  justifyContent: "center",
                                  background: "#10131C",
                                  color: "#707582",
                                }}
                              />,
                            ],
                          }
                        )
                      ),
                      _jsx(Line, { highlighted: topHovered || bottomHovered }),
                      _jsxs(
                        Side,
                        Object.assign(
                          {
                            onMouseEnter: () => onMouseEnter(bottomParty.id),
                            onMouseLeave: onMouseLeave,
                            won: bottomWon,
                            hovered: bottomHovered,
                            onClick: () =>
                              onPartyClick === null || onPartyClick === void 0
                                ? void 0
                                : onPartyClick(bottomParty, bottomWon),
                          },
                          {
                            children: [
                              _jsx(Team, {
                                children:
                                  bottomParty === null || bottomParty === void 0
                                    ? void 0
                                    : bottomParty.name,
                              }),
                              _jsx(
                                Score,
                                Object.assign(
                                  { won: bottomWon },
                                  {
                                    children:
                                      bottomParty === null ||
                                      bottomParty === void 0
                                        ? void 0
                                        : bottomParty.resultText,
                                  }
                                )
                              ),
                            ],
                          }
                        )
                      ),
                    ],
                  }),
                  _jsx(BottomText, {
                    children:
                      bottomText !== null && bottomText !== void 0
                        ? bottomText
                        : " ",
                  }),
                ],
              })
            }
          />
        </>
      )}
    </div>
  );
}

export default DisplayAllTournaments;
