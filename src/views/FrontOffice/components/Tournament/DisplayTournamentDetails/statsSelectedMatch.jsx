import { Button, Card, CardContent } from "@mui/material";
import React, { useEffect, useState } from "react";
import SoccerLineUp from "react-soccer-lineup";
import CloseIcon from "@mui/icons-material/Close";
import {
  getEmptyMatche,
  updateMatchScore,
} from "../../../../../Services/FrontOffice/apiMatch";
import { io } from "socket.io-client";
import { IoIosFootball } from "react-icons/io";

function StatsSelectedMatch({ match, onClose, socket, Tournament }) {
  const path = "http://localhost:3000/public/images/teams/";
  const [activeTab, setActiveTab] = useState("matches");
  const [homeTeam, setHomeTeam] = useState(match.team1.currentLineup);
  const [awayTeam, setAwayTeam] = useState(match.team2.currentLineup);
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
  const [editedTeam1Score, setEditedTeam1Score] = useState(
    match.scoreTeam1 === "" ? "?" : match.scoreTeam1
  );
  const [editedTeam2Score, setEditedTeam2Score] = useState(
    match.scoreTeam2 === "" ? "?" : match.scoreTeam2
  );

  const handleScoreChangeteam1 = (value) => {
    setEditedTeam1Score(value);
  };

  const handleScoreChangeteam2 = (value) => {
    setEditedTeam2Score(value);
  };

  const updateMatch = async (e) => {
    e.preventDefault();

    const updatedMatch = {
      ...match,
      scoreTeam1: editedTeam1Score,
      scoreTeam2: editedTeam2Score,
    };

    try {
      // Emit the updateScore event to the server
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

      socket.emit("updateScore", updatedMatch);
      console.log("Update successful");
    } catch (error) {
      console.error("Error updating match:", error);
    }
  };
  const [Squad, setSquad] = useState({
    gk: null,
    df: [],
    cdm: [],
    cm: [],
    cam: [],
    fw: [],
  });
  useEffect(() => {
    const updatedSquad = { ...Squad }; // Copy the current state
    console.log(updatedSquad);
    homeTeam.forEach((player) => {
      switch (player.position) {
        case "GK":
          updatedSquad.gk = player;
          break;
        case "FB":
          updatedSquad.df.push(player);
          break;
        case "DM":
          updatedSquad.cdm.push(player);
          break;
        case "M":
          updatedSquad.cm.push(player);
          break;
        case "cam":
          updatedSquad.cam.push(player);
          break;
        case "LM":
          updatedSquad.fw.push(player);
          break;
        case "AM":
          updatedSquad.fw.push(player);
          break;
        default:
          break;
      }
    });

    setSquad(updatedSquad);
  }, [homeTeam]);
  const [teamXL, setTeamXL] = useState({
    squad: Squad,
  });
  return (
    <div>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-opacity-30 dark:bg-opacity-30" />
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg overflow-hidden dark:bg-gray-900 ml-4 relative">
          <div
            className="absolute top-0 right-0  cursor-pointer"
            onClick={onClose}
          >
            <CloseIcon />
          </div>
          <div
            href="#"
            className="flex  flex-col  mb-2  bg-[#f6f8ff] border mt-6 ml-2 mr-2 border-gray-200 rounded-lg shadow  dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            <div className="flex items-center ml-3 mt-3 mb-2">
              <IoIosFootball
                className="text-black mr-2"
                style={{ fontSize: "1.3rem" }}
              />
              <p className="text-black font-medium text-[0.8rem]">FOOTBALL</p>
              <span className="mx-2 text-gray-400">{">"}</span>
              <p className="text-black font-medium text-[0.9rem]">
                {Tournament.city}
              </p>
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
                    {formatDate(match.matchDate)}
                  </div>
                  <div className="flex items-center space-x-4">
                    {match.scoreTeam1 === "" && match.scoreTeam2 === "" ? (
                      <>
                        <input
                          type="text"
                          className="w-5 font-semibold"
                          defaultValue={editedTeam1Score}
                          onChange={(e) =>
                            handleScoreChangeteam1(e.target.value)
                          }
                        />
                        <div className="font-semibold text-[1.5rem]">-</div>
                        <input
                          type="text"
                          className="w-5 font-semibold"
                          defaultValue={editedTeam2Score}
                          onChange={(e) =>
                            handleScoreChangeteam2(e.target.value)
                          }
                        />
                      </>
                    ) : (
                      <div className="text-4xl font-bold">
                        {match.scoreTeam1} - {match.scoreTeam2}
                      </div>
                    )}
                  </div>
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
            <div className="flex justify-start gap-2 ml-4  mb-5">
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
                  <div className="">
                    <SoccerLineUp
                      size={"responsive"}
                      color={"#588f58"}
                      pattern={"squares"}
                      homeTeam={teamXL}
                    />
                  </div>
                </>
              )}
            </div>
            <button onClick={updateMatch}>Save</button>
          </div>
        </div>
      </div>
    </div>
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

export default StatsSelectedMatch;
