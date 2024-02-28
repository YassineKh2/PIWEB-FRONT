import "./App.css";

import Footer from "./views/FrontOffice/components/Footer/index.jsx";
import Header from "./views/FrontOffice/components/Header/index.jsx";
import {useLocation} from "react-router-dom";
import {Providers} from "./providers.jsx";
import RoutesPath from "./routesPath.jsx";
import RoutingBackOffice from "./views/BackOffice/RoutingBackOffice.jsx";
import {useEffect, useState} from "react";

function App() {
    const location = useLocation();
    const [shouldDisplayHeader, setShouldDisplayHeader] = useState(false);

    useEffect(() => {
        const currentPath = location.pathname;
        let i = 0;
        // Extract paths directly from the RoutesPath component
        const frontOfficePaths = [
            "/signin",
            "/signup",
            "/about",
            "/blog",
            "/tournament/update",
            "/tournament/add",
            "/tournament/showAll",
            "/tournament/details/:id",
            "/team",
            "/team/add",
            "/team/dashboard",
            "/team/update",
            "/", // add other FrontOffice paths as needed
        ];




        // Check if the current path is in the array
        for (i = 0; i < frontOfficePaths.length; i++) {
            if (frontOfficePaths[i] === currentPath) setShouldDisplayHeader(true);
        }
    }, [location.pathname]);
    return (
        <>
            {shouldDisplayHeader && (
                <Providers>
                    <Header/>
                    <RoutesPath/>
                    <Footer/>
                </Providers>
            )}
            <RoutingBackOffice/>
        </>
    );

}

export default App;
