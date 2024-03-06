import {useEffect, useState} from "react";
import {getAllTeams} from "../../../../../Services/FrontOffice/apiTeam.js";
import TeamsCard from "./TeamsCard.jsx";
import SectionTitle from "../../../HomePage/components/Common/SectionTitle.jsx";
import {jwtDecode} from "jwt-decode";
import {getUserData} from "../../../../../Services/apiUser.js";


export default function ShowAllTeams() {
    const [teams, setTeams] = useState([]);
    const [user, setUser] = useState([]);
    const [searchData, setSearchData] = useState("");

    useEffect(() => {
        let decodedToken = jwtDecode(localStorage.getItem('token'));
        getUserData(decodedToken.userId).then((response) => {
            setUser(response.user);
        })

        getAllTeams().then((response) => {
            setTeams(response.teams);
        })



    }, [])

    const Search = () => {
    console.log("searching for ", searchData)
    }

    return (
        <>
        {!teams ? <h1>Loading...</h1> :
            <>
                <section id="blog" className="bg-primary/5 py-16 md:py-20 lg:py-28">

                    <div className="container">
                        <SectionTitle
                            title="Disvover All Teams"
                            paragraph="Explore the wide range of teams participating in our tournaments. Get to know their history, achievements, and more."
                            center
                        />


                        <div className="max-w-md mx-auto mb-6">
                            <label htmlFor="default-search"
                                   className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                                         xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                              strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                    </svg>
                                </div>
                                <input type="search" id="default-search"
                                       className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                       value={searchData}
                                       placeholder="Search for your favorite team" required/>
                                <button type="submit"
                                        onClick={Search}
                                        className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search
                                </button>
                            </div>
                        </div>


                        <div
                            className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 md:gap-x-6 lg:gap-x-8 xl:grid-cols-3">
                            {teams.map((team, index) => {
                                return (
                                    <TeamsCard key={index} team={team} user={user}/>
                                )
                            })
                            }
                        </div>
                    </div>
                </section>

            </>
        }
        </>
    )
}