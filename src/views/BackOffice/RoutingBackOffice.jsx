import PageTitle from "./components/PageTitle.jsx";
import {Route, Routes, useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import ECommerce from "./Pages/Dashbord/ECommerce.jsx";
import FormElements from "./Pages/Form/FormElements.jsx";
import FormLayout from "./Pages/Form/FormLayout.jsx";
import Calendar from "./Pages/Calendar.jsx";
import Profile from "./Pages/Profile.jsx";
import Tables from "./Pages/Tables.jsx";
import Settings from "./Pages/Settings.jsx";
import Chart from "./Pages/Chart.jsx";
import Alerts from "./Pages/UiElements/Alerts.jsx";
import Buttons from "./Pages/UiElements/Buttons.jsx";
import SignIn from "./Pages/Authentication/SignIn.jsx";
import SignUp from "./Pages/Authentication/SignUp.jsx";

export default function RoutingBackOffice() {
    const [loading, setLoading] = useState(true);
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        setTimeout(() => setLoading(false), 1000);
    }, []);

    return loading ? (
        // <Loader />
        console.log("Loading")
    ) : (
        <>
            <Routes>
                <Route
                    path="/backOffice"
                    element={
                        <>
                            <PageTitle title="eCommerce Dashboard | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                            <ECommerce />
                        </>
                    }
                />
                <Route
                    path="/calendar"
                    element={
                        <>
                            <PageTitle title="Calendar | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                            <Calendar />
                        </>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <>
                            <PageTitle title="Profile | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                            <Profile />
                        </>
                    }
                />
                <Route
                    path="/forms/form-elements"
                    element={
                        <>
                            <PageTitle title="Form Elements | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                            <FormElements />
                        </>
                    }
                />
                <Route
                    path="/forms/form-layout"
                    element={
                        <>
                            <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                            <FormLayout />
                        </>
                    }
                />
                <Route
                    path="/tables"
                    element={
                        <>
                            <PageTitle title="Tables | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                            <Tables />
                        </>
                    }
                />
                <Route
                    path="/settings"
                    element={
                        <>
                            <PageTitle title="Settings | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                            <Settings />
                        </>
                    }
                />
                <Route
                    path="/chart"
                    element={
                        <>
                            <PageTitle title="Basic Chart | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                            <Chart />
                        </>
                    }
                />
                <Route
                    path="/ui/alerts"
                    element={
                        <>
                            <PageTitle title="Alerts | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                            <Alerts />
                        </>
                    }
                />
                <Route
                    path="/ui/buttons"
                    element={
                        <>
                            <PageTitle title="Buttons | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                            <Buttons />
                        </>
                    }
                />
                <Route
                    path="/auth/signin"
                    element={
                        <>
                            <PageTitle title="Signin | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                            <SignIn />
                        </>
                    }
                />
                <Route
                    path="/auth/signup"
                    element={
                        <>
                            <PageTitle title="Signup | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                            <SignUp />
                        </>
                    }
                />
            </Routes>
        </>
    );
}