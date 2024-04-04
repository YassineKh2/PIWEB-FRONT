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
import LineUps from "./Components/LineUpsStaff.jsx";
import {useEffect, useState} from "react";
import {jwtDecode} from "jwt-decode";
import {getUserData} from "../../../../../Services/apiUser.js";
import TeamMembers from "./Components/TeamMembersStaff.jsx";

export default function RoutingDashboardStaff() {
    const [Staff, setStaff] = useState({});
    const [Loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            if (localStorage.getItem('token') === null)
                return;

            const userToken = localStorage.getItem('token');
            const decodedToken = jwtDecode(userToken);
            getUserData(decodedToken.userId).then((response) => {
                setStaff(response.user)
                setLoading(false)
            })
        } catch (e) {
            console.log(e.message)
        }


    }, [])


    return (
        <>
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
                        element={<HomeDash/>}
                    />
                    <Route
                        path="credentials"
                        element={
                            <>
                                <Credentials/>
                            </>
                        }
                    />
                    <Route
                        path="preferences"
                        element={
                            <>
                                <Preferences/>
                            </>
                        }
                    />
                    <Route
                        path="profile"
                        element={
                            <>
                                <Profile/>
                            </>
                        }
                    />
                    <Route
                        path="invitations"
                        element={
                            <>
                                <Invitations/>
                            </>
                        }
                    />
                    <Route
                        path="matches"
                        element={
                            <>
                                <Matches/>
                            </>
                        }
                    />
                    <Route
                        path="tournaments"
                        element={
                            <>
                                <Tournaments/>
                            </>
                        }
                    />
                    {Staff.hasAccessTo?.editlineup && (
                        <Route
                            path="lineups"
                            element={<LineUps/>}
                        />
                    )}
                    { (Staff.hasAccessTo?.add || Staff.hasAccessTo?.kick) && (
                        <Route
                            path="teammembers"
                            element={<TeamMembers/>}
                        />
                    )}

                    <Route
                        path="stats"
                        element={
                            <>
                                <StaffStats/>
                            </>
                        }
                    />

                </Route>
            </Routes>
        </>
    )
}