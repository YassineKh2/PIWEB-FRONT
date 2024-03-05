import { Route, Routes } from "react-router-dom";
import SigninPage from "./views/FrontOffice/components/User/signin/page.jsx";
import SignupPage from "./views/FrontOffice/components/User/signup/page.jsx";
import About from "./views/FrontOffice/HomePage/components/About/AboutSectionOne.jsx";
import Blog from "./views/FrontOffice/HomePage/components/Blog/index.jsx";
import Home from "./views/FrontOffice/HomePage/page.jsx";
import RoutingTeams from "./views/FrontOffice/components/Team/RoutingTeams.jsx";
import RoutingTournaments from "./views/FrontOffice/components/Tournament/RoutingTournaments.jsx";
import RoutingUsers from "./views/FrontOffice/components/User/profile/profile.jsx"
function RoutesPath() {
  return (
    <div>
      <Routes>
        <Route path="signin" element={<SigninPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="about" element={<About />} />
        <Route path="blog" element={<Blog />} />
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
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default RoutesPath;
