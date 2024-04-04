import { Route, Routes } from "react-router-dom";
import SigninPage from "./views/FrontOffice/components/User/signin/page.jsx";
import SignupPage from "./views/FrontOffice/components/User/signup/page.jsx";
import About from "./views/FrontOffice/HomePage/components/About/AboutSectionOne.jsx";
import Blog from "./views/FrontOffice/HomePage/components/Blog/index.jsx";
import Home from "./views/FrontOffice/HomePage/page.jsx";
import DisplayTournamentDetails from "./views/FrontOffice/components/Tournament/DisplayTournamentDetails/displayTournamentDetails.jsx";
import RoutingTournaments from "./views/FrontOffice/components/Tournament/RoutingTournaments.jsx";
import SignupPageTRM from "./views/FrontOffice/components/User/signup/page1.jsx"
import SignupPageTM from "./views/FrontOffice/components/User/signup/page2.jsx"
import UserOptions from "./views/FrontOffice/components/User/signup/userOptions.jsx"
import ForgotPassword from "./views/FrontOffice/components/User/signin/forgotPassword.jsx"
function PublicRoutes() {
  return (
    <div>
      <Routes>
      <Route path="/signin" element={<SigninPage />} />
        <Route path="/signup" element={<UserOptions />} />
        <Route path="/signupu" element ={<SignupPage/>} />
        <Route path="/signupTM" element={<SignupPageTM/>} />
        <Route path="/signupTRM" element ={<SignupPageTRM/>} />
        <Route path="/forgotPassword" element={<ForgotPassword/>}/>
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route
          path="/tournamentDetails/:id"
          element={<DisplayTournamentDetails />}
        />
        <Route path="about" element={<About />} />
        <Route path="blog" element={<Blog />} />
        <Route path="/" element={<Home />} />
        <Route
          path="tournament/*"
          element={
            <>
              <RoutingTournaments />
            </>
          }
        />


      </Routes>
    </div>
  );
}

export default PublicRoutes;
