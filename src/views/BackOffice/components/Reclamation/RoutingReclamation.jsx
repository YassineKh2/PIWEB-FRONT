import { Route, Routes } from "react-router-dom";
import DisplayReclamation from "./DisplayReclamation/DisplayReclamtion";

export default function RoutingReclamation() {
    return(
        <Routes>
          
         
            <Route
                path="/"
                element={<DisplayReclamation />}
            />

        </Routes>
    )
    
    }