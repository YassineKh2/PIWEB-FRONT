import {useEffect, useState} from "react";
import {jwtDecode} from "jwt-decode";
import {getUserData, updatePlayerImage, updateUser} from "../../../../../../Services/apiUser.js";
import {getTeam} from "../../../../../../Services/FrontOffice/apiTeam.js";
import {TbPhotoEdit as EditPhoto} from "react-icons/tb";


export default function PlayerCredentials() {
    const [player, setplayer] = useState({})
    const [team, setTeam] = useState({})
    const path = "http://localhost:3000/public/images/teams/";
    const pathPlayer = "http://localhost:3000/public/images/players/";

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


    const [showposition, setshowposition] = useState(false)
    const [position, setposition] = useState()
    const [showstrongfoot, setshowstrongfoot] = useState(false)
    const [strongfoot, setstrongfoot] = useState()
    const [showbio, setshowbio] = useState(false)
    const [bio, setbio] = useState()
    const [image, setimage] = useState()


    useEffect(() => {
        try {
            if (localStorage.getItem('token') === null)
                return;

            const userToken = localStorage.getItem('token');
            const decodedToken = jwtDecode(userToken);
            getUserData(decodedToken.userId).then((response) => {
                setplayer(response.user)
                setstrongfoot(response.user.preferredFoot)
                setimage(pathPlayer + response.user.image)
                if (response.user.PlayingFor) {
                    getTeam(response.user.PlayingFor).then((response) => {
                        setTeam(response.team)
                    })
                }

            })
        } catch (e) {
            console.log(e.message)
        }


    }, [])

    const [errorposition, seterrorposition] = useState('')
    const [errorshowstrongfoot, seterrorshowstrongfoot] = useState('')
    const [errorbio, seterrorbio] = useState('')
    const [Toast, setToast] = useState(false)
    const [ToastMessage, setToastMessage] = useState('')
    const [leaveModal, setleaveModal] = useState('')


    function changeposition() {
        let updatedPlayer = {
            ...player,
            position: position
        }
        updateUser(updatedPlayer).then((response) => {
            setToast(true)
            setToastMessage('Position updated !')
            setTimeout(() => {
                setToast(false)
            }, 5000)
            setplayer(updatedPlayer)

        }).catch((error) => {
            seterrorposition(error.message)
        })
    }

    function changestrongfoot() {
        let updatedPlayer = {
            ...player,
            preferredFoot: strongfoot
        }


        updateUser(updatedPlayer).then((response) => {
            setToast(true)
            setToastMessage('Strong updated !')
            setTimeout(() => {
                setToast(false)
            }, 5000)
            setplayer(updatedPlayer)

        }).catch((error) => {
            seterrorshowstrongfoot(error.message)
        })
    }

    function leaveteam() {
        let updatedPlayer = {
            ...player,
            PlayingFor: null
        }
        updateUser(updatedPlayer).then((response) => {
            setToast(true)
            setToastMessage('You have left the team !')
            setTimeout(() => {
                setToast(false)
            }, 5000)
            setplayer(updatedPlayer)
            setTeam({})
            setleaveModal(false)
        }).catch((error) => {
            console.log(error.message)
        })

    }

    function changebio() {
        let updatedPlayer = {
            ...player,
            bio: bio
        }
        updateUser(updatedPlayer).then((response) => {
            setToast(true)
            setToastMessage('Bio updated !')
            setTimeout(() => {
                setToast(false)
            }, 5000)
            setplayer(updatedPlayer)
            setshowbio(false)
        }).catch((error) => {
            console.log(error.message)
        })
    }

    function handleImageChange(e) {
        let file = e.target.files[0];


        let updatedPlayer = {
            ...player,
            image : file,
            imagename : file.name,
        }

        updatePlayerImage(updatedPlayer).then(() => {
            setToast(true)
            setToastMessage('Image updated !')
            setTimeout(() => {
                setToast(false)
            }, 5000)
            setimage(URL.createObjectURL(file))
            setplayer(updatedPlayer)

        }).catch((error) => {
            console.log(error.message)
        })


    }


    return (
        <>
            <div
                className="flex flex-col overflow-hidden rounded-xl sm:bg-gray-50 sm:px-8 sm:shadow dark:bg-neutral-900 w-5/6 md:w-full">
                <div className="pt-4">
                    <h1 className="py-2 text-2xl font-semibold">Team And Profile Details</h1>
                </div>
                <hr className="mt-4 mb-8"/>
                <div className="flex gap-10 justify-between">
                    <div >
                                <p className="py-2 text-xl font-semibold">{player.firstName} {player.lastName}</p>
                        <div className="flex gap-2">
                            <img src={image}
                                 className="w-30 md:w-35 xl:w-40  rounded-2xl"
                                 alt="team image"
                            />
                            <label htmlFor="hiddenFileInput" className="cursor-pointer">
                                <EditPhoto size={20}/>
                            </label>
                            <input type="file" id="hiddenFileInput" accept="image/*" style={{display: 'none'}}
                                   onChange={handleImageChange}/>
                        </div>


                    </div>

                    <div>
                        {team && team.name && team.image ? (
                            <>
                            <p className="py-2 text-xl font-semibold">{team.name}</p>
                                <img src={path + team.image}
                                     className="w-30 md:w-35 xl:w-40  rounded-2xl"
                                     alt="team image"
                                />
                            </>
                        ) : (
                            <>
                                <p className="py-2 text-xl font-semibold">No Team</p>
                                <img
                                    src="https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
                                    className="w-30 md:w-35 xl:w-40  rounded-2xl"
                                    alt="team image"
                                />
                            </>)
                        }
                    </div>
                </div>

                <p className="py-2 text-xl font-semibold">General Info</p>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <p className="mt-2 text-slate-600 dark:text-gray-300"><strong>Position</strong></p>
                    <p className="text-gray-600 dark:text-gray-400">
                        {positionMapping[player.position]}
                    </p>
                    <button onClick={() => setshowposition(!showposition)}
                            className="inline-flex text-sm font-semibold text-blue-600 underline decoration-2">Change
                    </button>
                </div>
                {showposition &&
                    <label htmlFor="emailChange" className="self-start mt-2 flex gap-4 items-center justify-center">
                        <div
                            className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
                            <select
                                onChange={(event) => setposition(event.target.value)}
                                name="position"
                                defaultValue={player.position}
                                className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp">
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

                        </div>
                        {errorposition && <p className="mt-2 text-red-500">{errorposition}</p>}
                        <button onClick={changeposition}
                                className="  rounded-lg mt-1 bg-blue-600 px-4 py-2 text-white self-start">Save Position
                        </button>
                    </label>
                }

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <p className="mt-2 text-slate-600 dark:text-gray-300"><strong>Strong Foot</strong></p>
                    <p className="text-gray-600 dark:text-gray-400">
                        {player.preferredFoot}
                    </p>
                    <button onClick={() => setshowstrongfoot(!showstrongfoot)}
                            className="inline-flex text-sm font-semibold text-blue-600 underline decoration-2">Change
                    </button>
                </div>
                {showstrongfoot &&
                    <label htmlFor="emailChange" className="self-start mt-2 flex gap-4 items-center justify-center">
                        <div
                            className="relative flex overflow-hidden rounded-md  transition focus-within:border-blue-600">
                            <div className="flex flex-col md:flex-row justify-between w-full gap-4 ">

                                <div
                                    className="flex items-center w-full ps-4 border px-2 rounded-2xl  dark:border-gray-700">
                                    <input id="bordered-radio-1" type="radio" value="Left"
                                           name="preferredFoot"
                                           checked={strongfoot === "Left"}
                                           onChange={(event) => setstrongfoot(event.target.value)}
                                           className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                    <label htmlFor="bordered-radio-1"
                                           className="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Left</label>
                                </div>
                                <div
                                    className="flex items-center w-full ps-4  border px-2 rounded-2xl dark:border-gray-700">
                                    <input id="bordered-radio-2" type="radio" value="Both"
                                           name="preferredFoot"
                                           checked={strongfoot === "Both"}
                                           onChange={(event) => setstrongfoot(event.target.value)}
                                           className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                    <label htmlFor="bordered-radio-2"
                                           className="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Both</label>
                                </div>
                                <div
                                    className="flex items-center w-full ps-4 border px-2 rounded-2xl  dark:border-gray-700">
                                    <input id="bordered-radio-3" type="radio" value="Right"
                                           name="preferredFoot"
                                           checked={strongfoot === "Right"}
                                           onChange={(event) => setstrongfoot(event.target.value)}
                                           className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                    <label htmlFor="bordered-radio-3"
                                           className="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Right</label>
                                </div>

                            </div>

                        </div>
                        {errorshowstrongfoot && <p className="mt-2 text-red-500">{errorshowstrongfoot}</p>}
                        <button onClick={changestrongfoot}
                                className=" mb-2 rounded-lg bg-blue-600 px-4 py-2 text-white self-end ">Save Strong Foot
                        </button>
                    </label>
                }

                <div className="flex flex-col">
                    <div className="flex flex-col md:flex-row justify-between mb-1">
                        <p className="mt-2 text-slate-600 dark:text-gray-300"><strong>Bio</strong></p>
                        <button onClick={() => setshowbio(!showbio)}
                                className="inline-flex md:self-end text-sm font-semibold text-blue-600 underline decoration-2">Change
                        </button>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                        {player.bio}
                    </p>
                </div>

                {showbio &&
                    <label htmlFor="emailChange" className="self-start mt-2 flex gap-4 items-center justify-center">
                        <div
                            className="relative flex overflow-hidden rounded-md  transition focus-within:border-blue-600">
                            <div
                                className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
                                <textarea id="bio"
                                          placeholder="New Bio"
                                          value={bio}
                                          defaultValue={player.bio}
                                          onChange={(e) => setbio(e.target.value)}
                                          className="w-full flex-shrink appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
                                ></textarea>
                            </div>

                        </div>
                        {errorbio && <p className="mt-2 text-red-500">{errorbio}</p>}
                        <button onClick={changebio}
                                className=" mb-2 rounded-lg bg-blue-600 px-4 py-2 text-white self-end ">Save Bio
                        </button>
                    </label>
                }


                <hr className="mt-4 mb-8"/>

                <div className="mb-10">
                    <p className="py-2 text-xl font-semibold">Leave Team</p>
                    <p className="inline-flex items-center rounded-full bg-rose-100 px-4 py-1 text-rose-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" viewBox="0 0 20 20"
                             fill="currentColor">
                            <path fillRule="evenodd"
                                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                  clipRule="evenodd"/>
                        </svg>
                        Proceed with caution
                    </p>
                    <p className="mt-2">Leaving the team is a significant step. Once you leave, access to team resources
                        will be restricted,
                        and you will require an invitation to rejoin the team make sure you
                        communicate your departure with your team for a smooth transition of responsibilities.</p>
                    <button
                        onClick={() => setleaveModal(true)}
                        className="ml-auto text-sm font-semibold text-rose-600 underline decoration-2">Continue
                        with departure
                    </button>
                </div>

            </div>
            {
                Toast &&
                <div id="toast-bottom-right"
                     className="fixed flex items-center w-full max-w-xs p-4 space-x-4 text-white bg-green-600 divide-x rtl:divide-x-reverse divide-gray-200 rounded-lg shadow right-5 bottom-5 dark:text-gray-100 dark:divide-gray-700 space-x dark:bg-green-800"
                     role="alert">
                    <div className="text-sm font-normal">{ToastMessage}</div>
                </div>
            }
            {
                leaveModal &&
                <div
                    className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                >
                    <div
                        className="m-10  bg-white flex max-w-lg flex-col items-center rounded-md border px-8 py-10 text-gray-800 shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg"
                             className="h-16 w-16 rounded-xl bg-red-50 p-2 text-red-500"
                             fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                        <p className="mt-4 text-center text-xl font-bold">Leaving Team</p>
                        <p className="mt-2 text-center text-lg">Are you sure you want to delete leave the team <span
                            className="truncate font-medium">This Action is cannot be reversed </span></p>
                        <div
                            className="mt-8 flex flex-col justify-center space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
                            <button
                                onClick={leaveteam}
                                className="whitespace-nowrap rounded-md bg-red-500 px-4 py-3 font-medium text-white">Yes,
                                Leave team
                            </button>
                            <button onClick={() => {
                                setleaveModal(false)
                            }} className="whitespace-nowrap rounded-md bg-gray-200 px-4 py-3 font-medium">Cancel, Stay
                                on the team
                            </button>
                        </div>
                    </div>
                </div>
            }

        </>
    )

}