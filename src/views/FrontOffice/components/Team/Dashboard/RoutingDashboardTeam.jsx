import {Route, Routes} from "react-router-dom";
import Dashboard from "./Dashboard.jsx";
import Matches from "./Components/Matches.jsx";
import HomeDash from "./Components/HomeDash.jsx";
import Tournaments from "./Components/Tournaments.jsx";
import TeamProfile from "./Components/TeamProfile.jsx";
import Invitations from "./Components/Invitations.jsx";
import LineUps from "./Components/LineUps.jsx";


export default function RoutingDashboardTeam() {
    return (
        <Routes>
            <Route
                path=""
                element={
                    <>
                        <Dashboard/>
                    </>
                }
            >
                <Route
                    index
                    element={ <HomeDash /> }
                />

                <Route
                    path="matches"
                    element={ <Matches/> }
                />
                <Route
                    path="tournaments"
                    element={ <Tournaments/> }
                />

                <Route
                    path="profile"
                    element={ <TeamProfile/> }
                />
                <Route
                    path="invitations"
                    element={ <Invitations/> }
                />
                <Route
                    path="lineups"
                    element={ <LineUps/> }
                />

            </Route>
        </Routes>
    )
}