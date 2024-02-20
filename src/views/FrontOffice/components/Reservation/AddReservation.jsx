import React, { useState } from "react";
import { addReservation } from "../../../../Services/FrontOffice/apiReservation";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

function AddReservation() {
  const navigate = useNavigate();
  const [reservation, setReservation] = useState({
    date: new Date(),
    nbplace: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Empêcher la saisie d'un nombre de chaise négatif
    if (name === "nbplace" && value < 0) {
      return;
    }

    setReservation({ ...reservation, [name]: value });
  };

  const add = async (e) => {
    e.preventDefault();
    try {
      const res = await addReservation(reservation);
      console.log("Ajout réussi");
      navigate("/getAllTournament");
      
      // Afficher la fenêtre pop-up de confirmation
      Swal.fire({
        title: 'Merci!',
        text: 'Merci de finaliser le.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout de la réservation :", error);
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
              />
            </div>
            <div className="mb-4">
              <label htmlFor="nbplace" className="text-body-color block mb-1 font-serif">Numero de chaise:</label>
              <input
                type="number"
                id="nbplace"
                name="nbplace"
                placeholder="Nombre de places"
                value={reservation.nbplace}
                onChange={(e) => handleChange(e)}
                className="w-full rounded-md border border-body-color border-opacity-10 py-3 px-6 text-base font-medium text-body-color placeholder-body-color outline-none focus:border-primary focus:border-opacity-100 focus-visible:shadow-none dark:border-white dark:border-opacity-10 dark:bg-[#242B51] focus:dark:border-opacity-50"
              />
            </div>
            <div className="flex justify-center"> {/* Ajout de la classe flex et justify-center */}
              <input
                type="submit"
                value="Confirmer"
                onClick={(e) => {
                  e.preventDefault();
                  // Afficher la fenêtre pop-up de confirmation avec SweetAlert
                  Swal.fire({
                    title: 'Voulez-vous vraiment confirmer cette réservation ?',
                    text: 'Une fois confirmé, vous devez payé.',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Confirmer',
                    cancelButtonText: 'Annuler'
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
