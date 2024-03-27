import {useEffect, useState} from "react";
import {jwtDecode} from "jwt-decode";
import {getUserData} from "../../../../../../Services/apiUser.js";
import {getTeam, getTournaments} from "../../../../../../Services/FrontOffice/apiTeam.js";


export default function StaffStats() {
    const [staff, setstaff] = useState({})
    const [loading, setLoading] = useState(true)
    const [team, setTeam] = useState({});
    const [tournaments, setTournament] = useState({});

    useEffect(() => {
        try {
            if (localStorage.getItem('token') === null)
                return;

            const userToken = localStorage.getItem('token');
            const decodedToken = jwtDecode(userToken);
            getUserData(decodedToken.userId).then((response) => {
                setstaff(response.user)
                if (response.user.PlayingFor) {
                    getTeam(response.user.PlayingFor).then((response) => {
                        setTeam(response.team)
                        getTournaments(response.team.tournaments).then((response) => {
                            setTournament(response.Tournaments)
                        })
                    })
                }
                setLoading(false)
            })
        } catch (e) {
            console.log(e.message)
        }


    }, [])


    return (
        <>
            {loading ?
                <div className="text-center mt-10"><p className="text-2xl font-medium text-slate-600">Loading...</p>
                </div> :

                <>

                    <div className="">
                        <div className="mx-auto grid max-w-screen-lg gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="max-w-md rounded-lg border px-6 pt-6 pb-10">
                                <div
                                    className="inline-block rounded-full border-8 border-emerald-50 bg-emerald-200 p-2 text-emerald-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                                         viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                    </svg>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg"
                                     className="float-right h-6 w-6 text-gray-500"
                                     fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                                </svg>
                                <p className="text-sm font-medium text-gray-500">Wins</p>
                                <p className="text-4xl font-medium text-gray-800">{team.wins}</p>
                                <span
                                    className="float-right rounded-full bg-rose-100 px-1 text-sm font-medium text-rose-600">
        <svg xmlns="http://www.w3.org/2000/svg" className="inline h-4 w-4 pb-0.5" fill="none" viewBox="0 0 24 24"
             stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 13l-5 5m0 0l-5-5m5 5V6"/>
        </svg>
        3%</span
                                >
                            </div>

                            <div className="max-w-md rounded-lg border px-6 pt-6 pb-10">
                                <div
                                    className="inline-block rounded-full border-8 border-emerald-50 bg-emerald-200 p-2 text-emerald-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                                         viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                    </svg>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg"
                                     className="float-right h-6 w-6 text-gray-500"
                                     fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                                </svg>
                                <p className="text-sm font-medium text-gray-500">Draws</p>
                                <p className="text-4xl font-medium text-gray-800">{team.draws}</p>
                                <span
                                    className="float-right rounded-full bg-emerald-100 px-1 text-sm font-medium text-emerald-600">
        <svg xmlns="http://www.w3.org/2000/svg" className="inline h-4 w-4 pb-0.5" fill="none" viewBox="0 0 24 24"
             stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 11l5-5m0 0l5 5m-5-5v12"/>
        </svg>
        23%</span
                                >
                            </div>

                            <div className="max-w-md rounded-lg border px-6 pt-6 pb-10">
                                <div
                                    className="inline-block rounded-full border-8 border-emerald-50 bg-emerald-200 p-2 text-emerald-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                                         viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                    </svg>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg"
                                     className="float-right h-6 w-6 text-gray-500"
                                     fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                                </svg>
                                <p className="text-sm font-medium text-gray-500">Losses</p>
                                <p className="text-4xl font-medium text-gray-800">{team.losses}</p>
                            </div>
                        </div>
                    </div>
                </>
            }
        </>
    )
}