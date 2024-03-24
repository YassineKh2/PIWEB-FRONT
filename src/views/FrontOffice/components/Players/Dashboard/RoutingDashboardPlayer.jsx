import {Route, Routes} from "react-router-dom";
import Dashboard from "./Dashboard.jsx";
import HomeDash from "./Components/HomeDash.jsx";

export default function RoutingDashboardPlayer() {
    return (
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
                    element={ <HomeDash /> }
                />

            </Route>
        </Routes>
    )
}