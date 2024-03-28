import {Route, Routes} from "react-router-dom";
import PageTitle from "../PageTitle.jsx";
import Addstadium from "./AddStadium/addStadium.jsx";
import DisplayStadiums from "./DisplayStadiums/displayStadiums.jsx";


export default function RoutingStadiumBack() {
return(
    <Routes>
        <Route
            path="add"
            element={
                <>
                    <Addstadium/>
                </>
            }
        />
        
        <Route
            path="showAll"
            element={
                <>
                    <DisplayStadiums/>
                </>
            }
        />
 <Route
            path="details/:id"
            element={
                <>
                    <DisplayStadiums/>
                </>
            }
        />

    </Routes>
)

}