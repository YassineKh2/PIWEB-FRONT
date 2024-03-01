import TournamentCard from './TournamentCards.jsx';
import {MdOutlineUpcoming as Upcoming} from "react-icons/md";
import {TbPlayFootball as Played} from "react-icons/tb";
import {HiMagnifyingGlass as Loop} from "react-icons/hi2";
import {BiFootball as Football} from "react-icons/bi";
import { AiOutlineFieldTime as Active } from "react-icons/ai";


import {useEffect, useState} from "react";
import {getTournaments} from "../../../../../../Services/FrontOffice/apiTeam.js";


export default function TournamentCards() {
    const [tournaments, setTournament] = useState([]);
    const [tournamentsCopy, setTournamentCopy] = useState([]);


    let tournamentsid = ["65de1fe6089d70c73b05e998","65de5ec3e139dc15f87cf29e"]

    useEffect(() => {
        getTournaments(tournamentsid).then((response) => {
            setTournament(response.Tournaments)
            setTournamentCopy(response.Tournaments)
        })
    }, [])


   const upcoming = () => {
    let upcoming = tournamentsCopy.filter((tournament) => {
        const currentDate = new Date();
        const tournamentStartDate = new Date(tournament.startDate);

        return tournamentStartDate.getTime() > currentDate.getTime();
    });

    setTournament(upcoming);
}
    const played = () => {
        let played = tournamentsCopy.filter((tournament) => {
            const currentDate = new Date();
            const tournamentEndDate = new Date(tournament.endDate);

            return tournamentEndDate.getTime() < currentDate.getTime();
        });

        setTournament(played);
    }

    function active() {
        let active = tournamentsCopy.filter((tournament) => {
            const currentDate = new Date();
            const tournamentStartDate = new Date(tournament.startDate);
            const tournamentEndDate = new Date(tournament.endDate);

            return (tournamentStartDate.getTime() <= currentDate.getTime()) && (tournamentEndDate.getTime() >= currentDate.getTime());
        });

        setTournament(active);
    }
    function all(){
        setTournament(tournamentsCopy);
    }

    return (
        <>
            {tournaments ? <h1>Join Tournaments and it will show here </h1> :


            <div className="md:flex">
                <ul className="flex-column  space-y space-y-4 text-sm font-medium text-gray-500 dark:text-gray-400 md:me-4 mb-4 md:mb-0">
                    <li>
                        <button onClick={all}
                           className="gap-1 inline-flex items-center px-4 py-3 text-white bg-blue-700 rounded-lg active w-full dark:bg-blue-600"
                           aria-current="page">
                            <Football size={20}/>
                            All
                        </button>
                    </li>
                    <li>
                        <button onClick={upcoming}
                           className="inline-flex gap-1 items-center px-4 py-3 rounded-lg hover:text-gray-900 bg-gray-50 hover:bg-gray-100 w-full dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white">
                            <Upcoming size={20}/>
                            Upcoming
                        </button>
                    </li>
                    <li>
                        <button onClick={active}
                           className="inline-flex gap-1 items-center px-4 py-3 rounded-lg hover:text-gray-900 bg-gray-50 hover:bg-gray-100 w-full dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white">
                            <Active size={20}/>
                            Active
                        </button>
                    </li>
                    <li>
                        <button onClick={played}
                           className=" gap-1 inline-flex items-center px-4 py-3 rounded-lg hover:text-gray-900 bg-gray-50 hover:bg-gray-100 w-full dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white">
                            <Played size={20}/>
                            Played
                        </button>
                    </li>
                    <li>
                        <a href="#"
                           className=" gap-1 inline-flex items-center px-4 py-3 rounded-lg hover:text-gray-900 bg-gray-50 hover:bg-gray-100 w-full dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white">
                            <Loop size={20}/>
                            Discover
                        </a>
                    </li>
                </ul>


                <div className="flex justify-around flex-col md:flex-row gap-4 flex-wrap">
                    {tournaments.map((tournament, index) => {
                        return (
                            <TournamentCard key={index} prop={tournament}/>
                        )
                    })
                    }

                </div>

                <div className="flex md:fixed md:right-15 mt-4 md:mt-0">

                    <a href="#"
                       className="flex items-center justify-center px-4 h-10 text-base font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                        Previous
                    </a>


                    <a href="#"
                       className="flex items-center justify-center px-4 h-10 ms-3 text-base font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                        Next
                    </a>
                </div>

            </div>
            }
        </>
    )
}