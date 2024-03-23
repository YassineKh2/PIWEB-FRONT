import {useEffect, useState} from "react";
import {jwtDecode} from "jwt-decode";
import {declineTeamRequest, getUserData, updatePlayersCurrentTeam} from "../../../../../../Services/apiUser.js";
import {getTeam} from "../../../../../../Services/FrontOffice/apiTeam.js";


export default function Invitations() {

    const path = "http://localhost:3000/public/images/teams"
    const [staff, setstaff] = useState({});
    const [teams, setTeams] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showAcceptModal, setshowAcceptModal] = useState(false);
    const [showAcceptConfirm, setshowAcceptConfirm] = useState(false);


    useEffect(() => {
        try {
            if (localStorage.getItem('token') === null)
                return;

            const userToken = localStorage.getItem('token');
            const decodedToken = jwtDecode(userToken);
            let Teams = [];
            getUserData(decodedToken.userId).then((response) => {
                setstaff(response.user)
                setTeams(response.user.teamInvitations)

                response.user.teamInvitations.map((teamInvitation) => {
                    getTeam(teamInvitation.team).then((response) => {
                        Teams.push({
                            team: response.team.name,
                            idTeam: response.team._id,
                            state: teamInvitation.state,
                            date: teamInvitation.date
                        })
                        setTeams(Teams)
                    })
                })

            })


        } catch (e) {
            console.log(e.message)
        }


    }, [])


    function acceptTeam(team) {
        if (staff.PlayingFor) {
            setshowAcceptModal(true)
            return;
        }

        let updatedStaff = staff;


        updatedStaff.PlayingFor = team.idTeam
        updatedStaff.previousTeam = staff.PlayingFor

        const index = teams.findIndex(t => t.team === team.team);
        if (index !== -1) {
            teams.splice(index, 1);
        }
        updatePlayersCurrentTeam(updatedStaff).then((response) => {
            console.log(response)
            setTeams([...teams]);
        })


    }

    function declineTeam(team) {
        const index = teams.findIndex(t => t.team === team.team);
        if (index !== -1) {
            teams.splice(index, 1);
            setTeams([...teams]);
        }
        let data = {
            staff: staff._id,
            team: team.idTeam
        }
        declineTeamRequest(data).then((response) => {
            console.log(response)
        })
    }


    function transformDate(date) {
        const dateObj = new Date(date);
        const options = {year: 'numeric', month: 'long', day: 'numeric'};
        return dateObj.toLocaleDateString('en-US', options);
    }

    return (
        <>

            {teams && teams.length === 0 ?
                <div className="flex flex-col items-center gap-4">
                    <h1 className="text-2xl text-semibold ">You will find your invitations here </h1>
                    <svg className="w-3/6" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1"
                         viewBox="0 0 647.63626 632.17383" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <path
                            d="M687.3279,276.08691H512.81813a15.01828,15.01828,0,0,0-15,15v387.85l-2,.61005-42.81006,13.11a8.00676,8.00676,0,0,1-9.98974-5.31L315.678,271.39691a8.00313,8.00313,0,0,1,5.31006-9.99l65.97022-20.2,191.25-58.54,65.96972-20.2a7.98927,7.98927,0,0,1,9.99024,5.3l32.5498,106.32Z"
                            transform="translate(-276.18187 -133.91309)" fill="#f2f2f2"/>
                        <path
                            d="M725.408,274.08691l-39.23-128.14a16.99368,16.99368,0,0,0-21.23-11.28l-92.75,28.39L380.95827,221.60693l-92.75,28.4a17.0152,17.0152,0,0,0-11.28028,21.23l134.08008,437.93a17.02661,17.02661,0,0,0,16.26026,12.03,16.78926,16.78926,0,0,0,4.96972-.75l63.58008-19.46,2-.62v-2.09l-2,.61-64.16992,19.65a15.01489,15.01489,0,0,1-18.73-9.95l-134.06983-437.94a14.97935,14.97935,0,0,1,9.94971-18.73l92.75-28.4,191.24024-58.54,92.75-28.4a15.15551,15.15551,0,0,1,4.40966-.66,15.01461,15.01461,0,0,1,14.32032,10.61l39.0498,127.56.62012,2h2.08008Z"
                            transform="translate(-276.18187 -133.91309)" fill="#3f3d56"/>
                        <path
                            d="M398.86279,261.73389a9.0157,9.0157,0,0,1-8.61133-6.3667l-12.88037-42.07178a8.99884,8.99884,0,0,1,5.9712-11.24023l175.939-53.86377a9.00867,9.00867,0,0,1,11.24072,5.9707l12.88037,42.07227a9.01029,9.01029,0,0,1-5.9707,11.24072L401.49219,261.33887A8.976,8.976,0,0,1,398.86279,261.73389Z"
                            transform="translate(-276.18187 -133.91309)" fill="#5c6cac"/>
                        <circle cx="190.15351" cy="24.95465" r="20" fill="#5c6cac"/>
                        <circle cx="190.15351" cy="24.95465" r="12.66462" fill="#fff"/>
                        <path
                            d="M878.81836,716.08691h-338a8.50981,8.50981,0,0,1-8.5-8.5v-405a8.50951,8.50951,0,0,1,8.5-8.5h338a8.50982,8.50982,0,0,1,8.5,8.5v405A8.51013,8.51013,0,0,1,878.81836,716.08691Z"
                            transform="translate(-276.18187 -133.91309)" fill="#e6e6e6"/>
                        <path
                            d="M723.31813,274.08691h-210.5a17.02411,17.02411,0,0,0-17,17v407.8l2-.61v-407.19a15.01828,15.01828,0,0,1,15-15H723.93825Zm183.5,0h-394a17.02411,17.02411,0,0,0-17,17v458a17.0241,17.0241,0,0,0,17,17h394a17.0241,17.0241,0,0,0,17-17v-458A17.02411,17.02411,0,0,0,906.81813,274.08691Zm15,475a15.01828,15.01828,0,0,1-15,15h-394a15.01828,15.01828,0,0,1-15-15v-458a15.01828,15.01828,0,0,1,15-15h394a15.01828,15.01828,0,0,1,15,15Z"
                            transform="translate(-276.18187 -133.91309)" fill="#3f3d56"/>
                        <path
                            d="M801.81836,318.08691h-184a9.01015,9.01015,0,0,1-9-9v-44a9.01016,9.01016,0,0,1,9-9h184a9.01016,9.01016,0,0,1,9,9v44A9.01015,9.01015,0,0,1,801.81836,318.08691Z"
                            transform="translate(-276.18187 -133.91309)" fill="#5c6cac"/>
                        <circle cx="433.63626" cy="105.17383" r="20" fill="#5c6cac"/>
                        <circle cx="433.63626" cy="105.17383" r="12.18187" fill="#fff"/>
                    </svg>
                </div>
                :
                <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead
                            className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Team
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Invitation Date
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Status
                            </th>

                        </tr>
                        </thead>
                        <tbody>
                        {teams.map((team, index) => (
                                <>
                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={index}>
                                        <th scope="row"
                                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {team.team}
                                        </th>
                                        <th scope="row"
                                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {transformDate(team.date)}
                                        </th>
                                        <td className="px-6 py-4 flex items-center justify-between">
                                            <p>{team.state}</p>
                                            <div>
                                                <button type="button"
                                                        onClick={() => setshowAcceptConfirm(true)}
                                                        className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Accept
                                                </button>
                                                {showAcceptConfirm ? (
                                                    <>
                                                        <div
                                                            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                                                        >
                                                            <div className="relative w-auto my-6 mx-auto max-w-sm">
                                                                {/*content*/}
                                                                <div
                                                                    className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                                                    {/*header*/}
                                                                    <div
                                                                        className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                                                                        <h3 className="text-3xl font-semibold">
                                                                            Accept Invitation
                                                                        </h3>
                                                                        <button
                                                                            className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                                                            onClick={() => setshowAcceptConfirm(false)}
                                                                        >
                                                                         <span
                                                                             className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                                                            ×
                                                                             </span>
                                                                        </button>
                                                                    </div>
                                                                    {/*body*/}
                                                                    <div className="relative p-6 flex-auto">
                                                                        <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                                                                            You're going
                                                                            to <strong> Accept </strong> team's <strong>{team.team} </strong>
                                                                            invitation are
                                                                            you
                                                                            sure?
                                                                        </p>
                                                                    </div>
                                                                    {/*footer*/}
                                                                    <div
                                                                        className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                                                                        <button
                                                                            className="text-gray-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                                            type="button"
                                                                            onClick={() => setshowAcceptConfirm(false)}
                                                                        >
                                                                            Close
                                                                        </button>
                                                                        <button
                                                                            className="bg-emerald-700 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                                            type="button"
                                                                            onClick={() => {
                                                                                setshowAcceptConfirm(false)
                                                                                acceptTeam(team)
                                                                            }}
                                                                        >
                                                                                Accept
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                                                    </>
                                                ) : null}

                                                {showAcceptModal ? (
                                                    <>
                                                        <div
                                                            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                                                        >
                                                            <div className="relative w-auto my-6 mx-auto max-w-sm">
                                                                {/*content*/}
                                                                <div
                                                                    className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                                                    {/*header*/}
                                                                    <div
                                                                        className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                                                                        <h3 className="text-3xl font-semibold">
                                                                            Accept Invitation
                                                                        </h3>
                                                                        <button
                                                                            className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                                                            onClick={() => setshowAcceptModal(false)}
                                                                        >
                    <span
                        className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                                                                        </button>
                                                                    </div>
                                                                    {/*body*/}
                                                                    <div className="relative p-6 flex-auto">
                                                                        <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                                                                          You're already part of a team
                                                                        </p>
                                                                    </div>
                                                                    {/*footer*/}
                                                                    <div
                                                                        className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                                                                        <button
                                                                            className="text-gray-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                                            type="button"
                                                                            onClick={() => setshowAcceptModal(false)}
                                                                        >
                                                                            Close
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                                                    </>
                                                ) : null}


                                                <button type="button"
                                                        onClick={() => setShowModal(true)}
                                                        className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Decline
                                                </button>
                                                {showModal ? (
                                                    <>
                                                        <div
                                                            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                                                        >
                                                            <div className="relative w-auto my-6 mx-auto max-w-sm">
                                                                {/*content*/}
                                                                <div
                                                                    className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                                                    {/*header*/}
                                                                    <div
                                                                        className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                                                                        <h3 className="text-3xl font-semibold">
                                                                            Decline Invitation
                                                                        </h3>
                                                                        <button
                                                                            className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                                                            onClick={() => setShowModal(false)}
                                                                        >
                    <span
                        className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                                                                        </button>
                                                                    </div>
                                                                    {/*body*/}
                                                                    <div className="relative p-6 flex-auto">
                                                                        <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                                                                            You're going to decline the invitation
                                                                            from <strong>{team.team} </strong>team, are you
                                                                            sure?
                                                                        </p>
                                                                    </div>
                                                                    {/*footer*/}
                                                                    <div
                                                                        className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                                                                        <button
                                                                            className="text-gray-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                                            type="button"
                                                                            onClick={() => setShowModal(false)}
                                                                        >
                                                                            Close
                                                                        </button>
                                                                        <button
                                                                            className="bg-red-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                                            type="button"
                                                                            onClick={() => {
                                                                                setShowModal(false)
                                                                                declineTeam(team)
                                                                            }}
                                                                        >
                                                                            Delete
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                                                    </>
                                                ) : null}

                                            </div>
                                        </td>
                                    </tr>
                                </>
                            )
                        )}


                        </tbody>
                    </table>
                </div>
            }
        </>
    )
}