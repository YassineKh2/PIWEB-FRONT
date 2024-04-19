import {Loader} from "lucide-react";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {getUserData} from "../../../../../Services/apiUser.js";
import {getMatchesByTeam, getTeam, getTeams} from "../../../../../Services/FrontOffice/apiTeam.js";
import {IoMdFootball as Ball} from "react-icons/io";
import {TbCardsFilled as Card} from "react-icons/tb";
import {Link} from "react-router-dom";


export default function ProfilePlayer() {
    const [player, setPlayer] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const {id} = useParams();

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
        "W": "Winger"
    };
    const path = "http://localhost:3000/public/images/players/";
    const pathteam = "http://localhost:3000/public/images/teams/";

    useEffect(() => {
        getUserData(id)
            .then((response) => {
                setPlayer(response.user);
                setLoading(false);
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            });

    }, [id]);

    const [matches, setMatches] = useState([]);


    useEffect(() => {
        try {
            if (!player.PlayingFor)
                return;

            getMatchesByTeam(player.PlayingFor).then(
                (response) => {
                    setMatches(response.matchList);
                }
            )
            getTeam(player.PlayingFor).then(
                (response) => {
                    setTeam(response.team);
                })
        } catch (e) {
            console.log(e.message)
        }

    }, [player])

    useEffect(() => {
        console.log(player.previousTeams)
        try {
            if (player.previousTeams.length === 0)
                return;

            getTeams(player.previousTeams).then(
                (response) => {
                    setpreviousTeams(response);
                })
        } catch (e) {
            console.log(e.message)
        }

    }, [player])
    useEffect(() => {
        console.log("player.previousTeams")



    }, [])



    const [previousTeams, setpreviousTeams] = useState([]);
    const [team, setTeam] = useState([]);


    if (loading) {
        return <Loader/>;
    }

    if (error) {
        return <div>Erreur : {error.message}</div>;
    }

    return (
        <>
            <div className="px-4 py-4 md:py-8">
                <div className="max-w-6xl mx-auto space-y-4">
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm" data-v0-t="card">
                        <div className="flex justify-between gap-2 p-10">
                            <div>

                                <div className="w-24 h-24 relative rounded-full overflow-hidden">
                                    <img
                                        src={path + player?.image}
                                        alt="Player Image"
                                        width="100"
                                        height="100"
                                        className="rounded-full"

                                    />
                                </div>
                                <div className="text-2xl font-bold tracking-tight">
                                    <span>{player?.firstName} {player?.lastName}</span>
                                </div>
                                <div className="text-sm font-medium tracking-tighter opacity-60">
                                    <span>{positionMapping[player?.position]}</span>
                                </div>
                            </div>

                            <div className="flex flex-col justify-center items-center">
                                <div className="w-24 h-24 relative rounded-full overflow-hidden">
                                    <img
                                        src={pathteam + team?.image}
                                        alt="Team Image"
                                        width="100"
                                        height="100"
                                        className="rounded-full"

                                    />
                                </div>
                                <div className="text-2xl font-bold tracking-tight">
                                    <span>{team?.name}</span>
                                </div>
                                <div className="text-sm font-medium tracking-tighter opacity-60">
                                    <span>{team?.wins}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm" data-v0-t="card">
                        <div className="flex flex-col space-y-1.5 p-6">
                            <h2 className="text-lg font-medium">Bio</h2>
                        </div>
                        <div className="p-6">
                            <p className="text-sm opacity-60">
                                {player?.bio}
                            </p>
                        </div>
                    </div>
                    <div className="grid gap-4 md:gap-8">
                        <div className="rounded-lg border bg-card text-card-foreground shadow-sm" data-v0-t="card">
                            <div className="flex justify-between space-y-1.5 p-6">
                                <h2 className="text-lg font-medium">Statistics</h2>
                                <div className="flex gap-3">
                                    <div className="flex flex-col items-center">
                                        <Ball className="text-green-500" size={20}/>
                                        <p>{player?.goals}</p>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <Ball className="text-gray-500" size={20}/>
                                        <p>{player?.assists}</p>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <Card className="text-yellow-500" size={20}/>
                                        <p>{player?.yellowCards}</p>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <Card className="text-red-500" size={20}/>
                                        <p>{player?.redCards}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-0">
                                <div className="overflow-auto">
                                    <table className="min-w-full w-full">
                                        <thead>
                                        <tr className="border-t border-gray-200 dark:border-gray-800">
                                            <th className="px-4 py-2 text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                                Match
                                            </th>
                                            <th className="px-4 py-2 text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                                Goals
                                            </th>
                                            <th className="px-4 py-2 text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                                Assists
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {matches.map((match, index) => {

                                            let goals = 0;
                                            let assists = 0;

                                            if (match?.team1?._id === player?.PlayingFor) {
                                                match.goalsScoredByTeam1.map((goal) => {
                                                    if (goal?.scorer === player?._id) {
                                                        goals++
                                                    }
                                                })
                                            }
                                            if (match?.team2?._id === player?.PlayingFor) {
                                                match.goalsScoredByTeam2.map((goal) => {
                                                    if (goal?.scorer === player?._id) {
                                                        goals++
                                                    }
                                                })
                                            }

                                            if (match?.team1?._id === player?.PlayingFor) {
                                                match.goalsScoredByTeam1.map((goal) => {
                                                    if (goal?.assistedBy === player?._id) {
                                                        assists++
                                                    }
                                                })
                                            }
                                            if (match?.team2?._id === player?.PlayingFor) {
                                                match.goalsScoredByTeam2.map((goal) => {
                                                    if (goal?.assistedBy === player?._id) {
                                                        assists++
                                                    }
                                                })
                                            }

                                            return (
                                                <>
                                                    <tr key={index}
                                                        className="divide-x divide-gray-200 dark:divide-gray-800">
                                                        <td className="px-4 py-3 text-sm">{match?.team1?.name} Vs {match?.team2?.name}</td>

                                                        <td className="px-4 py-3 text-sm">{goals}</td>
                                                        <td className="px-4 py-3 text-sm">{assists}</td>
                                                    </tr>

                                                </>
                                            )
                                        })}

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-lg border bg-card text-card-foreground shadow-sm" data-v0-t="card">
                            <div className="flex flex-col space-y-1.5 p-6">
                                <h2 className="text-lg font-medium">Played For</h2>
                            </div>
                            <div className="p-6">
                                <ul className="grid gap-4 sm:grid-cols-2">
                                    {previousTeams.map((team, index) => (
                                        <>
                                            <Link to={"/team/profile/"+team?._id}>
                                                <li className="flex items-center space-x-4" key={index}>
                                                    <img
                                                        src={pathteam + team?.image}
                                                        alt={"team Image"}
                                                        className="rounded w-2/12"
                                                    />
                                                    <span
                                                        className="text-sm font-medium tracking-tight">{team?.name}</span>
                                                </li>
                                            </Link>
                                        </>
                                    ))}

                                </ul>
                            </div>
                        </div>


                        <div className="rounded-lg border bg-card text-card-foreground shadow-sm" data-v0-t="card">
                            <div className="flex flex-col space-y-1.5 p-6">
                                <h2 className="text-lg font-medium">Achievements</h2>
                            </div>
                            <div className="p-6">
                                <ul className="grid gap-4 sm:grid-cols-2">
                                    <li className="flex items-center space-x-4">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="w-4 h-4"
                                        >
                                            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                                            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                                            <path d="M4 22h16"></path>
                                            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                                            <path
                                                d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                                            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                                        </svg>
                                        <span
                                            className="text-sm font-medium tracking-tight">Premier League Champion</span>
                                    </li>
                                    <li className="flex items-center space-x-4">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="w-4 h-4"
                                        >
                                            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                                            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                                            <path d="M4 22h16"></path>
                                            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                                            <path
                                                d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                                            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                                        </svg>
                                        <span className="text-sm font-medium tracking-tight">FA Cup Winner</span>
                                    </li>
                                    <li className="flex items-center space-x-4">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="w-4 h-4"
                                        >
                                            <path
                                                d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15"></path>
                                            <path d="M11 12 5.12 2.2"></path>
                                            <path d="m13 12 5.88-9.8"></path>
                                            <path d="M8 7h8"></path>
                                            <circle cx="12" cy="17" r="5"></circle>
                                            <path d="M12 18v-2h-.5"></path>
                                        </svg>
                                        <span className="text-sm font-medium tracking-tight">PFA Young Player of the Year</span>
                                    </li>
                                    <li className="flex items-center space-x-4">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="w-4 h-4"
                                        >
                                            <path
                                                d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15"></path>
                                            <path d="M11 12 5.12 2.2"></path>
                                            <path d="m13 12 5.88-9.8"></path>
                                            <path d="M8 7h8"></path>
                                            <circle cx="12" cy="17" r="5"></circle>
                                            <path d="M12 18v-2h-.5"></path>
                                        </svg>
                                        <span className="text-sm font-medium tracking-tight">Golden Boot Winner</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}