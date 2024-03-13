import React, { useEffect, useState } from "react";
import { getAllTicket } from "../../../../Services/FrontOffice/apiTicket";
import DefaultLayout from "../../DefaultLayout";

function BTicket() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await getAllTicket();
        if (Array.isArray(response) && response.length > 0) {
          setTickets(response);
        } else {
          console.error("Erreur : Le format de la réponse n'est pas conforme aux attentes");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des tickets :", error);
      }
    };

    fetchTickets();
  }, []);

  return (
    <DefaultLayout>
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white font-roboto">
          Tickets
        </h4>

        {/* Tableau des tickets */}
        {tickets.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 dark:bg-meta-4">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date_Reservation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Seat</th>
                {/* Ajoutez plus de colonnes pour d'autres détails sur le ticket si nécessaire */}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-boxdark dark:divide-gray-700">
              {tickets.map((ticket) => (
                <tr key={ticket._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{ticket.reservation.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{ticket.reservation.nbplace}</td>
                  {/* Ajoutez plus de cellules pour d'autres détails sur le ticket si nécessaire */}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="p-4 bg-white rounded-md shadow-md dark:bg-boxdark">Aucun ticket trouvé.</p>
        )}
      </div>
    </DefaultLayout>
  );
}

export default BTicket;
