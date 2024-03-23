import {Route, Routes} from "react-router-dom";
import RoutingDashboardStaff from "./Dashboard/RoutingDashboardStaff.jsx";
import CompleteSingUp from "./AddStaff/CompleteSingUp.jsx";


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



        </Routes>
    )

}