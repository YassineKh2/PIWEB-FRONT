import React, { useEffect, useState } from "react";
import { getTournamentDetails } from "../../../../../Services/FrontOffice/apiTournament";
import { useParams } from "react-router-dom";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import {jwtDecode} from "jwt-decode";
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
import { getAvisByTournament, addAvis, updateAvis } from "../../../../../Services/FrontOffice/apiAvis";


function DisplayAllTournaments() {
  const { id } = useParams();
  const [Tournament, setTournament] = useState({});
  const [Teams, setTeams] = useState([]);
  const [RealTeams, setRealTeams] = useState([]);
  const [Matches, setMatches] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [Avis, setAvis] = useState([]);
  const [newAvis, setNewAvis] = useState("");
  const [rating, setRating] = useState(0);
  const userToken = localStorage.getItem('token');
  //const currentUser = userToken ? jwtDecode(userToken) : null;
  const currentUser = {_id:"65f380284f0fdef2191b85f0"};

  const getTournamentDetail = async () => {
    try {
      const res = await getTournamentDetails(id);
      setTournament(res.tournaments);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getTournamentDetail();
  }, []);
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
    const initialStats = Teams.map((team) => ({
      teamId: team.id,
      points: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
    }));
    return initialStats;
  };

  const [Stats, setStats] = useState(initializeStats);

  /* Avis */
  useEffect(() => {
    getAvisForTournament(id);
  }, [id]);

  const getAvisForTournament = async (tournamentId) => {
    try {
      const res = await getAvisByTournament(tournamentId);
      setAvis(res.avis);
    } catch (error) {
      console.error("Error fetching avis for tournament:", error);
    }
  };

  function StarRating({ value, onClick }) {
    const stars = ['1', '2', '3', '4', '5'];
    
    return (
      <div className="flex mb-2">
        {stars.map((star) => (
          <span
            key={star}
            className={`hover:text-yellow cursor-pointer ${
              value >= star ? 'text-yellow' : 'text-gray-400'
            }`}
            onClick={() => onClick(`${star}`)}
            style={{ fontSize: '1.5rem' }} // Adjust font size here
          >
            &#9733;
          </span>
        ))}
      </div>
    );
  }

  // Function to handle adding or updating avis
  const handleAvisSubmit = async () => {
    try {
      if (!newAvis.trim() || !rating.trim()) return; // Don't add empty avis or rating
      // Check if user already has an avis, if so update it
      const userAvis = Avis.find(avis => avis.user._id === currentUser._id);
      if (userAvis) {
        await updateAvis(userAvis._id, { comment: newAvis, rating : rating , user : currentUser._id , tournament: id});
      } else {
        await addAvis({ tournament: id, comment: newAvis, rating : rating , user : currentUser._id });
      }
      // Refresh avis after adding/updating
      getAvisForTournament(id);
      setNewAvis(""); // Clear the input field
      setRating(""); // Clear the rating field
    } catch (error) {
      console.error("Error adding/updating avis:", error);
    }
  };
     /* Avis */
  return (
    <div className="mt-26 mb-20 ml-100">
      {Tournament.tournamentType === "League" && (
        <>
          <div className="overflow-x-auto lg:w-3/12 xl:w-9/12">
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
                {RealTeams.map((team, index) => (
                  <TableRow key={index} className="bg-gray dark:bg-gray-800">
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
                        <div className="ml-1">{team.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>0</TableCell>
                    <TableCell>0</TableCell>
                    <TableCell>0</TableCell>
                    <TableCell>0</TableCell>
                    <TableCell>0</TableCell>
                    <TableCell>0</TableCell>
                    <TableCell>0</TableCell>
                    <TableCell className="font-bold">0</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
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

            {/* Avis section */}
      <div className=" mt-8">
        <h2 className="text-lg font-semibold mb-2">Avis</h2>
        <div className="comments-section">
          {/* Display existing avis */}
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {Avis.map((avisItem, index) => (
  <div key={index} className="w-full">
    <div className="wow fadeInUp rounded-md bg-white p-8 shadow-one dark:bg-[#1D2144] lg:px-5 xl:px-8" data-wow-delay=".1s">
      <div className="mb-5 flex items-center space-x-1">
        {/* Rating stars */}
        {[...Array(avisItem.rating)].map((_, i) => (
          <span key={i} className="text-yellow">
            <svg width="18" height="16" viewBox="0 0 18 16" className="fill-current">
              <path d="M9.09815 0.361679L11.1054 6.06601H17.601L12.3459 9.59149L14.3532 15.2958L9.09815 11.7703L3.84309 15.2958L5.85035 9.59149L0.595291 6.06601H7.0909L9.09815 0.361679Z"></path>
            </svg>
          </span>
        ))}
      </div>
      <p className="mb-8 border-b border-body-color border-opacity-10 pb-8 text-base leading-relaxed text-body-color dark:border-white dark:border-opacity-10 dark:text-white">
        {avisItem.comment}
      </p>
      <div className="flex items-center">
        <div className="relative mr-4 h-[30px] w-full max-w-[30px] overflow-hidden rounded-full">
          <img src='https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg' alt={avisItem.user.email} />
        </div>
        <div className="w-full">
          <h5 className="mb-1 text-lg font-semibold text-dark dark:text-white lg:text-base xl:text-lg">{avisItem.user.firstName+' '+avisItem.user.lastName}</h5>
          {/* Assuming avisItem.user.role contains the role */}
          <p className="text-sm text-body-color">{`Contact :${avisItem.user.email}`}</p>
        </div>
      </div>
    </div>
  </div>
))}
</div>
          {/* Add new avis */}
          {currentUser && (
  <div className="mx-4 mt-8 flex flex-wrap">
  <div className="wow fadeInUp mb-12 rounded-md bg-primary/[3%] py-11 px-8 dark:bg-dark sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]" data-wow-delay=".15s">
    <h2 className="mb-3 text-2xl font-bold text-black dark:text-white sm:text-3xl lg:text-2xl xl:text-3xl">Submit Your Avis</h2>
    <p className="mb-12 text-base font-medium text-body-color">Share your experience with us.</p>
    {/* Container to center the form */}
    <div className="flex justify-center items-center">
      <div className="-mx-4 flex flex-wrap w-full">
        <textarea
          value={newAvis}
          onChange={(e) => setNewAvis(e.target.value)}
          placeholder="Add your avis..."
          rows={5}
          className="w-full resize-none rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp mb-8"
        />
        <StarRating value={rating} onClick={setRating} />
        <div className="flex justify-end w-full pr-4">
          <button onClick={handleAvisSubmit} className="rounded-md bg-primary py-4 px-9 text-base font-medium text-white transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp">Post Avis</button>
        </div>
      </div>
    </div>
  </div>
  </div>
)}
        </div>
      </div>

        </>
      )}
    </div>
    
  );
}

export default DisplayAllTournaments;
