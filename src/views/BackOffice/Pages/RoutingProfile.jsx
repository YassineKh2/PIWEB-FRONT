import { Route, Routes } from "react-router-dom";
import Profile from "./Profile.jsx";
import UpdateProfile from "./updateProfileAdmin.jsx";
import PageTitle from "../components/PageTitle.jsx";
import  UpdatePassword from "./updateAdminPassword.jsx";
export default function RoutingProfile() {
    return(
        <Routes>
          
         
            <Route
                path="/"
                element={<Profile />}
            />
            <Route
                path="/update"
                element={
                    <>
                        <PageTitle title="Calendar | TailAdmin - Tailwind CSS Admin Dashboard Template"/>
                        <UpdateProfile/>
                    </>
                }
            />
            <Route
                path="/updatePasswordAdmin"
                element={
                    <>
                        <PageTitle title="Calendar | TailAdmin - Tailwind CSS Admin Dashboard Template"/>
                        <UpdatePassword/>
                    </>
                }
            />


        </Routes>
    )
    
    }