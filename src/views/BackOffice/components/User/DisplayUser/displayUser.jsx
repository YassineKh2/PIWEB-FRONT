import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAllUsers } from "../../../../../Services/apiUser"; 
import { formatDate } from 'date-fns';
import { Link } from 'react-router-dom';
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function DisplayAllUsers() {
    const [userData, setUserData] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await getAllUsers();
                setUserData(response.users);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

     // Fonction pour formater la date
     const formatDate = (dateString) => {
        if (!dateString) return ''; // Vérification de nullité
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

   
    return (
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark overflow-x-auto">
        <style>
            {`
            .table-container {
                overflow-x: auto;
                white-space: nowrap;
            }
            `}
        </style>
        <div className="flex justify-between py-6 px-4 md:px-6 xl:px-7.5">
            <h4 className="text-xl font-semibold text-black dark:text-white">
                Users Table
            </h4>
            <Link to="/backoffice/users/addAdmin" className="inline-block flex items-center px-4 py-2 text-white bg-primary rounded-md hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50">
        <FontAwesomeIcon icon={faPlus} className="mr-2" />
        Add Admin
    </Link>

        </div>
    
        <div className="table-container">
            <table className="w-full table-auto">
                <thead>
                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                    <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                            Picture
                        </th>
                        <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                            First Name
                        </th>
                        <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                            Last Name
                        </th>
                        <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                            Email
                        </th>
                        <th className="py-4 px-4 font-medium text-black dark:text-white">
                            Creation Date
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {userData.map((user, index) => (
                        <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-100 dark:bg-gray-800' : ''} border-b border-[#eee] dark:border-strokedark`}>
                          <td className="py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                    <img src={user.image} alt="User" className="w-10 h-10 rounded-full" />
                                </td>
                            <td className="py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                <h5 className="font-medium text-black dark:text-white">{user.firstName}</h5>
                            </td>
                            
                            <td className="py-5 px-4 dark:border-strokedark">
                                <p className="text-black dark:text-white">{user.lastName}</p>
                            </td>
                            <td className="py-5 px-4 dark:border-strokedark">
                                <p className="text-black dark:text-white">{user.email}</p>
                            </td>
                            <td className="py-5 px-4 dark:border-strokedark">
                                    <p className="text-black dark:text-white">{formatDate(user.createdAt)}</p>
                                </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
   
    
</div>
    );
}

export default DisplayAllUsers;
