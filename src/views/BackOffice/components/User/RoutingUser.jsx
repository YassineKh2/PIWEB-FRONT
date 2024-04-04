import { Route, Routes } from "react-router-dom";
import DisplayUser from "./DisplayUser/displayUser.jsx";
import AddAdmin from "./AddUser/addUser.jsx";
import PageTitle from "../PageTitle.jsx";
import DisplayUserData from "./DisplayUserData/displayUserData.jsx"
export default function RoutingUsersBack() {
    return(
        <Routes>
          
         
            <Route
                path="/"
                element={<DisplayUser />}
            />
            <Route
                path="/addAdmin"
                element={
                    <>
                        <PageTitle title="Calendar | TailAdmin - Tailwind CSS Admin Dashboard Template"/>
                        <AddAdmin/>
                    </>
                }
            />

<Route
                path="/user-details"
                element={
                    <>
                        <PageTitle title="Calendar | TailAdmin - Tailwind CSS Admin Dashboard Template"/>
                        <DisplayUserData/>
                    </>
                }
            />
        </Routes>
    )
    
    }