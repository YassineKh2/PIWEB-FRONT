import {Route, Routes} from "react-router-dom";
import DisplayHotelList from "./DisplayHotelsList/DisplayHotelList.jsx";


export default function RoutingHotels() {

    return(
        <Routes>
            <Route
               index
                element={
                    <>
                    <DisplayHotelList />
                    
                    </>
                }
            />
           
        </Routes>
    )

}