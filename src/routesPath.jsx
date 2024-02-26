import { Route, Routes } from "react-router-dom";
import SigninPage from "./views/FrontOffice/components/User/signin/page.jsx";
import SignupPage from "./views/FrontOffice/components/User/signup/page.jsx";
import About from "./views/FrontOffice/HomePage/components/About/AboutSectionOne.jsx";
import Blog from "./views/FrontOffice/HomePage/components/Blog/index.jsx";
import Home from "./views/FrontOffice/HomePage/page.jsx";
import AddTournament from "./views/FrontOffice/components/Tournament/AddTournament/addTournament.jsx";
import DisplayAllTournaments from "./views/FrontOffice/components/Tournament/DisplayTournament/displayTournaments.jsx";
import DisplayTournamentDetails from "./views/FrontOffice/components/Tournament/DisplayTournamentDetails/displayTournamentDetails.jsx";
import AddTeam from "./views/FrontOffice/components/Team/AddTeam/AddTeam.jsx";
import AddReservation from "./views/FrontOffice/components/Reservation/AddReservation.jsx";
import AddSponsors from "./views/FrontOffice/components/Sponsors/AddSponsors.jsx";
import AllReservation from "./views/BackOffice/components/Reservation/AllReservation.jsx"
import AllSponsors from "./views/BackOffice/components/Sponsors/AllSponsors.jsx";
function RoutesPath() {
  return (
    <div>
      <Routes>
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/addTournament" element={<AddTournament />} />
        <Route path="/getAllTournament" element={<DisplayAllTournaments />} />
        <Route path="/tournamentDetails/:id" element={<DisplayTournamentDetails />} />
        <Route path="/addReservation" element={<AddReservation />} />
        <Route path="/addsp" element={<AddSponsors/>} />
        <Route path="/allReservation" element={<AllReservation/>} />
        <Route path="/allSponsors" element={<AllSponsors/>} />

        <Route path="/team" element={<AddTeam />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default RoutesPath;
