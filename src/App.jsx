import "./App.css";

import Footer from "./views/FrontOffice/components/Footer/index.jsx";
import Header from "./views/FrontOffice/components/Header/index.jsx";
import { Providers } from "./providers.jsx";
import RoutesPath from "./routesPath.jsx";
import ECommerce from "./views/BackOffice/Pages/Dashbord/ECommerce.jsx";
import RoutingBackOffice from "./views/BackOffice/RoutingBackOffice.jsx";

function App() {
  return (
    <>
      {/*<Providers>*/}
      {/*  <Header />*/}
      {/*  <RoutesPath />*/}
      {/*  <Footer />*/}
      {/*</Providers>*/}

        <RoutingBackOffice>
            <ECommerce />
        </RoutingBackOffice>
    </>
  );
}

export default App;
