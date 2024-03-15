
import React, { useState, useEffect } from "react";
import { getTicket } from "../../../../Services/FrontOffice/apiTicket";
import { deleteres } from "../../../../Services/FrontOffice/apiReservation";
import classnames from "classnames";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function AffTicket() {
    const navigate = useNavigate();
    const [ticket, setTicket] = useState(null);

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const response = await getTicket();
                setTicket(response);
            } catch (error) {
                console.error("Erreur lors de la récupération du ticket :", error);
            }
        };

        fetchTicket();
    }, []);

    const formatDate = (date) => {
        const options = { day: "numeric", month: "numeric", year: "numeric" };
        return new Date(date).toLocaleDateString(undefined, options);
    };

    const handleDeleteTicket = async (reservationId) => {
        try {
            await deleteres(reservationId);
            Swal.fire({
                title: 'Ticket deleted successfully',
                icon: 'success',
            });
        } catch (error) {
            console.error("Erreur lors de la suppression du ticket :", error);
            Swal.fire({
                title: 'Error',
                text: 'An error occurred while deleting the ticket',
                icon: 'error',
            });
        }
        navigate("/addReservation");
    };

    const handleModifyTicket = () => {
        navigate("/upres", { state: { _id: ticket.reservation._id, nbplace: ticket.reservation.nbplace } });
    };
    
    

    const modifierButtonClass = classnames(
        "duration-80",
        "cursor-pointer",
        "rounded-md",
        "border",
        "border-transparent",
        "bg-green-500",
        "py-2",
        "px-4",
        "sm:py-3",
        "sm:px-6",
        "text-center",
        "text-base",
        "font-medium",
        "text-white",
        "outline-none",
        "transition",
        "ease-in-out",
        "hover:bg-opacity-80",
        "hover:shadow-signUp",
        "focus-visible:shadow-none",
    );
    const payerButtonClass = classnames(
        "ml-7",
        "duration-80",
        "cursor-pointer",
        "rounded-md",
        "border",
        "border-transparent",
        "bg-green-500",
        "py-2",
        "px-4",
        "sm:py-3",
        "sm:px-6",
        "text-center",
        "text-base",
        "font-medium",
        "text-white",
        "outline-none",
        "transition",
        "ease-in-out",
        "hover:bg-opacity-80",
        "hover:shadow-signUp",
        "focus-visible:shadow-none",
    );

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", flexDirection: "column" }}>
            {ticket && (
                <div style={{ position: "relative", width: "700px" }}>
                    <img src="/images/tic.png" alt="Tic" style={{ width: "100%", height: "290px" }} />
                    <p style={{ position: "absolute", top: "200px", left: "50px", color: "white", fontSize: "24px" }}>{formatDate(ticket.reservation.date)}</p>
                    <p style={{ position: "absolute", top: "250px", left: "10px", color: "white", fontSize: "20px" }}>{ticket.reservation.nbplace}</p>
                    <div style={{ marginTop: "18px", display: "flex", justifyContent: "space-between" }}>
                        <input
                            type="submit"
                            value="Annuler"
                            onClick={(e) => {
                                e.preventDefault();
                                Swal.fire({
                                    title: 'Do you really want to delete this ticket ?',
                                    text: 'The reservation will be deleted automatically.',
                                    icon: 'question',
                                    showCancelButton: true,
                                    confirmButtonText: 'Confirm',
                                    cancelButtonText: 'Cancel'
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        handleDeleteTicket(ticket.reservation._id);
                                    }
                                });
                            }}
                            className="duration-80 cursor-pointer rounded-md border border-transparent bg-green-500 py-2 px-4 sm:py-3 sm:px-6 text-center text-base font-medium text-white outline-none transition ease-in-out hover:bg-opacity-80 hover:shadow-signUp focus-visible:shadow-none"
                        />
                        <div>
                            <button className={modifierButtonClass} onClick={handleModifyTicket}>Modifier</button>
                            <button className={payerButtonClass}>Payer</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AffTicket;
