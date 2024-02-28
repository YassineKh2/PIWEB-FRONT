import {Route, Routes} from "react-router-dom";
import UpdateTeam from "./UpdateTeam/UpdateTeam.jsx";
import AddTeam from "./AddTeam/AddTeam.jsx";
import Dashboard from "../Team/Dashboard/Dashboard.jsx";
import RoutingDashboardTeam from "./Dashboard/RoutingDashboardTeam.jsx";

export default function RoutingTeams() {

    return(
        <Routes>
            <Route
                path="*"
                element={
                    <>
                        <RoutingDashboardTeam/>
                    </>
                }
            />
            <Route
                path="add"
                element={
                    <>
                        <AddTeam/>
                    </>
                }
            />
            <Route
                path="update"
                element={
                    <>
                        <UpdateTeam/>
                    </>
                }
            />
        </Routes>
    )

}