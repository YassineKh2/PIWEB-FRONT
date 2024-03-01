import {Route, Routes} from "react-router-dom";
import UpdateTeam from "./UpdateTeam/UpdateTeam.jsx";
import AddTeam from "./AddTeam/AddTeam.jsx";
import RoutingDashboardTeam from "./Dashboard/RoutingDashboardTeam.jsx";
import LiveStream from "../LiveStreaming/LiveStream.jsx";
import ShowAllTeams from "./AllTeams/ShowAllTeams.jsx";


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
                path="stream"
                element={
                    <>
                        <LiveStream />
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
            <Route
                path="all"
                element={
                    <>
                        <ShowAllTeams/>
                    </>
                }
            />
        </Routes>
    )

}