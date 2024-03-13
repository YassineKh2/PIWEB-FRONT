import React, { useEffect, useState } from "react";
import { getAllSponsors, getbyName,triAsc,triDesc } from "../../../../Services/FrontOffice/apiSponsors";
import DefaultLayout from "../../DefaultLayout";
import { FaSortUp, FaSortDown } from "react-icons/fa";

function AllSponsors() {
  const [allSponsors, setAllSponsors] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const response = await getAllSponsors();
        if (Array.isArray(response) && response.length > 0) {
          setAllSponsors(response);
          setSponsors(response);
        } else {
          console.error("Erreur : Le format de la réponse n'est pas conforme aux attentes");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des sponsors :", error);
      }
    };

    fetchSponsors();
  }, []);

  const handleSearchChange = async (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    try {
      if (term.trim() === "") {
        setSponsors(allSponsors);
      } else {
        const filteredSponsors = allSponsors.filter((sponsor) =>
          sponsor.name.toLowerCase().includes(term.toLowerCase())
        );
        setSponsors(filteredSponsors);
      }
    } catch (error) {
      console.error("Erreur lors de la recherche des sponsors :", error);
    }
  };
  const handleSortDesc = async () => {
    try {
      const response = await triDesc(); 
      setSponsors(response);
    } catch (error) {
      console.error("Erreur lors du tri descendant :", error);
    }
  };

  const handleSortAsc = async () => {
    try {
      const response = await triAsc(); 
      setSponsors(response);
    } catch (error) {
      console.error("Erreur lors du tri ascendant :", error);
    }
  };
  return (
    <DefaultLayout>
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">Sponsors</h4>
           {/* Boutons de tri avec les icônes de flèche */}
           <div className="flex justify-normal mb-4">
          <button onClick={handleSortDesc} className="bg-blue-800 text-white font-bold py-2 px-2 rounded mr-2">
            <FaSortDown className="mr-1" /> 
          </button>
          <button onClick={handleSortAsc} className="bg-blue-800 text-white font-bold py-2 px-2 rounded">
            <FaSortUp className="mr-1" /> 
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            id="search"
            name="search"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full mt-1 py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Rechercher un sponsor..."
          />
        </div>
        {sponsors.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 dark:bg-meta-4">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Adresse</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-boxdark dark:divide-gray-700">
              {sponsors.map((sponsor) => (
                <tr key={sponsor._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{sponsor.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{sponsor.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{sponsor.contact}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{sponsor.adresse}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="p-4 bg-white rounded-md shadow-md dark:bg-boxdark">Aucun sponsor trouvé.</p>
        )}
      </div>
    </DefaultLayout>
  );
}

export default AllSponsors;
