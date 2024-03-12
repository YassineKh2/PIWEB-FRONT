import Sidebar from "./Components/Sidebar.jsx";
import {Outlet} from "react-router-dom";

export default function Dashboard() {


    return (
        <>
            <div className="mb-10 ">
                {/* <!-- ===== Page Wrapper Start ===== --> */}
                <div className="flex h-screen overflow-hidden">
                    {/* <!-- ===== Sidebar Start ===== --> */}
                    <div className="hidden md:block">
                    <Sidebar/>
                    </div>
                    {/* <!-- ===== Sidebar End ===== --> */}

                    {/* <!-- ===== Content Area Start ===== --> */}
                    <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">

                        {/* <!-- ===== Main Content Start ===== --> */}
                        <main>
                            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                                <Outlet />
                            </div>
                        </main>
                        {/* <!-- ===== Main Content End ===== --> */}
                    </div>
                    {/* <!-- ===== Content Area End ===== --> */}
                </div>
                {/* <!-- ===== Page Wrapper End ===== --> */}
            </div>
        </>
    );
}

