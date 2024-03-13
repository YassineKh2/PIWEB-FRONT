import {Route, Routes} from "react-router-dom";
<<<<<<< HEAD
import Dashboard from "./Dashboard.jsx";
=======
import Dashboard from "./Components/Sidebar";
>>>>>>> 022475351e9db684bc852a1dcda4191938a2a99a
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
<<<<<<< HEAD
                    path="tournaments"
=======
                    path="/tournaments"
>>>>>>> 022475351e9db684bc852a1dcda4191938a2a99a
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