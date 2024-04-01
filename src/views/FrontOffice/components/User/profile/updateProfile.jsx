import React, { useState, useEffect } from 'react';
import { getUserProfile, update } from '../../../../../Services/apiUser';
import { useNavigate } from 'react-router-dom';

function UpdateUserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    _id: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    birthDate: '',
    cin: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getUserProfile();
        if (response && response.user) {
          setUser({
            _id: response.user._id,
            firstName: response.user.firstName,
            lastName: response.user.lastName,
            email: response.user.email,
            // password: '' intentionally left out for security reasons
            birthDate: response.user.birthDate.slice(0, 10),
            cin: response.user.cin,
          });
        }
      } catch (fetchError) {
        setError('Failed to load user profile');
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedInfo = { ...user };
      if (!updatedInfo.password) {
        delete updatedInfo.password; // Remove password from updatedInfo if not set
      }
      await update(user._id, updatedInfo);
      setError('Profile updated successfully');
      navigate('/profile'); // Redirect to profile page or show success message
    } catch (updateError) {
      setError('Failed to update user profile');
    }
  };

  const handleUpdatePassword = () => {
    navigate('/updatePassword');
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
                <div className="-mx-4 flex flex-wrap">
                  <div className="w-full px-4 md:w-1/2">
                    <div className="mb-8">
                      <label htmlFor="firstName" className="mb-3 block text-sm font-medium text-dark dark:text-white">
                        First Name
                      </label>
                      <input type="text" id="firstName" name="firstName" placeholder="Enter your first name" value={user.firstName} onChange={handleChange} className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp" required />
                    </div>
                  </div>
                  <div className="w-full px-4 md:w-1/2">
                    <div className="mb-8">
                      <label htmlFor="lastName" className="mb-3 block text-sm font-medium text-dark dark:text-white">
                        Last Name
                      </label>
                      <input type="text" id="lastName" name="lastName" placeholder="Enter your last name" value={user.lastName} onChange={handleChange} className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp" required />
                    </div>
                  </div>
                  <div className="w-full px-4">
                    <div className="mb-8">
                      <label htmlFor="email" className="mb-3 block text-sm font-medium text-dark dark:text-white">
                        Email
                      </label>
                      <input type="email" id="email" name="email" placeholder="Enter your email" value={user.email} onChange={handleChange} className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp" required />
                    </div>
                  </div>
                  <div className="w-full px-4">
                    <div className="mb-8">
                      <label htmlFor="birthDate" className="mb-3 block text-sm font-medium text-dark dark:text-white">
                        Birth Date
                      </label>
                      <input type="date" id="birthDate" name="birthDate" value={user.birthDate} onChange={handleChange} className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp" />
                    </div>
                  </div>
                  <div className="w-full px-4">
                    <div className="mb-8">
                      <label htmlFor="cin" className="mb-3 block text-sm font-medium text-dark dark:text-white">
                        CIN
                      </label>
                      <input type="number" id="cin" name="cin" placeholder="Enter your CIN" value={user.cin} onChange={handleChange} className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp" required />
                    </div>
                  </div>
                  <div className="w-full px-4">
                    <div className="mb-8">
                      <label htmlFor="password" className="mb-3 block text-sm font-medium text-dark dark:text-white">
                        Enter your password 
                      </label>
                      <input type="password" id="password" name="password" placeholder="Enter new password (optional)" value={user.password} onChange={handleChange} className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp" />
                      <small className="text-xs text-gray-500">You have to enter your password to update your profile</small>
                    </div>
                  </div>
                  <div className="w-full px-4 flex justify-between">
  <button className="rounded-md bg-primary py-4 px-9 text-base font-medium text-white transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp">
    Update Profile
  </button>

  <button className="rounded-md bg-primary py-4 px-9 text-base font-medium text-white transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp" onClick={handleUpdatePassword}>
        Update Password
      </button>
</div>
                </div>
              </form>
              {error && <p className="mt-4 text-center text-red-500">{error}</p>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default UpdateUserProfile;
