import {Route, Routes} from "react-router-dom";
import RoutingDashboardStaff from "./Dashboard/RoutingDashboardStaff.jsx";
import CompleteSingUp from "./AddPlayer/CompleteSingUp.jsx";
import ProfilePlayer from "./Profile/PlayerProfile.jsx";

export default function RoutingPlayers() {

    return(
        <Routes>
            <Route
                path="*"
                element={
                    <>
                        <RoutingDashboardStaff />
                    </>
                }
            />
            <Route
                path="completeSingUp"
                element={
                    <>
                        <CompleteSingUp />
                    </>
                }
            />
            <Route
                path="profile/:id"
                element={
                    <>
                        <ProfileStaff />
                    </>
                }
            />


        </Routes>
    )

}