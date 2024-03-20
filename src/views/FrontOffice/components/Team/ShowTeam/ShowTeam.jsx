import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {getMatchesByTeam, getTeam} from "../../../../../Services/FrontOffice/apiTeam.js";
import {getTopPlayers} from "../../../../../Services/apiUser.js";
import { FaTrophy  as Trophy} from "react-icons/fa";

export default function ShowTeam() {
    const path = "http://localhost:3000/public/images/teams/";
    const pathPlayer = "http://localhost:3000/public/images/players/";
    const [team, setTeam] = useState({});
    const {id} = useParams();
    const [matches, setMatches] = useState([])
    const [trophies, setTrophies] = useState([])


    useEffect(() => {
        getTeam(id).then((response) => {
            setTeam(response.team)
            setTrophies(response.team.trophies)
        })
        getMatchesByTeam(id).then((response) => {
            setMatches(response.matchList)
        });
    }, [])

    const [players, setPlayers] = useState([]);

    useEffect(() => {
        try {
            if(!team) return;

            getTopPlayers(team._id).then((response) => {
                setPlayers(response);
            });
        } catch (error) {
            console.error(error);
        }
    }, [team]);

    function transformDate(date) {
        const dateObj = new Date(date);
        const options = {year: 'numeric', month: 'long', day: 'numeric'};
        return dateObj.toLocaleDateString('en-US', options);
    }


    return (
        <div className="w-full py-6 space-y-6 md:py-12 bg-primary/5">
            <div className="container grid max-w-6xl gap-6 px-4 md:px-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">{team.name}</h1>
                    <p className="text-gray-500 dark:text-gray-400">{team?.slogan}</p>
                </div>
                <div className="grid items-start gap-6 lg:grid-cols-[200px,1fr] xl:gap-10">
                    <div className="flex items-start gap-4">
                        <img
                            alt="Team logo"
                            className="rounded-lg  overflow-hidden  object-center w-2/5 md:w-full"
                            src={path + team.image}
                        />
                    </div>
                    <div className="grid gap-4">
                        <div className="grid gap-1">
                            <h2 className="text-2xl font-bold">About</h2>
                            <p className="text-gray-500 md:max-w-prose dark:text-gray-400 w-5/6">
                                {team?.description}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-6">
                    <div>
                        <div className="grid gap-1">
                            <h2 className="text-2xl font-bold">Top Players</h2>
                            <div className="grid gap-4 md:grid-cols-2">
                                {players?.map((player, index) => (
                                    <>
                                        <Link to={'/player/profile/'+player._id} key={index} className="flex items-center gap-4">
                                            <img
                                                alt="Player"
                                                className="rounded-full object-cover object-center"
                                                height="80"
                                                src={pathPlayer + player.image}
                                                style={{
                                                    aspectRatio: "80/80",
                                                    objectFit: "cover",
                                                }}
                                                width="80"
                                            />
                                            <div className="grid gap-1.5">
                                                <h3 className="font-bold">{player.firstName} {player.lastName}</h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{player.position}</p>
                                            </div>
                                        </Link>
                                    </>
                                ))}
                            </div>
                            {/*<Link to="">*/}
                            {/*    <p className="text-white text-center bg-blue-400 rounded-2xl p-2 text-xs w-1/6">See More</p>*/}
                            {/*</Link>*/}
                        </div>
                    </div>
                    <div>
                        <div className="flex flex-col gap-6">
                            <h2 className="text-2xl font-bold">Achievements</h2>
                            <div className="flex flex-col gap-4">
                                {trophies.map((trophy, index) => (
                                    <>
                                        <div className="flex items-center gap-2" key={index}>
                                            <Trophy size={18} className="text-yellow-500"/>
                                            <p> {trophy}</p>
                                        </div>
                                    </>
                                ))}

                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="flex flex-col gap-6">
                            <h2 className="text-2xl font-bold">Upcoming Matches</h2>
                            <div className="flex flex-col  gap-4">
                                {matches.map((match, index) => (
                                        <>
                                            <Link to="" key={index}
                                                  className="flex flex-col md:flex-row  items-center gap-4 p-3 md:gap-10 text-base font-bold text-gray-900 rounded-lg bg-white hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                                                <span className="flex-1 ms-3 whitespace-nowrap">{match.team1.name}
                                                    <text className="text-xl">&nbsp;vs{' '}&nbsp;</text>
                                                    {match.team2.name}</span>
                                                <p className="text-center text-white bg-blue-400 rounded-2xl p-2 text-xs">{transformDate(match.matchDate)}</p>
                                            </Link>
                                        </>
                                    )
                                )}


                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="flex flex-col gap-6">
                            <h2 className="text-2xl font-bold">Recent Matches</h2>
                            <div className="flex flex-col gap-4">
                                {matches.map((match, index) => {
                                    if (match.team1._id === team._id) {
                                        let currentTeam = match.team1;
                                        let enemyTeam = match.team2;
                                    } else {
                                        let currentTeam = match.team2;
                                        let enemyTeam = match.team1;
                                    }

                                    let linkStyle = "flex w-[95%] md:w-full flex-col md:flex-row items-center gap-2 p-3 md:gap-10 text-base font-bold text-gray-900 rounded-lg  group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
                                    if (match.scoreTeam1 === 0 || match.scoreTeam2 === 0)
                                        linkStyle += " bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600";
                                    else if (match.team1._id === team._id && match.scoreTeam1 > match.scoreTeam2)
                                        linkStyle += " bg-[#339900]  hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-500";
                                    else if (match.team2._id === team._id && match.scoreTeam1 < match.scoreTeam2)
                                        linkStyle += " bg-[#339900] hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-500";
                                    else
                                        linkStyle += " bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-400";

                                    return (
                                        <Link to="" key={index} className={linkStyle}>
                                                <span className="flex-1 md:flex-row ms-3 whitespace-nowrap">{match.team1.name}
                                                    <text
                                                        className="">&nbsp;{match.scoreTeam1} - {match.scoreTeam2}{' '}&nbsp;</text>
                                                    {match.team2.name}</span>
                                            <p className="text-center text-white bg-cyan-500 rounded-2xl p-2 text-xs">{match.tournament.name}</p>
                                        </Link>
                                    )
                                })}


                            </div>
                        </div>
                    </div>

                </div>
                <div className="grid gap-1">
                    <h2 className="text-2xl font-bold">Gallery</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        <img
                            alt="Photo"
                            className="rounded-lg object-cover aspect-video overflow-hidden object-center"
                            height="300"
                            src="/placeholder.svg"
                            width="500"
                        />
                        <img
                            alt="Photo"
                            className="rounded-lg object-cover aspect-video overflow-hidden object-center"
                            height="300"
                            src="/placeholder.svg"
                            width="500"
                        />
                        <img
                            alt="Photo"
                            className="rounded-lg object-cover aspect-video overflow-hidden object-center"
                            height="300"
                            src="/placeholder.svg"
                            width="500"
                        />
                        <img
                            alt="Photo"
                            className="rounded-lg object-cover aspect-video overflow-hidden object-center"
                            height="300"
                            src="/placeholder.svg"
                            width="500"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

