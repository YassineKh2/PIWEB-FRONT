import {Route, Routes} from "react-router-dom";
import RoutingDashboardPlayer from "./Dashboard/RoutingDashboardPlayer.jsx";
import CompleteSingUp from "./AddPlayer/CompleteSingUp.jsx";

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

        </Routes>
    )

}