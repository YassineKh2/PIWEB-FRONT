import React, { useState, useEffect } from 'react';
import { getUserProfile, updatePassword } from "../../../Services/apiUser";
import Swal from "sweetalert2";
export default function ChangePassword() {
  // Initial states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userId, setUserId] = useState(null); // State to store user ID
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Fetch the user profile when the component mounts
    const fetchProfile = async () => {
      try {
        const profile = await getUserProfile();
        setUserId(profile.user._id); // Update the userId state
      } catch (error) {
        setError('Unable to fetch user profile');
      }
    };
    
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!userId) {
      setError('User ID is undefined.');
      return;
    }
  
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
  
    try {
      const updateResponse = await updatePassword(userId, currentPassword, newPassword);
      if (updateResponse.success) {
        // Display success popup using SweetAlert2
        await Swal.fire({
          title: "Success!",
          text: "Password updated successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
  
        setSuccess(true);
        setError('');
        // You might want to redirect the user or reset form fields here
      }
    } catch (error) {
      // If there's an error, display an error popup
      await Swal.fire({
        title: "Error!",
        text: error.message || 'An error occurred while updating the password.',
        icon: "error",
        confirmButtonText: "OK",
      });
      setError(error.message || 'An error occurred while updating the password.');
      setSuccess(false);
    }
  };
  

  return (
    <section id="update-profile" className="overflow-hidden py-16 md:py-20 lg:py-28">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="mb-12 rounded-md bg-primary/[3%] py-11 px-8 dark:bg-dark sm:p-[55px]">
              <h2 className="mb-3 text-2xl font-bold text-black dark:text-white sm:text-3xl">
                Update Your Profile
              </h2>
              <p className="mb-12 text-base font-medium text-body-color">
                Modify your profile information here.
              </p>
              <form onSubmit={handleSubmit}>
                {/* ... other profile fields */}
              </form>
              {error && <p className="mt-4 text-center text-red-500">{error}</p>}
              
              {/* Add Change Password Form Here */}
              <form onSubmit={handleSubmit} className="mt-12 space-y-4">
                <div className="space-y-2">
                  <label htmlFor="current-password" className="mb-3 block text-sm font-medium text-dark dark:text-white">
                    Current Password
                  </label>
                  <input type="password" id="current-password" name="currentPassword" required placeholder="Enter your current password" className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="new-password" className="mb-3 block text-sm font-medium text-dark dark:text-white">
                    New Password
                  </label>
                  <input type="password" id="new-password" name="newPassword" required placeholder="Enter a new password" className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="confirm-password" className="mb-3 block text-sm font-medium text-dark dark:text-white">
                    Confirm Password
                  </label>
                  <input type="password" id="confirm-password" name="confirmPassword" required placeholder="Confirm new password" className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
                <div className="flex justify-end">
                  <button type="submit" className="rounded-md bg-primary py-4 px-9 text-base font-medium text-white transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp">
                    Change Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}