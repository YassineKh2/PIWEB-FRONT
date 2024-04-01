import {TbPasswordUser as Credentials, TbTournament} from "react-icons/tb";
import {IoIosFootball as Football} from "react-icons/io";
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import {MdDashboard as Dashboard, MdManageAccounts as AccountProfile} from "react-icons/md";
import {HiOutlineAdjustmentsHorizontal as Preferences} from "react-icons/hi2";
import {AiOutlineTeam as Team} from "react-icons/ai";
import {jwtDecode} from "jwt-decode";
import {getUserData} from "../../../../../..//Services/apiUser.js";
import { TbSoccerField as Field} from "react-icons/tb";


export default function Sidebar() {
    const [ShowAccountSettings, setShowAccountSettings] = useState(false)
    const [notifications, setNotifications] = useState(0)


    useEffect(() => {
        try {
            if (localStorage.getItem('token') === null)
                return;

            const userToken = localStorage.getItem('token');
            const decodedToken = jwtDecode(userToken);
            getUserData(decodedToken.userId).then((response) => {
                setNotifications(response.user.teamInvitations.length)
            })
        } catch (e) {
            console.log(e.message)
        }


    }, [])

    return (
        <>
            <div>

                <button data-drawer-target="cta-button-sidebar" data-drawer-toggle="cta-button-sidebar"
                        aria-controls="cta-button-sidebar" type="button"
                        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                    <span className="sr-only">Open sidebar</span>
                    <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                         xmlns="http://www.w3.org/2000/svg">
                        <path clipRule="evenodd" fillRule="evenodd"
                              d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                    </svg>
                </button>

                <aside id="cta-button-sidebar"
                       className=" rounded-3xl dark:bg-neutral-900 top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
                       aria-label="Sidebar">
                    <div className="h-full rounded-3xl px-3 py-4 overflow-y-auto bg-gray-100 dark:bg-neutral-900">
                        <ul className="space-y-2 font-medium">
                            <li>
                                <Link to="/team"
                                      className="flex items-center p-2  text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                    <Dashboard size={20} className="text-gray-500"/>
                                    <span className="ms-3">Dashboard</span>
                                </Link>
                            </li>

                            <li>
                                <Link to="stats"
                                      className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                    <svg
                                        className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                                        aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                                        viewBox="0 0 22 21">
                                        <path
                                            d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z"/>
                                        <path
                                            d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z"/>
                                    </svg>
                                    <span className="flex-1 ms-3 whitespace-nowrap">Stats</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="matches"
                                      className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                    <Football size={20} className="text-gray-500"/>
                                    <span className="flex-1 ms-3 whitespace-nowrap">Matches</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="tournaments"
                                      className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                    <TbTournament size={20} className="text-gray-500"/>
                                    <span className="flex-1 ms-3 whitespace-nowrap">Tournaments</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="lineups"
                                      className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">

                                    <Field size={23} className="text-gray-500"/>
                                    <span className="flex-1 ms-3 whitespace-nowrap">LineUps</span>
                                </Link>
                            </li>
                            <li>
                                <a onClick={() => setShowAccountSettings(!ShowAccountSettings)}
                                   className="hover:text-gray-900 hover:cursor-pointer flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                    <AccountProfile size={20} className="text-gray-500 hover:text-gray-900"/>
                                    <span className="flex-1 ms-3 whitespace-nowrap">Team Settings</span>
                                </a>
                            </li>
                            <li>
                                {ShowAccountSettings && (
                                    <>
                                        <ul className="ml-4">
                                            <li>
                                                <Link to="profile"
                                                      className="hover:text-gray-900 flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                                    <Credentials size={20}
                                                                 className="text-gray-500 hover:text-gray-900"/>
                                                    <span className="flex-1 ms-3 whitespace-nowrap">Team Profile</span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="preferences"
                                                      className="hover:text-gray-900 flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                                    <Preferences size={20}
                                                                 className="text-gray-500 hover:text-gray-900"/>
                                                    <span className="flex-1 ms-3 whitespace-nowrap">Preferences</span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="members"
                                                      className="hover:text-gray-900 flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                                    <Team size={20} className="text-gray-500 hover:text-gray-900"/>
                                                    <span
                                                        className="flex-1 ms-3 whitespace-nowrap">Players And Coaches</span>
                                                </Link>
                                            </li>
                                        </ul>
                                    </>
                                )}

                            </li>

                            <li>
                                <Link to="invitations"
                                      className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                    <svg
                                        className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                                        aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                                        viewBox="0 0 20 20">
                                        <path
                                            d="m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377ZM6 12H4a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Z"/>
                                    </svg>
                                    <span className="flex-1 ms-3 whitespace-nowrap">Invitations</span>
                                    {notifications > 0 &&
                                        <span
                                            className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">3</span>
                                    }
                                </Link>
                            </li>
                            <li>
                                <a href="#"
                                   className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                    <svg
                                        className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                                        aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                                        viewBox="0 0 18 18">
                                        <path
                                            d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z"/>
                                    </svg>
                                    <span className="flex-1 ms-3 whitespace-nowrap">Plan</span>
                                    <span
                                        className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">Free</span>
                                </a>
                            </li>

                        </ul>
                        <div id="dropdown-cta" className="p-4 mt-6 rounded-lg bg-blue-200 dark:bg-blue-900"
                             role="alert">
                            <div className="flex items-center mb-3">
                            <span
                                className="bg-orange-100 text-orange-800 text-sm font-semibold me-2 px-2.5 py-0.5 rounded dark:bg-orange-200 dark:text-orange-900">PRO</span>
                                <button type="button"
                                        className="ms-auto -mx-1.5 -my-1.5 bg-blue-50 inline-flex justify-center items-center  text-blue-900 rounded-lg focus:ring-2 focus:ring-blue-400 p-1 hover:bg-blue-200 h-6 w-6 dark:bg-blue-900 dark:text-blue-400 dark:hover:bg-blue-800"
                                        data-dismiss-target="#dropdown-cta" aria-label="Close">
                                    <span className="sr-only">Close</span>
                                    <svg className="w-2.5 h-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                         fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                              strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                    </svg>
                                </button>
                            </div>
                            <p className="mb-3 text-sm text-blue-800 dark:text-blue-400">
                                Upgrade to pro for more features and support.
                            </p>
                            <a className="text-sm text-blue-800 underline font-medium hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                               href="#">Learn More</a>
                        </div>
                    </div>
                </aside>


            </div>
        </>
    )
}