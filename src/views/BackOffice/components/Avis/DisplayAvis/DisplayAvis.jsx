import React, { useState, useEffect } from 'react';
import { getAllAvis, updateAvis } from "../../../../../Services/FrontOffice/apiAvis";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

function DisplayAvis() {
    const [avis, setAvis] = useState([]);

    useEffect(() => {
        const fetchAvis = async () => {
            try {
                const response = await getAllAvis();
                setAvis(response.avis);
            } catch (error) {
                console.error('Error fetching avis:', error);
            }
        };

        fetchAvis();
    }, []);

    const handleApprove = async (avisItem) => {
        try {
            avisItem.status = 'APPROVED';
            await updateAvis(avisItem._id, avisItem);
            // Refresh avis after updating
            const updatedAvis = await getAllAvis();
            setAvis(updatedAvis.avis);
        } catch (error) {
            console.error('Error approving avis:', error);
        }
    };

    const handleReject = async (avisItem) => {
        try {
            avisItem.status = 'REJECTED';
            await updateAvis(avisItem._id, avisItem);
            // Refresh avis after updating
            const updatedAvis = await getAllAvis();
            setAvis(updatedAvis.avis);
        } catch (error) {
            console.error('Error rejecting avis:', error);
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
                    Avis Table
                </h4>
            </div>

            <div className="table-container">
                <table className="w-full table-auto">
                    <thead>
                        <tr className="bg-gray-2 text-left dark:bg-meta-4">
                            <th className="py-4 px-4 font-medium text-black dark:text-white">
                                Tournament
                            </th>
                            <th className="py-4 px-4 font-medium text-black dark:text-white">
                                Rating
                            </th>
                            <th className="py-4 px-4 font-medium text-black dark:text-white">
                                Comment
                            </th>
                            <th className="py-4 px-4 font-medium text-black dark:text-white">
                                CreatedAt
                            </th>
                            <th className="py-4 px-4 font-medium text-black dark:text-white">
                                User
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {avis.map((avisItem, index) => (
                            <tr key={index} className={`${index % 2 === 0 ? "bg-gray-100 dark:bg-gray-800" : ""} border-b border-[#eee] dark:border-strokedark`}>
                                <td className="py-5 px-4">
                                    {avisItem.tournament.name}
                                </td>
                                <td className="py-5 px-4">
                                    {avisItem.rating}
                                </td>
                                <td className="py-5 px-4">
                                    {avisItem.comment}
                                </td>
                                <td className="py-5 px-4">
                                    {avisItem.createdAt}
                                </td>
                                <td className="py-5 px-4">
                                {avisItem.user.email}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default DisplayAvis;
