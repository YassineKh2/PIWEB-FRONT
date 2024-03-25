import React, { useState, useEffect } from 'react';
import { getAllReclamations , updateReclamation } from "../../../../../Services/FrontOffice/apiReclamation";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function DisplayReclamation() {
    const [reclamations, setReclamations] = useState([]);

    useEffect(() => {
        const fetchReclamations = async () => {
            try {
                const response = await getAllReclamations();
                setReclamations(response.reclamations);
            } catch (error) {
                console.error('Error fetching reclamations:', error);
            }
        };

        fetchReclamations();
    }, []);

    const handleApprove = async (reclamtion) => {
        try {
            reclamtion.status='APPROVED';
            console.log(reclamtion);
            await updateReclamation(reclamtion._id, reclamtion);
            // Refresh reclamations after updating
            const updatedReclamations = await getAllReclamations();
            setReclamations(updatedReclamations.reclamations);
        } catch (error) {
            console.error('Error approving reclamation:', error);
        }
    };

    const handleReject = async (reclamtion) => {
        try {
            reclamtion.status='REJECTED';
            await updateReclamation(reclamtion._id, reclamtion);
            // Refresh reclamations after updating
            const updatedReclamations = await getAllReclamations();
            setReclamations(updatedReclamations.reclamations);
        } catch (error) {
            console.error('Error rejecting reclamation:', error);
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
                    Reclamations Table
                </h4>
            </div>

            <div className="table-container">
                <table className="w-full table-auto">
                    <thead>
                        <tr className="bg-gray-2 text-left dark:bg-meta-4">
                            <th className="py-4 px-4 font-medium text-black dark:text-white">
                                Name
                            </th>
                            <th className="py-4 px-4 font-medium text-black dark:text-white">
                                Purpose
                            </th>
                            <th className="py-4 px-4 font-medium text-black dark:text-white">
                                Status
                            </th>
                            <th className="py-4 px-4 font-medium text-black dark:text-white">
                                Type
                            </th>
                            <th className="py-4 px-4 font-medium text-black dark:text-white">
                                Creation Date
                            </th>
                            <th className="py-4 px-4 font-medium text-black dark:text-white">
                                User
                            </th>
                            <th className="py-4 px-4 font-medium text-black dark:text-white">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {reclamations.map((reclamation, index) => (
                            <tr key={index} className={`${index % 2 === 0 ? "bg-gray-100 dark:bg-gray-800" : ""} border-b border-[#eee] dark:border-strokedark`}>
                                <td className="py-5 px-4">
                                    {reclamation.name}
                                </td>
                                <td className="py-5 px-4">
                                    {reclamation.purpose} 
                                </td>
                                <td className="py-5 px-4">
                                    {reclamation.status}
                                </td>
                                <td className="py-5 px-4">
                                    {reclamation.type}
                                </td>
                                <td className="py-5 px-4">
                                    {reclamation.createdAt}
                                </td>
                                <td className="py-5 px-4">
                                    {reclamation.user.email}
                                </td>
                                <td className="py-5 px-4">
                                    {reclamation.status === 'PENDING' ? (
                                        <>
                                            <button onClick={() => handleApprove(reclamation)}>
                                                <FontAwesomeIcon icon={faCheck} className="text-green-500 cursor-pointer mr-2" />
                                            </button>
                                            <button onClick={() => handleReject(reclamation)}>
                                                <FontAwesomeIcon icon={faTimes} className="text-red-500 cursor-pointer" />
                                            </button>
                                        </>
                                    ) : (
                                        <span>No action</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default DisplayReclamation;
