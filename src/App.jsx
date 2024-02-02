import './App.css'
import Home from "./App/page.jsx";
import Footer from "./components/Footer/index.jsx";
import Header from "./components/Header/index.jsx";
import {Providers} from "./App/providers.jsx";


function App() {

    return (
        <>
            <Providers>
                <Header/>
                <Home/>
                <Footer/>
            </Providers>
        </>
    )
}

export default App
