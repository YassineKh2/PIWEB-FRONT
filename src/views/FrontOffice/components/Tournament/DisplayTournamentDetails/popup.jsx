import { Button, Card, CardContent } from "@mui/material";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import {
  getEmptyMatche,
  updateMatchScore,
} from "../../../../../Services/FrontOffice/apiMatch";
import { io } from "socket.io-client";

function PopupContent({ match, onClose, socket, Tournament }) {
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

  return (
    <div>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-opacity-30 dark:bg-opacity-30" />
        <div className="w-full max-w-sm bg-white rounded-lg shadow-lg overflow-hidden dark:bg-gray-900 ml-4 relative">
          <div
            className="absolute top-0 right-0  cursor-pointer"
            onClick={onClose}
          >
            <CloseIcon />
          </div>
          <div className="flex flex-col items-center p-6">
            <div className="flex items-center space-x-6 mb-4">
              <div className="flex items-center">
                <div className="font-semibold ml-4 text-[1.5rem]">
                  {match.team1.name}
                </div>
                <img
                  alt="Team A logo"
                  className="rounded-full overflow-hidden border object-cover w-12 h-12 ml-4"
                  src="/images/placeholderTeam.png"
                  style={{
                    aspectRatio: "1",
                    objectFit: "cover",
                  }}
                />
              </div>

              <div className="text-[1.5rem] font-bold mx-4">vs</div>

              <div className="flex items-center">
                <img
                  alt="Team B logo"
                  className="rounded-full overflow-hidden border object-cover w-12 h-12"
                  src="/images/placeholderTeam.png"
                  style={{
                    aspectRatio: "1",
                    objectFit: "cover",
                  }}
                />
                <div className="font-semibold ml-4 text-[1.5rem]">
                  {match.team2.name}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4 mb-4">
              {match.scoreTeam1 === "" && match.scoreTeam2 === "" ? (
                <>
                  <input
                    type="text"
                    className="w-5 font-semibold  "
                    defaultValue={editedTeam1Score}
                    onChange={(e) => handleScoreChangeteam1(e.target.value)}
                  />
                  <div className="font-semibold  text-[1.5rem]">-</div>
                  <div className="ml-10">
                    <input
                      type="text"
                      className=" w-5 font-semibold"
                      defaultValue={editedTeam2Score}
                      onChange={(e) => handleScoreChangeteam2(e.target.value)}
                    />
                  </div>
                </>
              ) : (
                <div className="text-xl font-bold">
                  {match.scoreTeam1} - {match.scoreTeam2}
                </div>
              )}
            </div>

            <div className="text-xs grid gap-0.5 text-center">
              <div>{match.matchDate}</div>
              <div>{match.matchTime}</div>
              <div>{match.location}</div>
            </div>
            <button onClick={updateMatch}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PopupContent;
