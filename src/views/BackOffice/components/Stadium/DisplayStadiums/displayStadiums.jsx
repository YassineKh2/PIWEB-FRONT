import React, { useEffect, useState } from "react";
import {
  getStadiumDetail,
  getAllStadiums,
  deleteStadium
} from "../../../../../Services/FrontOffice/apiStadium";
import { Link, useNavigate } from "react-router-dom";

import ShowDetailsModal from '../DisplayStadiumDetails/ShowDetailsModal';
import UpdateStadiumModal from '../UpdateStadium/updateStadiumModal'; // Import the UpdateStadiumModal component

function DisplayStadiums() {
  const navigate = useNavigate();
  const [stadiums, setStadiums] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStadium, setSelectedStadium] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false); // State to manage the visibility of the update modal
  const [selectedStadiumsToDelete, setSelectedStadiumsToDelete] = useState([]);
  const [showCheckboxes, setShowCheckboxes] = useState(false); // State to manage the visibility of checkboxes

  useEffect(() => {
    const fetchStadiums = async () => {
      try {
        const res = await getAllStadiums();
        setStadiums(res.Stadiums);
      } catch (err) {
        console.log(err);
      }
    };
    fetchStadiums();
  }, []);

  const handleReadMore = async (stadiumId) => {
    try {
      const stadiumDetails = await getStadiumDetail(stadiumId);
      setSelectedStadium(stadiumDetails);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching stadium details:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStadium(null);
  };

  const handleUpdateClick = (stadium) => {
    setSelectedStadium(stadium);
    setShowUpdateModal(true);
    console.log('showupodatestate',showUpdateModal)
    console.log('stadium',selectedStadium)

  };
  
  // Function to close the update modal
  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
  };


  const handleCheckboxChange = (e, stadium) => {
    if (e.target.checked) {
      setSelectedStadiumsToDelete([...selectedStadiumsToDelete, stadium]);
    } else {
      setSelectedStadiumsToDelete(selectedStadiumsToDelete.filter(item => item._id !== stadium._id));
    }
  };

  const handleDeleteSelected = async () => {
    try {
      const promises = selectedStadiumsToDelete.map(stadium => deleteStadium(stadium._id));
      await Promise.all(promises);
      // Update the list of stadiums after deletion
      const res = await getAllStadiums();
      setStadiums(res.Stadiums);
      // Clear the selection after deletion
      setSelectedStadiumsToDelete([]);
    } catch (error) {
      console.error('Error deleting stadiums:', error);
    }
  };
useEffect(()=>{
console.log(selectedStadiumsToDelete)
},[])
  return (
    <div>
      <button onClick={() => setShowCheckboxes(!showCheckboxes)}>Toggle Selection</button>
      <div>
            <button
              onClick={() => navigate("/backoffice/stadiums/add")}
              className="mt-6  ease-in-up hidden rounded-md bg-primary py-2 px-6 text-base font-bold text-white transition duration-300 hover:bg-opacity-90 hover:shadow-signUp md:block md:px-9 lg:px-6 xl:px-9 ml-auto mr-10"
            >
              Create Stadium
            </button>
          </div>
      <div className="mt-6 mb-12 ml-10 mr-10 grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 md:gap-x-6 lg:gap-x-8 xl:grid-cols-3">
        {stadiums.map((stadium) => (
          <div key={stadium._id} className="w-full">
            <div className="wow fadeInUp relative overflow-hidden rounded-md bg-white shadow-one dark:bg-dark">
              <a href="/" className="relative block h-[220px] w-full">
                <span className="absolute top-6 right-6 z-20 inline-flex items-center justify-center rounded-full bg-primary py-2 px-4 text-sm font-semibold capitalize text-white">
                  {stadium.name}
                </span>
                <img
                  src="https://via.placeholder.com/350" // Replace with actual image source
                  alt="Stadium"
                  style={{
                    maxHeight: "100%",
                    width: "100%",
                    objectFit: "cover",
                  }}
                />
              </a>
              <div className="p-6 sm:p-8 md:py-8 md:px-6 lg:p-8 xl:py-8 xl:px-5 2xl:p-8">
                <h3>
                  <a
                    href="/"
                    className="mb-4 block text-xl font-bold text-black hover:text-primary dark:text-white dark:hover:text-primary sm:text-2xl"
                  >
                    {stadium.name}
                  </a>
                </h3>
                <p className="border-b border-body-color border-opacity-10 pb-6 text-base font-medium text-body-color dark:border-white dark:border-opacity-10">
                  <span className="text-dark dark:text-black">Location:</span>&nbsp;{stadium.address?.city}, {stadium.address?.state}, {stadium.address?.country}&nbsp;&nbsp;&nbsp;
                </p>
                <p className="mt-4 mb-6 border-b border-body-color border-opacity-10 pb-6 text-base font-medium text-body-color dark:border-white dark:border-opacity-10">
                  <span className="text-dark dark:text-black">Capacity:</span>&nbsp;{stadium.capacity}
                </p>
                <p className="mt-4 mb-6 border-b border-body-color border-opacity-10 pb-6 text-base font-medium text-body-color dark:border-white dark:border-opacity-10">
                  <span className="text-dark dark:text-black">Status:</span>&nbsp;{stadium.status}
                </p>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start">
                {showCheckboxes && (
                  <input type="checkbox" onChange={(e) => handleCheckboxChange(e, stadium)} />
                )}
                <button onClick={() => handleReadMore(stadium._id)} className="mb-4 -mt-4 mr-2 ease-in-up rounded-full bg-primary py-2 px-6 text-sm font-bold text-white transition duration-300 hover:bg-opacity-90 hover:shadow-signUp md:block md:px-8 lg:px-3 xl:px-8">Read More</button>
                <button onClick={() => handleUpdateClick(stadium)} className="mb-4 -mt-4 mr-2 ease-in-up rounded-full bg-primary py-2 px-6 text-sm font-bold text-white transition duration-300 hover:bg-opacity-90 hover:shadow-signUp md:block md:px-8 lg:px-3 xl:px-8">Update</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {showModal && <ShowDetailsModal show={showModal} handleClose={handleCloseModal} stadium={selectedStadium} />}
      {showUpdateModal && <UpdateStadiumModal show={showUpdateModal} handleClose={handleCloseUpdateModal} selectedStadium={selectedStadium} />}
      {showCheckboxes && (
        <button onClick={handleDeleteSelected}>Delete Selected</button>
      )}
    </div>
  );
}

export default DisplayStadiums;
