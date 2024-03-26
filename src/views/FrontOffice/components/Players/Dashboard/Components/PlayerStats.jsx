import {useEffect, useState} from "react";
import {jwtDecode} from "jwt-decode";
import {getUserData} from "../../../../../../Services/apiUser.js";
import {IoMdFootball as Ball} from "react-icons/io";
import {TbCardsFilled as Card} from "react-icons/tb";
import { GiStarsStack as Rating } from "react-icons/gi";
import {Link} from "react-router-dom";


export default function PlayerStats() {
    const [player, setplayer] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        try {
            if (localStorage.getItem('token') === null)
                return;

            const userToken = localStorage.getItem('token');
            const decodedToken = jwtDecode(userToken);
            getUserData(decodedToken.userId).then((response) => {
                setplayer(response.user)
                setLoading(false)
            })
        } catch (e) {
            console.log(e.message)
            setLoading(false)
        }


    }, [])


    return (
        <>
            {loading ? <div className="text-center mt-10"> <p className="text-2xl font-medium text-slate-600">Loading...</p></div> :
            <div
                className="text-slate-600  mx-auto grid max-w-2xl grid-cols-2 gap-y-4 px-4 py-1 sm:my-10 sm:rounded-md sm:border sm:shadow-gray-400">
                <div className="col-span-2 col-start-1 flex flex-col justify-between border-b py-3 sm:flex-row">
                    <p className="font-medium text-xl dark:text-gray-200">Overview</p>
                    <select
                        className="text-slate-500 dark:dark:bg-neutral-900 dark:text-white hover:bg-slate-200 rounded-lg border-2 px-4 py-2 font-medium focus:outline-none focus:ring">
                        <option value="last-month" >Last Match</option>
                        <option value="last-month">Last Week</option>
                        <option value="last-month">Last Month</option>
                        <option value="last-month">This Year</option>
                    </select>
                </div>
                <div
                    className="col-span-2 -mx-4 bg-gradient-to-t from-indigo-500 to-blue-500 dark:from-indigo-700 dark:to-blue-600 px-4 py-8 sm:col-span-1 sm:mx-0 sm:rounded-xl sm:py-4">
                    <p className="mb-4 font-medium text-indigo-100">Last Match </p>
                    <div className="mb-6 flex max-w-xs">
                        <div
                            className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-400 sm:mr-3 sm:mb-0">

                            <Rating className="text-gray-400" size={24}/>
                        </div>
                        <div className="px-4">
                            <p className="font-medium text-indigo-100">Your Rating</p>
                            <p className="mb-1 text-2xl font-black text-white">1569</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-between">
                        <div className="flex flex-col items-center px-4 py-1 rounded-2xl bg-white">
                            <p className="text-lg font-medium text-indigo-500">232</p>
                            <p className="text-xs font-medium text-indigo-500">Touches</p>
                        </div>
                        <div className="mb-1 flex flex-col items-center px-4 py-1 sm:mr-1 sm:mb-0">
                            <p className="text-lg font-medium text-white">150</p>
                            <p className="text-xs font-medium text-indigo-100">Passes Made</p>
                        </div>
                        <div className="mb-1 flex flex-col items-center rounded-2xl bg-white px-4 py-1 sm:mr-1 sm:mb-0">
                            <p className="text-lg font-medium text-indigo-500">21</p>
                            <p className="text-xs font-medium text-indigo-500">Shots</p>
                        </div>

                        <div className="mt-1 flex flex-col items-center px-4 py-1 sm:mr-1 sm:mb-0">
                            <p className="text-lg font-medium text-white">7</p>
                            <p className="text-xs font-medium text-indigo-100">Shots on Target</p>
                        </div>
                        <div className="mt-1 flex flex-col items-center px-4 py-1">
                            <p className="text-lg font-medium text-white">23</p>
                            <p className="text-xs font-medium text-indigo-100">Interceptions</p>
                        </div>


                    </div>
                </div>
                <div className="col-span-2 grid grid-cols-2 gap-4 py-4 sm:col-span-1 sm:gap-8 sm:px-4">
                    <div className="">
                        <p className="text-lg font-bold dark:text-gray-200">something</p>
                        <p className="text-slate-400 mb-2 font-medium">876</p>
                        <span
                            className="bg-slate-200 text-slate-600 rounded-full px-2.5 py-1 text-xs font-medium">Drafts</span>
                    </div>
                    <div className="">
                        <p className="text-lg font-bold dark:text-gray-200">Invitations</p>
                        <p className="text-slate-400 mb-2 font-medium">{player.teamInvitations.length}</p>
                        <Link to="/player/invitations" className="rounded-full bg-indigo-200 px-2.5 py-1 text-xs font-medium text-indigo-600">Prending Approval</Link>
                    </div>
                    <div className="">
                        <p className="text-lg font-bold dark:text-gray-200">something</p>
                        <p className="text-slate-400 mb-2 font-medium">54</p>
                        <span className="rounded-full bg-yellow-200 px-2.5 py-1 text-xs font-medium text-yellow-700">Sent to Clients</span>
                    </div>
                    <div className="">
                        <p className="text-lg font-bold dark:text-gray-200">something</p>
                        <p className="text-slate-400 mb-2 font-medium">454</p>
                        <span
                            className="rounded-full bg-green-200 dark:bg-green-700 px-2.5 py-1 text-xs font-medium dark:text-gray-200">Signing</span>
                    </div>
                </div>


                <div
                    className="col-span-2 col-start-1 grid grid-cols-2 gap-6 border-t py-4 sm:grid-cols-4 sm:px-4 sm:py-8">

                        <div className="flex flex-col items-center gap-2">
                            <p className="text-slate-500 text-sm flex items-center dark:text-gray-200 gap-1"><Ball
                                className="text-green-500 "
                                size={18}/> Goals</p>
                            <p className="text-xl font-medium dark:text-gray-400 ">{player.goals}</p>
                        </div>
                        <div className="flex  flex-col items-center gap-2">
                            <p className="text-slate-500 text-sm flex dark:text-gray-200 items-center gap-1 "><Ball
                                className="text-gray-500"
                                size={18}/>Assists</p>
                            <p className="text-xl font-medium flex items-center gap-1 dark:text-gray-400">{player.assists}</p>
                        </div>
                        <div className="flex   flex-col items-center gap-2">
                            <p className="text-slate-500 text-sm flex items-center dark:text-gray-200 gap-1"><Card
                                className="text-yellow-500"
                                size={18}/>Yellow Cards</p>
                            <p className="text-xl font-medium dark:text-gray-400">{player.yellowCards}</p>
                        </div>
                        <div className="flex  flex-col items-center gap-2">
                            <p className="text-slate-500 text-sm flex items-center dark:text-gray-200 gap-1"><Card className="text-red-500"
                                                                                                size={18}/>Red Cards</p>
                            <p className="text-xl font-medium dark:text-gray-400">{player.redCards}</p>
                        </div>

                </div>
            </div>
                }
        </>
    )
}