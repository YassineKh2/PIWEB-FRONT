import {useEffect, useState} from "react";
import {getMatchesByTeam} from "../../../../../../Services/FrontOffice/apiTeam.js";
import {jwtDecode} from "jwt-decode";
import {getUserData} from "../../../../../../Services/apiUser.js";
import {Dropdown} from 'primereact/dropdown';


export default function Matches() {
    const [matches, setMatches] = useState([])
    const [FilterdMatches, setFilteredMatches] = useState([])
    const [teamManager, setteamManager] = useState({})
    const [searchTerm, setsearchTerm] = useState("")

    const [filteroptions, setfilteroptions] = useState(null);
    const options = [
        {name: 'All', code: 'A'},
        {name: 'This Month', code: 'TM'},
        {name: 'This Week ', code: 'TW'},
        {name: 'Last Month', code: 'LM'},
        {name: 'Last Year', code: 'LY'}
    ];

    useEffect(() => {
        try {
            if (localStorage.getItem('token') === null)
                return;

            const userToken = localStorage.getItem('token');
            const decodedToken = jwtDecode(userToken);
            getUserData(decodedToken.userId).then((response) => {
                setteamManager(response.user)
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
        getMatchesByTeam(teamManager.PlayingFor).then((response) => {
            setMatches(response.matchList)
            setFilteredMatches(response.matchList)
        });
    }, [teamManager]);


    useEffect(() => {
        if (!filteroptions) return;

        switch (filteroptions.code) {
            case 'TM': // This Month
                setFilteredMatches(matches.filter(match => isInThisMonth(match.matchDate)));
                break;
            case 'TW': // This Week
                setFilteredMatches(matches.filter(match => isInThisWeek(match.matchDate)));
                break;
            case 'LM': // Last Month
                setFilteredMatches(matches.filter(match => isInLastMonth(match.matchDate)));
                break;
            case 'LY': // Last Year
                setFilteredMatches(matches.filter(match => isInLastYear(match.matchDate)));
                break;
            case 'A': // All
                setFilteredMatches(matches);
                break;
            default:
                // Handle invalid option
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
        setFilteredMatches(
            matches.filter((match) => {
                    let enemyTeamName = ""
                    if (match.team1._id === teamManager.PlayingFor)
                        enemyTeamName = match.team2.name
                    else
                        enemyTeamName = match.team1.name

                    return(
                        enemyTeamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        match.tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        transformDate(match.matchDate).toLowerCase().includes(searchTerm.toLowerCase())
                    )
                }
            )
        );
    }, [searchTerm]);

    return (
        <>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">

                <div
                    className="flex flex-column flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
                    <Dropdown value={filteroptions} onChange={(e) => setfilteroptions(e.value)} options={options}
                              optionLabel="name"
                              placeholder="Select a Date" className="w-full md:w-40" />
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
                            Tournament
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Score
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Enemy Team
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Match Date
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Action
                        </th>
                    </tr>
                    </thead>
                    <tbody>

                    {FilterdMatches.map((match, key) => (
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
                                    {match.tournament.name}
                                </th>
                                <td className="px-6 py-4">
                                    {match.scoreTeam1} - {match.scoreTeam2}
                                </td>
                                <td className="px-6 py-4">
                                    {match.team1._id === teamManager.PlayingFor ? match.team2.name : match.team1.name}
                                </td>
                                <td className="px-6 py-4">
                                    {transformDate(match.matchDate)}
                                </td>
                                <td className="px-6 py-4">
                                    <a href="#"
                                       className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                                </td>
                            </tr>

                        )
                    )}

                    </tbody>
                </table>
            </div>

        </>

    )
}