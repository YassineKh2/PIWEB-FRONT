import {useEffect, useState} from "react";
import {jwtDecode} from "jwt-decode";
import {getUserData, updateUser} from "../../../../../../Services/apiUser.js";
import { FaRegEye as EyeOpen} from "react-icons/fa";
import { FaRegEyeSlash as EyeClosed} from "react-icons/fa";




export default function StaffCredentials() {
    const [staff, setstaff] = useState({})
    const [passwordType, setPasswordType] = useState('password')
    const [placeholderPassword, setplaceholderPassword] = useState('***********')


    const togglePasswordVisibility = () => {
        setPasswordType(passwordType === 'password' ? 'text' : 'password')
        if(passwordType !== 'password')
            setplaceholderPassword('***********')
        else
            setplaceholderPassword('')
    }

    useEffect(() => {
        try {
            if (localStorage.getItem('token') === null)
                return;

            const userToken = localStorage.getItem('token');
            const decodedToken = jwtDecode(userToken);
            getUserData(decodedToken.userId).then((response) => {
                setstaff(response.user)
            })
        } catch (e) {
            console.log(e.message)
        }


    }, [])

    const [currentpassword,setcurrentpassword] = useState('')
    const [hashedcurrentpassword,sethashedcurrentpassword] = useState('')
    const [password,setPassword] = useState('')
    const [Repeatpassword,setRepeatPassword] = useState('')
    const [error,seterror] = useState('')
    const [Toast,setToast] = useState(false)
    const [ToastMessage,setToastMessage] = useState('')

    async function hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hash = await window.crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    useEffect(() => {
        hashPassword(currentpassword).then(hashedPassword => {
            sethashedcurrentpassword(hashedPassword)
        });
    },[currentpassword])


    function changePassword() {

        if(hashedcurrentpassword !== staff.password){
            seterror('Current password is incorrect')
            return
        }

        if(password.length<= 7){
            seterror('Password length should be greater than 8 characters.');
            return;
        }

        if (!/[A-Z]/.test(password)) {
            seterror("Password should contain at least one uppercase letter.");
            return;
        }

        if (!/[a-z]/.test(password)) {
            seterror("Password should contain at least one lowercase letter.");
            return;
        }

        if (!/[0-9]/.test(password)) {
            seterror("Password should contain at least one digit.");
            return;
        }

        if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
            seterror("Password should contain at least one special character.");
            return;
        }
        if(password !== Repeatpassword){
            seterror('Passwords do not match');
            return;
        }


        seterror('')

        let updatedStaff = {
            ...staff,
            password: password
        }
        updateUser(updatedStaff).then((response) => {
            setToast(true)
            setToastMessage('Password updated !')
            setTimeout(() => {
                setToast(false)
            }, 5000)
            hashPassword(currentpassword).then(hashedPassword => {
                sethashedcurrentpassword(hashedPassword)
                updatedStaff.password = hashedPassword
                setstaff(updatedStaff)
                setPassword('')
                setRepeatPassword('')
                setcurrentpassword('')
            });

        }).catch((error) => {
            seterror(error.message)
        })

    }

    const [showChangeEmailInput, setshowChangeEmailInput] = useState(false)
    const [newemail, setnewemail] = useState('')
    const [emailerror, setemailerror] = useState('')


    function changeEmail() {
        if(newemail === staff.email){
            setemailerror('New email is same as current email')
            return
        }

        if(newemail.length < 3){
            setemailerror('Email is too short')
            return
        }

        if(!newemail.includes('@')){
            setemailerror('Invalid email')
            return
        }

        let updatedStaff = {
            ...staff,
            email: newemail
        }
        updateUser(updatedStaff).then((response) => {
            setstaff(updatedStaff)
            setshowChangeEmailInput(false)
            setnewemail('')
            setToast(true)
            setToastMessage('Email updated !')
            setTimeout(() => {
                setToast(false)
            }, 5000)
        }).catch((error) => {
            seterror(error.message)
        })
    }

    return (
        <>

            <div
                className="flex flex-col overflow-hidden rounded-xl sm:bg-gray-50 sm:px-8 sm:shadow dark:bg-neutral-900 w-5/6 md:w-full">
                <div className="pt-4">
                    <h1 className="py-2 text-2xl font-semibold">Account settings</h1>
                </div>
                <hr className="mt-4 mb-8"/>

                <p className="py-2 text-xl font-semibold">Email Address</p>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-gray-600 dark:text-gray-400">Your email address
                        is <strong>{staff.email}</strong></p>

                    <button onClick={() => setshowChangeEmailInput(!showChangeEmailInput)}
                            className="inline-flex text-sm font-semibold text-blue-600 underline decoration-2">Change
                    </button>
                </div>
                {showChangeEmailInput &&
                    <label htmlFor="emailChange" className="self-start mt-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">New Email</span>
                        <div
                            className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
                            <input type="email" id="login-Repeatpassword"
                                   value={newemail}
                                   onChange={(e) => setnewemail(e.target.value)}
                                   className="w-full flex-shrink appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
                                   />
                        </div>
                        {emailerror && <p className="mt-2 text-red-500">{emailerror}</p>}
                        <button onClick={changeEmail}
                                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white self-start">Save Email
                        </button>
                    </label>
                }
                <hr className="mt-4 mb-8"/>
                <p className="py-2 text-xl font-semibold">Password</p>
                <div className="flex items-center">
                    <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
                        <label htmlFor="login-password">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Current Password</span>
                            <div
                                className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
                                <input type={passwordType} id="login-currentpassword"
                                       value={currentpassword}
                                       onChange={(e) => setcurrentpassword(e.target.value)}
                                       className="w-full flex-shrink appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
                                       placeholder={placeholderPassword}/>
                            </div>
                        </label>
                        <label htmlFor="login-password">
                            <span className="text-sm text-gray-500 dark:text-gray-400">New Password</span>
                            <div
                                className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
                                <input type={passwordType} id="login-password"
                                       value={password}
                                       onChange={(e) => setPassword(e.target.value)}
                                       className="w-full flex-shrink appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
                                       placeholder={placeholderPassword}/>

                            </div>
                        </label>
                        <label htmlFor="login-password">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Repeat Password</span>
                            <div
                                className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
                                <input type={passwordType} id="login-Repeatpassword"
                                       value={Repeatpassword}
                                       onChange={(e) => setRepeatPassword(e.target.value)}
                                       className="w-full flex-shrink appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none"

                                       placeholder={placeholderPassword}/>
                            </div>
                        </label>
                    </div>

                    {passwordType === 'password' ?
                        <EyeClosed onClick={togglePasswordVisibility}
                                   className="mt-5 ml-2 h-6 w-6 cursor-pointer text-sm font-semibold text-gray-600 underline decoration-2"/> :
                        <EyeOpen onClick={togglePasswordVisibility}
                                 className="mt-5 ml-2 h-6 w-6 cursor-pointer text-sm font-semibold text-gray-600 underline decoration-2"/>}

                </div>
                {error && <p className="mt-2 text-red-500">{error}</p>}
                <p className="mt-2 dark:text-gray-300">Can't remember your current password. <a
                    className="text-sm font-semibold text-blue-600 underline decoration-2" href="#">Recover
                    Account</a></p>
                <button onClick={changePassword}
                        className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white self-start">Save Password
                </button>
                <hr className="mt-4 mb-8"/>
                {Toast &&
                    <div id="toast-bottom-right"
                         className="fixed flex items-center w-full max-w-xs p-4 space-x-4 text-white bg-green-600 divide-x rtl:divide-x-reverse divide-gray-200 rounded-lg shadow right-5 bottom-5 dark:text-gray-100 dark:divide-gray-700 space-x dark:bg-green-800"
                         role="alert">
                        <div className="text-sm font-normal">{ToastMessage}</div>
                    </div>
                }
                <div className="mb-10">
                    <p className="py-2 text-xl font-semibold">Delete Account</p>
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
                        your account after this action.</p>
                    <button
                        className="ml-auto text-sm font-semibold text-rose-600 underline decoration-2">Continue
                        with deletion
                    </button>
                </div>
            </div>
        </>
    );
}