import React, { useState, useRef, useEffect } from 'react';
import StadiumService from '../../../../../Services/FrontOffice/apiStadium';
import { DateRangePicker } from 'react-date-range';

const UpdateStadiumModal = ({ selectedStadium, handleClose }) => {
  const modalRef = useRef(null);
  const [stadium, setStadium] = useState({
    name: selectedStadium?.name || '',
    ownership: selectedStadium?.ownership || '',
    address: selectedStadium?.address || '',
    city: selectedStadium?.address?.city || '',
    state: selectedStadium?.address?.state || '',
    country: selectedStadium?.address?.country || '',
    status: selectedStadium?.status || '',
    capacity: selectedStadium?.capacity || 0,
    maintenancePeriod: selectedStadium?.maintenancePeriod || {
      startDate: new Date(),
      endDate: new Date(),
    },
    bookingSchedule: selectedStadium?.bookingSchedule || '',
  });
  const [status, setStatus] = useState('available'); // Default status

  const [selectedDates, setSelectedDates] = useState([
    {
      startDate: new Date(selectedStadium.maintenancePeriod.startDate),
      endDate: new Date(selectedStadium.maintenancePeriod.endDate),
      key: 'selection'
    }
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStadium({ ...stadium, [name]: value });
  };

  const handleDateSelect = (ranges) => {
    const { startDate, endDate } = ranges.selection;
  
    if (!startDate || !endDate) {
      // If either startDate or endDate is null, set status to 'available'
      setStatus('available');
      setSelectedDates([ranges.selection]);
      setStadium({
        ...stadium,
        maintenancePeriod: {
          startDate: startDate ? startDate.toISOString() : null,
          endDate: endDate ? endDate.toISOString() : null
        }
      });
      return;
    }
  
    // Convert today's date to the same format as startDate and endDate
    const today = new Date();
    const formattedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
    endDate.setHours(23, 59, 59, 999);
  
    console.log('Selected Dates:', ranges.selection);
    setSelectedDates([ranges.selection]);
    setStadium({
      ...stadium,
      maintenancePeriod: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }
    });
  
    // Check if today's date is within the maintenance period
    if (formattedToday >= new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()) &&
        formattedToday <= new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())) {
      setStatus('unavailable');
    } else {
      setStatus('available');
    }
  };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await StadiumService.updateStadium(selectedStadium._id, stadium); // Pass the stadium ID and updated object
      console.log('Stadium updated successfully:', response);
      alert('Stadium updated successfully');
      handleClose();
      window.location.reload();
    } catch (error) {
      console.error('Error updating stadium:', error);
      alert('Error updating stadium');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClose]);

  return (
    <div className={`fixed inset-0 z-50 flex justify-center items-center backdrop-filter backdrop-blur-lg bg-opacity-30`} ref={modalRef}>
      <div className="bg-white p-4 rounded">
        <h1 className="font-semibold text-center text-xl text-gray-700">
          Update Stadium
        </h1>
        <hr className="my-4" />
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={stadium.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="ownership">Ownership:</label>
            <input
              type="text"
              id="ownership"
              name="ownership"
              value={stadium.ownership}
              onChange={handleChange}
            />
          </div>
          {/* Add other stadium fields here */}
          <div>
            <label htmlFor="capacity">Capacity:</label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              value={stadium.capacity}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="status">Status:</label>
            <input
              type="text"
              id="status"
              name="status"
              value={stadium.status}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="bookingSchedule">Booking Schedule:</label>
            <input
              type="text"
              id="bookingSchedule"
              name="bookingSchedule"
              value={stadium.bookingSchedule}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="maintenancePeriod">Maintenance Period:</label>
            <DateRangePicker
              ranges={selectedDates}
              onChange={handleDateSelect}
            />
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              className="ml-2 inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
            >
              Save changes
            </button>
            <button
              type="button"
              className="inline-block rounded bg-gray-200 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-gray-700 transition duration-150 ease-in-out hover:bg-gray-300 focus:bg-gray-300 focus:outline-none focus:ring-0 active:bg-gray-400 ml-4"
              onClick={handleClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateStadiumModal;
