import {useEffect, useState} from "react";

import {deleteTeam, getAllTeams} from "../../../../../Services/FrontOffice/apiTeam";
import {FaEye as Eye, FaTrash as Trash} from "react-icons/fa";
import {Link} from "react-router-dom";


const ConsultTeams = () => {
    const [teams, setTeams] = useState([]);
    const [teamsCopy, setteamsCopy] = useState([])

    const path = "http://localhost:3000/public/images/teams/";

    const [DeleteTeam, SetDeleteTeam] = useState({
        show: false,
        team: {},
        confirmationInput: "",
        confirmationInputValidation: false
    })

    // --------Toast Message--------
    const [Toast, setToast] = useState(false)
    const [ErrorToast, setErrorToast] = useState(false)
    const [ToastMessage, setToastMessage] = useState('')
    // --------Toast Message--------

    // --------Pagination--------
    const [currentPage, setCurrentPage] = useState(1);
    const [teamsPerPage, setTeamPerPage] = useState(5);

    const indexOfLastTeam = currentPage * teamsPerPage;
    const indexOfFirstTeam = indexOfLastTeam - teamsPerPage;
    const [pages, setPages] = useState(0);
    const [currentTeams, setCurrentTeams] = useState([]);
    // --------Pagination--------


    const [searchTerm, setsearchTerm] = useState("")


    useEffect(() => {
        setCurrentTeams(teams.slice(indexOfFirstTeam, indexOfLastTeam));
        setPages(Math.ceil(teams.length / teamsPerPage));
    }, [teams, currentPage])


    useEffect(() => {

        const fetchTeams = async () => {
            const data = await getAllTeams();
            setTeams(data.teams);
            setteamsCopy(data.teams)
        };

        fetchTeams();
    }, []);


    function transformDate(date) {
        const dateObj = new Date(date);
        const options = {year: 'numeric', month: 'long', day: 'numeric'};
        return dateObj.toLocaleDateString('en-US', options);
    }

    function deleteTeamFunc() {
        if (DeleteTeam.confirmationInput !== DeleteTeam.team.name) {
            SetDeleteTeam({
                ...DeleteTeam,
                confirmationInputValidation: true
            })
            return
        }

        deleteTeam(DeleteTeam.team._id).then(() => {
            setToastMessage("Team Deleted Successfully")
            setToast(true)
            setTimeout(() => {
                setToast(false)
            }, 3000)

            SetDeleteTeam({
                show: false,
                team: {},
                confirmationInput: "",
                confirmationInputValidation: false
            })
            setTeams(teams.filter((team) => team._id !== DeleteTeam.team._id))

        }).catch((e) => {
            setToastMessage(e.message)
            setErrorToast(true)
            setTimeout(() => {
                setErrorToast(false)
            }, 3000)
        })

    }

    useEffect(() => {
        setTeams(
            teamsCopy.filter((team) => {
                    return (
                        team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        team.nameAbbreviation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        transformDate(team.CreatedIn).toLowerCase().includes(searchTerm.toLowerCase()) ||
                        team.ranking.toString().toLowerCase().includes(searchTerm.toLowerCase())
                    )
                }
            )
        );
        setCurrentTeams(teams.slice(indexOfFirstTeam, indexOfLastTeam));
    }, [searchTerm]);

    return (
        <>
            <div
                className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
                    Teams
                </h4>
                <div
                    className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
                    <label htmlFor="table-search" className="sr-only">Search</label>
                    <div className="relative">
                        <div
                            className="absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center ps-3 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true"
                                 fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd"
                                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                      clipRule="evenodd"></path>
                            </svg>
                        </div>
                        <input type="text" id="table-search"
                               value={searchTerm}
                               onChange={(e) => setsearchTerm(e.target.value)}
                               className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                               placeholder="Search by Name, Rank, Abbereviation...."/>
                    </div>
                </div>

                <div className="flex flex-col">
                    <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
                        <div className="p-2.5 xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">
                                Team Name
                            </h5>
                        </div>
                        <div className="p-2.5 text-center xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">
                                Team Abbreviation
                            </h5>
                        </div>
                        <div className="p-2.5 text-center xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">
                                Created In
                            </h5>
                        </div>
                        <div className="hidden p-2.5 text-center sm:block xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">
                                Ranking
                            </h5>
                        </div>
                        <div className="hidden p-2.5 text-center sm:block xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">
                                Actions
                            </h5>
                        </div>
                    </div>

                    {currentTeams.map((team, key) => (
                        <div
                            className={`grid grid-cols-3 sm:grid-cols-5 ${
                                key === currentTeams.length - 1
                                    ? ''
                                    : 'border-b border-stroke dark:border-strokedark'
                            }`}
                            key={key}
                        >
                            <div className="flex items-center gap-3 p-2.5 xl:p-5">
                                <div className="flex-shrink-0">
                                    <img src={path + team.image} alt="Team's Logo"
                                         className="w-15 h-15 rounded-3xl hover:rounded-2xl "/>
                                </div>
                                <p className="hidden text-black dark:text-white sm:block">
                                    {team.name}
                                </p>
                            </div>

                            <div className="flex items-center justify-center p-2.5 xl:p-5">
                                <p className="text-black dark:text-white">{team.nameAbbreviation}</p>
                            </div>

                            <div className="flex items-center justify-center p-2.5 xl:p-5">
                                <p>{transformDate(team.CreatedIn)}</p>
                            </div>

                            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                                <p className="text-meta-5">{team.ranking}</p>
                            </div>
                            <div className="hidden items-center justify-center gap-2  p-2.5 sm:flex xl:p-5">
                                <Link to={"profile/" + team._id}>
                                    <Eye size={22} className="text-meta-3 hover:cursor-pointer active:scale-95"/>
                                </Link>
                                <Trash
                                    onClick={() => SetDeleteTeam({
                                        show: true,
                                        team: team
                                    })}
                                    size={20} className="text-meta-1 hover:cursor-pointer active:scale-95"/>
                            </div>
                        </div>
                    ))}

                    <nav aria-label="Page Navigation"
                         className="mx-auto my-10 flex max-w-xs justify-between space-x-2 rounded-md  py-2">
                        <button onClick={() => {
                            setCurrentPage(1)
                        }}
                                disabled={currentPage === 1}
                                className="flex hover:cursor-pointer items-center space-x-1 font-medium hover:text-blue-600"
                                aria-label="First Page">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                 className="h-4 w-4">
                                <path fillRule="evenodd"
                                      d="M13.28 3.97a.75.75 0 010 1.06L6.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0zm6 0a.75.75 0 010 1.06L12.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0z"
                                      clipRule="evenodd"/>
                            </svg>
                        </button>
                        <button
                            onClick={() => {
                                setCurrentPage(currentPage - 1)
                            }}
                            disabled={currentPage === 1}
                            className="flex items-center hover:cursor-pointer space-x-1 font-medium hover:text-blue-600"
                            aria-label="Previous Page">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                 className="h-4 w-4">
                                <path fillRule="evenodd"
                                      d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
                                      clipRule="evenodd"/>
                            </svg>
                        </button>
                        <ul className="flex items-center">
                            {Array.from({length: pages}, (_, i) => {
                                return (
                                    <li key={i}>
                                        <a href="#"
                                           onClick={() => setCurrentPage(i + 1)}
                                           className={currentPage === i + 1 ? "rounded-md px-2 text-2xl font-medium text-blue-600 sm:px-3" : "px-2 text-lg font-medium text-gray-400 sm:px-3 hover:text-blue-600"}
                                           aria-label={`Page ${i + 1}`}>{i + 1}</a>
                                    </li>
                                )
                            })}
                        </ul>
                        <button onClick={() => {
                            setCurrentPage(currentPage + 1)
                        }} className="flex items-center hover:cursor-pointer space-x-1 font-medium hover:text-blue-600"
                                disabled={currentPage === pages}
                                aria-label="Next Page">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                 className="h-4 w-4">
                                <path fillRule="evenodd"
                                      d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
                                      clipRule="evenodd"/>
                            </svg>
                        </button>
                        <button onClick={() => {
                            setCurrentPage(pages)
                        }} className="flex hover:cursor-pointer items-center space-x-1 font-medium hover:text-blue-600"
                                disabled={currentPage === pages}
                                aria-label="Last Page">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                 className="h-4 w-4">
                                <path fillRule="evenodd"
                                      d="M4.72 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L11.69 12 4.72 5.03a.75.75 0 010-1.06zm6 0a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06L17.69 12l-6.97-6.97a.75.75 0 010-1.06z"
                                      clipRule="evenodd"/>
                            </svg>
                        </button>
                    </nav>

                </div>
            </div>

            {
                DeleteTeam.show && (
                    <div
                        className="justify-center gray-100 items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                    >
                        <div
                            className="m-10 bg-gray-100 flex max-w-lg flex-col items-center rounded-md border px-8 py-10 text-gray-800 shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/svg"
                                 className="h-16 w-16 rounded-xl bg-red-50 p-2 text-red-500"
                                 fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>

                            <p className="mt-4 text-center text-xl font-bold">Delete Team</p>
                            <p className="mt-2 text-center text-lg">Are you sure you want to
                                delete {DeleteTeam.team.name} !
                            </p>
                            <p className="mt-2 text-center text-lg">Type <strong
                                className="text-red-500">{DeleteTeam.team.name}</strong> to confirm</p>
                            <input
                                value={DeleteTeam.confirmationInput}
                                placeholder="Team Name"
                                onChange={(e) => {
                                    SetDeleteTeam({
                                        ...DeleteTeam,
                                        confirmationInput: e.target.value
                                    })
                                }}
                                type="text"
                                className={DeleteTeam.confirmationInputValidation ? "mt-2 w-3/4 p-2 border border-red-300 rounded-md" : "mt-2 w-3/4 p-2 border border-gray-300 rounded-md"}/>
                            {
                                DeleteTeam.confirmationInputValidation && (
                                    <p className="mt-2 text-center text-lg text-red-500">Name does not match</p>
                                )}
                            <div
                                className="mt-8 flex flex-col justify-center space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
                                <button
                                    onClick={() => {
                                        deleteTeamFunc()
                                    }}
                                    className="whitespace-nowrap rounded-md bg-red-500 px-4 py-3 font-medium text-white">Delete
                                    Team
                                </button>
                                <button onClick={() => {
                                    SetDeleteTeam({
                                        show: false,
                                        team: {},
                                        confirmationInput: "",
                                        confirmationInputValidation: false
                                    })
                                }} className="whitespace-nowrap rounded-md bg-gray-200 px-4 py-3 font-medium">Cancel
                                </button>
                            </div>
                            <p className="mt-6 text-center text-lg"><span className="truncate font-bold">This Action is cannot be reversed</span>
                            </p>
                        </div>
                    </div>
                )
            }
            {Toast &&
                <div id="toast-bottom-right"
                     className="fixed flex items-center w-full max-w-xs p-4 space-x-4 text-white bg-green-600 divide-x rtl:divide-x-reverse divide-gray-200 rounded-lg shadow right-5 bottom-5 dark:text-gray-100 dark:divide-gray-700 space-x dark:bg-green-800"
                     role="alert">
                    <div className="text-sm font-normal">{ToastMessage}</div>
                </div>
            }
            {ErrorToast &&
                <div id="toast-bottom-right"
                     className="fixed flex items-center w-full max-w-xs p-4 space-x-4 text-white bg-rose-600 divide-x rtl:divide-x-reverse divide-gray-200 rounded-lg shadow right-5 bottom-5 dark:text-gray-100 dark:divide-gray-700 space-x dark:bg-green-800"
                     role="alert">
                    <div className="text-sm font-normal">{ToastMessage}</div>
                </div>
            }
        </>
    );
}


export default ConsultTeams;
