import SoccerLineUp from 'react-soccer-lineup'
import {useEffect, useState} from "react";
import {Dropdown} from "primereact/dropdown";
import {MultiSelect} from "primereact/multiselect";
import {jwtDecode} from "jwt-decode";
import {getplayersbyteam, getUserData} from "../../../../../../Services/apiUser.js";
import {getTeam, updateLineup} from "../../../../../../Services/FrontOffice/apiTeam.js";

export default function LineUps() {

    const path = "http://localhost:3000/public/images/players/";

    // Team Manager , Team and Players Data
    const [teamManager, setTeamManager] = useState({})
    const [team, setTeam] = useState({})
    const [players, setPlayers] = useState([]);

    // --------Toast Message--------
    const [Toast, setToast] = useState(false)
    const [ErrorToast, setErrorToast] = useState(false)
    const [ToastMessage, setToastMessage] = useState('')
    // --------Toast Message--------

    // --------Selected Players--------
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [selectedGoalKeeper, setSelectedGoalKeeper] = useState([]);
    const [selectedDefenders, setSelectedDefenders] = useState([]);
    const [selectedCentralDefensiveMidfielders, setSelectedCentralDefensiveMidfielders] = useState([]);
    const [selectedMidfielders, setSelectedMidfielders] = useState([]);
    const [selectedCentralAttackingMidfielders, setSelectedCentralAttackingMidfielders] = useState([]);
    const [selectedAttackers, setSelectedAttackers] = useState([]);
    const [selectedSubstitutes, setSelectedSubstitutes] = useState([]);
    // --------Selected Players--------

    // --------Player List--------
    const [goalKeeper, setGoalKeeper] = useState([]);
    const [defenders, setDefenders] = useState([]);
    const [centralDefensiveMidfielders, setCentralDefensiveMidfielders] = useState([]);
    const [midfielders, setMidfielders] = useState([]);
    const [centralAttackingMidfielders, setCentralAttackingMidfielders] = useState([]);
    const [attackers, setAttackers] = useState([]);
    const [substitutes, setSubstitutes] = useState([]);
    const [availableSubstitutes, setAvailableSubstitutes] = useState([]);

    // --------Player List--------

    // --------Field Related States--------

    const [Squad, setSquad] = useState({
        gk: null,
        df: [],
        cdm: [],
        cm: [],
        cam: [],
        fw: [],
    })
    const [teamXL, setTeamXL] = useState({
        squad: Squad
    })


    // --------Field Related States--------

    useEffect(() => {
        try {
            if (localStorage.getItem('token') === null)
                return;

            const userToken = localStorage.getItem('token');
            const decodedToken = jwtDecode(userToken);
            getUserData(decodedToken.userId).then((response) => {
                setTeamManager(response.user)
                getplayersbyteam(response.user.PlayingFor).then((response) => {
                    setPlayers(response)
                })
                getTeam(response.user.PlayingFor).then((response) => {
                    setTeam(response.team)


                })
            })
        } catch (e) {
            console.log(e.message)
        }


    }, [])

    function getExistingLineup(){
        let goalkeeper = {}
        let defenders = []
        let centralDefensiveMidfielders = []
        let midfielders = []
        let centralAttackingMidfielders = []
        let attackers = []

        team.currentLineup.map((player) => {

            if (player.position === "GK") {
                goalkeeper = player
            } else if (player.position === "CB" || player.position === "CF" || player.position === "CM" || player.position === "D" || player.position === "FB") {
                defenders = [...defenders, player]
            } else if (player.position === "DM") {
                centralDefensiveMidfielders = [...centralDefensiveMidfielders, player]
            } else if (player.position === "M" || player.position === "LM" || player.position === "RM") {
                midfielders = [...midfielders, player]
            } else if (player.position === "AM") {
                centralAttackingMidfielders = [...centralAttackingMidfielders, player]
            } else if (player.position === "F" || player.position === "S" || player.position === "WB" || player.position === "SS" || player.position === "S" || player.position === "W") {
                attackers = [...attackers, player]
            }
        })
        setSelectedDefenders(defenders)
        setSelectedGoalKeeper(goalkeeper)
        setSelectedCentralDefensiveMidfielders(centralDefensiveMidfielders)
        setSelectedMidfielders(midfielders)
        setSelectedCentralAttackingMidfielders(centralAttackingMidfielders)
        setSelectedAttackers(attackers)

        setSelectedPlayers([goalkeeper, ...defenders, ...centralDefensiveMidfielders, ...midfielders, ...centralAttackingMidfielders, ...attackers])
       let CurrentSquad = {
            gk: goalkeeper,
            df: defenders,
            cdm: centralDefensiveMidfielders,
            cm: midfielders,
            cam: centralAttackingMidfielders,
            fw: attackers,
        }
        setSquad(CurrentSquad)
        setTeamXL({
                squad: CurrentSquad
            }
        )
    }

    // useEffect(() => {
    //     if (team.currentLineup) {
    //         getExistingLineup()
    //     }
    // }, [team])


    useEffect(() => {
        if (players.length > 0) {
            let playerList = players.map((player) => {
                return {
                    name: player.firstName + " " + player.lastName,
                    position: player.position,
                    number: 10,
                    image: player.image,
                    id: player._id,
                    color: "#e58213",
                    onClick: () => {
                        logMessage(player)
                    }
                }
            })
            let gk = []
            let df = []
            let cdm = []
            let cm = []
            let cam = []
            let fw = []
            playerList.map((player) => {
                if (player.position === "GK") {
                    gk.push(player)
                } else if (player.position === "CB" || player.position === "CF" || player.position === "CM" || player.position === "D" || player.position === "FB") {
                    df.push(player)
                } else if (player.position === "DM") {
                    cdm.push(player)
                } else if (player.position === "M" || player.position === "LM" || player.position === "RM") {
                    cm.push(player)
                } else if (player.position === "AM") {
                    cam.push(player)
                } else if (player.position === "F" || player.position === "S" || player.position === "WB" || player.position === "SS" || player.position === "S" || player.position === "W") {
                    fw.push(player)
                }
            })

            setGoalKeeper(gk)
            setDefenders(df)
            setCentralDefensiveMidfielders(cdm)
            setMidfielders(cm)
            setCentralAttackingMidfielders(cam)
            setAttackers(fw)
            setSubstitutes(playerList)
            setAvailableSubstitutes(playerList)
        }
        if (team.currentLineup) {
            getExistingLineup()
        }
    }, [players])


    const logMessage = (player) => {
        console.log(player)
        console.log("This is a message from LineUps component and" + player.firstName + " is clicked")
    }


    const PlayerTemplate = (option) => {
        return (
            <div className="flex gap-4 justify-between">
                <img alt={option.name + ' image'}
                     src={path + option.image}
                     className={`ml-4 rounded-3xl player player-${option.id.toLowerCase()}`}
                     style={{width: '50px', height: '50px'}}/>
                <div className="self-center text-semibold text-md">{option.name}</div>
            </div>
        );
    };


    const DefenderspanelFooterTemplate = () => {
        const length = selectedDefenders ? selectedDefenders.length : 0;

        return (
            <div className="py-2 px-3">
                <b>{length}</b> Player{length > 1 ? 's' : ''} selected. (max 5)
            </div>
        );
    };
    const CentralDefensiveMidfieldersspanelFooterTemplate = () => {
        const length = selectedCentralDefensiveMidfielders ? selectedCentralDefensiveMidfielders.length : 0;

        return (
            <div className="py-2 px-3">
                <b>{length}</b> Player{length > 1 ? 's' : ''} selected. (max 5)
            </div>
        );
    };
    const CentralAttackingMidfieldersspanelFooterTemplate = () => {
        const length = selectedCentralAttackingMidfielders ? selectedCentralAttackingMidfielders.length : 0;

        return (
            <div className="py-2 px-3">
                <b>{length}</b> Player{length > 1 ? 's' : ''} selected. (max 5)
            </div>
        );
    };
    const MidfielderspanelFooterTemplate = () => {
        const length = selectedMidfielders ? selectedMidfielders.length : 0;

        return (
            <div className="py-2 px-3">
                <b>{length}</b> Player{length > 1 ? 's' : ''} selected. (max 5)
            </div>
        );
    };
    const AttackerspanelFooterTemplate = () => {
        const length = selectedAttackers ? selectedAttackers.length : 0;

        return (
            <div className="py-2 px-3">
                <b>{length}</b> Player{length > 1 ? 's' : ''} selected. (max 5)
            </div>
        );
    };


    const SubstitutespanelFooterTemplate = () => {
        const length = selectedSubstitutes ? selectedSubstitutes.length : 0;

        return (
            <div className="py-2 px-3">
                <b>{length}</b> Substitute{length > 1 ? 's' : ''} selected. (max 12)
            </div>
        );
    };


    function changeDefenders(e) {
        setSelectedDefenders(e.value)

        let newsquad = {
            ...Squad,
            df: e.value
        }
        setSquad(newsquad)
        setTeamXL({
            squad: newsquad
        })

    }

    function changeGoalKeeper(e) {
        setSelectedGoalKeeper(e.value)

        let newsquad = {
            ...Squad,
            gk: e.value
        }
        setSquad(newsquad)
        setTeamXL({
            squad: newsquad
        })
    }

    function changeMidfielders(e) {
        setSelectedMidfielders(e.value)
        let newsquad = {
            ...Squad,
            cm: e.value
        }
        setSquad(newsquad)
        setTeamXL({
            squad: newsquad
        })
    }

    function changeAttackers(e) {
        setSelectedAttackers(e.value)

        let newsquad = {
            ...Squad,
            fw: e.value
        }
        setSquad(newsquad)
        setTeamXL({
            squad: newsquad
        })
    }

    function changeCentralDefensiveMidfielders(e) {
        setSelectedCentralDefensiveMidfielders(e.value)

        let newsquad = {
            ...Squad,
            cdm: e.value
        }
        setSquad(newsquad)
        setTeamXL({
            squad: newsquad
        })
    }

    function changeCentralAttackingMidfielders(e) {
        setSelectedCentralAttackingMidfielders(e.value)

        let newsquad = {
            ...Squad,
            cam: e.value
        }
        setSquad(newsquad)
        setTeamXL({
            squad: newsquad
        })
    }

    function resetLineup() {
        setSelectedGoalKeeper([])
        setSelectedDefenders([])
        setSelectedCentralDefensiveMidfielders([])
        setSelectedMidfielders([])
        setSelectedCentralAttackingMidfielders([])
        setSelectedAttackers([])
        setSelectedSubstitutes([])
        setTeamXL({
            squad: {
                gk: null,
                df: [],
                cdm: [],
                cm: [],
                cam: [],
                fw: [],
            }
        })
        setSquad({
            gk: null,
            df: [],
            cdm: [],
            cm: [],
            cam: [],
            fw: [],
        })
        setToast(true)
        setSelectedPlayers([])
        setToastMessage("Lineup Reset Successfully")
        setTimeout(() => {
            setToast(false)
        }, 3000)
    }

    function saveLineup() {
        if (selectedPlayers.length !== 11) {
            let selectedNumber = selectedPlayers.length
            setErrorToast(true)
            setToastMessage("Please select 11 players currently " + selectedNumber + " are selected")
            setTimeout(() => {
                setErrorToast(false)
            }, 3000)
            return;
        }
        if (selectedSubstitutes.length > 12) {
            setErrorToast(true)
            setToastMessage("Please select no more than 12 substitutes currently " + selectedSubstitutes.length + " are selected")
            setTimeout(() => {
                setErrorToast(false)
            }, 3000)
            return;
        }

        let data = {
            lineup: selectedPlayers,
            substitutes: selectedSubstitutes,
            teamid: team._id
        }

        updateLineup(data).then((response) => {
            setToast(true)
            setToastMessage("Lineup Saved Successfully")
            setTimeout(() => {
                setToast(false)
            }, 3000)
        })


    }

    useEffect(() => {
        let updatedSelectedPlayers = [
            selectedGoalKeeper,
            ...selectedDefenders,
            ...selectedCentralDefensiveMidfielders,
            ...selectedMidfielders,
            ...selectedCentralAttackingMidfielders,
            ...selectedAttackers
        ];
        setSelectedPlayers(updatedSelectedPlayers);

        let updatedAvailableSubstitutes = substitutes.filter(player => {
            return selectedGoalKeeper !== player &&
                !selectedDefenders.includes(player) &&
                !selectedCentralDefensiveMidfielders.includes(player) &&
                !selectedMidfielders.includes(player) &&
                !selectedCentralAttackingMidfielders.includes(player) &&
                !selectedAttackers.includes(player);
        });
        setAvailableSubstitutes(updatedAvailableSubstitutes);


    }, [selectedGoalKeeper, selectedDefenders, selectedCentralDefensiveMidfielders, selectedMidfielders, selectedCentralAttackingMidfielders, selectedAttackers]);

    return (
        <>
            <div className="flex flex-col gap-2 mb-20">

                <div
                    className="flex flex-col overflow-hidden rounded-xl sm:bg-gray-50 sm:px-8 sm:shadow dark:bg-neutral-900 w-5/6 md:w-full">
                    <div className="pt-4">
                        <h1 className="py-2 text-2xl font-semibold">Team Lineup</h1>
                        <p className="mt-2">Prepare your teams strategy and tactics</p>
                    </div>


                    <hr className="mt-4 mb-8"/>
                    <p className="py-2 text-xl font-semibold">Lineup</p>
                    <p className="mb-3">Choose players adjusting your lineup configuration</p>
                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
                            <label htmlFor="login-password">
                                <span className="text-sm text-gray-500 dark:text-gray-400">GoalKeeper</span>
                                <div
                                    className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
                                    <Dropdown value={selectedGoalKeeper}
                                              onChange={changeGoalKeeper}
                                              options={goalKeeper}
                                              dataKey={selectedGoalKeeper.id}
                                              optionLabel="name"
                                              placeholder="Select a Goalkeeper" className="w-full md:w-20rem"/>
                                </div>
                            </label>
                        </div>
                        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
                            <label htmlFor="login-password">
                                <span className="text-sm text-gray-500 dark:text-gray-400">Defenders</span>
                                <div
                                    className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
                                    <MultiSelect checkboxIcon value={selectedDefenders} options={defenders}
                                                 onChange={changeDefenders} optionLabel="name"
                                                 dataKey={defenders.id}
                                                 placeholder="Select Defenders" itemTemplate={PlayerTemplate}
                                                 panelFooterTemplate={DefenderspanelFooterTemplate}
                                                 className="w-full md:w-20rem py-1.5"
                                                 filter filterIcon
                                                 selectionLimit={5}
                                                 showSelectAll={false}
                                                 itemClassName={"flex items-center"}
                                                 display="chip"/>
                                </div>
                            </label>
                        </div>
                        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
                            <label htmlFor="login-password">
                                <span
                                    className="text-sm text-gray-500 dark:text-gray-400">Central Defensive Midfielders</span>
                                <div
                                    className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
                                    <MultiSelect checkboxIcon value={selectedCentralDefensiveMidfielders}
                                                 options={centralDefensiveMidfielders}
                                                 onChange={changeCentralDefensiveMidfielders}
                                                 optionLabel="name"
                                                 dataKey={centralDefensiveMidfielders.id}
                                                 placeholder="Select CDMs" itemTemplate={PlayerTemplate}
                                                 panelFooterTemplate={CentralDefensiveMidfieldersspanelFooterTemplate}
                                                 className="w-full md:w-20rem py-1.5"
                                                 filter filterIcon
                                                 showSelectAll={false}
                                                 itemClassName={"flex items-center"}
                                                 display="chip"/>
                                </div>
                            </label>
                        </div>
                        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
                            <label htmlFor="login-password">
                                <span className="text-sm text-gray-500 dark:text-gray-400">Central Midfielders</span>
                                <div
                                    className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
                                    <MultiSelect checkboxIcon value={selectedMidfielders} options={midfielders}
                                                 onChange={changeMidfielders} optionLabel="name"
                                                 placeholder="Select Central Midfielders" itemTemplate={PlayerTemplate}
                                                 panelFooterTemplate={MidfielderspanelFooterTemplate}
                                                 className="w-full md:w-20rem py-1.5"
                                                 dataKey={midfielders.id}
                                                 filter filterIcon
                                                 showSelectAll={false}
                                                 itemClassName={"flex items-center"}
                                                 display="chip"/>
                                </div>
                            </label>
                        </div>
                        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
                            <label htmlFor="login-password">
                                <span
                                    className="text-sm text-gray-500 dark:text-gray-400">Central Attacking Midfielders</span>
                                <div
                                    className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
                                    <MultiSelect checkboxIcon value={selectedCentralAttackingMidfielders}
                                                 options={centralAttackingMidfielders}
                                                 onChange={changeCentralAttackingMidfielders}
                                                 optionLabel="name"
                                                 dataKey={centralAttackingMidfielders.id}
                                                 placeholder="Select CAMs" itemTemplate={PlayerTemplate}
                                                 panelFooterTemplate={CentralAttackingMidfieldersspanelFooterTemplate}
                                                 className="w-full md:w-20rem py-1.5"
                                                 filter filterIcon
                                                 showSelectAll={false}
                                                 itemClassName={"flex items-center"}
                                                 display="chip"/>
                                </div>
                            </label>
                        </div>
                        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
                            <label htmlFor="login-password">
                                <span className="text-sm text-gray-500 dark:text-gray-400">Forward</span>
                                <div
                                    className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
                                    <MultiSelect checkboxIcon value={selectedAttackers} options={attackers}
                                                 onChange={changeAttackers} optionLabel="name"
                                                 placeholder="Select Forwards" itemTemplate={PlayerTemplate}
                                                 panelFooterTemplate={AttackerspanelFooterTemplate}
                                                 className="w-full md:w-20rem py-1.5"
                                                 dataKey={attackers.id}
                                                 filter filterIcon
                                                 showSelectAll={false}
                                                 itemClassName={"flex items-center"}
                                                 display="chip"/>
                                </div>
                            </label>
                        </div>
                        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
                            <label htmlFor="login-password">
                                <span className="text-sm text-gray-500 dark:text-gray-400">Substitutes</span>
                                <div
                                    className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
                                    <MultiSelect checkboxIcon value={selectedSubstitutes} options={availableSubstitutes}
                                                 onChange={(e) => setSelectedSubstitutes(e.value)} optionLabel="name"
                                                 placeholder="Select Substitutes" itemTemplate={PlayerTemplate}
                                                 panelFooterTemplate={SubstitutespanelFooterTemplate}
                                                 className="w-full md:w-20rem py-1.5"
                                                 dataKey={availableSubstitutes.id}
                                                 filter filterIcon
                                                 showSelectAll={false}
                                                 itemClassName={"flex items-center"}
                                                 display="chip"/>
                                </div>
                            </label>
                        </div>

                    </div>

                    <button
                        onClick={saveLineup}
                        className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white self-start">Save Lineup
                    </button>
                    <hr className="mt-4 mb-8"/>
                    <div className="mb-10 flex flex-col">
                        <p className="py-2 text-xl font-semibold">Lineup Settings</ p>
                        <div className="flex flex-col">
                            <p className="self-start inline-flex items-center rounded-full bg-blue-100 px-4 py-1 text-blue-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" viewBox="0 0 20 20"
                                     fill="currentColor">
                                    <path fillRule="evenodd"
                                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                          clipRule="evenodd"/>
                                </svg>
                                This will reset your current Lineup
                            </p>
                            <button
                                onClick={resetLineup}
                                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white self-start">Reset
                            </button>
                        </div>
                    </div>
                </div>


                <SoccerLineUp
                    size={"responsive"}
                    color={"#588f58"}
                    pattern={"squares"}
                    homeTeam={teamXL}
                />
            </div>

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
    )
}