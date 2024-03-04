import "./App.css";

import Footer from "./views/FrontOffice/components/Footer/index.jsx";
import Header from "./views/FrontOffice/components/Header/index.jsx";
import {useLocation} from "react-router-dom";
import {Providers} from "./providers.jsx";
import RoutesPath from "./routesPath.jsx";
import RoutingBackOffice from "./views/BackOffice/RoutingBackOffice.jsx";
import {useEffect, useState} from "react";
import {jwtDecode} from "jwt-decode";

function App() {
    const location = useLocation();
    const [shouldDisplayHeader, setShouldDisplayHeader] = useState(false);

    useEffect(() => {
        const userToken = localStorage.getItem('token');
        const decodedToken = jwtDecode(userToken);

        if(decodedToken.role !== "A"){
            setShouldDisplayHeader(true);
        }



    }, []);




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
