import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { useNavigate } from 'react-router-dom';

function FacialAuthLive() {
    const webcamRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const capture = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImgSrc(imageSrc);
    };

    const handleLogin = async () => {
        if (!imgSrc) {
            alert('No image captured.'); // Replace with your preferred error handling
            return;
        }
    
        setLoading(true);
        try {
            const blob = await fetch(imgSrc).then(r => r.blob());
            const formData = new FormData();
            formData.append('image', blob, 'capture.jpg');
    
            const response = await fetch('http://localhost:3000/user/face', {
                method: 'POST',
                body: formData,
            });
    
            const data = await response.json();
            if (data.match && data.login_response && data.login_response.token) {
                const existingToken = localStorage.getItem('userInfo');
                //localStorage.setItem('token', data.login_response.token); // Store token in 'token' key
                const updatedUserInfo = {
                    ...data.login_response,
                    userId: data.userId // Assuming `userId` is sent back from the server
                };
                localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo)); // You can still store other user info if needed
                alert('Authentication Successful'); // Replace with your preferred success handling
                navigate('/qrcode', { state: { userId: data.userId } });
            } else {
                alert('Authentication Failed'); // Replace with your preferred failure handling
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to authenticate.'); // Replace with your preferred error handling
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="scale-100">
            <div className="container mx-auto p-4">
                <div className="space-y-8 max-w-lg mx-auto p-5 shadow-2xl rounded-lg bg-white dark:bg-gray-700">
                    <h1 className="text-2xl text-teal-500">Facial Authentication</h1>
                    <p className="text-md text-gray-600 dark:text-gray-200">
                        If your face matches our records, you will be logged in automatically.
                    </p>
                    <div className="aspect-w-16 aspect-h-9 w-full relative shadow-xl rounded-lg overflow-hidden">
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            style={{ width: '100%', height: 'auto' }}
                            videoConstraints={{
                                width: 1280,
                                height: 720,
                                facingMode: "user"
                            }}
                        />
                        <button
                            className="absolute bottom-3 right-3 bg-purple-500 text-white p-2 rounded-full"
                            onClick={capture}
                        >
                            {/* Icon from Heroicons `camera` */}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.55-3.27A1 1 0 0121 7.76V16.24a1 1 0 01-1.45.97L15 14H5a1 1 0 01-1-1V9a1 1 0 011-1h10zm-6 4H9" />
                            </svg>
                        </button>
                    </div>
                    {imgSrc && (
                        <img
                            src={imgSrc}
                            alt="Captured"
                            className="w-full object-cover rounded-lg"
                        />
                    )}
                    <button
                        className={`w-full bg-purple-500 text-white p-3 rounded-lg ${loading ? 'opacity-50' : 'hover:bg-purple-700'}`}
                        onClick={handleLogin}
                        disabled={loading}
                    >
                        {loading ? 'Authenticating...' : 'Authenticate'}
                    </button>
                    {loading && <div className="w-full bg-blue-500 h-1 animate-pulse"></div>}
                    {!loading && imgSrc && <span className="bg-green-500 text-white p-2 rounded-full m-2">Photo Captured</span>}
                </div>
            </div>
        </div>
    );
}

export default FacialAuthLive;
