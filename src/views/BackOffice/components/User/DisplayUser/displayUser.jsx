import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAllUsers, deleteUser, blockUser, unBlockUser } from "../../../../../Services/apiUser"; 
import { formatDate } from 'date-fns';
import { Link } from 'react-router-dom';
import { faPlus, faTrash, faLock, faUnlock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Swal from 'sweetalert2';

function DisplayAllUsers() {
    const [userData, setUserData] = useState([]);
    const baseUrl = "http://localhost:3000/";
    const pathPlayer ="http://localhost:3000/public/images/players/"
    const pathStaff= "http://localhost:3000/public/images/staff/"
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

     // Fonction pour supprimer un utilisateur
     const handleDeleteUser = async (userId) => {
        try {
            console.log('UserID:', userId); // Ajoutez cette ligne pour vérifier l'ID de l'utilisateur
            await deleteUser(userId);
            // Mettre à jour la liste des utilisateurs après la suppression
            setUserData(userData.filter(user => user._id !== userId));
            console.log('Utilisateur supprimé avec succès');
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'utilisateur : ', error);
            // Gérer les erreurs de suppression, par exemple afficher un message d'erreur à l'utilisateur
        }
    };

    // Fonction pour bloquer ou débloquer un utilisateur
    const toggleBlockUser = async (userId, isBlocked) => {
      try {
          if (isBlocked) {
              await unBlockUser(userId);
          } else {
              await blockUser(userId);
          }
          // Mettre à jour la liste des utilisateurs après le blocage ou le déblocage
          setUserData(userData.map(user =>
              user._id === userId ? { ...user, blocked: !isBlocked } : user
          ));
      } catch (error) {
          console.error('Erreur lors du blocage ou du déblocage de l\'utilisateur : ', error);
          // Gérer les erreurs, par exemple afficher un message d'erreur à l'utilisateur
      }
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
            <Link
              to="/backoffice/users/addAdmin"
              className="inline-block flex items-center px-4 py-2 text-white bg-primary rounded-md hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
            >
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
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {userData.map((user, index) => {
                  
                  let path =baseUrl

                  if(user.role === "P")
                  path = pathPlayer

                  if(user.role === "S")
                  path = pathStaff
              
          
                  return (
                  
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-gray-100 dark:bg-gray-800" : ""
                    } border-b border-[#eee] dark:border-strokedark`}
                  >
                    <td className="py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                      <img
                        src={user.image ? `${path}${user.image}` : `${baseUrl}userImage.png`}
                        alt="User"
                        className="w-10 h-10 rounded-full"
                      />
                    </td>
                    <td className="py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                      <h5 className="font-medium text-black dark:text-white">
                        {user.firstName}
                      </h5>
                    </td>
    
                    <td className="py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">{user.lastName}</p>
                    </td>
                    <td className="py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">{user.email}</p>
                    </td>
                    <td className="py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {formatDate(user.createdAt)}
                      </p>
                    </td>
                    <td className="py-5 px-4 dark:border-strokedark">
                      {/* Icône de la corbeille pour l'action de suppression */}
                      <FontAwesomeIcon 
  icon={faTrash} 
  className="text-blue-500 cursor-pointer mr-4"
  onClick={() => {
    // Display confirmation popup with SweetAlert
    Swal.fire({
      title: 'Do you really want to confirm deleting this user?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        // Call the delete function here
        handleDeleteUser(user._id);
      }
    });
  }} 
/>
                      <FontAwesomeIcon 
                        icon={user.blocked ? faLock : faUnlock} // Utilisez les icônes faLock et faUnlock de FontAwesome
                        className={`text-${user.blocked ? 'red' : 'green'}-500 cursor-pointer`} // Changez la couleur en fonction de l'état de blocage
                        onClick={() => toggleBlockUser(user._id, user.blocked)} // Appel de la fonction pour bloquer/débloquer lors du clic sur l'icône
                      />
                          
                    </td>
                  </tr>
                )}
                
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
}

export default DisplayAllUsers;
