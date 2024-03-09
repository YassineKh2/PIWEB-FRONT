import {Route, Routes} from "react-router-dom";
import AddHotels from "./AddHotels/AddHotels.jsx";


export default function RoutingHotels() {

    return(
        <Routes>
            <Route
               index
                element={
                    <>
                    <AddHotels/>
                    
                    </>
                }
            />
           
        </Routes>
    )

}