import {Route, Routes} from "react-router-dom";
import HotelList from "./AddHotels/AddHotels.jsx";
import DisplayHotels from "./DisplayHotels/DisplayHotels.jsx";
import UpdateHotels from "./UpdateHotels/updateHotels.jsx";


export default function RoutingHotels() {

    return(
        <Routes>
        <Route path="listhotels"          element={ <HotelList /> } />
        <Route path="details/:id" element={<DisplayHotels />} />
        <Route path="updateHotel/:id"          element={ <UpdateHotels /> } />

      </Routes>
    )

}