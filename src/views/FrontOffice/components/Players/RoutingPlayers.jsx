import {Route, Routes} from "react-router-dom";
import RoutingDashboardPlayer from "./Dashboard/RoutingDashboardPlayer.jsx";
import CompleteSingUp from "./AddPlayer/CompleteSingUp.jsx";
import ProfilePlayer from "./Profile/PlayerProfile.jsx";
import PlayerProfile2 from "./Profile/PlayerProfile2.jsx";

export default function RoutingPlayers() {

    return(
        <Routes>
            <Route
                path="*"
                element={
                    <>
                        <RoutingDashboardPlayer/>
                    </>
                }
            />
            <Route
                path="completeSingUp"
                element={
                    <>
                        <CompleteSingUp/>
                    </>
                }
            />
            <Route
                path="profile/:id"
                element={
                    <>
                        <ProfilePlayer/>
                    </>
                }
            />
            <Route
                path="profile2/:id"
                element={
                    <>
                        <PlayerProfile2 />
                    </>
                }
            />

        </Routes>
    )

}