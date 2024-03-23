import {Route, Routes} from "react-router-dom";
import Dashboard from "./Dashboard.jsx";
import HomeDash from "./Components/HomeDash.jsx";
import Credentials from "./Components/StaffCredentials.jsx";
import Preferences from "./Components/StaffPreferences.jsx";
import Profile from "./Components/StaffProfileSettings.jsx";
import Invitations from "./Components/Invitations.jsx";
import Matches from "./Components/StaffMatches.jsx";
import Tournaments from "./Components/TournamentsStaff.jsx";
import StaffStats from "./Components/StaffStats.jsx";

export default function RoutingDashboardStaff() {
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
                    path="credentials"
                    element={
                        <>
                            <Credentials />
                        </>
                    }
                />
                <Route
                    path="preferences"
                    element={
                        <>
                            <Preferences />
                        </>
                    }
                />
                <Route
                    path="profile"
                    element={
                        <>
                            <Profile />
                        </>
                    }
                />
                <Route
                    path="invitations"
                    element={
                        <>
                            <Invitations />
                        </>
                    }
                />
                <Route
                    path="matches"
                    element={
                        <>
                            <Matches />
                        </>
                    }
                />
                <Route
                    path="tournaments"
                    element={
                        <>
                            <Tournaments />
                        </>
                    }
                />
                <Route
                    path="stats"
                    element={
                        <>
                            <StaffStats />
                        </>
                    }
                />

            </Route>
        </Routes>
    )
}