import {Route, Routes} from "react-router-dom";
import UpdateTeam from "./UpdateTeam/UpdateTeam.jsx";
import AddTeam from "./AddTeam/AddTeam.jsx";
import Dashboard from "../Team/Dashboard/Dashboard.jsx";

export default function RoutingTeams() {

    return(
        <Routes>
            <Route
                index
                element={
                    <>
                        <Dashboard/>
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