import {Route, Routes} from "react-router-dom";
import PageTitle from "../PageTitle.jsx";
import ConsultTeams from "./ConsultTeams/ConsultTeams.jsx";
import TableTwo from "../Tables/TableTwo.jsx";

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
            path="test"
            element={
                <>
                    <PageTitle title="Calendar | TailAdmin - Tailwind CSS Admin Dashboard Template"/>
                    <TableTwo/>
                </>
            }
        />
    </Routes>
)

}