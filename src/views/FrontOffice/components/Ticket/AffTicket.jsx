import React, { useState, useEffect } from "react";
import { getTicket } from "../../../../Services/FrontOffice/apiTicket";
import { deleteres } from "../../../../Services/FrontOffice/apiReservation";
import classnames from "classnames";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import QRCode from 'qrcode.react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

const formatDate = (date) => {
    const options = { day: "numeric", month: "numeric", year: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
};

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
    const handlePayment = async () => {
        try {
            // Charger Stripe avec votre clé publique
            const stripe = await loadStripe("pk_test_51OuG1RHMTmfPbZ2rJc8v3BKFGgsr01wD723Z1diicQ1qCFZ4NybLceC75F1XuqRaOmwCnkuYrm8KWWOmAUB1M7uM00KaXkEGCZ");

            // Envoyer une requête POST à votre backend pour créer une session de paiement
            const response = await fetch("http://localhost:3000/payment/create-checkout-session", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    amount: '20', // Montant à payer
                }),
            });

            const session = await response.json();


            const result = await stripe.redirectToCheckout({
                sessionId: session.sessionId,
            });


            if (result.error) {
                console.error(result.error.message);
            } else {
                console.log("Redirection réussie");
            }
        } catch (error) {
            console.error('Erreur lors du paiement:', error);
        }


        Swal.fire({
            title: 'Thank you for finishing the payment!',
            icon: 'success',
            showConfirmButton: false,
            timer: 5000
        }).then(() => {
            window.location.href = '/tournament/showAll';
        });
    };

    // Classnames for buttons
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

    const deleteButtonClass = classnames(

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
                    <p style={{ position: "absolute", top: "138px", left: "10px", color: "white", fontSize: "20px",fontWeight: "bold"}}>{ticket.reservation.team1}</p>
                    <p style={{ position: "absolute", top: "138px", left: "190px", color: "white", fontSize: "20px",fontWeight: "bold" }}>{ticket.reservation.team2}</p>

                    <p style={{ position: "absolute", top: "240px", left: "15px", color: "white", fontSize: "20px" }}>{ticket.reservation.nbplace}</p>
                    <p style={{ position: "absolute", top: "265px", left: "10px", color: "black", fontSize: "15px",fontWeight: "semibold"}}>This ticket is valid for one person</p>

                    <div style={{ marginTop: "18px", display: "flex", justifyContent: "space-between" }}>
                        <input
                            type="submit"
                            value="Delete"
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
                            className={deleteButtonClass}
                        />
                        <div>
                            <button className={modifierButtonClass} onClick={handleModifyTicket}>Update</button>
                            <button className={payerButtonClass} onClick={handlePayment}>Payer</button>
                        </div>
                    </div>
                    {/* Affichage du QR Code ici */}
                    <div style={{ position: "absolute", top: "100px", left: "570px"}}>
                        <QRCode value={`La ticket est bien réservée: ${ticket.reservation.team1} vs ${ticket.reservation.team2} pour la place ${ticket.reservation.nbplace} `} renderAs="svg" />
                        <p style={{ position: "absolute", top: "140px", left: "0px", color: "black", fontSize: "20px",fontWeight: "bold" }}>{formatDate(ticket.reservation.date)}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AffTicket;