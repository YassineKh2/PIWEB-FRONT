import {Route, Routes} from "react-router-dom";
import SigninPage from "./views/FrontOffice/components/User/signin/page.jsx";

import SignupPageTRM from "./views/FrontOffice/components/User/signup/page1.jsx"
import SignupPageTM from "./views/FrontOffice/components/User/signup/page2.jsx"

import About from "./views/FrontOffice/HomePage/components/About/AboutSectionOne.jsx";
import Blog from "./views/FrontOffice/HomePage/components/Blog/index.jsx";
import Home from "./views/FrontOffice/HomePage/page.jsx";
import AddTournament from "./views/FrontOffice/components/Tournament/AddTournament/addTournament.jsx";
import DisplayAllTournaments from "./views/FrontOffice/components/Tournament/DisplayTournament/displayTournaments.jsx";
import DisplayTournamentDetails
    from "./views/FrontOffice/components/Tournament/DisplayTournamentDetails/displayTournamentDetails.jsx";

import AddReservation from "./views/FrontOffice/components/Reservation/AddReservation.jsx";
import AddSponsors from "./views/FrontOffice/components/Sponsors/AddSponsors.jsx";
import AllReservation from "./views/BackOffice/components/Reservation/AllReservation.jsx"
import AllSponsors from "./views/BackOffice/components/Sponsors/AllSponsors.jsx";
import AffTicket from "./views/FrontOffice/components/Ticket/AffTicket.jsx"
import UpReservation from "./views/FrontOffice/components/Reservation/UpReservation.jsx";
import BTicket from "./views/BackOffice/components/ticket/BTicket.jsx";
import RoutingTeams from "./views/FrontOffice/components/Team/RoutingTeams.jsx";
import RoutingTournaments from "./views/FrontOffice/components/Tournament/RoutingTournaments.jsx";
import RoutingPlayers from "./views/FrontOffice/components/Players/RoutingPlayers.jsx";
import RoutingStaff from "./views/FrontOffice/components/Staff/RoutingStaff.jsx";

import RoutingUsers from "./views/FrontOffice/components/User/profile/profile.jsx"
import UserOptions from "./views/FrontOffice/components/User/signup/userOptions.jsx"
import RequireAuth from "./views/FrontOffice/components/User/requireAuth.jsx"
import RoutingBackOffice from "./views/BackOffice/RoutingBackOffice.jsx"
import UpdateProfile from "./views/FrontOffice/components/User/profile/updateProfile.jsx"
import UpdatePassword from "./views/FrontOffice/components/User/profile/updatePassword.jsx"
import SignupPage from "./views/FrontOffice/components/User/signup/page.jsx";
import RoutingHotels from "./views/FrontOffice/components/Hotels/RoutingHotels.jsx";


function RoutesPath() {
    return (
        <div>
            <Routes>
                <Route path="/signin" element={<SigninPage/>}/>
                <Route path="/signup" element={<UserOptions/>}/>
                <Route path="/signupu" element={<SignupPage/>}/>
                <Route path="/signupTM" element={<SignupPageTM/>}/>
                <Route path="/signupTRM" element={<SignupPageTRM/>}/>
                <Route path="/updateProfile" element={<UpdateProfile/>}/>
                <Route path="/updatePassword" element={<UpdatePassword/>}/>
                
                <Route path="/signup" element={<SignupPage/>}/>
                <Route path="/about" element={<About/>}/>
                <Route path="/blog" element={<Blog/>}/>
                <Route path="/addTournament" element={<AddTournament/>}/>
                <Route path="/getAllTournament" element={<DisplayAllTournaments/>}/>
                <Route path="/tournamentDetails/:id" element={<DisplayTournamentDetails/>}/>
                <Route path="/addReservation" element={<AddReservation/>}/>
                <Route path="/addsp" element={<AddSponsors/>}/>
                <Route path="/allReservation" element={<AllReservation/>}/>
                <Route path="/allSponsors" element={<AllSponsors/>}/>
                <Route path="/BTicket" element={<BTicket/>}/>
                <Route path="/ticket" element={<AffTicket/>}/>
                <Route path="/upres" element={<UpReservation/>}/>
                
                <Route path="signin" element={<SigninPage/>}/>
                <Route path="signup" element={<SignupPage/>}/>
                <Route path="about" element={<About/>}/>
                <Route path="blog" element={<Blog/>}/>
                <Route
                    path="tournament/*"
                    element={
                        <>
                            <RoutingTournaments/>
                        </>
                    }
                />
                <Route
                    path="profile/*"
                    element={
                        <>
                            <RoutingUsers/>
                        </>
                    }
                />

                <Route
                    path="team/*"
                    element={
                        <>
                            <RoutingTeams/>
                        </>
                    }
                />
                <Route
                    path="staff/*"
                    element={
                        <>
                            <RoutingStaff/>
                        </>
                    }
                />

                <Route
                    path="player/*"
                    element={
                        <>
                            <RoutingPlayers/>
                        </>
                    }
                />


                <Route
                    path="hotels/*"
                    element={
                        <>
                            <RoutingHotels/>
                        </>
                    }
                />

                <Route path="/" element={<Home/>}/>


                <Route element={<RequireAuth allowedRoles={['A']}/>}>
                    <Route path="backoffice" element={<RoutingBackOffice/>}/>
                </Route>

            </Routes>
        </div>
    );
}

export default RoutesPath;
