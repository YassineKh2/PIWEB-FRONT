import {useEffect, useState} from "react";
import {jwtDecode} from "jwt-decode";
import {getUserData, updateUser} from "../../../../../../Services/apiUser.js";
import {teal} from "@mui/material/colors";


export default function PlayerAccount() {
    const [player, setplayer] = useState({})
    const [TeamUpdatesSmsValue, setTeamUpdatesSmsValue] = useState(false);
    const [TeamUpdatesEmailValue, setTeamUpdatesEmailValue] = useState(false);
    const [TeamUpdatesDisableValue, setTeamUpdatesDisableValue] = useState(false);
    const [TeamInvitationsSmsValue, setTeamInvitationsSmsValue] = useState(false);
    const [TeamInvitationsEmailValue, setTeamInvitationsEmailValue] = useState(false);
    const [TeamInvitationsDisableValue, setTeamInvitationsDisableValue] = useState(false);

    const [Toast,setToast] = useState(false)
    const [ToastMessage,setToastMessage] = useState('')
    const [error,seterror] = useState('')

    useEffect(() => {
        try {
            if (localStorage.getItem('token') === null)
                return;

            const userToken = localStorage.getItem('token');
            const decodedToken = jwtDecode(userToken);
            getUserData(decodedToken.userId).then((response) => {
                setplayer(response.user)
                if(response.user.preferences.TeamInvitations)
                    setTeamInvitationsEmailValue(true)
                else
                    setTeamInvitationsDisableValue(true)
            })
        } catch (e) {
            console.log(e.message)
        }
    }, [])


    function savepreferances() {

        let TeamInvites = false

        if(TeamInvitationsDisableValue)
            TeamInvites = false
        else
            TeamInvites = true



        let updatedPlayer = {
            ...player,
            preferences: {
                TeamInvitations: TeamInvites,
                EmailUpdates: player.preferences.EmailUpdates
            }
        }


        updateUser(updatedPlayer).then((response) => {
            setToast(true)
            setToastMessage('Preferenceces updated !')
            setTimeout(() => {
                setToast(false)
            }, 5000)


        }).catch((error) => {
            seterror(error.message)
        })
    }

    return (
        <>
            <div className="col-span-8 overflow-hidden rounded-xl bg-gray-50 px-8 shadow dark:bg-neutral-900">
                <div className="border-b pt-4 pb-8">
                    <h1 className="py-2 text-2xl font-semibold">Notification settings</h1>
                    <p className="font- text-slate-600 dark:text-gray-300">Here you will find your notifications
                        settings</p>
                </div>
                <div className="grid border-b py-6 sm:grid-cols-2">
                    <div className="">
                        <h2 className="text-lg font-semibold leading-4 text-slate-700 dark:text-gray-100">Teams</h2>
                        <p className="mt-2 text-slate-600 dark:text-gray-300">Receive Team Invitations *</p>
                    </div>
                    <div className="mt-4 flex items-center sm:justify-end">
                        <div className="flex flex-col md:flex-row gap-3">
                            <label htmlFor="TeamInvitationsEmail"
                                   className="relative inline-flex cursor-pointer items-center">
                                <input
                                    onChange={() => {
                                        setTeamInvitationsEmailValue(!TeamInvitationsEmailValue);
                                        setTeamInvitationsDisableValue(false);
                                    }}
                                    checked={TeamInvitationsEmailValue}
                                    type="checkbox" id="TeamInvitationsEmail" className="peer sr-only"/>
                                <div
                                    className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Email</span>
                            </label>
                            <label htmlFor="TeamUpdatesSms"
                                   className="relative inline-flex cursor-pointer items-center">
                                <input
                                    onChange={() => {
                                        setTeamInvitationsSmsValue(!TeamInvitationsSmsValue);
                                        setTeamInvitationsDisableValue(false);
                                    }}
                                    checked={TeamInvitationsSmsValue}
                                    type="checkbox" id="TeamUpdatesSms" className="peer sr-only"/>
                                <div
                                    className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">SMS</span>
                            </label>
                            <label htmlFor="teamInvitationsDisable"
                                   className="relative inline-flex cursor-pointer items-center">
                                <input
                                    onChange={() => {
                                        setTeamInvitationsDisableValue(!TeamInvitationsDisableValue);
                                        setTeamInvitationsEmailValue(false);
                                        setTeamInvitationsSmsValue(false);
                                    }}
                                    checked={TeamInvitationsDisableValue}
                                    type="checkbox" id="teamInvitationsDisable" className="peer sr-only"/>
                                <div
                                    className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                                <span
                                    className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Disable</span>
                            </label>
                        </div>
                    </div>

                    <div className="mt-4">
                        <p className="font- text-slate-600 dark:text-gray-300">Team Updates </p>
                    </div>
                    <div className="mt-4 flex items-center sm:justify-end">
                        <div className="flex flex-col md:flex-row gap-3">
                            <label htmlFor="TeamUpdatesEmail"
                                   className="relative inline-flex cursor-pointer items-center">
                                <input
                                    onChange={() => {
                                        setTeamUpdatesEmailValue(!TeamUpdatesEmailValue);
                                        setTeamUpdatesDisableValue(false);
                                    }}
                                    type="checkbox" checked={TeamUpdatesEmailValue} id="TeamUpdatesEmail"
                                    className="peer sr-only"/>
                                <div
                                    className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Email</span>
                            </label>
                            <label htmlFor="TeamUpdatesEmailSms"
                                   className="relative inline-flex cursor-pointer items-center">
                                <input
                                    onChange={() => {
                                        setTeamUpdatesSmsValue(!TeamUpdatesSmsValue);
                                        setTeamUpdatesDisableValue(false);
                                    }}
                                    type="checkbox" checked={TeamUpdatesSmsValue} id="TeamUpdatesEmailSms"
                                    className="peer sr-only"/>
                                <div
                                    className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">SMS</span>
                            </label>
                            <label htmlFor="TeamUpdatesDisable"
                                   className="relative inline-flex cursor-pointer items-center">
                                <input
                                    onChange={() => {
                                        setTeamUpdatesDisableValue(!TeamUpdatesDisableValue);
                                        setTeamUpdatesSmsValue(false);
                                        setTeamUpdatesEmailValue(false);
                                    }}
                                    type="checkbox" checked={TeamUpdatesDisableValue} id="TeamUpdatesDisable"
                                    className="peer sr-only"/>
                                <div
                                    className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                                <span
                                    className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Disable</span>
                            </label>
                        </div>
                    </div>

                </div>

                <div className="grid border-b py-6 sm:grid-cols-2">
                    <div className="">
                        <h2 className="text-lg font-semibold leading-4 text-slate-700 dark:text-gray-100">Reminders</h2>
                        <p className="mt-2 text-slate-600 dark:text-gray-300">Adjust your Tournament , Match and
                            Training Reminders</p>
                    </div>
                    <div className="mt-4 flex items-center sm:justify-end">
                        <div className="flex flex-col md:flex-row gap-3">
                            <label htmlFor="email" className="relative inline-flex cursor-pointer items-center">
                                <input type="checkbox" value="" id="email" className="peer sr-only"/>
                                <div
                                    className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Email</span>
                            </label>
                            <label htmlFor="sms" className="relative inline-flex cursor-pointer items-center">
                                <input type="checkbox" value="" id="sms" className="peer sr-only"/>
                                <div
                                    className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">SMS</span>
                            </label>
                            <label htmlFor="push" className="relative inline-flex cursor-pointer items-center">
                                <input type="checkbox" value="" id="push" className="peer sr-only"/>
                                <div
                                    className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                                <span
                                    className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Disable</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div className="grid  py-6 sm:grid-cols-2">
                    <div className="">
                        <h2 className="text-lg font-semibold leading-4 text-slate-700 dark:text-gray-100">Updates</h2>
                        <p className="mt-2 text-slate-600 dark:text-gray-300">Receive updates about your followed
                            teams and tournaments</p>
                    </div>
                    <div className="mt-4 flex items-center sm:justify-end">
                        <div className="flex flex-col md:flex-row gap-3">
                            <label htmlFor="email" className="relative inline-flex cursor-pointer items-center">
                                <input type="checkbox" value="" id="email" className="peer sr-only"/>
                                <div
                                    className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Email</span>
                            </label>
                            <label htmlFor="sms" className="relative inline-flex cursor-pointer items-center">
                                <input type="checkbox" value="" id="sms" className="peer sr-only"/>
                                <div
                                    className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">SMS</span>
                            </label>
                            <label htmlFor="push" className="relative inline-flex cursor-pointer items-center">
                                <input type="checkbox" value="" id="push" className="peer sr-only"/>
                                <div
                                    className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                                <span
                                    className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Disable</span>
                            </label>
                        </div>
                    </div>
                    <div className="">
                        <p className="mt-4 text-slate-600 dark:text-gray-300">Get updates about new features</p>
                    </div>
                    <div className="mt-4 flex items-center sm:justify-end">
                        <div className="flex flex-col md:flex-row gap-3">
                            <label htmlFor="email" className="relative inline-flex cursor-pointer items-center">
                                <input type="checkbox" value="" id="email" className="peer sr-only"/>
                                <div
                                    className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Email</span>
                            </label>
                            <label htmlFor="sms" className="relative inline-flex cursor-pointer items-center">
                                <input type="checkbox" value="" id="sms" className="peer sr-only"/>
                                <div
                                    className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">SMS</span>
                            </label>
                            <label htmlFor="push" className="relative inline-flex cursor-pointer items-center">
                                <input type="checkbox" value="" id="push" className="peer sr-only"/>
                                <div
                                    className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                                <span
                                    className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Disable</span>
                            </label>
                        </div>
                    </div>
                </div>
                <button onClick={savepreferances}
                        className="my-4 rounded-lg bg-blue-600 px-4 py-2 text-white">Save
                </button>
            </div>
            <p className="flex justify-end mt-2 text-gray-600 dark:text-gray-300">* Pressing Disable will block all Team
                Invitations</p>
            {Toast &&
                <div id="toast-bottom-right"
                     className="fixed flex items-center w-full max-w-xs p-4 space-x-4 text-white bg-green-600 divide-x rtl:divide-x-reverse divide-gray-200 rounded-lg shadow right-5 bottom-5 dark:text-gray-100 dark:divide-gray-700 space-x dark:bg-green-800"
                     role="alert">
                    <div className="text-sm font-normal">{ToastMessage}</div>
                </div>
            }
            {error &&
                <div id="toast-bottom-right"
                     className="fixed flex items-center w-full max-w-xs p-4 space-x-4 text-white bg-red-600 divide-x rtl:divide-x-reverse divide-gray-200 rounded-lg shadow right-5 bottom-5 dark:text-gray-100 dark:divide-gray-700 space-x dark:bg-green-800"
                     role="alert">
                    <div className="text-sm font-normal">{error}</div>
                </div>
            }
        </>
    )
        ;
}