import React from 'react';
import { useLocation } from 'react-router-dom';
import { confirmUser, refuseUser } from "../../../../../Services/apiUser";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'; // Import SweetAlert2

const Card = ({ children, className }) => <div className={className}>{children}</div>;
const CardHeader = ({ children }) => <div className="bg-white text-gray-800 text-center p-4">{children}</div>;
const CardContent = ({ children }) => <div className="flex flex-col items-center space-y-4 p-4">{children}</div>;
const Button = ({ children, variant, onClick }) => (
  <button
    className={`px-6 py-2.5 text-sm rounded-lg ${variant === 'outline' ? 'border-2 border-gray-300 text-gray-700' : 'bg-green-500 text-white'} hover:opacity-90 focus:outline-none`}
    onClick={onClick}
  >
    {children}
  </button>
);

const UserDetails = ({ onActionComplete }) => {
  const location = useLocation();
  const { user } = location.state || {};
  const navigate = useNavigate();
  const baseUrl = "http://localhost:3000/public/images/certificate/";
  const certificateUrl = user?.certificate ? `${baseUrl}${user.certificate}` : '';

  const handleAccept = async () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You are about to accept this user's sign up request.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, accept it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const result = await confirmUser(user._id);
          console.log(result.message);
          Swal.fire('Accepted!', 'The user has been accepted.', 'success');
          
          navigate("/backoffice/users");
        } catch (error) {
          console.error(error.message);
          Swal.fire('Error!', 'There was an issue accepting the user.', 'error');
        }
      }
    });
  };

  const handleDecline = async () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You are about to decline this user's sign up request.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, decline it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const result = await refuseUser(user._id);
          console.log(result.message);
          Swal.fire('Declined!', 'The user has been declined.', 'success');
          
          navigate("/backoffice/users");
        } catch (error) {
          console.error(error.message);
          Swal.fire('Error!', 'There was an issue declining the user.', 'error');
        }
      }
    });
  };

  // The rest of your component...





  if (!user) {
    return <p>Loading user details...</p>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-2xl shadow-xl rounded-lg">
        <CardHeader>
          <h2 className="text-xl font-semibold">Sign Up Request</h2>
          <p>Accept or decline the request of {user.firstName}.</p>
        </CardHeader>
        <CardContent>
          <div>
            <h3 className="text-lg font-semibold">{user.firstName} {user.lastName}</h3>
            <p className="text-gray-500">{user.email}</p>
            <p className="text-gray-500">{user.role}</p>
          </div>
          {certificateUrl && (
            <div className="w-full flex justify-center">
              <img src={certificateUrl} alt="User Certificate" className="max-w-full h-auto rounded-lg shadow-md" />
            </div>
          )}
          <div className="flex space-x-4">
            <Button variant="outline" onClick={handleDecline}>Decline</Button>
            <Button variant="outline" onClick={handleAccept}>Accept</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDetails;
