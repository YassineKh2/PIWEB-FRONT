import {useCallback, useEffect, useState} from "react";
import {jwtDecode} from "jwt-decode";
import {getUserData} from "../../../../../../Services/apiUser.js";
import {getTeam, updateTeam, updateTeamImage} from "../../../../../../Services/FrontOffice/apiTeam.js";
import {GetCitybyStateAndCountry, GetCountries, GetStateByCountry} from "../../../../../../Services/APis/CountryAPI.js";
import {DatePickerDemo} from "./DatePickerTeam.jsx";
import {useDropzone} from "react-dropzone";


export default function TeamProfile() {
    const [Team, setTeam] = useState({})
    const [date, setDate] = useState()
    const [image, setImage] = useState()
    const path = "http://localhost:3000/public/images/teams/";


    const onDrop = useCallback(acceptedFiles => {
        try {
            setImage(URL.createObjectURL(acceptedFiles[0]));
            // setTeam({...Team, image: acceptedFiles[0]})
            let teamData = {
                _id: Team._id,
                image: acceptedFiles[0],
                imagename: acceptedFiles[0].name
            }
            updateTeamImage(teamData).then(() => {
                setToast(true)
                setToastMessage('Team Picture Updated Successfully')
                setTimeout(() => {
                    setToast(false)
                }, 3000)
            }).catch((error) => {
                setErrorToast(true)
                setToastMessage('Error Updating Profile', error.message)
            })
        } catch (e) {
            console.log(e)
        }
    }, [Team])

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop,
        accept:
            {'image/*': []}
    });


    useEffect(() => {
        try {
            if (localStorage.getItem('token') === null)
                return;

            const userToken = localStorage.getItem('token');
            const decodedToken = jwtDecode(userToken);
            getUserData(decodedToken.userId).then((response) => {
                getTeam(response.user.PlayingFor).then((response) => {
                    setTeam(response.team)
                    setDate(response.team.foundedIn)
                    setImage(path + response.team.image)
                })
            })
        } catch (e) {
            console.log(e.message)
        }


    }, [])


    //-------------------- County API --------------------

    const [Countries, setCountries] = useState([]);
    const [States, setStates] = useState([]);
    const [Cites, setCites] = useState([]);

    useEffect(() => {
        GetCountries().then((response) => {
            setCountries(response);
        });
    }, [Team]);

    useEffect(() => {
        if (Team.country) {
            setCites([]);
            GetStateByCountry(Team.country).then((response) => {
                setStates(response);
            });
        }
    }, [Team.country]);

    useEffect(() => {
        if (Team.state) {
            GetCitybyStateAndCountry(Team.country, Team.state).then((response) => {
                setCites(response);
            });
        }
    }, [Team.state, Team.country]);

    //-------------------- County API --------------------


    const [Toast, setToast] = useState(false)
    const [ErrorToast, setErrorToast] = useState(false)
    const [ToastMessage, setToastMessage] = useState('')


    function saveProfile() {
        try {


            if (Team.name === '' || Team.nameAbbreviation === '' || Team.country === '' || Team.state === '' || Team.city === '' || Team.zipcode === '' || Team.founder === '' || Team.slogan === '' || date === '') {
                setErrorToast(true)
                setToastMessage('Please fill all the fields')
                setTimeout(() => {
                    setErrorToast(false)
                }, 3000)
                return
            }

            if (Team.nameAbbreviation.length !== 3) {
                setErrorToast(true)
                setToastMessage('Team Abbreviation must be at least 3 characters')
                setTimeout(() => {
                    setErrorToast(false)
                }, 3000)
                return
            }

            Team.foundedIn = date

            updateTeam(Team).then(() => {
                setToast(true)
                setToastMessage('Profile Updated Successfully')
                setTimeout(() => {
                    setToast(false)
                }, 3000)
            }).catch((error) => {
                setToast(true)
                setToastMessage('Error Updating Profile', error.message)
            })
        } catch (e) {
            console.log(e.message)
        }
    }

    return (
        <>

            <div
                className="flex flex-col overflow-hidden rounded-xl sm:bg-gray-50 sm:px-8 sm:shadow dark:bg-neutral-900 w-5/6 md:w-full">
                <div className="pt-4">
                    <h1 className="py-2 text-2xl font-semibold ">Team Profile</h1>
                </div>
                <hr className="mt-4 mb-8"/>

                <p className="py-2 text-xl font-semibold">Team Logo</p>
                <label
                    htmlFor="image"
                    className="mb-3  block text-sm font-medium text-dark dark:text-white"
                >
                    {" "}
                    Profile Picture{" "}
                </label>
                <div className="flex gap-10 items-center">
                    <img src={image} alt="team image" className="w-1/6 h-1/6 rounded"/>

                    <div className=" ">

                        <div
                            className="flex flex-col items-center justify-center w-full gap-6" {...getRootProps()} >
                            <label htmlFor="dropzone-file"
                                   className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-neutral-600 dark:bg-neutral-700   hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500">
                                <div
                                    className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg
                                        className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                        aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                        fill="none" viewBox="0 0 20 16">
                                        <path stroke="currentColor" strokeLinecap="round"
                                              strokeLinejoin="round" strokeWidth="2"
                                              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                    </svg>
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                                                <span
                                                                    className="font-semibold">Click to upload</span> or
                                        drag and drop</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">SVG,
                                        PNG, JPG or GIF (MAX. 800x400px)</p>
                                </div>
                                <input id="dropzone-file" type="file"
                                       className="hidden" {...getInputProps()}
                                       name="image"
                                />
                            </label>


                        </div>
                    </div>
                </div>
                <hr className="mt-4 mb-8"/>

                <p className="py-2 text-xl font-semibold">Name And Abbreviation</p>
                <div className="flex flex-col space-y-2 lg:flex-row lg:space-y-0 lg:space-x-3">
                    <label htmlFor="login-password">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Name</span>
                        <div
                            className="relative flex overflow-hidden rounded-md border-2 transition dark:focus-within:border-blue-900 focus-within:border-blue-600">
                            <input type="text" id="login-currentpassword"
                                   value={Team.name}
                                   onChange={(e) => {
                                       setTeam({...Team, name: e.target.value})
                                   }}
                                   className="w-full dark:bg-neutral-700 dark:text-gray-100 flex-shrink appearance-none border-gray-300 bg-white py-3 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
                                   placeholder="Team Name"/>
                        </div>
                    </label>
                    <label htmlFor="login-password">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Abbreviation</span>
                        <div
                            className="relative  flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
                            <input type="text" id="login-currentpassword"
                                   value={Team.nameAbbreviation}
                                   onChange={(e) => {
                                       setTeam({...Team, nameAbbreviation: e.target.value})
                                   }}
                                   className="w-full dark:bg-neutral-700 dark:text-gray-100 flex-shrink appearance-none border-gray-300 bg-white py-3 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
                                   placeholder="Team Abbreviation"/>
                        </div>
                    </label>
                    <label htmlFor="login-password">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Nickname</span>
                        <div
                            className="relative  flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
                            <input type="text" id="login-currentpassword"
                                   value={Team.nickname}
                                   onChange={(e) => {
                                       setTeam({...Team, nickname: e.target.value})
                                   }}
                                   className="w-full  dark:bg-neutral-700 dark:text-gray-100 flex-shrink appearance-none border-gray-300 bg-white py-3 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
                                   placeholder="Team Nickname"/>
                        </div>
                    </label>
                </div>


                <hr className="mt-4 mb-8"/>
                <p className="py-2 text-xl font-semibold">Location</p>
                <div className="flex items-center">
                    <div className="flex flex-col space-y-2 lg:flex-row lg:space-y-0 lg:space-x-3">
                        <label htmlFor="login-password">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Country</span>
                            <div
                                className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
                                <select
                                    name="country"
                                    value={Team.country}
                                    onChange={(e) => {
                                        setTeam({...Team, country: e.target.value})
                                    }}
                                    className="w-full  dark:bg-neutral-700 dark:text-gray-100 rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:shadow-signUp">
                                    {Countries.map((country, index) => (
                                        <option key={index} value={country.iso2}>
                                            {country.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </label>
                        <label htmlFor="login-password">
                            <span className="text-sm text-gray-500 dark:text-gray-400">City</span>
                            <div
                                className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
                                <select
                                    name="state"
                                    defaultValue={Team.state}
                                    onChange={(e) => {
                                        setTeam({...Team, state: e.target.value})
                                    }}
                                    className="w-full dark:bg-neutral-700 dark:text-gray-100 rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:shadow-signUp">
                                    {States.map((state, index) => (
                                        <option key={index} value={state.iso2}>
                                            {state.name}
                                        </option>

                                    ))}
                                </select>
                            </div>
                        </label>
                        <label htmlFor="login-password">
                            <span className="text-sm text-gray-500 dark:text-gray-400">City</span>
                            <div
                                className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
                                <select
                                    name="city"
                                    defaultValue={Team.city}
                                    onChange={(e) => {
                                        setTeam({...Team, city: e.target.value})
                                    }}
                                    className="w-full  dark:bg-neutral-700 dark:text-gray-100 rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:shadow-signUp">
                                    {Cites.map((city, index) => (
                                        <option key={index} value={city.iso2}>
                                            {city.name}
                                        </option>

                                    ))}
                                </select>
                            </div>
                        </label>
                        <label htmlFor="login-password">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Postal Code</span>
                            <div
                                className="relative  flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
                                <input type="number" id="zipcode"
                                       value={Team.zipcode}
                                       onChange={(e) => {
                                           setTeam({...Team, zipcode: e.target.value})
                                       }}
                                       className="w-full dark:bg-neutral-700 dark:text-gray-100  flex-shrink appearance-none border-gray-300 bg-white py-3 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
                                       placeholder="Postal Code"/>
                            </div>
                        </label>
                    </div>


                </div>


                <hr className="mt-4 mb-8"/>
                <p className="py-2 text-xl font-semibold">History And Description</p>
                <div className="flex items-center">
                    <div className="flex flex-col space-y-2 lg:flex-row lg:space-y-0 lg:space-x-3">
                        <label htmlFor="Founder">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Founder</span>
                            <div
                                className="relative  flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
                                <input type="text" id="login-currentpassword"
                                       value={Team.founder}
                                       onChange={(e) => {
                                           setTeam({...Team, founder: e.target.value})
                                       }}
                                       className="w-full dark:bg-neutral-700 dark:text-gray-100  flex-shrink appearance-none border-gray-300 bg-white py-3 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
                                       placeholder="Team Founder"/>
                            </div>
                        </label>
                        <label htmlFor="">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Founded In</span>
                            <div
                                className="relative dark:bg-neutral-700 dark:text-gray-100  flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
                                <DatePickerDemo date={date} setDate={setDate}/>
                            </div>
                        </label>
                        <label htmlFor="">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Slogan</span>
                            <div
                                className="relative  flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
                                <input type="text" id="login-currentpassword"
                                       value={Team.slogan}
                                       onChange={(e) => {
                                           setTeam({...Team, slogan: e.target.value})
                                       }}
                                       className="w-full dark:bg-neutral-700 dark:text-gray-100  flex-shrink appearance-none border-gray-300 bg-white py-3 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
                                       placeholder="Team Slogan"/>
                            </div>
                        </label>
                        <label htmlFor="">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Description</span>
                            <div
                                className="relative  flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
                                <textarea id="login-currentpassword"
                                          value={Team.description}
                                          onChange={(e) => {
                                              setTeam({...Team, description: e.target.value})
                                          }}
                                          className="w-full dark:bg-neutral-700 dark:text-gray-100 md:w-80  flex-shrink appearance-none border-gray-300 bg-white py-3 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
                                          placeholder="Team Description"/>
                            </div>
                        </label>
                    </div>


                </div>


                <button
                    onClick={saveProfile}
                    className="mt-4 rounded-lg bg-blue-600 px-4 py-3 text-white self-start">Save Profile
                </button>

                <hr className="mt-4 mb-8"/>
                <div className="mb-10">
                    <p className="py-2 text-xl font-semibold">Delete Team</p>
                    <p className="inline-flex items-center rounded-full bg-rose-100 px-4 py-1 text-rose-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" viewBox="0 0 20 20"
                             fill="currentColor">
                            <path fillRule="evenodd"
                                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                  clipRule="evenodd"/>
                        </svg>
                        Proceed with caution
                    </p>
                    <p className="mt-2">Make sure you have taken backup of your account in case you ever need to
                        get access to your data. We will completely wipe your data. There is no way to access
                        your team after this action.</p>
                    <button
                        className="ml-auto text-sm font-semibold text-rose-600 underline decoration-2">Continue
                        with deletion
                    </button>
                </div>
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
    );
}