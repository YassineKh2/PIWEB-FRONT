import React, { useState } from "react";
import { updateReservation } from "../../../../Services/FrontOffice/apiReservation";
import { useNavigate, useLocation } from "react-router-dom";

function UpReservation() {
    const navigate = useNavigate();
    const location = useLocation();
  
    const {  _id,nbplace } = location.state || {};
    const [newData, setNewData] = useState({
     
        _id:_id,
        nbplace: nbplace || '',
    });

    const handleChange = (e) => {
        const { value } = e.target;
        setNewData(prevData => ({
            ...prevData,
            nbplace: value
        }));
    };

    const handleUpdateReservation = async () => {
        try {
      
            console.log("Reservation ID:", _id);
            console.log("New data:", newData);
            console.log(newData);
            await updateReservation(_id, newData);
      
            navigate("/Ticket");
    
        } catch (error) {
            console.error("Error updating reservation:", error);
        }
    };
    

    return (
        <div className="flex justify-center items-center h-screen mt-16">
            <div className="w-full px-4 lg:w-8/12 xl:w-6/12">
                {nbplace && (
                    <div className="wow fadeInUp relative z-10 rounded-md bg-primary/[3%] p-8 dark:bg-primary/10 sm:p-11 lg:p-8 xl:p-11" data-wow-delay=".2s">
                        <h3 className="mb-4 text-2xl font-bold leading-tight text-black dark:text-white font-serif">
                            Reservation
                        </h3>
                        <form>
                            <div className="mb-4">
                                <label htmlFor="nbplace" className="text-body-color block mb-1 font-serif">Seat Number:</label>
                                <input
                                    type="text"
                                    id="nbplace"
                                    name="nbplace"
                                    placeholder="Seat Number"
                                    value={newData.nbplace}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-body-color border-opacity-10 py-3 px-6 text-base font-medium text-body-color placeholder-body-color outline-none focus:border-primary focus:border-opacity-100 focus-visible:shadow-none dark:border-white dark:border-opacity-10 dark:bg-[#242B51] focus:dark:border-opacity-50"
                                    required
                                />
 </div>
 <input
    type="button"
    onClick={handleUpdateReservation}
    className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded transition duration-300"
    value="Update Reservation"
/>

                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UpReservation;
