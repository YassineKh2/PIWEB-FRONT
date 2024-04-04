import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword,verifyRecoveryCode,updatePasswordAfterRecovery } from "../../../../../Services/apiUser";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleRecoveryCodeChange = (e) => setRecoveryCode(e.target.value);
  const handleNewPasswordChange = (e) => setNewPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (step === 1) {
        // API call to send recovery code to the user's email
        await forgotPassword(email);
        setStep(2); // Move to the next step
      } else if (step === 2) {
        const isCodeValid = await verifyRecoveryCode(email, recoveryCode);
        if (isCodeValid) {
          setStep(3); // Code is valid, move to the next step
        } else {
          setErrorMessage("Invalid or expired recovery code.");
        }
      } else if (step === 3) {
        if (newPassword === confirmPassword) {
          try {
            const res = await updatePasswordAfterRecovery(email, newPassword);
            if (res.success) {
              Swal.fire({
                title: 'Success!',
                text: 'Password has been updated successfully!',
                icon: 'success',
                confirmButtonText: 'OK'
              }).then((result) => {
                if (result.isConfirmed) {
                  navigate("/signin"); // Navigate to sign-in page after successful password change
                }
              });
            } else {
              setErrorMessage(res.message || "An error occurred during password update.");
            }
          } catch (error) {
            setErrorMessage(error.response?.data?.message || error.message || "An error occurred during password update.");
          }
        } else {
          setErrorMessage("Passwords do not match!");
        }
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message || "An error occurred.");
    }
  };
  return (
    <>
      <section className="relative z-10 overflow-hidden pt-36 pb-16 md:pb-20 lg:pt-[180px] lg:pb-28">
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div className="mx-auto max-w-[500px] rounded-md bg-primary bg-opacity-5 py-10 px-6 dark:bg-dark sm:p-[60px]">
                <h3 className="mb-3 text-center text-2xl font-bold text-black dark:text-white sm:text-3xl">
                  {step === 1
                    ? "Enter your email"
                    : step === 2
                    ? "Enter Recovery Code"
                    : "Change Password"}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {step === 1 && (
                    <>
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={handleEmailChange}
                        className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
                        required
                      />
                      <button
                        type="submit"
                        className="flex w-full items-center justify-center rounded-md bg-primary py-4 px-9 text-base font-medium text-white transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp"
                      >
                        Send Recovery Code
                      </button>
                    </>
                  )}
                  {step === 2 && (
                    <>
                      <input
                        type="text"
                        name="recoveryCode"
                        placeholder="Recovery Code"
                        value={recoveryCode}
                        onChange={handleRecoveryCodeChange}
                        className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
                        required
                      />
                      <button
                        type="submit"
                        className="flex w-full items-center justify-center rounded-md bg-primary py-4 px-9 text-base font-medium text-white transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp"
                      >
                        Verify Code
                      </button>
                    </>
                  )}
                  {step === 3 && (
                    <>
                      <input
                        type="password"
                        name="newPassword"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={handleNewPasswordChange}
                        className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
                        required
                      />
                      <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
                        required
                      />
                      <button
                        type="submit"
                        className="flex w-full items-center justify-center rounded-md bg-primary py-4 px-9 text-base font-medium text-white transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp"
                      >
                        Change Password
                      </button>
                    </>
                  )}
                </form>
                {errorMessage && (
                  <div className="mt-3 text-center text-sm text-red-500">
                    {errorMessage}
                  </div>
                )}
                {step !== 1 && (
                  <p className="mt-4 text-center text-sm">
                    <Link to="/signin" className="text-primary hover:underline">
                      Remembered your password? Sign in
                    </Link>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ResetPasswordPage;
