import React, { useState } from "react";
import { addReservation } from "../../../../Services/FrontOffice/apiReservation";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

function AddReservation() {
  const navigate = useNavigate();
  const [reservation, setReservation] = useState({
    date: new Date().toISOString().split('T')[0], // System date
    nbplace: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Prevent entering a negative number of seats
    if (name === "nbplace" && value < 0) {
      return;
    }

    setReservation({ ...reservation, [name]: value });
  };

  const add = async (e) => {
    e.preventDefault();
    try {
      // Check if nbplace is provided
      if (!reservation.nbplace) {
        Swal.fire({
          title: 'Error!',
          text: 'Please enter the seat number.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        return;
      }
      
      const res = await addReservation(reservation);
      console.log("Successful addition");
      navigate("/getAllTournament");
      
      // Display confirmation popup
      Swal.fire({
        title: 'Thank You!',
        text: 'Please finalize the payment.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    } catch (error) {
      console.error("Error adding reservation:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen mt-16">
      <div className="w-full px-4 lg:w-8/12 xl:w-6/12">
        <div className="wow fadeInUp relative z-10 rounded-md bg-primary/[3%] p-8 dark:bg-primary/10 sm:p-11 lg:p-8 xl:p-11" data-wow-delay=".2s">
          <h3 className="mb-4 text-2xl font-bold leading-tight text-black dark:text-white font-serif">
            Reservation
          </h3>
          <form>
            <div className="mb-4">
              <label htmlFor="date" className="text-body-color block mb-1 font-serif">Date:</label>
              <input
                type="date"
                id="date"
                name="date"
                value={reservation.date}
                onChange={(e) => handleChange(e)}
                className="w-full rounded-md border border-body-color border-opacity-10 py-3 px-6 text-base font-medium text-body-color placeholder-body-color outline-none focus:border-primary focus:border-opacity-100 focus-visible:shadow-none dark:border-white dark:border-opacity-10 dark:bg-[#242B51] focus:dark:border-opacity-50"
                disabled // Disable date field
              />
            </div>
            <div className="mb-4">
              <label htmlFor="nbplace" className="text-body-color block mb-1 font-serif">Seat Number:</label>
              <input
                type="text" // Change type to "text" to accept characters and numbers
                id="nbplace"
                name="nbplace"
                placeholder="Seat Number"
                value={reservation.nbplace}
                onChange={(e) => handleChange(e)}
                className="w-full rounded-md border border-body-color border-opacity-10 py-3 px-6 text-base font-medium text-body-color placeholder-body-color outline-none focus:border-primary focus:border-opacity-100 focus-visible:shadow-none dark:border-white dark:border-opacity-10 dark:bg-[#242B51] focus:dark:border-opacity-50"
                required // Make nbplace field required
              />
            </div>
            <div className="flex justify-center"> {/* Add flex and justify-center classes */}
              <input
                type="submit"
                value="Confirm"
                onClick={(e) => {
                  e.preventDefault();
                  // Display confirmation popup with SweetAlert
                  Swal.fire({
                    title: 'Do you really want to confirm this reservation?',
                    text: 'Once confirmed, you must pay.',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Confirm',
                    cancelButtonText: 'Cancel'
                  }).then((result) => {
                    if (result.isConfirmed) {
                      add(e);
                    }
                  });
                }}
                className="duration-80 cursor-pointer rounded-md border border-transparent bg-primary py-2 px-4 sm:py-3 sm:px-6 text-center text-base font-medium text-white outline-none transition ease-in-out hover:bg-opacity-80 hover:shadow-signUp focus-visible:shadow-none"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddReservation;
