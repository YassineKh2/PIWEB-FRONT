import React, { useRef, useEffect } from "react";

const ShowDetailsModal = ({ show, handleClose, stadium }) => {
  const modalRef = useRef(null);
  console.log('Stadium:', stadium);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    };
    
    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show, handleClose]);

  return (
    <div
      id="container"
      ref={modalRef}
      className={`fixed inset-0 z-50 flex justify-center items-center backdrop-filter backdrop-blur-lg bg-opacity-30 ${show ? 'block' : 'hidden'}`}
    >
      <div className="bg-white p-4 rounded">
        <h1 className="font-semibold text-center text-xl text-gray-700">
          Stadium Details
        </h1>
        <hr className="my-4" />
        <div>
  <p><strong>Name:</strong> {stadium.Stadiums.name || 'N/A'}</p>
  <p><strong>Location:</strong> {stadium.Stadiums.address ? `${stadium.Stadiums.address.city || 'N/A'}, ${stadium.Stadiums.address.state || 'N/A'}, ${stadium.Stadiums.address.country || 'N/A'}` : 'N/A'}</p>
  <p><strong>Capacity:</strong> {stadium.Stadiums.capacity !== undefined ? stadium.Stadiums.capacity : 'N/A'}</p>
  <p><strong>Status:</strong> {stadium.Stadiums.status || 'N/A'}</p>
  <p><strong>Ownership:</strong> {stadium.Stadiums.ownership || 'N/A'}</p>
  <p><strong>Booking Schedule:</strong> {stadium.Stadiums.bookingSchedule || 'N/A'}</p>
  <p><strong>Maintenance Period:</strong> {stadium.Stadiums.maintenancePeriod ? `${stadium.Stadiums.maintenancePeriod.startDate || 'N/A'} - ${stadium.Stadiums.maintenancePeriod.endDate || 'N/A'}` : 'N/A'}</p>
  {/* Add more details here */}
</div>
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            className="inline-block rounded bg-gray-200 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-gray-700 transition duration-150 ease-in-out hover:bg-gray-300 focus:bg-gray-300 focus:outline-none focus:ring-0 active:bg-gray-400"
            onClick={handleClose}
          >
            Close
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default ShowDetailsModal;
