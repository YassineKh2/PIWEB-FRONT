import "./App.css";
import Footer from "./views/FrontOffice/components/Footer/index.jsx";
import Header from "./views/FrontOffice/components/Header/index.jsx";
import { Providers } from "./providers.jsx";
import RoutesPath from "./routesPath.jsx";

function App() {
  return (
    <>
      <Providers>
        <Header />
        <RoutesPath />
        <Footer />
      </Providers>
    </>
  );
}

export default App;
