
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

import {
  addPlayerStatsForTournament,
  getMatchGoalsForTournament,
  getPlayerStatsForTournament,
  updatePlayerStatsForTournament,
} from "../../../../../Services/FrontOffice/apiGoalStats";

function StatsPlayer({ match, onClose, Tournament, player, HomeAwayTeam,socket }) {
  const [playerStats, setPlayerStats] = useState({});
  const [matchGoals, setMatchGoals] = useState([]);
  const [allGoals, setAllGoals] = useState(0);
  const [countGoals, setCountGoals] = useState(0);
  const [countAssists, setCountAssists] = useState(0);
  const [countYellowCards, setCountYellowCards] = useState(0);
  const [countRedCards, setCountRedCards] = useState(0);
  const [goalInputs, setGoalInputs] = useState([]);
  const [yellowCardInputs, setYellowCardInputs] = useState(false);
  const [redCardInputs, setredCardInputs] = useState(false);
  const [goalInputsvalue, setGoalInputsvalue] = useState([]);
  const [yellowInputsvalue, setYellowInputsvalue] = useState();
  const [redInputsvalue, setRedInputsvalue] = useState();
  const [disableGoalsUpdate, setDisableGoalsUpdate] = useState(false);
  const [matchScoreTeam, setMatchScoreTeam] = useState(0);
  const [incrementClicked, setIncrementClicked] = useState(false);
  const [saveClicked, setSaveClicked] = useState(false);
  const getPlayerStats = async () => {
    try {
      let forTeam;
      if (HomeAwayTeam === true) {
        forTeam = match.team1._id;
      } else if (HomeAwayTeam === false) {
        forTeam = match.team2._id;
      }
      const response = await getPlayerStatsForTournament(
        player.id,
        Tournament._id,
        match._id,
        forTeam
      );
      setPlayerStats(response.goals);
    } catch (err) {
      console.error(err);
    }
  };
  const getMatchGoals = async () => {
    try {
      let forTeam;
      if (HomeAwayTeam === true) {
        forTeam = match.team1._id;
      } else if (HomeAwayTeam === false) {
        forTeam = match.team2._id;
      }
      const response = await getMatchGoalsForTournament(
        forTeam,
        Tournament._id,
        match._id
      );
      setMatchGoals(response.goals);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    if (player && Tournament) getPlayerStats();
  }, []);
  useEffect(() => {
    if (Tournament) getMatchGoals();
  }, []);
  useEffect(() => {
    let matchTeamScore;
    if (HomeAwayTeam === true) {
      matchTeamScore = parseInt(match.scoreTeam1);
    } else if (HomeAwayTeam === false) {
      matchTeamScore = parseInt(match.scoreTeam2);
    }
    setMatchScoreTeam(matchTeamScore);
  }, []);
  useEffect(() => {
    const totalGoals = matchGoals.reduce(
      (total, goal) => total + goal.goalNumber,
      0
    );
    let matchTeamScore;
    if (HomeAwayTeam === true) {
      matchTeamScore = parseInt(match.scoreTeam1);
    } else if (HomeAwayTeam === false) {
      matchTeamScore = parseInt(match.scoreTeam2);
    }
    setAllGoals(totalGoals);
    if (totalGoals === matchTeamScore) {
      setDisableGoalsUpdate(true);
    } else {
      setDisableGoalsUpdate(false);
    }
  }, [matchGoals]);
  useEffect(() => {
    if (
      playerStats &&
      (playerStats.goalNumber ||
        playerStats.assistNumber ||
        playerStats.yellowCardsNumber ||
        playerStats.redCardsNumber)
    ) {
      setCountGoals(playerStats.goalNumber);
      setCountAssists(playerStats.assistNumber);
      setCountYellowCards(playerStats.yellowCardsNumber);
      setCountRedCards(playerStats.redCardsNumber);
      setGoalInputsvalue(playerStats.goalMinutes);
      if (playerStats.yellowCardMinutes && playerStats.yellowCardMinutes != 0)
        setYellowCardInputs(true);
      if (playerStats.RedCardMinutes && playerStats.RedCardMinutes != 0)
        setredCardInputs(true);
      setYellowInputsvalue(playerStats.yellowCardMinutes);
      setRedInputsvalue(playerStats.RedCardMinutes);
      const newGoalInputs = [];
      for (let i = 0; i < playerStats.goalNumber; i++) {
        const goalInputId = `${i}`; // Unique identifier for each input
        const newGoalInput = (
          <div key={goalInputId} className="relative">
            <input
              type="number"
              min={1}
              max={120}
              id={goalInputId}
              defaultValue={playerStats.goalMinutes[goalInputId] || ""}
              onChange={(event) =>
                handleGoalInputChange(goalInputId, parseInt(event.target.value))
              }
              className="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-20 text-sm text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
            />
            <label
              htmlFor={goalInputId}
              className="absolute text-sm mr-3 w-5 text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
            >
              mins
            </label>
          </div>
        );
        newGoalInputs.push(newGoalInput);
      }

      setGoalInputs(newGoalInputs);
    }
  }, [playerStats]);
  let updatedInputsValue = []; // Initialize state with a copy of goalInputs

  const handleGoalInputChange = (index, value) => {
    setGoalInputsvalue(prevInputs => {
      const updatedInputs = [...prevInputs];
      updatedInputs[index] = value;
      return updatedInputs;
    });
  };
  
  useEffect(() => {
    console.log(goalInputsvalue);
  }, [goalInputsvalue]);
  const handleYellowInputChange = (value) => {
    setYellowInputsvalue(value);
  };
  const handleRedInputChange = (value) => {
    setRedInputsvalue(value);
  };
  useEffect(() => {
    updatedInputsValue = [...goalInputs];
  }, [goalInputs]);
  useEffect(() => {
    if (allGoals === matchScoreTeam) {
      setDisableGoalsUpdate(true);
    } else {
      setDisableGoalsUpdate(false);
    }
  }, [allGoals]);

  ///////////////////////////////// INCREMENT AND DECREMENT AND HANDLES////////////////////////////////////////

  const handleIncrementGoals = () => {
    if (disableGoalsUpdate === false) {
      setIncrementClicked(true);
      setCountGoals((prevCount) => prevCount + 1);
      setAllGoals(allGoals + 1);
      const newIndex = goalInputs.length; // Determine the index for the new input
      const newGoalInputId = `${newIndex}`; // Unique identifier for the new input
      const newGoalInput = (
        <div className="relative" key={newGoalInputId}>
          <input
            type="number"
            min={1}
            max={120}
            id={newGoalInputId} // Assign the unique ID
            onChange={(event) =>
              handleGoalInputChange(
                newIndex,
                parseInt(event.target.value)
              )
            }
            className="block rounded-t-lg mr-4 px-2.5 pb-2.5 pt-5 w-20 text-sm text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
          />
          <label
            htmlFor={newGoalInputId} // Reference the corresponding input's ID
            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
          >
            mins
          </label>
        </div>
      );
      setGoalInputs((prevInputs) => [...prevInputs, newGoalInput]);
    }
  };

  const handleDecrementGoals = () => {
    if (countGoals > 0) {
      setAllGoals(allGoals - 1);
      setCountGoals((prevCount) => prevCount - 1);
      setGoalInputs((prevInputs) => prevInputs.slice(0, -1)); // Remove the last input
    }
  };
  const handleIncrementAssists = () => {
    setCountAssists((prevCount) => prevCount + 1);
  };

  const handleDecrementAssits = () => {
    if (countAssists > 0) {
      setCountAssists((prevCount) => prevCount - 1);
    }
  };
  const handleIncrementYellowCards = () => {
    if (countYellowCards < 1) {
      setCountYellowCards((prevCount) => prevCount + 1);
      setYellowCardInputs(true);
    }
  };

  const handleDecrementYellowCards = () => {
    if (countYellowCards > 0) {
      setYellowInputsvalue(0);
      setCountYellowCards((prevCount) => prevCount - 1);
      setYellowCardInputs(false);
    }
  };
  const handleIncrementRedCards = () => {
    if (countRedCards < 1) {
      setCountRedCards((prevCount) => prevCount + 1);
      setredCardInputs(true);
    }
  };

  const handleDecrementRedCards = () => {
    if (countRedCards > 0) {
      setRedInputsvalue(0);
      setCountRedCards((prevCount) => prevCount - 1);
      setredCardInputs(false);
    }
  };

  /////////////////////////////////////// when saving ////////////////////////////////////////
  const save = async () => {
    try {
      let forTeam;
      if (HomeAwayTeam === true) {
        forTeam = match.team1._id;
      } else if (HomeAwayTeam === false) {
        forTeam = match.team2._id;
      }
      const newPlayerStats = {
        scorer: player.id,
        matchId: match._id,
        forTournament: Tournament._id,
        forTeam,
        goalNumber: countGoals,
        assistNumber: countAssists,
        yellowCardsNumber: countYellowCards,
        redCardsNumber: countRedCards,
        goalMinutes: goalInputsvalue,
        yellowCardMinutes: yellowInputsvalue,
        RedCardMinutes: redInputsvalue,
      };
      if (Object.keys(playerStats).length !== 0) {
        await updatePlayerStatsForTournament(playerStats._id, newPlayerStats);
      } else {
        await addPlayerStatsForTournament(newPlayerStats);
      }
      setSaveClicked(true)
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if(saveClicked === true)
    socket.emit("updateTournamentStats", saveClicked,Tournament._id);

  
},[saveClicked])
  return (
    <div>
      <div>
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="w-full max-w-sm bg-white rounded-lg shadow-lg overflow-hidden dark:bg-gray-900 ml-4 relative">
            <div
              className="absolute top-0 right-0  cursor-pointer"
              onClick={onClose}
            >
              <CloseIcon />
            </div>
            <div className="flex mb-3 items-center ml-5">
              <img
                className="overflow-hidden  object-cover w-10 h-10 ml-4 mr-4"
                src="/images/goal.png"
                style={{
                  aspectRatio: "1",
                  objectFit: "cover",
                }}
              />

              <div className="relative flex items-center mr-5">
                <button
                  type="button"
                  onClick={handleDecrementGoals}
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
                <input
                  type="text"
                  className="flex-shrink-0 text-gray-900 dark:text-white border-0 bg-transparent text-sm font-normal focus:outline-none focus:ring-0 max-w-[2.5rem] text-center"
                  placeholder=""
                  onChange={(event) =>
                    setCountGoals(parseInt(event.target.value))
                  }
                  value={countGoals}
                  readOnly // Make input read-only to prevent manual input
                  required
                />
                <button
                  type="button"
                  onClick={handleIncrementGoals}
                  className="flex-shrink-0 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
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
              </div>

              <div className="flex mb-3 items-center mt-3">
                <img
                  className="overflow-hidden  object-cover w-9 h-9 ml-4 mr-4"
                  src="/images/football.png"
                  style={{
                    aspectRatio: "1",
                    objectFit: "cover",
                  }}
                />
                <div>
                  <div className="relative flex items-center">
                    <button
                      type="button"
                      onClick={handleDecrementAssits}
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
                    <input
                      type="text"
                      className="flex-shrink-0 text-gray-900 dark:text-white border-0 bg-transparent text-sm font-normal focus:outline-none focus:ring-0 max-w-[2.5rem] text-center"
                      placeholder=""
                      value={countAssists}
                      onChange={(event) =>
                        setCountAssists(parseInt(event.target.value))
                      }
                      readOnly // Make input read-only to prevent manual input
                      required
                    />
                    <button
                      type="button"
                      onClick={handleIncrementAssists}
                      className="flex-shrink-0 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
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
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center mb-3 ml-5">
              <img
                className="overflow-hidden  object-cover w-10 h-10 ml-4 mr-4"
                src="/images/yellow-card.png"
                style={{
                  aspectRatio: "1",
                  objectFit: "cover",
                }}
              />
              <div className="relative flex items-center mr-4">
                <button
                  type="button"
                  onClick={handleDecrementYellowCards}
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
                <input
                  type="text"
                  className="flex-shrink-0 text-gray-900 dark:text-white border-0 bg-transparent text-sm font-normal focus:outline-none focus:ring-0 max-w-[2.5rem] text-center"
                  placeholder=""
                  value={countYellowCards}
                  onChange={(event) =>
                    setCountYellowCards(parseInt(event.target.value))
                  }
                  readOnly // Make input read-only to prevent manual input
                  required
                />
                <button
                  type="button"
                  onClick={handleIncrementYellowCards}
                  className="flex-shrink-0 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
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
              </div>
              <img
                className="overflow-hidden  object-cover w-10 h-10 ml-4 mr-4"
                src="/images/red.png"
                style={{
                  aspectRatio: "1",
                  objectFit: "cover",
                }}
              />
              <div className="relative flex items-center">
                <button
                  type="button"
                  onClick={handleDecrementRedCards}
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
                <input
                  type="text"
                  className="flex-shrink-0 text-gray-900 dark:text-white border-0 bg-transparent text-sm font-normal focus:outline-none focus:ring-0 max-w-[2.5rem] text-center"
                  placeholder=""
                  value={countRedCards}
                  onChange={(event) =>
                    setCountRedCards(parseInt(event.target.value))
                  }
                  readOnly // Make input read-only to prevent manual input
                  required
                />
                <button
                  type="button"
                  onClick={handleIncrementRedCards}
                  className="flex-shrink-0 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
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
              </div>
            </div>
            <div className="flex flex-wrap mr-2 ml-6">
              {goalInputs.map((goalInput, index) => (
                <div key={index} className="w-1/3 mb-2">
                  {goalInput}
                </div>
              ))}
            </div>
            <div className=" flex items-center mb-3 ">
              {yellowCardInputs && (
                <div className="flex flex-col">
                  <label
                    for="steps-range"
                    className="block ml-7 mb-2 mt-2 text-sm font-medium text-gray-900  dark:text-white"
                  >
                    Yellow Card Minute :
                  </label>
                  <div className="relative ml-6">
                    <input
                      type="number"
                      min={1}
                      max={120}
                      defaultValue={yellowInputsvalue}
                      onChange={(event) =>
                        handleYellowInputChange(parseInt(event.target.value))
                      }
                      className="block rounded-t-lg px-2.5 h-13 pb-2.5 pt-5 w-20 text-sm text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                    />
                    <label className="absolute text-sm mr-3 w-5 text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">
                      mins
                    </label>
                  </div>
                </div>
              )}
              {redCardInputs && (
                <div className="flex flex-col items-start ml-8">
                  <label
                    for="steps-range"
                    class="block ml-7 mt-2 mb-2 text-sm font-medium text-gray-900  dark:text-white"
                  >
                    Red Card Minute :
                  </label>
                  <div className="relative ml-6">
                    <input
                      type="number"
                      min={1}
                      max={120}
                      defaultValue={redInputsvalue}
                      onChange={(event) =>
                        handleRedInputChange(parseInt(event.target.value))
                      }
                      className="block rounded-t-lg px-2.5 pb-2.5 h-13 pt-5 w-20 text-sm text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                    />
                    <label className="absolute text-sm mr-3 w-5 text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">
                      mins
                    </label>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-center items-center mb-2">
              <button
                type="button"
                className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2 text-center me-2 mb-2"
                onClick={save}
              >
                Save
              </button>
            </div>
            {disableGoalsUpdate && (
              <p className="text-red-500 text-sm">
                Cannot update goals anymore because they match the team's score
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsPlayer;
