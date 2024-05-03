/*import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EnableTwoFactorAuth = () => {
  const [qrCode, setQrCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve the userId from local storage and enable 2FA
    const enable2FA = async () => {
      try {
        const userInfo = localStorage.getItem('userInfo');
        const { userId } = JSON.parse(userInfo);

        if (!userId) {
          throw new Error('User ID is not available');
        }

        const response = await axios.post('http://localhost:3000/user/enable-2fa', { userId });
        console.log(response);
        setQrCode(response.data.qrcode);
      } catch (err) {
        setError(err.message || 'Failed to enable 2FA. Please try again.');
      }
    };

    enable2FA();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-gray-100 dark:bg-gray-800">
      <div className="flex flex-col items-center p-8 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Set Up Two-Factor Authentication</h3>
        {error ? (
          <div className="text-red-500 text-sm">{error}</div>
        ) : (
          <>
            <p className="text-center mb-4">Scan the QR code below with your 2FA app to enable two-factor authentication.</p>
            {qrCode ? (
              <img src={qrCode} alt="2FA QR Code" className="w-40 h-40 object-cover rounded-full" />
            ) : (
              <p>Loading QR code...</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EnableTwoFactorAuth;*/


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {getUserByEmail } from "../../../../../Services/apiUser";
import { jwtDecode } from 'jwt-decode';

const TwoFactorAuthSetup = () => {
  const [qrCode, setQrCode] = useState('');
  const [error, setError] = useState('');
  const [userId, setUserId] = useState('');
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch userInfo from localStorage
    const userInfo = localStorage.getItem('userInfo');
    const parsedUserInfo = userInfo ? JSON.parse(userInfo) : null;

    // Extract userId from parsedUserInfo
    if (parsedUserInfo && parsedUserInfo.userId) {
      setUserId(parsedUserInfo.userId);
      if (parsedUserInfo.twoFactorEnabled) {
        // If 2FA is already enabled, redirect to the home page
        navigate('/');
      }
    } else {
      setError("User information not found in storage.");
    }
  }, [navigate]);

  useEffect(() => {
    // Function to enable 2FA, only called if userId is set and qrCode has not been loaded yet
    const enable2FA = async () => {
      if (userId && !qrCode) {
        try {
          const response = await axios.post('https://piweb-back.onrender.com/user/enable-2fa', { userId });
          setQrCode(response.data.qrcode);
        } catch (err) {
          setError(err.response?.data?.message || 'Could not enable 2FA.');
        }
      }
    };

    enable2FA();
  }, [userId, qrCode]);

  /*const verifyToken = async () => {
    try {
      const response = await axios.post('http://localhost:3000/user/verify-2fa', {
        userId,
        token
      });

      if (response.data.success) {
        const userDetailsResponse = await getUserByEmail(email);
        // Update local userInfo with 2FA enabled status
        const newUserInfo = {
          ...JSON.parse(localStorage.getItem('token')),
          twoFactorEnabled: true
        };

        localStorage.setItem('token', JSON.stringify(newUserInfo));
        //navigate('/');
        if (response.user.role === "A") {
          navigate("/backoffice", { replace: true });
        } else if (response.user.role === "TM" && !userDetailsResponse.user.PlayingFor) {
          navigate("/team/add");
        } else {
          navigate("/");
        }
      } else {
        setError('Failed to verify 2FA token.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error verifying 2FA token.');
    }
  };*/

  /*const verifyToken = async () => {
    try {
        const userInfo = localStorage.getItem('userInfo');
        const { userId } = JSON.parse(userInfo);
        const response = await axios.post('http://localhost:3000/user/verify-2fa', { userId, token });
       console.log(response);
        if (response.data.success) {
            // Mettre à jour les informations utilisateur avec 2FA activé
            const newUserInfo = {
                ...JSON.parse(localStorage.getItem('userInfo')),
                twoFactorEnabled: true
            };

            localStorage.setItem('userInfo', JSON.stringify(newUserInfo));
             console.log(token);

            // Gérer les redirections en fonction du rôle utilisateur
            // Récupérer les détails de l'utilisateur par e-mail
            const userDetailsResponse = await getUserByEmail(response.data.email);

            // Gérer les redirections en fonction du rôle utilisateur
            if (userDetailsResponse.success) {
                const { role } = userDetailsResponse.user;
                if (role === "A") {
                    navigate("/backoffice", { replace: true });
                } else if (role === "TM" && !userDetailsResponse.user.PlayingFor) {
                    navigate("/team/add");
                } //else {
                   // navigate("/");
                //}

        } else {
            setError('Failed to verify 2FA token.');
        }
      }
    } catch (err) {
        setError(err.response?.data?.message || 'Error verifying 2FA token.');
    }
};*/

const verifyToken = async () => {
  try {
      const userInfo = localStorage.getItem('userInfo');
      const { userId } = JSON.parse(userInfo);
      const response = await axios.post('http://localhost:3000/user/verify-2fa', { userId, token });
      console.log(response);

      if (response.data.success) {
          // Save the JWT token in localStorage
          localStorage.setItem('token', response.data.token);

          // Decode token to get user details
          const decodedToken = jwtDecode(response.data.token);
          console.log('Decoded Token:', decodedToken);
          const userEmail = decodedToken.email;

          // Fetch user details by email
          const userDetailsResponse = await getUserByEmail(userEmail);

          if (userDetailsResponse) {
              const { role } = userDetailsResponse.user;
              if (role === "A") {
                  navigate("/backoffice", { replace: true });
              } else if (role === "TM" && !userDetailsResponse.user.PlayingFor) {
                  navigate("/team/add");
              } else {
                  navigate("/");
              }
          } else {
              setError('Failed to retrieve user details.');
          }
      } else {
          setError('Failed to verify 2FA.');
      }
  } catch (err) {
      setError(err.response?.data?.message || 'Error verifying 2FA token.');
  }
};



  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-gray-100 dark:bg-gray-800">
      <div className="flex flex-col items-center p-8 bg-white dark:bg-gray-900 rounded-lg shadow-lg transition-opacity duration-500">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Set Up Two-Factor Authentication</h3>

        {error && (
          <div className="bg-red-500 text-white p-3 rounded-md mt-4 w-full">
            {error}
          </div>
        )}
       {/*{qrCode ? (
          <>
            <p className="text-md mt-4">Scan this QR code with your 2FA Google authentication App to enable two-factor authentication for your account.</p>
            <img src="/google.webp" alt="Google Authenticator" className="w-16 h-16 mb-1" />
            <img src={qrCode} alt="2FA QR Code" className="w-48 h-48 object-cover rounded-full" />
            <label htmlFor="token" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mt-4">Enter your 2FA token from the Google App</label>
            <input
              type="text"
              id="token"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:border-blue-500"
              placeholder="Enter token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
            <button className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-md" onClick={verifyToken}>
              Verify Token
            </button>
          </>
        ) : (
          <p>Loading QR code...</p>
        )}*/}

<>
  <label htmlFor="token" className="block text-md mt-4 font-medium text-gray-700 dark:text-gray-200">Enter your 2FA token from the Google Authenticator App</label>
  <input
    type="text"
    id="token"
    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:border-blue-500"
    placeholder="Enter token"
    value={token}
    onChange={(e) => setToken(e.target.value)}
  />
  <button className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-md" onClick={verifyToken}>
    Verify Token
  </button>
</>
      </div>
    </div>
  );
};

export default TwoFactorAuthSetup;

