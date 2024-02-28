import {Route, Routes} from "react-router-dom";
import Dashboard from "./Dashboard.jsx";
import Matches from "./Components/Matches.jsx";
import HomeDash from "./Components/HomeDash.jsx";
import Tournaments from "./Components/Tournaments.jsx";
import TeamDetails from "./Components/TeamDetails.jsx";


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
                    element={ <TeamDetails/> }
                />

            </Route>
        </Routes>
    )
}