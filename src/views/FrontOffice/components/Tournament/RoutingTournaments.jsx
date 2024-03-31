import {Route, Routes} from "react-router-dom";
import AddTournament from "./AddTournament/addTournament.jsx";
import DisplayAllTournaments from "./DisplayTournament/displayTournaments.jsx";
import DisplayTournamentDetails from "./DisplayTournamentDetails/displayTournamentDetails.jsx";
import UpdateTournament from "./updateTournament/updateTournament.jsx";
import StatsSelectedMatch from "./DisplayTournamentDetails/statsSelectedMatch.jsx";

export default function RoutingTournaments() {

    return (
        <Routes>
            <Route
                path="add"
                element={
                    <>
                        <AddTournament/>
                    </>
                }
            />
            <Route
                path="showAll"
                element={
                    <>
                        <DisplayAllTournaments/>
                    </>
                }
            />
            <Route
                path="details/:id"
                element={
                    <>
                        <DisplayTournamentDetails/>
                    </>
                }
            />

            <Route
                path="update"
                element={
                    <>
                        <UpdateTournament/>
                    </>
                }
            />
            <Route
                path="matchStats"
                element={
                    <>
                        <StatsSelectedMatch/>
                    </>
                }
            />
        </Routes>
    )

}