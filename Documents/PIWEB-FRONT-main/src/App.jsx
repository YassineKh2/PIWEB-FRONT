import "./App.css";

import Footer from "./views/FrontOffice/components/Footer/index.jsx";
import Header from "./views/FrontOffice/components/Header/index.jsx";
import { useLocation } from "react-router-dom";
import { Providers } from "./providers.jsx";
import RoutesPath from "./routesPath.jsx";
import RoutingBackOffice from "./views/BackOffice/RoutingBackOffice.jsx";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import PublicRoutes from "./publicRoutes";

function App() {
  const location = useLocation();
  const [shouldDisplayHeader, setShouldDisplayHeader] = useState(0);

  useEffect(() => {
    const userToken = localStorage.getItem("token");
    //const decodedToken = jwtDecode(userToken);

    if (userToken) {
      const decodedToken = jwtDecode(userToken);
      if (decodedToken.role === "C") {
        setShouldDisplayHeader(1);
      } else if (decodedToken.role === "A") {
        setShouldDisplayHeader(2);
      }else if (decodedToken.role === "TRM") {
        setShouldDisplayHeader(3);
      }else if (decodedToken.role === "TM") {
        setShouldDisplayHeader(4);
      }
    }
  }, []);

  return (
    <>
      {shouldDisplayHeader === 0 && (
        <Providers>
          <Header />
          <PublicRoutes />
          <Footer />
        </Providers>
      )}
      {shouldDisplayHeader === 1 && (
        <Providers>
          <Header />
          <RoutesPath />
          <Footer />
        </Providers>
      )}
       {shouldDisplayHeader === 3 && (
        <Providers>
          <Header />
          <RoutesPath />
          <Footer />
        </Providers>
      )}
       {shouldDisplayHeader === 4 && (
        <Providers>
          <Header />
          <RoutesPath />
          <Footer />
        </Providers>
      )}
      {shouldDisplayHeader === 2 && <RoutingBackOffice />}
    </>
  );
}

export default App;