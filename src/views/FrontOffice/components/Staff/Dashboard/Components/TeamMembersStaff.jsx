import {Fragment, useEffect, useState} from "react";
import {jwtDecode} from "jwt-decode";
import {
    addplayers,
    addstaff,
    getAllPlayers,
    getAllStaff,
    getplayersbyteam,
    getstaffbyteam,
    getUserData,
    sendinvitationtomembers,
    updatePlayersCurrentTeam,
    updateTeamMember
} from "../../../../../../Services/apiUser.js";
import {getTeam, updateLineup} from "../../../../../../Services/FrontOffice/apiTeam.js";
import {IoAddCircleOutline as Add2, IoPersonAddSharp as Add} from "react-icons/io5";
import {MdOutlineSendToMobile as Send} from "react-icons/md";
import {MultiSelect} from "primereact/multiselect";


export default function TeamMembers() {
    const [Team, setTeam] = useState({})
    const [SelectPlayers, setSelectPlayers] = useState(true)
    const [LoggedStaff, setLoggedStaff] = useState({})


    //----------- Players -----------
    const [Players, setPlayers] = useState([])
    const [PlayersCopy, setPlayersCopy] = useState([])
    const [SearchPlayers, setSearchPlayers] = useState('')
    const [ShowPlayersDetails, setShowPlayersDetails] = useState([])

    const [AddPlayer, setAddPlayer] = useState(false)
    const [InvitePlayer, setInvitePlayer] = useState(false)

    const [AllPlayers, setAllPlayers] = useState([])
    const [SelectedPlayers, setSelectedPlayers] = useState([])

    const PlayersFooterTemplate = () => {
        const length = SelectedPlayers ? SelectedPlayers.length : 0;

        return (
            <div className="py-2 px-3">
                <b>{length}</b> Player{length > 1 ? 's' : ''} selected.
            </div>
        );
    };
    const PlayerTemplate = (option) => {
        return (
            <div className="flex gap-4 justify-between">
                <img alt={option.name + ' image'}
                     src={path + option.image}
                     className={`ml-4 rounded-3xl player player-${option._id.toLowerCase()}`}
                     style={{width: '50px', height: '50px'}}/>
                <div className="self-center text-semibold text-md">{option.name}</div>
            </div>
        );
    };

    const [NewPlayer, SetNewPlayer] = useState({
        firstName: '',
        lastName: '',
        email: '',
        position: '',
    })

    const [NewPlayerErrors, setNewPlayerErrors] = useState({
        firstName: {
            state: false,
            message: '',
        },
        lastName: {
            state: false,
            message: '',
        },
        email: {
            state: false,
            message: '',
        },
        position: {
            state: false,
            message: '',
        },
    })

    //----------- Players -----------

    //----------- Staff -----------
    const [Staff, setStaff] = useState([])
    const [StaffCopy, setStaffCopy] = useState([])
    const [ShowStaffDetails, setShowStaffDetails] = useState([])
    const [SearchStaff, setSearchStaff] = useState('')

    const [AddStaff, setAddStaff] = useState(false)
    const [InviteStaff, setInviteStaff] = useState(false)

    const [AllStaff, setAllStaff] = useState([])
    const [SelectedStaff, setSelectedStaff] = useState([])

    const StaffFooterTemplate = () => {
        const length = SelectedStaff ? SelectedStaff.length : 0;

        return (
            <div className="py-2 px-3">
                <b>{length}</b> Staff{length > 1 ? 's' : ''} selected.
            </div>
        );
    };

    const StaffTemplate = (option) => {
        return (
            <div className="flex gap-4 justify-between">
                <img alt={option.name + ' image'}
                     src={pathStaff + option.image}
                     className={`ml-4 rounded-3xl player player-${option._id.toLowerCase()}`}
                     style={{width: '50px', height: '50px'}}/>
                <div className="self-center text-semibold text-md">{option.name}</div>
            </div>
        );
    };

    const [NewStaff, SetNewStaff] = useState({
        firstName: '',
        lastName: '',
        email: '',
        position: '',
    })

    const [NewStaffErrors, setNewStaffErrors] = useState({
        firstName: {
            state: false,
            message: '',
        },
        lastName: {
            state: false,
            message: '',
        },
        email: {
            state: false,
            message: '',
        },
        position: {
            state: false,
            message: '',
        },
    })

    //----------- Staff -----------

    //----------- Toast -----------
    const [Toast, setToast] = useState(false)
    const [ErrorToast, setErrorToast] = useState(false)
    const [ToastMessage, setToastMessage] = useState('')
    //----------- Toast -----------
    const classname = "w-full rounded-md border bg-white py-2 px-2 outline-none ring-blue-600 focus:ring-1 dark:bg-neutral-700 dark:text-gray-100"
    const errorclassname = "w-full placeholder-gray-500 rounded-md border bg-rose-200 py-2 px-2 outline-none ring-red-600 focus:ring-1 "


    const [KickPlayerPopup, setKickPlayerPopup] = useState({
        show: false,
        player: {}
    })


    const path = "http://localhost:3000/public/images/players/";
    const pathStaff = "http://localhost:3000/public/images/staff/";

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

    useEffect(() => {
        try {
            if (localStorage.getItem('token') === null)
                return;

            const userToken = localStorage.getItem('token');
            const decodedToken = jwtDecode(userToken);
            getUserData(decodedToken.userId).then((response) => {
                setLoggedStaff(response.user)
                getTeam(response.user.PlayingFor).then((response) => {
                    setTeam(response.team)
                })
                getplayersbyteam(response.user.PlayingFor).then((response) => {
                    setPlayers(response)
                    setPlayersCopy(response)
                    let Show = {
                        show: false
                    }
                    let showArray = []
                    response.forEach(() => {
                        showArray.push(Show)
                    })
                    setShowPlayersDetails(showArray)
                })
                getstaffbyteam(response.user.PlayingFor).then((response) => {
                    setStaff(response)
                    setStaffCopy(response)
                    let Show = {
                        show: false
                    }
                    let showArray = []
                    response.forEach(() => {
                        showArray.push(Show)
                    })
                    setShowStaffDetails(showArray)
                })
            })
        } catch (e) {
            console.log(e.message)
        }


    }, [])


    useEffect(() => {
        getAllPlayers().then((response) => {
            let playersList = response.users
            playersList = playersList.filter((player) => player.PlayingFor !== Team._id)
            playersList = playersList.map((player) => {
                let name = player.firstName + ' ' + player.lastName
                player = {
                    ...player,
                    name: name
                }
                return player
            })
            setAllPlayers(playersList)
        })
        getAllStaff().then((response) => {
            let staffList = response.users
            staffList = staffList.filter((staff) => staff.PlayingFor !== Team._id)
            staffList = staffList.map((staff) => {
                let name = staff.firstName + ' ' + staff.lastName
                staff = {
                    ...staff,
                    name: name
                }
                return staff
            })
            setAllStaff(staffList)
        })
    }, [Team])


    function kickPlayer(player) {
        try {
            player.PlayingFor = null
            player.TeamJerseyNumber = null
            updatePlayersCurrentTeam(player).then(() => {
                setToastMessage('Player Kicked !')
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


            if (!SelectPlayers) {
                setStaff(Staff.filter((playerS) => playerS._id !== player._id))
                setStaffCopy(StaffCopy.filter((playerS) => playerS._id !== player._id))
                return
            }


            let team = {...Team}
            Team.currentLineup.forEach((playerS, index) => {
                if (player._id === playerS.id) {
                    team.currentLineup.splice(index, 1)
                    let lineup = {
                        teamid: team._id,
                        lineup: team.currentLineup
                    }
                    updateLineup(lineup).then(() => {
                        console.log('Player removed from lineup')
                    })
                }
            })
            setPlayers(Players.filter((playerS) => playerS._id !== player._id))
            setPlayersCopy(PlayersCopy.filter((playerS) => playerS._id !== player._id))
            setTeam(team)
        } catch (e) {
            console.log(e.message)
        }
    }

    useEffect(() => {
        setPlayers(PlayersCopy.filter((player) => {
            const fullPositionName = positionMapping[player.position];
            return player.firstName.toLowerCase().includes(SearchPlayers.toLowerCase())
                || player.lastName.toLowerCase().includes(SearchPlayers.toLowerCase())
                || (fullPositionName && fullPositionName.toLowerCase().includes(SearchPlayers.toLowerCase()));
        }))
    }, [SearchPlayers])

    useEffect(() => {
        setStaff(StaffCopy.filter((staff) => {
            const fullPositionName = staffPositionMapping[staff.position];
            return staff.firstName.toLowerCase().includes(SearchStaff.toLowerCase())
                || staff.lastName.toLowerCase().includes(SearchStaff.toLowerCase())
                || (fullPositionName && fullPositionName.toLowerCase().includes(SearchStaff.toLowerCase()));
        }))
    }, [SearchStaff])

    function isJerseyNumberUnique(jerseyNumber, id) {
        for (let i = 0; i < Players.length; i++) {
            if (Players[i].teamJerseyNumber === jerseyNumber && Players[i]._id !== id) {
                return false;
            }
        }
        return true;
    }

    function savePlayer(player) {
        if (isJerseyNumberUnique(player.teamJerseyNumber, player._id)) {
            updateTeamMember(player).then(() => {
                setToastMessage('Player Updated !')
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
        } else {
            setToastMessage('Jersey number is not unique!')
            setErrorToast(true)
            setTimeout(() => {
                setErrorToast(false)
            }, 3000)
        }
    }

    function saveStaff(staff) {
        try {
            updateTeamMember(staff).then(() => {
                setToastMessage('Staff Updated !')
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
        } catch (e) {
            console.log(e.message)
        }

    }

    function verifyEmail(email) {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    }

    function verifyNewMember(NewMember) {
        let errors = {
            firstName: {
                state: false,
                message: '',
            },
            lastName: {
                state: false,
                message: '',
            },
            email: {
                state: false,
                message: '',
            },
            position: {
                state: false,
                message: '',
            },
        }
        let error = false
        if (NewMember.firstName === '') {
            errors.firstName.state = true
            errors.firstName.message = 'Name is required'
            error = true
        }
        if (NewMember.lastName === '') {
            errors.lastName.state = true
            errors.lastName.message = 'Name is required'
            error = true
        }
        if (NewMember.email === '') {
            errors.email.state = true
            errors.email.message = 'Email is required'
            error = true
        }
        if (NewMember.position === '') {
            errors.position.state = true
            errors.position.message = 'Position is required'
            error = true
        }

        if (NewMember.firstName.length < 3) {
            errors.firstName.state = true
            errors.firstName.message = 'Name must be at least 3 letters'
            error = true
        }
        if (NewMember.lastName.length < 3) {
            errors.lastName.state = true
            errors.lastName.message = 'Name must be at least 3 letters'
            error = true
        }

        if (!verifyEmail(NewMember.email)) {
            errors.email.state = true
            errors.email.message = 'Email isn\'t valid'
            error = true
        }
        return {error, errors}
    }

    function addplayer() {

        let {error, errors} = verifyNewMember(NewStaff)

        if (error) {
            setNewPlayerErrors(errors)
            return
        }

        setNewPlayerErrors({
            firstName: {
                state: false,
                message: '',
            },
            lastName: {
                state: false,
                message: '',
            },
            email: {
                state: false,
                message: '',
            },
            position: {
                state: false,
                message: '',
            },
        })
        let playertoadd = {
            teamId: Team._id,
            players: [{
                playername: NewPlayer.firstName,
                lastName: NewPlayer.lastName,
                email: NewPlayer.email,
                position: NewPlayer.position
            }]
        }
        addplayers(playertoadd).then(() => {
            setToastMessage('Player Added !')
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

        setAddPlayer(false)
        setPlayers([...Players], NewPlayer)
        setPlayersCopy([...PlayersCopy], NewPlayer)
        SetNewPlayer({
            firstName: '',
            lastName: '',
            email: '',
            position: '',
        })

    }

    function addstaffmember() {

        let {error, errors} = verifyNewMember(NewStaff)

        if (error) {
            setNewStaffErrors(errors)
            return
        }

        setNewStaffErrors({
            firstName: {
                state: false,
                message: '',
            },
            lastName: {
                state: false,
                message: '',
            },
            email: {
                state: false,
                message: '',
            },
            position: {
                state: false,
                message: '',
            },
        })
        let stafftoadd = {
            teamId: Team._id,
            staff: [{
                staffname: NewStaff.firstName,
                lastName: NewStaff.lastName,
                email: NewStaff.email,
                position: NewStaff.position
            }]
        }

        addstaff(stafftoadd).then(() => {
            setToastMessage('Staff Added !')
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

        setAddStaff(false)
        setStaff([...Staff], NewStaff)
        setStaffCopy([...StaffCopy], NewStaff)

        SetNewStaff({
            firstName: '',
            lastName: '',
            email: '',
            position: '',
        })


    }

    function inviteStaff() {
        if (SelectedStaff.length === 0) {
            setToastMessage('No staff selected !')
            setErrorToast(true)
            setTimeout(() => {
                setErrorToast(false)
            }, 3000)
            return
        }
        let data = {
            idTeam: Team._id,
            invitedStaff: SelectedStaff
        }

        sendinvitationtomembers(data).then(() => {
            setToastMessage('Invitation sent !')
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
        setAddStaff(false)
        setSelectedStaff([])
    }

    function invitePlayers() {
        if (SelectedPlayers.length === 0) {
            setToastMessage('No staff selected !')
            setErrorToast(true)
            setTimeout(() => {
                setErrorToast(false)
            }, 3000)
            return
        }
        let data = {
            idTeam: Team._id,
            invitedPlayers: SelectedPlayers
        }

        sendinvitationtomembers(data).then(() => {
            setToastMessage('Invitation sent !')
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
        setAddPlayer(false)
        setSelectPlayers([])
    }

    return (
        <>
            <div
                className="dark:bg-neutral-700 dark:text-gray-100  col-span-8 overflow-hidden rounded-xl sm:bg-gray-50 sm:px-8 sm:shadow">
                <div className="pt-4">
                    <h1 className="py-2 text-2xl font-semibold">Team settings</h1>
                </div>
                <hr className="mt-4 mb-8"/>
                <p className="py-2 text-xl font-semibold">Teams</p>
                {SelectPlayers ? (
                    <div className="space-y-2">
                        <div
                            className="cursor-pointer dark:bg-neutral-600 dark:hover:bg-neutral-500 dark:text-gray-100  rounded-md border bg-blue-100 px-6 py-2 text-2xl hover:bg-blue-50">Players
                        </div>
                        <div
                            onClick={() => setSelectPlayers(false)}
                            className="cursor-pointer dark:bg-neutral-700 dark:text-gray-100  dark:hover:bg-neutral-500 rounded-md border bg-white px-6 py-2 text-2xl hover:bg-blue-50">Coaches
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <div
                            onClick={() => setSelectPlayers(true)}
                            className="cursor-pointer dark:bg-neutral-600 dark:hover:bg-neutral-500 dark:text-gray-100 rounded-md border bg-white px-6 py-2 text-2xl hover:bg-blue-50">Players
                        </div>
                        <div
                            className="cursor-pointer  dark:bg-neutral-700 dark:text-gray-100  dark:hover:bg-neutral-500 rounded-md border bg-blue-100 px-6 py-2 text-2xl hover:bg-blue-50">Coaches
                        </div>
                    </div>
                )}
                <hr className="mt-4 mb-8"/>
                <p className="py-2 text-xl font-semibold">Members</p>
                <div
                    className="relative mx-auto mb-4 flex w-full max-w-2xl items-center justify-between rounded-md border shadow-lg">
                    <svg className="absolute left-2 block h-5 w-5 text-gray-400"
                         xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                         viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                         strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" className=""></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65" className=""></line>
                    </svg>
                    {SelectPlayers ? (
                        <>
                            <input type="name" name="search"
                                   className="h-14 w-full  rounded-md py-4 pr-40 pl-12 outline-none focus:ring-2"
                                   placeholder="Name , Position, Number... "
                                   value={SearchPlayers}
                                   onChange={(e) => {
                                       setSearchPlayers(e.target.value)
                                   }}
                            />
                            {LoggedStaff.hasAccessTo?.add &&
                                <Add
                                    onClick={() => {
                                        setAddPlayer(true)
                                    }}
                                    className="absolute right-2 h-8 w-8 text-gray-400 hover:cursor-pointer active:scale-95"
                                    size={20}>
                                </Add>
                            }
                        </>
                    ) : (
                        <>
                            <input type="name" name="search"
                                   className="h-14 w-full rounded-md py-4 pr-40 pl-12 outline-none focus:ring-2"
                                   placeholder="Name , Position, Access... "
                                   value={SearchStaff}
                                   onChange={(e) => {
                                       setSearchStaff(e.target.value)
                                   }}
                            />
                            {LoggedStaff.hasAccessTo?.add &&
                                <Add
                                    onClick={() => {
                                        setAddStaff(true)
                                    }}
                                    className="absolute right-2 h-8 w-8 text-gray-400 hover:cursor-pointer active:scale-95"
                                    size={20}>
                                </Add>
                            }
                        </>
                    )}
                </div>


                <div className="space-y-1">
                    {SelectPlayers ? (
                        Players.map((player, index) => {
                            return (
                                <Fragment key={index}>
                                    {ShowPlayersDetails[index].show ? (
                                        <>
                                            <div
                                                className="rounded-md  border bg-white dark:bg-neutral-700 dark:text-gray-100 ">
                                                <div className="flex w-full  items-center px-6 py-2">
                                                    <img src={path + player.image}
                                                         className="mr-2 rounded-3xl h-8 w-8 text-gray-400"
                                                         alt="player Image"/>
                                                    <span>{player.firstName} {player.lastName}</span>
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                         onClick={() => {
                                                             let showDetails = [...ShowPlayersDetails]
                                                             showDetails[index] = {
                                                                 show: false
                                                             }
                                                             setShowPlayersDetails(showDetails)
                                                         }}
                                                         className="ml-auto h-5 w-5 cursor-pointer text-gray-400 active:scale-95"
                                                         fill="none"
                                                         viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                                    </svg>
                                                </div>
                                                <div className="flex flex-col space-y-3 px-4 py-6 sm:px-10 ">
                                                    <label className="block" htmlFor="name">
                                                        <p className="text-sm">Jersey Number</p>
                                                        <input
                                                            className="w-full dark:bg-neutral-600 dark:text-gray-100 rounded-md border py-2 px-2 bg-gray-50 outline-none ring-blue-600 focus:ring-1"
                                                            type="number" placeholder="From 1 to 99"
                                                            max={99} min={1}
                                                            onChange={(e) => {
                                                                let PlayersTab = [...Players]
                                                                PlayersTab[index] = {
                                                                    ...player,
                                                                    teamJerseyNumber: e.target.value
                                                                }
                                                                setPlayers(PlayersTab)
                                                            }}
                                                            value={player.teamJerseyNumber}/>
                                                    </label>
                                                    <label className="block" htmlFor="email">
                                                        <p className="text-sm">Physical State</p>
                                                        <select
                                                            onChange={(e) => {
                                                                player.HealthStatus = e.target.value
                                                            }}
                                                            className="w-full  dark:bg-neutral-600 dark:text-gray-100 rounded-md border py-2 px-2 bg-gray-50 outline-none ring-blue-600 focus:ring-1"
                                                            name="team" defaultValue={player.HealthStatus}>
                                                            <option value="H">Healthy</option>
                                                            <option value="INJ">Injured</option>
                                                            <option value="SUS">Suspended</option>
                                                        </select>
                                                    </label>
                                                    <label className="block" htmlFor="position">
                                                        <p className="text-sm">Position</p>
                                                        <select
                                                            onChange={(e) => {
                                                                player.position = e.target.value
                                                            }}
                                                            className="w-full dark:bg-neutral-600 dark:text-gray-100 rounded-md border py-2 px-2 bg-gray-50 outline-none ring-blue-600 focus:ring-1"
                                                            name="team" defaultValue={player.position}>
                                                            <option value="AM">Attacking Midfielder</option>
                                                            <option value="CB">Center Back</option>
                                                            <option value="CF">Center Forward</option>
                                                            <option value="CM">Central Midfielder</option>
                                                            <option value="D">Defender</option>
                                                            <option value="DM">Defensive Midfielder</option>
                                                            <option value="FB">Full Back</option>
                                                            <option value="F">Forward</option>
                                                            <option value="GK">Goalkeeper</option>
                                                            <option value="LM">Left Midfielder</option>
                                                            <option value="M">Midfielder</option>
                                                            <option value="RM">Right Midfielder</option>
                                                            <option value="S">Striker</option>
                                                            <option value="SS">Second Striker</option>
                                                            <option value="WB">Wing Back</option>
                                                            <option value="W">Winger</option>
                                                        </select>
                                                    </label>
                                                    <div className="flex gap-2 self-end ">
                                                        {LoggedStaff.hasAccessTo?.kick &&
                                                        <button
                                                            onClick={() => {
                                                                setKickPlayerPopup({
                                                                    show: true,
                                                                    player: player
                                                                })
                                                            }}
                                                            className="mt-4 ml-auto rounded-lg bg-rose-600 px-10 py-2 text-white">Kick
                                                        </button>
                                                        }
                                                        <button
                                                            onClick={() => {
                                                                savePlayer(player)
                                                            }}
                                                            className="mt-4 ml-auto rounded-lg bg-blue-600 px-10 py-2 text-white">Save
                                                        </button>


                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div
                                                className="rounded-md border bg-white dark:bg-neutral-700 dark:text-gray-100">
                                                <div className="flex w-full items-center px-6 py-2">
                                                    <img src={path + player.image}
                                                         className="mr-2 rounded-3xl h-8 w-8 text-gray-400"
                                                         alt="player Image"/>
                                                    <span>{player.firstName} {player.lastName}</span>
                                                    {LoggedStaff.hasAccessTo?.add &&
                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                             onClick={() => {
                                                                 let showDetails = [...ShowPlayersDetails]
                                                                 showDetails[index] = {
                                                                     show: true
                                                                 }
                                                                 setShowPlayersDetails(showDetails)
                                                             }}
                                                             className="ml-auto h-5 w-5 cursor-pointer text-gray-400 active:scale-95"
                                                             fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                                             strokeWidth="2">
                                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                                        </svg>
                                                    }
                                                    {(LoggedStaff.hasAccessTo?.kick && !LoggedStaff.hasAccessTo?.add) &&
                                                        <button
                                                            onClick={() => {
                                                                setKickPlayerPopup({
                                                                    show: true,
                                                                    player: player
                                                                })
                                                            }}
                                                            className="ml-auto rounded-lg bg-rose-600 px-10 py-2 text-white">Kick
                                                        </button>
                                                    }
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </Fragment>
                            )
                        })
                    ) : (
                        Staff.map((staff, index) => {
                            return (
                                <Fragment key={index}>
                                    {ShowStaffDetails[index].show ? (
                                        <>
                                        <div
                                                className="rounded-md border bg-white dark:bg-neutral-700 dark:text-gray-100">
                                                <div className="flex w-full items-center px-6 py-2">
                                                    <img src={pathStaff + staff.image}
                                                         className="mr-2 rounded-3xl h-8 w-8 text-gray-400"
                                                         alt="player Image"/>
                                                    <span>{staff.firstName} {staff.lastName}</span>
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                         onClick={() => {
                                                             let showDetails = [...ShowStaffDetails]
                                                             showDetails[index] = {
                                                                 show: false
                                                             }
                                                             setShowStaffDetails(showDetails)
                                                         }}
                                                         className="ml-auto h-5 w-5 cursor-pointer text-gray-400 active:scale-95"
                                                         fill="none"
                                                         viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                                    </svg>
                                                </div>
                                                <div className="flex flex-col space-y-3 px-4 py-6 sm:px-10">
                                                    <label className="block" htmlFor="email">
                                                        <p className="text-sm">Access</p>
                                                        <div className="flex gap-x-4">
                                                            <div
                                                                className="relative flex w-56  items-center justify-center dark:bg-neutral-700 dark:text-gray-100  rounded-xl bg-gray-50 px-4 py-3 font-medium text-gray-700">
                                                                <input className="peer hidden" type="radio"
                                                                       name={"add" + index}
                                                                       checked={staff.hasAccessTo.add}
                                                                       onClick={() => {
                                                                           let StaffTab = [...Staff]
                                                                           let access = {
                                                                               add: !staff.hasAccessTo.add,
                                                                               kick: staff.hasAccessTo.kick,
                                                                               editlineup: staff.hasAccessTo.editlineup
                                                                           }
                                                                           StaffTab[index] = {
                                                                               ...staff,
                                                                               hasAccessTo: access
                                                                           }
                                                                           setStaff(StaffTab)
                                                                       }}
                                                                       id={"addplayers" + index}/>
                                                                <label
                                                                    className="peer-checked:border-blue-400 peer-checked:bg-blue-200 dark:peer-checked:border-blue-700 dark:peer-checked:bg-blue-500 absolute top-0 h-full w-full cursor-pointer rounded-xl border"
                                                                    htmlFor={"addplayers" + index}> </label>
                                                                <div
                                                                    className="peer-checked:border-transparent peer-checked:bg-blue-400 peer-checked:ring-2 absolute left-4 h-5 w-5 rounded-full border-2 border-gray-300 bg-gray-200 ring-blue-400 ring-offset-2"></div>
                                                                <span
                                                                    className="pointer-events-none z-10">Manage Players</span>
                                                            </div>
                                                            <div
                                                                className="relative flex w-56 items-center justify-center dark:bg-neutral-700 dark:text-gray-100 rounded-xl bg-gray-50 px-4 py-3 font-medium text-gray-700">
                                                                <input className="peer hidden" type="radio"
                                                                       name={"kick" + index}
                                                                       checked={staff.hasAccessTo.kick}
                                                                       onClick={() => {
                                                                           let StaffTab = [...Staff]
                                                                           let access = {
                                                                               add: staff.hasAccessTo.add,
                                                                               kick: !staff.hasAccessTo.kick,
                                                                               editlineup: staff.hasAccessTo.editlineup
                                                                           }
                                                                           StaffTab[index] = {
                                                                               ...staff,
                                                                               hasAccessTo: access
                                                                           }
                                                                           setStaff(StaffTab)
                                                                       }}
                                                                       id={"kickplayers" + index}/>
                                                                <label
                                                                    className="peer-checked:border-blue-400 peer-checked:bg-blue-200 dark:peer-checked:border-blue-700 dark:peer-checked:bg-blue-500 absolute top-0 h-full w-full cursor-pointer rounded-xl border"
                                                                    htmlFor={"kickplayers" + index}> </label>
                                                                <div
                                                                    className="peer-checked:border-transparent peer-checked:bg-blue-400  peer-checked:ring-2 absolute left-4 h-5 w-5 rounded-full border-2 border-gray-300 bg-gray-200 ring-blue-400 ring-offset-2"></div>
                                                                <span
                                                                    className="pointer-events-none z-10">Kick Players</span>
                                                            </div>
                                                            <div
                                                                className="relative flex w-56 dark:bg-neutral-700 dark:text-gray-100 items-center justify-center rounded-xl bg-gray-50 px-4 py-3 font-medium text-gray-700">
                                                                <input className="peer hidden " type="radio"
                                                                       name={"edit" + index}
                                                                       checked={staff.hasAccessTo.editlineup}
                                                                       onClick={() => {
                                                                           let StaffTab = [...Staff]
                                                                           let access = {
                                                                               add: staff.hasAccessTo.add,
                                                                               kick: staff.hasAccessTo.kick,
                                                                               editlineup: !staff.hasAccessTo.editlineup
                                                                           }
                                                                           StaffTab[index] = {
                                                                               ...staff,
                                                                               hasAccessTo: access
                                                                           }
                                                                           setStaff(StaffTab)
                                                                       }}
                                                                       id={"editlineup" + index}/>
                                                                <label
                                                                    className="peer-checked:border-blue-400 peer-checked:bg-blue-200 dark:peer-checked:border-blue-700 dark:peer-checked:bg-blue-500 absolute top-0 h-full w-full cursor-pointer rounded-xl border"
                                                                    htmlFor={"editlineup" + index}> </label>
                                                                <div
                                                                    className="peer-checked:border-transparent peer-checked:bg-blue-400 peer-checked:ring-2 absolute left-4 h-5 w-5 rounded-full border-2 border-gray-300 bg-gray-200 ring-blue-400 ring-offset-2"></div>
                                                                <span
                                                                    className="pointer-events-none z-10">Edit Lineup</span>
                                                            </div>
                                                        </div>
                                                    </label>
                                                    <label className="block" htmlFor="position">
                                                        <p className="text-sm">Position</p>
                                                        <select
                                                            onChange={(e) => {
                                                                staff.position = e.target.value
                                                            }}
                                                            className="w-full dark:bg-neutral-600 dark:text-gray-100 rounded-md border py-2 px-2 bg-gray-50 outline-none ring-blue-600 focus:ring-1"
                                                            name="team" defaultValue={staff.position}>
                                                            <option value="manager">Manager</option>
                                                            <option value="assistant_manager">Assistant Manager</option>
                                                            <option value="coach">Coach</option>
                                                            <option value="goalkeeping_coach">Goalkeeping Coach</option>
                                                            <option value="fitness_coach">Fitness Coach</option>
                                                            <option value="analyst">Analyst</option>
                                                            <option value="scout">Scout</option>
                                                            <option value="physiotherapist">Physiotherapist</option>
                                                            <option value="doctor">Team Doctor</option>
                                                            <option value="nutritionist">Nutritionist</option>
                                                            <option value="psychologist">Sports Psychologist</option>
                                                            <option value="media_officer">Media Officer</option>
                                                            <option value="kit_manager">Kit Manager</option>
                                                        </select>
                                                    </label>
                                                    <div className="flex gap-2 self-end">
                                                        {LoggedStaff.hasAccessTo?.kick &&
                                                            <button
                                                                onClick={() => {
                                                                    setKickPlayerPopup({
                                                                        show: true,
                                                                        player: staff
                                                                    })
                                                                }}
                                                                className="mt-4 ml-auto rounded-lg bg-rose-600 px-10 py-2 text-white">Kick
                                                            </button>
                                                        }
                                                        <button
                                                            onClick={() => {
                                                                saveStaff(staff)
                                                            }}
                                                            className="mt-4 ml-auto rounded-lg bg-blue-600 px-10 py-2 text-white">Save
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div
                                                className="rounded-md border bg-white dark:bg-neutral-700 dark:text-gray-100">
                                                <div className="flex w-full items-center px-6 py-2">
                                                    <img src={pathStaff + staff.image}
                                                         className="mr-2 rounded-3xl h-8 w-8 text-gray-400"
                                                         alt="player Image"/>
                                                    <span>{staff.firstName} {staff.lastName}</span>
                                                    {LoggedStaff.hasAccessTo?.add && (
                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                             onClick={() => {
                                                                 let showDetails = [...ShowStaffDetails]
                                                                 showDetails[index] = {
                                                                     show: true
                                                                 }
                                                                 setShowStaffDetails(showDetails)
                                                             }}
                                                             className="ml-auto h-5 w-5 cursor-pointer text-gray-400 active:scale-95"
                                                             fill="none"
                                                             viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                                        </svg>
                                                    )}
                                                    {(LoggedStaff.hasAccessTo?.kick && !LoggedStaff.hasAccessTo?.add) && (
                                                        <button
                                                            onClick={() => {
                                                                setKickPlayerPopup({
                                                                    show: true,
                                                                    player: staff
                                                                })
                                                            }}
                                                            className="ml-auto rounded-lg bg-rose-600 px-10 py-2 text-white">Kick
                                                        </button>

                                                    )}

                                                </div>
                                            </div>
                                        </>
                                    )}
                                </Fragment>
                            )
                        })
                    )}
                </div>

                <hr className="mt-4 mb-8"/>
            </div>

            {
                KickPlayerPopup.show && (
                    <div
                        className="justify-center bg-gray-400 bg-opacity-60 dark:bg-opacity-10 items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                    >
                        <div
                            className="m-10 dark:bg-neutral-700 dark:text-gray-100 bg-white flex max-w-lg flex-col items-center rounded-md border px-8 py-10 text-gray-800 shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/svg"
                                 className="h-16 w-16 rounded-xl bg-red-50 p-2 text-red-500"
                                 fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>

                            <p className="mt-4 text-center text-xl font-bold">Kick Player !</p>
                            <p className="mt-2 text-center text-lg">Are you sure you want to
                                kick {KickPlayerPopup.player.firstName} {KickPlayerPopup.player.lastName} from the team
                                !</p>
                            <p className="mt-2 text-center text-lg"><span className="truncate font-medium">This Action is cannot be reversed</span>
                            </p>
                            <div
                                className="mt-8 flex flex-col justify-center space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
                                <button
                                    onClick={() => {
                                        kickPlayer(KickPlayerPopup.player)
                                        setKickPlayerPopup({
                                            show: false,
                                            player: {}
                                        })
                                    }}
                                    className="whitespace-nowrap rounded-md bg-red-500 px-4 py-3 font-medium text-white">Yes,
                                    Kick {KickPlayerPopup.player.lastName}
                                </button>
                                <button onClick={() => {
                                    setKickPlayerPopup({
                                        show: false,
                                        player: {}
                                    })
                                }}
                                        className="whitespace-nowrap rounded-md dark:bg-gray-800 bg-gray-200 px-4 py-3 font-medium">Cancel,
                                    Kick
                                    from the team
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

            {
                AddPlayer && (
                    <div
                        className="bg-[#0000007F] justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                    >
                        <div
                            className="relative dark:bg-neutral-700 dark:text-gray-100 bg-white m-10 max-w-lg rounded-md border text-gray-800 shadow-lg">
                            <p className="mt-4 pl-4 text-xl font-bold">Add a new player</p>
                            <svg xmlns="http://www.w3.org/2000/svg"
                                 onClick={() => {
                                     setAddPlayer(false)
                                 }}
                                 className="absolute right-0 top-0 m-3 h-6 w-6 cursor-pointer text-gray-400" fill="none"
                                 viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                            <label className="flex justify-center mt-5 gap-3 items-center cursor-pointer">
                                <span
                                    onClick={() => {
                                        setInvitePlayer(!InvitePlayer)
                                    }}
                                    className="flex ms-3 text-sm font-medium  text-gray-900 dark:text-gray-300 active:scale-90"><Add2
                                    size={25} className="text-gray-900 dark:text-gray-300"/></span>
                                <input type="checkbox" value={InvitePlayer} className="sr-only peer"/>
                                <div
                                    onClick={() => {
                                        setInvitePlayer(!InvitePlayer)
                                    }}
                                    className="relative w-11 h-6 bg-gray-200  dark:text-gray-100 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-500 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-900"></div>
                                <span
                                    onClick={() => {
                                        setInvitePlayer(!InvitePlayer)
                                    }}
                                    className="flex text-sm font-medium text-gray-900 dark:text-gray-300 active:scale-90"><Send
                                    size={25} className="text-gray-900 dark:text-gray-300"/></span>
                            </label>
                            {InvitePlayer ? (
                                <div className="flex flex-col items-center px-8 py-10">
                                    <MultiSelect checkboxIcon value={SelectedPlayers} options={AllPlayers}
                                                 onChange={(e) => {
                                                     setSelectedPlayers(e.value)
                                                 }}
                                                 optionLabel="firstName"
                                                 placeholder="Select Players" itemTemplate={PlayerTemplate}
                                                 panelFooterTemplate={PlayersFooterTemplate}
                                                 className="w-full md:w-20rem py-1.5"
                                                 filter filterIcon
                                                 showSelectAll={false}
                                                 selectionLimit={3}
                                                 itemClassName={"flex items-center"}
                                                 display="chip"/>
                                    <div
                                        className="mt-8 flex flex-col justify-center space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
                                        <button
                                            onClick={() => {
                                                setAddPlayer(false)
                                            }}
                                            className="whitespace-nowrap rounded-md bg-gray-200 px-4 py-3 font-medium dark:bg-gray-800 ">Cancel
                                            Operation
                                        </button>
                                        <button
                                            onClick={invitePlayers}
                                            className="whitespace-nowrap rounded-md bg-blue-500 px-4 py-3 font-medium text-white">Invite
                                            Players
                                        </button>
                                    </div>

                                </div>
                            ) : (
                                <div className="flex flex-col items-center px-8 py-10">
                                    <label className="block w-full" htmlFor="name">
                                        <p className={NewPlayerErrors.firstName.state ? "mb-1 text-sm text-red-600" : "mb-1 text-sm text-gray-600"}>First
                                            Name</p>
                                        <input
                                            value={NewPlayer.firstName}
                                            onChange={(e) => {
                                                SetNewPlayer(
                                                    {
                                                        ...NewPlayer,
                                                        firstName: e.target.value
                                                    }
                                                )
                                            }}
                                            className={NewPlayerErrors.firstName.state ? errorclassname : classname}
                                            type="text" placeholder="Enter First Name"/>
                                        {NewPlayerErrors.firstName.state && (
                                            <p className="text-sm text-red-600 ">{NewPlayerErrors.firstName.message}</p>
                                        )}
                                    </label>
                                    <label className="mt-4 block w-full" htmlFor="name">
                                        <p className={NewPlayerErrors.lastName.state ? "mb-1 text-sm text-red-600" : "mb-1 text-sm text-gray-600"}>Last
                                            Name</p>
                                        <input
                                            value={NewPlayer.lastName}
                                            onChange={(e) => {
                                                SetNewPlayer(
                                                    {
                                                        ...NewPlayer,
                                                        lastName: e.target.value
                                                    }
                                                )
                                            }}
                                            className={NewPlayerErrors.lastName.state ? errorclassname : classname}
                                            type="text" placeholder="Enter Last Name"/>
                                        {NewPlayerErrors.lastName.state && (
                                            <p className="text-sm text-red-600">{NewPlayerErrors.lastName.message}</p>
                                        )}
                                    </label>
                                    <label className="mt-4 block w-full" htmlFor="name">
                                        <p className={NewPlayerErrors.email.state ? "mb-1 text-sm text-red-600" : "mb-1 text-sm text-gray-600"}>Email
                                            Address</p>
                                        <input
                                            value={NewPlayer.email}
                                            onChange={(e) => {
                                                SetNewPlayer(
                                                    {
                                                        ...NewPlayer,
                                                        email: e.target.value
                                                    }
                                                )
                                            }}
                                            className={NewPlayerErrors.email.state ? errorclassname : classname}
                                            type="email" placeholder="Enter email"/>
                                        {NewPlayerErrors.email.state && (
                                            <p className="text-sm text-red-600">{NewPlayerErrors.email.message}</p>
                                        )}
                                    </label>
                                    <label className="mt-4 block w-full" htmlFor="name">
                                        <p className={NewPlayerErrors.position.state ? "mb-1 text-sm text-red-600" : "mb-1 text-sm text-gray-600"}>Position</p>
                                        <select
                                            value={NewPlayer.position}
                                            onChange={(e) => {
                                                SetNewPlayer(
                                                    {
                                                        ...NewPlayer,
                                                        position: e.target.value
                                                    }
                                                )
                                            }}
                                            defaultValue="AM"
                                            className={NewPlayerErrors.position.state ? errorclassname + " text-gray-500" : classname}
                                            type="email">
                                            <option value="AM">Attacking Midfielder</option>
                                            <option value="CB">Center Back</option>
                                            <option value="CF">Center Forward</option>
                                            <option value="CM">Central Midfielder</option>
                                            <option value="D">Defender</option>
                                            <option value="DM">Defensive Midfielder</option>
                                            <option value="FB">Full Back</option>
                                            <option value="F">Forward</option>
                                            <option value="GK">Goalkeeper</option>
                                            <option value="LM">Left Midfielder</option>
                                            <option value="M">Midfielder</option>
                                            <option value="RM">Right Midfielder</option>
                                            <option value="S">Striker</option>
                                            <option value="SS">Second Striker</option>
                                            <option value="WB">Wing Back</option>
                                            <option value="W">Winger</option>
                                        </select>
                                        {NewPlayerErrors.position.state && (
                                            <p className="text-sm text-red-600">{NewPlayerErrors.position.message}</p>
                                        )}
                                    </label>

                                    <div
                                        className="mt-8 flex flex-col justify-center space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
                                        <button
                                            onClick={() => {
                                                setAddPlayer(false)
                                            }}
                                            className="whitespace-nowrap rounded-md bg-gray-200 px-4 py-3 font-medium dark:bg-gray-800">Cancel
                                            Operation
                                        </button>
                                        <button
                                            onClick={addplayer}
                                            className="whitespace-nowrap rounded-md bg-blue-500 px-4 py-3 font-medium text-white">Add
                                            Player
                                        </button>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-4">Password will be sent to their email</p>
                                </div>
                            )}
                        </div>
                    </div>
                )
            }

            {
                AddStaff && (
                    <div
                        className="bg-[#0000007F] justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                    >
                        <div
                            className="relative dark:bg-neutral-700 dark:text-gray-100 bg-white m-10 max-w-lg rounded-md border text-gray-800 shadow-lg">
                            <p className="mt-4 pl-4 text-xl font-bold">Add a new staff member</p>
                            <svg xmlns="http://www.w3.org/2000/svg"
                                 onClick={() => {
                                     setAddStaff(false)
                                 }}
                                 className="absolute right-0 top-0 m-3 h-6 w-6 cursor-pointer text-gray-400" fill="none"
                                 viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                            <label className="flex justify-center mt-5 gap-3 items-center cursor-pointer">
                                <span
                                    onClick={() => {
                                        setInviteStaff(!InviteStaff)
                                    }}
                                    className="flex ms-3 text-sm font-medium text-gray-900 dark:text-gray-300 active:scale-90"><Add2
                                    size={25} className="text-gray-900 dark:text-gray-300"/></span>
                                <input type="checkbox" value={InviteStaff} className="sr-only peer"/>
                                <div
                                    onClick={() => {
                                        setInviteStaff(!InviteStaff)
                                    }}
                                    className="relative w-11 h-6 bg-gray-200  dark:text-gray-100 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-500 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-900"></div>
                                <span
                                    onClick={() => {
                                        setInviteStaff(!InviteStaff)
                                    }}
                                    className="flex text-sm font-medium text-gray-900 dark:text-gray-300 active:scale-90"><Send
                                    size={25} className="text-gray-900 dark:text-gray-300"/></span>
                            </label>
                            {InviteStaff ? (<>
                                <div className="flex flex-col items-center px-8 py-10">
                                    <MultiSelect checkboxIcon value={SelectedStaff} options={AllStaff}
                                                 onChange={(e) => {
                                                     setSelectedStaff(e.value)
                                                 }}
                                                 optionLabel="firstName"
                                                 placeholder="Select Staff" itemTemplate={StaffTemplate}
                                                 panelFooterTemplate={StaffFooterTemplate}
                                                 className="w-full md:w-20rem py-1.5"
                                                 filter filterIcon
                                                 showSelectAll={false}
                                                 selectionLimit={3}
                                                 itemClassName={"flex items-center"}
                                                 display="chip"/>
                                    <div
                                        className="mt-8 flex flex-col justify-center space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
                                        <button
                                            onClick={() => {
                                                setAddStaff(false)
                                            }}
                                            className="whitespace-nowrap rounded-md bg-gray-200 px-4 py-3 font-medium dark:bg-gray-800">Cancel
                                            Operation
                                        </button>
                                        <button
                                            onClick={inviteStaff}
                                            className="whitespace-nowrap rounded-md bg-blue-500 px-4 py-3 font-medium text-white">Invite
                                            Staff
                                        </button>
                                    </div>

                                </div>

                            </>) : (
                                <>
                                    <div className="flex flex-col items-center px-8 py-10">
                                        <label className="block w-full" htmlFor="name">
                                            <p className={NewStaffErrors.firstName.state ? "mb-1 text-sm text-red-600" : "mb-1 text-sm text-gray-600"}>First
                                                Name</p>
                                            <input
                                                value={NewStaff.firstName}
                                                onChange={(e) => {
                                                    SetNewStaff(
                                                        {
                                                            ...NewStaff,
                                                            firstName: e.target.value
                                                        }
                                                    )
                                                }}
                                                className={NewStaffErrors.firstName.state ? errorclassname : classname}
                                                type="text" placeholder="Enter First Name"/>
                                            {NewStaffErrors.firstName.state && (
                                                <p className="text-sm text-red-600">{NewStaffErrors.firstName.message}</p>
                                            )}
                                        </label>
                                        <label className="mt-4 block w-full" htmlFor="name">
                                            <p className={NewStaffErrors.lastName.state ? "mb-1 text-sm text-red-600" : "mb-1 text-sm text-gray-600"}>Last
                                                Name</p>
                                            <input
                                                value={NewStaff.lastName}
                                                onChange={(e) => {
                                                    SetNewStaff(
                                                        {
                                                            ...NewStaff,
                                                            lastName: e.target.value
                                                        }
                                                    )
                                                }}
                                                className={NewStaffErrors.lastName.state ? errorclassname : classname}
                                                type="text" placeholder="Enter Last Name"/>
                                            {NewStaffErrors.lastName.state && (
                                                <p className="text-sm text-red-600">{NewStaffErrors.lastName.message}</p>
                                            )}
                                        </label>
                                        <label className="mt-4 block w-full" htmlFor="name">
                                            <p className={NewStaffErrors.email.state ? "mb-1 text-sm text-red-600" : "mb-1 text-sm text-gray-600"}>Email
                                                Address</p>
                                            <input
                                                value={NewStaff.email}
                                                onChange={(e) => {
                                                    SetNewStaff(
                                                        {
                                                            ...NewStaff,
                                                            email: e.target.value
                                                        }
                                                    )
                                                }}
                                                className={NewStaffErrors.email.state ? errorclassname : classname}
                                                type="email" placeholder="Enter email"/>
                                            {NewStaffErrors.email.state && (
                                                <p className="text-sm text-red-600">{NewStaffErrors.email.message}</p>
                                            )}
                                        </label>
                                        <label className="mt-4 block w-full" htmlFor="name">
                                            <p className={NewStaffErrors.position.state ? "mb-1 text-sm text-red-600" : "mb-1 text-sm text-gray-600"}>Position</p>
                                            <select
                                                value={NewStaff.position}
                                                onChange={(e) => {
                                                    SetNewStaff(
                                                        {
                                                            ...NewStaff,
                                                            position: e.target.value
                                                        }
                                                    )
                                                }}
                                                defaultValue="AM"
                                                className={NewStaffErrors.position.state ? errorclassname + " text-gray-500" : classname}
                                                type="email">
                                                <option value="manager">Manager</option>
                                                <option value="assistant_manager">Assistant Manager</option>
                                                <option value="coach">Coach</option>
                                                <option value="goalkeeping_coach">Goalkeeping Coach</option>
                                                <option value="fitness_coach">Fitness Coach</option>
                                                <option value="analyst">Analyst</option>
                                                <option value="scout">Scout</option>
                                                <option value="physiotherapist">Physiotherapist</option>
                                                <option value="doctor">Team Doctor</option>
                                                <option value="nutritionist">Nutritionist</option>
                                                <option value="psychologist">Sports Psychologist</option>
                                                <option value="media_officer">Media Officer</option>
                                                <option value="kit_manager">Kit Manager</option>
                                            </select>
                                            {NewPlayerErrors.position.state && (
                                                <p className="text-sm text-red-600">{NewPlayerErrors.position.message}</p>
                                            )}
                                        </label>

                                        <div
                                            className="mt-8 flex flex-col justify-center space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
                                            <button
                                                onClick={() => {
                                                    setAddStaff(false)
                                                }}
                                                className="whitespace-nowrap rounded-md bg-gray-200 px-4 py-3 font-medium dark:bg-gray-800">Cancel
                                                Operation
                                            </button>
                                            <button
                                                onClick={addstaffmember}
                                                className="whitespace-nowrap rounded-md bg-blue-500 px-4 py-3 font-medium text-white">Add
                                                Staff
                                            </button>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-4">Password will be sent to their email</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )
            }


        </>
    )
}