import {useEffect, useState} from "react";
import {jwtDecode} from "jwt-decode";
import {getInvitationsByTeam, getUserData, updateTeamMember, updateUser} from "../../../../../../Services/apiUser.js";
import {Dropdown} from 'primereact/dropdown';
import {FaTrash as Trash} from "react-icons/fa";


export default function SentInvitations() {
    const [Invitations, SetInvitations] = useState([])
    const [FilterdInvitations, setFilteredInvitations] = useState([])
    const [searchTerm, setsearchTerm] = useState("")

    const [filteroptions, setfilteroptions] = useState(null);
    const options = [
        {name: 'All', code: 'A'},
        {name: 'This Month', code: 'TM'},
        {name: 'This Week ', code: 'TW'},
        {name: 'Last Month', code: 'LM'},
        {name: 'Last Year', code: 'LY'}
    ];

    const positionMapping = {
        "AM": "Attacking Midfielder",
        "CB": "Center Back",
        "CF": "Center Forward",
        "CM": "Central Midfielder",
        "D": "Defender",
        "DM": "Defensive Midfielder",
        "FB": "Full Back",
        "F": "Forward",
        "GK": "Goalkeeper",
        "LM": "Left Midfielder",
        "M": "Midfielder",
        "RM": "Right Midfielder",
        "S": "Striker",
        "SS": "Second Striker",
        "WB": "Wing Back",
        "W": "Winger",

    }
    const staffPositionMapping = {
        "manager": "Manager",
        "assistant_manager": "Assistant Manager",
        "coach": "Coach",
        "goalkeeping_coach": "Goalkeeping Coach",
        "fitness_coach": "Fitness Coach",
        "analyst": "Analyst",
        "scout": "Scout",
        "physiotherapist": "Physiotherapist",
        "doctor": "Team Doctor",
        "nutritionist": "Nutritionist",
        "psychologist": "Sports Psychologist",
        "media_officer": "Media Officer",
        "kit_manager": "Kit Manager"
    };

    //----------- Toast -----------
    const [Toast, setToast] = useState(false)
    const [ErrorToast, setErrorToast] = useState(false)
    const [ToastMessage, setToastMessage] = useState('')
    //----------- Toast -----------


    const [CancelInvite, setCancelInvite] = useState({
        show: false,
        invitation: {},
        player: {}
    })

    useEffect(() => {
        try {
            if (localStorage.getItem('token') === null)
                return;

            const userToken = localStorage.getItem('token');
            const decodedToken = jwtDecode(userToken);
            getUserData(decodedToken.userId).then((response) => {
                getInvitationsByTeam(response.user.PlayingFor).then((response) => {
                    SetInvitations(response)
                    setFilteredInvitations(response)
                });
            })
        } catch (e) {
            console.log(e.message)
        }


    }, [])

    function transformDate(date) {
        const dateObj = new Date(date);
        const options = {year: 'numeric', month: 'long', day: 'numeric'};
        return dateObj.toLocaleDateString('en-US', options);
    }


    useEffect(() => {
        if (!filteroptions) return;

        switch (filteroptions.code) {
            case 'TM': // This Month
                setFilteredInvitations(Invitations.filter(invite => isInThisMonth(invite.invitation.date)));
                break;
            case 'TW': // This Week
                setFilteredInvitations(Invitations.filter(invite => isInThisWeek(invite.invitation.date)));
                break;
            case 'LM': // Last Month
                setFilteredInvitations(Invitations.filter(invite => isInLastMonth(invite.invitation.date)));
                break;
            case 'LY': // Last Year
                setFilteredInvitations(Invitations.filter(invite => isInLastYear(invite.invitation.date)));
                break;
            case 'A': // All
                setFilteredInvitations(Invitations);
                break;
            default:
                setFilteredInvitations(Invitations);
                break;
        }

    }, [filteroptions]);

    const isInThisMonth = (date) => {
        const now = new Date();
        const inputDate = new Date(date);
        return now.getMonth() === inputDate.getMonth() && now.getFullYear() === inputDate.getFullYear();
    };

    const isInThisWeek = (date) => {
        const now = new Date();
        const inputDate = new Date(date);
        const startOfWeek = now.getDate() - now.getDay();
        const endOfWeek = startOfWeek + 7;
        return inputDate.getDate() >= startOfWeek && inputDate.getDate() <= endOfWeek;
    };

    const isInLastMonth = (date) => {
        const now = new Date();
        const inputDate = new Date(date);
        const lastMonth = now.getMonth() - 1;
        return inputDate.getMonth() === lastMonth && now.getFullYear() === inputDate.getFullYear();
    };

    const isInLastYear = (date) => {
        const now = new Date();
        const inputDate = new Date(date);
        return now.getFullYear() - 1 === inputDate.getFullYear();
    };


    useEffect(() => {
        setFilteredInvitations(
            Invitations.filter((invite) => {
                    let playername = invite.user.firstName + " " + invite.user.lastName

                    return (
                        playername.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        invite.user.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        transformDate(invite.invitation.date).toLowerCase().includes(searchTerm.toLowerCase())
                    )
                }
            )
        );
    }, [searchTerm]);

    function CancelInvitation() {
        let user = CancelInvite.player
        let invitation = CancelInvite.invitation
        user.teamInvitations = user.teamInvitations.filter((invite) => invite.team !== invitation.team)

        updateTeamMember(user).then(() => {
            Invitations.filter((invite) => invite.invitation !== invitation)
            setFilteredInvitations(Invitations.filter((invite) => invite.invitation !== invitation))
            setToastMessage('Invitation has been removed !')
            setToast(true)
            setTimeout(() => {
                setToast(false)
            }, 3000)
        }).catch((e) => {
            setToastMessage(e.message)
            setErrorToast(true)
            setTimeout(() => {
                setErrorToast(false)
            }, 3000)
        })


    }

    return (
        <>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">

                <div
                    className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
                    <Dropdown value={filteroptions} onChange={(e) => setfilteroptions(e.value)} options={options}
                              optionLabel="name"
                              placeholder="Select a Date" className="w-full md:w-14rem"/>
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
                               placeholder="Search by Tournament, Team or Date"/>
                    </div>
                </div>


                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="p-4">
                            <div className="flex items-center">
                                <input id="checkbox-all-search" type="checkbox"
                                       className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>
                            </div>
                        </th>
                        <th scope="col" className="px-6 py-3">
                            User
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Role
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Invited On
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Status
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Action
                        </th>
                    </tr>
                    </thead>
                    <tbody>

                    {FilterdInvitations.map((invitation, key) => (
                            <tr key={key}
                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="w-4 p-4">
                                    <div className="flex items-center">
                                        <input id="checkbox-table-search-1" type="checkbox"
                                               className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                        <label htmlFor="checkbox-table-search-1" className="sr-only">checkbox</label>
                                    </div>
                                </td>
                                <th scope="row"
                                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {invitation.user.firstName} {invitation.user.lastName}
                                </th>
                                <td className="px-6 py-4">
                                    {invitation.user.role === "P" ? positionMapping[invitation.user.position] : staffPositionMapping[invitation.user.position]}
                                </td>
                                <td className="px-6 py-4">
                                    {transformDate(invitation.invitation.date)}
                                </td>
                                <td className="px-6 py-4">
                                    <div
                                        className="w-fit rounded-full bg-blue-600 py-2 px-3 text-xs font-medium text-white"> {invitation.invitation.state}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <Trash
                                        size={20}
                                        onClick={() => {
                                            setCancelInvite({
                                                show: true,
                                                invitation: invitation.invitation,
                                                player: invitation.user
                                            })
                                        }}
                                        className="text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 cursor-pointer"
                                    />

                                </td>
                            </tr>

                        )
                    )}

                    </tbody>
                </table>
            </div>
            {
                CancelInvite.show && (
                    <div
                        className="justify-center bg-gray-400 bg-opacity-60 dark:bg-opacity-10  items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                    >
                        <div
                            className="m-10 dark:bg-neutral-900 dark:text-gray-100  bg-white flex max-w-lg flex-col items-center rounded-md border px-8 py-10 text-gray-800 shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/svg"
                                 className="h-16 w-16 rounded-xl bg-red-50 p-2 text-red-500"
                                 fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>

                            <p className="mt-4 text-center text-xl font-bold">Remove Invitation</p>
                            <p className="mt-2 text-center text-lg">Are you sure you want to
                                kick {CancelInvite.player.firstName} {CancelInvite.player.lastName} from the team
                                !</p>
                            <p className="mt-2 text-center text-lg"><span className="truncate font-medium">This Action is cannot be reversed</span>
                            </p>
                            <div
                                className="mt-8 flex flex-col justify-center space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
                                <button
                                    onClick={() => {
                                        CancelInvitation()
                                        setCancelInvite({
                                            show: false,
                                            invitation: {},
                                            player: {}
                                        })
                                    }}
                                    className="whitespace-nowrap rounded-md bg-red-500 px-4 py-3 font-medium text-white">Remove
                                    the invitation
                                </button>
                                <button onClick={() => {
                                    setCancelInvite({
                                        show: false,
                                        invitation: {},
                                        player: {}
                                    })
                                }} className="whitespace-nowrap rounded-md bg-gray-200 px-4 py-3 font-medium dark:bg-gray-800">Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
            {
                Toast &&
                <div id="toast-bottom-right"
                     className="fixed flex items-center w-full max-w-xs p-4 space-x-4 text-white bg-green-600 divide-x rtl:divide-x-reverse divide-gray-200 rounded-lg shadow right-5 bottom-5 dark:text-gray-100 dark:divide-gray-700 space-x dark:bg-green-800"
                     role="alert">
                    <div className="text-sm font-normal">{ToastMessage}</div>
                </div>
            }
            {
                ErrorToast &&
                <div id="toast-bottom-right"
                     className="fixed flex items-center w-full max-w-xs p-4 space-x-4 text-white bg-rose-600 divide-x rtl:divide-x-reverse divide-gray-200 rounded-lg shadow right-5 bottom-5 dark:text-gray-100 dark:divide-gray-700 space-x dark:bg-green-800"
                     role="alert">
                    <div className="text-sm font-normal">{ToastMessage}</div>
                </div>
            }

        </>


    )
}