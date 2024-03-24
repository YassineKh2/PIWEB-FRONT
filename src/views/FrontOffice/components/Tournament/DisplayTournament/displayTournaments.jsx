import { useEffect, useState } from "react";
import {
  addTournament,
  getAllTournaments,
} from "../../../../../Services/FrontOffice/apiTournament";
import { Link, useNavigate } from "react-router-dom";

function DisplayAllTournaments() {
  const path = "http://localhost:3000/public/images/tournaments/";
  const navigate = useNavigate();
  const [Tournaments, setTournaments] = useState([]);
  const getTournaments = async () => {
    const res = getAllTournaments()
      .then((res) => {
        setTournaments(res.tournaments);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getTournaments();
  }, []);
  return (
    <>
      <button
        onClick={() => navigate("/tournament/add")}
        className="mt-24 ease-in-up hidden rounded-md bg-primary py-3 px-8 text-base font-bold text-white transition duration-300 hover:bg-opacity-90 hover:shadow-signUp md:block md:px-9 lg:px-6 xl:px-9 ml-auto mr-10"
      >
        create Tournament
      </button>
      <div className="mt-6 mb-12 ml-10 mr-10 grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 md:gap-x-6 lg:gap-x-8 xl:grid-cols-3">
        {Tournaments.map((tournament) => (
          <div key={tournament._id} className="w-full">
            <div
              className="wow fadeInUp relative overflow-hidden rounded-md bg-white shadow-one dark:bg-dark"
              data-wow-delay=".1s"
            >
              <a href="/" className="relative block h-[220px] w-full">
                <span className="absolute top-6 right-6 z-20 inline-flex items-center justify-center rounded-full bg-primary py-2 px-4 text-sm font-semibold capitalize text-white">
                  {tournament.name}
                </span>
                <img
                  src={path + tournament?.image}
                  alt="image"
                  style={{
                    maxHeight: "100%",
                    width: "100%",
                    objectFit: "cover",
                  }}
                />
              </a>
              <div className="p-6 sm:p-8 md:py-8 md:px-6 lg:p-8 xl:py-8 xl:px-5 2xl:p-8">
                <h3>
                  <a
                    href="/"
                    className="mb-4 block text-xl font-bold text-black hover:text-primary dark:text-white dark:hover:text-primary sm:text-2xl"
                  >
                    {tournament.tournamentType}
                  </a>
                </h3>
                <p className=" border-b border-body-color border-opacity-10 pb-6 text-base font-medium text-body-color dark:border-white dark:border-opacity-10">
                  Location : {tournament.city}
                </p>
                <p className="mt-4 mb-6 border-b border-body-color border-opacity-10 pb-6 text-base font-medium text-body-color dark:border-white dark:border-opacity-10">
                  Number of Teams : {tournament.nbTeamPartipate}
                </p>
                <div className="flex items-center">
                  <div className="mr-5 flex items-center border-r border-body-color border-opacity-10 pr-5 dark:border-white dark:border-opacity-10 xl:mr-3 xl:pr-3 2xl:mr-5 2xl:pr-5">
                    <div className="mr-4">
                      <div className="relative h-10 w-10 overflow-hidden rounded-full">
                        <img src={path + tournament?.image} alt="author" />
                      </div>
                    </div>
                    <div className="w-full">
                      <h4 className="mb-1 text-sm font-medium text-dark dark:text-white">
                        By nassim
                      </h4>
                      <p className="text-xs text-body-color">test</p>
                    </div>
                  </div>
                  <div className="inline-block">
                    <div className="mr-4">
                      <h4 className="mb-1 text-sm font-medium text-dark dark:text-white">
                        Start Date
                      </h4>
                      <p className="text-xs text-body-color">
                        {new Date(tournament.startDate).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                    <div>
                      <h4 className="mb-1 text-sm font-medium text-dark dark:text-white">
                        End Date
                      </h4>
                      <p className="text-xs text-body-color">
                        {new Date(tournament.endDate).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex">
                <button
                  onClick={() =>
                    navigate(`/tournament/details/${tournament._id}`)
                  }
                  className="mb-4 -mt-4 ease-in-up hidden rounded-full bg-primary py-2 px-6 text-sm font-bold text-white transition duration-300 hover:bg-opacity-90 hover:shadow-signUp md:block md:px-8 lg:px-3 xl:px-8 ml-35 "
                >
                  Details
                </button>

                <button
                  onClick={() =>
                    navigate(`/tournament/update`, { state: { tournament } })
                  }
                  className="mb-4 -mt-4 mr-4 ease-in-up hidden rounded-full bg-primary py-2 px-6 text-sm font-bold text-white transition duration-300 hover:bg-opacity-90 hover:shadow-signUp md:block md:px-8 lg:px-3 xl:px-8 ml-auto "
                >
                  Update

                {userInfo && userInfo.role === "TRM" && (
                  <button
                    onClick={() =>
                      navigate(`/tournament/update`, { state: { tournament } })
                    }
                    className="mb-4 -mt-4 ease-in-up rounded-full bg-primary py-2 px-6 text-sm font-bold text-white transition duration-300 hover:bg-opacity-90 hover:shadow-signUp md:block md:px-8 lg:px-3 xl:px-8"
                    style={{
                      display: userTournaments.some(
                        (t) => t._id === tournament._id
                      )
                        ? "block"
                        : "none",
                    }}
                  >
                    Update
                  </button>
                )}
                <button
            
                  onClick={() =>navigate(`/hotels/details/${tournament._id}`)}
                  className="mb-4 -mt-4 mr-2 ease-in-up rounded-full bg-primary py-2 px-6 text-sm font-bold text-white transition duration-300 hover:bg-opacity-90 hover:shadow-signUp md:block md:px-8 lg:px-3 xl:px-8"

                >
                 Hotels

                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default DisplayAllTournaments;
