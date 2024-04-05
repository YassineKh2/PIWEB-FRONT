import {Route, Routes} from "react-router-dom";
import PageTitle from "../PageTitle.jsx";
import ConsultTeams from "./ConsultTeams/ConsultTeams.jsx";
import TeamProfile from "./ConsultTeams/ProfileTeam.jsx";

export default function RoutingTeamsBack() {
return(
    <Routes>
        <Route
            path=""
            element={
                <>
                    <PageTitle title="Calendar | TailAdmin - Tailwind CSS Admin Dashboard Template"/>
                    <ConsultTeams/>
                </>
            }
        />
        <Route
            path="profile/:id"
            element={
                <>
                    <PageTitle title="Calendar | TailAdmin - Tailwind CSS Admin Dashboard Template"/>
                    <TeamProfile/>
                </>
            }
        />
    </Routes>
)

}