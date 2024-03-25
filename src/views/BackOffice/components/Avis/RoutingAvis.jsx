import { Route, Routes } from "react-router-dom";
import DisplayAvis from "./DisplayAvis/DisplayAvis";

export default function RoutingAvis() {
    return(
        <Routes>
          
         
            <Route
                path="/"
                element={<DisplayAvis />}
            />

        </Routes>
    )
    
    }