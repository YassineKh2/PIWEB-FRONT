import React, { useEffect, useState } from "react";
import { getAllReservation, triDesc, triAsc,getbyplace } from "../../../../Services/FrontOffice/apiReservation";
import { FaSortUp, FaSortDown } from "react-icons/fa";
import DefaultLayout from "../../DefaultLayout";

function AllReservation() {
  const [reservations, setReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await getAllReservation();
        if (Array.isArray(response) && response.length > 0) {
          setReservations(response);
        } else {
          console.error("Erreur : Le format de la réponse n'est pas conforme aux attentes");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des réservations :", error);
      }
    };

    fetchReservations();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortDesc = async () => {
    try {
      const response = await triDesc(); 
      setReservations(response);
    } catch (error) {
      console.error("Erreur lors du tri descendant :", error);
    }
  };

  const handleSortAsc = async () => {
    try {
      const response = await triAsc(); 
      setReservations(response);
    } catch (error) {
      console.error("Erreur lors du tri ascendant :", error);
    }
  };

  const filteredReservations = reservations.filter((reservation) =>
    reservation.nbplace.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DefaultLayout>
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white font-roboto">
          Reservations
        </h4>

        {/* Boutons de tri avec les icônes de flèche */}
        <div className="flex justify-normal mb-4">
          <button onClick={handleSortDesc} className="bg-blue-800 text-white font-bold py-2 px-2 rounded mr-2">
            <FaSortDown className="mr-1" /> 
          </button>
          <button onClick={handleSortAsc} className="bg-blue-800 text-white font-bold py-2 px-2 rounded">
            <FaSortUp className="mr-1" /> 
          </button>
        </div>

        {/* Barre de recherche */}
        <div className="mb-4">
          <input
            type="text"
            id="search"
            name="search"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full mt-1 py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Rechercher une réservation..."
          />
        </div>

        {/* Tableau des réservations */}
        {filteredReservations.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 dark:bg-meta-4">
              <tr>
              
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nombre de places</th>
                {/* Ajoutez plus de colonnes pour d'autres détails sur la réservation si nécessaire */}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-boxdark dark:divide-gray-700">
              {filteredReservations.map((reservation) => (
                <tr key={reservation._id}>
          
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{reservation.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{reservation.nbplace}</td>
                  {/* Ajoutez plus de cellules pour d'autres détails sur la réservation si nécessaire */}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="p-4 bg-white rounded-md shadow-md dark:bg-boxdark">Aucune réservation trouvée.</p>
        )}
      </div>
    </DefaultLayout>
  );
}

export default AllReservation;
