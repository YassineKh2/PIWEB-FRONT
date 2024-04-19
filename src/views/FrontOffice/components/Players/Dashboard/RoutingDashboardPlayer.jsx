import {Route, Routes} from "react-router-dom";
import Dashboard from "./Dashboard.jsx";
import Invitations from "./Components/Invitations.jsx";
import Credentials from "./Components/PlayerCredentials.jsx";
import Preferences from "./Components/PlayerPreferences.jsx";
import Team from "./Components/PlayerTeamSettings.jsx";
import PlayerStats from "./Components/PlayerStats.jsx";
import PlayerMatches from "./Components/PlayerMatches.jsx";
import TournamentsPlayer from "./Components/TournamentsPlayer.jsx";

export default function RoutingDashboardPlayer() {
    return (
        <Routes>
            <Route
                path=""
                element={
                    <>
                        <Dashboard />
                    </>
                }
            >
                <Route
                    path="invitations"
                    element={ <Invitations /> }
                />
                <Route
                    path="credentials"
                    element={ <Credentials /> }
                />
                <Route
                    path="preferences"
                    element={ <Preferences /> }
                />
                <Route
                    path="team"
                    element={ <Team /> }
                />
                <Route
                    path="stats"
                    element={ <PlayerStats /> }
                />
                <Route
                    path="matches"
                    element={ <PlayerMatches /> }
                />
                <Route
                    path="tournaments"
                    element={ <TournamentsPlayer /> }
                />

            </Route>
        </Routes>
    )
}