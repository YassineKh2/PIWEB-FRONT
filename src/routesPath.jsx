import { Route, Routes } from "react-router-dom";
import SigninPage from "./views/FrontOffice/components/User/signin/page.jsx";
import SignupPage from "./views/FrontOffice/components/User/signup/page.jsx";
import About from "./views/FrontOffice/HomePage/components/About/AboutSectionOne.jsx";
import Blog from "./views/FrontOffice/HomePage/components/Blog/index.jsx";
import Home from "./views/FrontOffice/HomePage/page.jsx";
import AddTournament from "./views/FrontOffice/components/Tournament/AddTournament/addTournament.jsx";
import DisplayAllTournaments from "./views/FrontOffice/components/Tournament/DisplayTournament/displayTournaments.jsx";
import DisplayTournamentDetails from "./views/FrontOffice/components/Tournament/DisplayTournamentDetails/displayTournamentDetails.jsx";
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
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default RoutesPath;
