import React, { useState } from "react";
import { updateSp , deleteSp} from "../../../../Services/FrontOffice/apiSponsors";
import { useNavigate, useLocation } from "react-router-dom";
import * as yup from 'yup';
import Swal from "sweetalert2";

function UpdateSponsors() {
    const navigate = useNavigate();
    const location = useLocation();
    const {  _id,name,description,contact,adresse } = location.state || {};
    const [newData, setNewData] = useState({
     
        _id:_id,
        name: name || '',
        description: description || '',
        contact: contact|| 0,
        adresse: adresse|| '',
    });

    const schema = yup.object().shape({
        name: yup.string().required("Name is required").matches(/^[A-Za-z]+$/, "Name must contain only letters"),
        description: yup.string().required("Description is required"),
        contact: yup.string().required("Contact is required").matches(/^[0-9]+$/, "Contact must contain only digits").length(8, "Contact must be exactly 8 digits"),
        adresse: yup.string().required("Adresse is required")
    });
    const handleDeleteSponsor = async (sponsorId) => {
        try {
            await deleteSp(sponsorId);
            Swal.fire({
                title: 'sponsor deleted successfully',
                icon: 'success',
            });
        } catch (error) {
            console.error("Erreur lors de la suppression du sponsor :", error);
            Swal.fire({
                title: 'Error',
                text: 'An error occurred while deleting the sponsor',
                icon: 'error',
            });
        }
        navigate("/team");
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };
    const handleUpdateSponsors = async () => {
        try {
            console.log("Sponsor ID:", _id);
            console.log("New data:", newData);
            await updateSp(_id, newData);
            navigate("/Team/all");
        } catch (error) {
            console.error("Error updating sponsor:", error);
            if (error.response) {
                console.error("Response data:", error.response.data);
                console.error("Response status:", error.response.status);
                console.error("Response headers:", error.response.headers);
            }
        }
    };
    

    return (
        <div className="flex justify-center items-center h-screen mt-16">
            <div className="w-full px-4 lg:w-8/12 xl:w-6/12">
                <div className="wow fadeInUp relative z-10 rounded-md bg-primary/[3%] p-8 dark:bg-primary/10 sm:p-11 lg:p-8 xl:p-11" data-wow-delay=".2s">
                    <h3 className="mb-4 text-2xl font-bold leading-tight text-black dark:text-white font-serif">
                        Update Sponsor
                    </h3>
    
                    <form>
                        <div className="mb-4">
                            <label htmlFor="name" className="text-body-color block mb-1 font-serif">Name:</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Name"
                                value={newData.name}
                                onChange={handleChange}
                                className="w-full rounded-md border border-body-color border-opacity-10 py-3 px-6 text-base font-medium text-body-color placeholder-body-color outline-none focus:border-primary focus:border-opacity-100 focus-visible:shadow-none dark:border-white dark:border-opacity-10 dark:bg-[#242B51] focus:dark:border-opacity-50"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="description" className="text-body-color block mb-1 font-serif">Description:</label>
                            <input
                                type="text"
                                id="description"
                                name="description"
                                placeholder="Description"
                                value={newData.description}
                                onChange={handleChange}
                                className="w-full rounded-md border border-body-color border-opacity-10 py-3 px-6 text-base font-medium text-body-color placeholder-body-color outline-none focus:border-primary focus:border-opacity-100 focus-visible:shadow-none dark:border-white dark:border-opacity-10 dark:bg-[#242B51] focus:dark:border-opacity-50"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="contact" className="text-body-color block mb-1 font-serif">Contact:</label>
                            <input
                                type="text"
                                id="contact"
                                name="contact"
                                placeholder="Contact"
                                value={newData.contact}
                                onChange={handleChange}
                                className="w-full rounded-md border border-body-color border-opacity-10 py-3 px-6 text-base font-medium text-body-color placeholder-body-color outline-none focus:border-primary focus:border-opacity-100 focus-visible:shadow-none dark:border-white dark:border-opacity-10 dark:bg-[#242B51] focus:dark:border-opacity-50"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="adresse" className="text-body-color block mb-1 font-serif">Address:</label>
                            <input
                                type="text"
                                id="adresse"
                                name="adresse"
                                placeholder="Address"
                                value={newData.adresse}
                                onChange={handleChange}
                                className="w-full rounded-md border border-body-color border-opacity-10 py-3 px-6 text-base font-medium text-body-color placeholder-body-color outline-none focus:border-primary focus:border-opacity-100 focus-visible:shadow-none dark:border-white dark:border-opacity-10 dark:bg-[#242B51] focus:dark:border-opacity-50"
                                required
                            />
                        </div>
                        <div className="flex justify-between items-center">
                        <input
                            type="button"
                            onClick={handleUpdateSponsors}
                            className="w-[calc(50% - 5px)] bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded transition duration-300"
                            value="Update"
                        />
                        <input
                            type="submit"
                            value="Delete"
                            onClick={(e) => {
                                e.preventDefault();
                                Swal.fire({
                                    title: 'Do you really want to delete this sponsor ?',
                                    icon: 'question',
                                    showCancelButton: true,
                                    confirmButtonText: 'Confirm',
                                    cancelButtonText: 'Cancel'
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        handleDeleteSponsor(newData._id); // Corrected to use newData._id
                                    }
                                });
                            }}
                            className="w-[calc(50% - 5px)] duration-80 cursor-pointer rounded-md border border-transparent bg-blue-500 py-2 px-4 sm:py-3 sm:px-6 text-center text-base font-medium text-white outline-none transition ease-in-out hover:bg-opacity-80 hover:shadow-signUp focus-visible:shadow-none"
                        />
                    </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UpdateSponsors;
