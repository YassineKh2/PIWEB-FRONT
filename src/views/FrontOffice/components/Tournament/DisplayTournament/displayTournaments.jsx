import { useEffect, useState } from "react";
import {
  addTournament,
  getAllTournaments,
  getTournamentsByUser,
} from "../../../../../Services/FrontOffice/apiTournament";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  FaHeart as FullHeart,
  FaHeartBroken as BrokenHeart,
  FaRegHeart as EmptyHeart,
} from "react-icons/fa";
import {
  getUserData,
  updateFollowedTournaments,
} from "../../../../../Services/apiUser";
import SectionTitle from "../../../HomePage/components/Common/SectionTitle";
function DisplayAllTournaments() {
  const path = "http://localhost:3000/public/images/tournaments/";
  const navigate = useNavigate();
  const [Tournaments, setTournaments] = useState([]);
  const [userTournaments, setUserTournaments] = useState([]);
  const [userInfo, setUserInfo] = useState();
  const [user, setUser] = useState();
  const [selectedOption, setSelectedOption] = useState("AllTournaments");
  const [followedTournaments, setfollowedTournaments] = useState();
  const [liked, setLiked] = useState(false);
  const [isHovered, setIsHovered] = useState({});
  const [likedTournaments, setLikedTournaments] = useState({});
  const displayTournaments =
    selectedOption === "AllTournaments" ? Tournaments : userTournaments;
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
  useEffect(() => {
    const userToken = localStorage.getItem("token");
    if (userToken) {
      const decodedToken = jwtDecode(userToken);
      setUserInfo(decodedToken);
      getUserData(decodedToken.userId).then((response) => {
        setUser(response.user);
        setfollowedTournaments(response.user.followedTournaments);
        const likedTournamentsObj = {};
        response.user.followedTournaments.forEach((tournamentId) => {
          likedTournamentsObj[tournamentId] = true;
        });
        setLikedTournaments(likedTournamentsObj);
      });
    }
  }, []);
  const getUserTournament = async () => {
    const res = getTournamentsByUser(userInfo.userId)
      .then((res) => {
        setUserTournaments(res.tournaments);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    if (userInfo) getUserTournament();
  }, [userInfo]);
  useEffect(() => {
    if (user) setfollowedTournaments(user.followedTournaments);
  }, [user]);
  const like = (idTournament) => {
    const updatedLikedTournaments = { ...likedTournaments };
    followedTournaments.push(idTournament);
    user.followedTournaments = followedTournaments;
    updateFollowedTournaments(user).then(() => {
      console.log("Liked team :", idTournament);
    });
    updatedLikedTournaments[idTournament] = true;
    setLikedTournaments(updatedLikedTournaments);
  };

  const unlike = (idTournament) => {
    const updatedLikedTournaments = { ...likedTournaments };
    followedTournaments.pop(idTournament);
    user.followedTournaments = followedTournaments;
    updateFollowedTournaments(user).then(() => {
      console.log("Unliked team :", idTournament);
    });
    updatedLikedTournaments[idTournament] = false;
    setLikedTournaments(updatedLikedTournaments);
  };
  return (
    <>
      <SectionTitle
        title="Disvover All Tournaments"
        paragraph="Explore the wide range of  tournaments. Get to know their results, standings, and more."
        center
      />

      <div className="max-w-md mx-auto mb-4">
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            // value={searchData}
            placeholder="Search for your favorite team"
            required
          />
          <button
            type="submit"
            //  onClick={Search}
            className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Search
          </button>
        </div>
      </div>
      {userInfo && userInfo.role === "TRM" && (
        <div className="flex justify-between mt-10">
          <form className="max-w-sm ml-10">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Select an option
            </label>
            <select
              id="countries"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
            >
              <option value="AllTournaments">Display All Tournaments</option>
              <option value="yourTournaments">Display Your Tournaments</option>
            </select>
          </form>
          <div>
            <button
              onClick={() => navigate("/tournament/add")}
              className="mt-6  ease-in-up hidden rounded-md bg-primary py-2 px-6 text-base font-bold text-white transition duration-300 hover:bg-opacity-90 hover:shadow-signUp md:block md:px-9 lg:px-6 xl:px-9 ml-auto mr-10"
            >
              create Tournament
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 mb-12 ml-10 mr-10 grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 md:gap-x-6 lg:gap-x-8 xl:grid-cols-3">
        {displayTournaments.map((tournament) => (
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
                <p className="border-b border-body-color border-opacity-10 pb-6 text-base font-medium text-body-color dark:border-white dark:border-opacity-10">
                  <span className="text-dark dark:text-black">Location:</span>
                  &nbsp; {tournament.city} &nbsp;&nbsp;&nbsp;
                  <span className="text-dark dark:text-black">
                    Description:{" "}
                  </span>
                  {tournament.description}
                </p>
                <p className="mt-4 mb-6 border-b border-body-color border-opacity-10 pb-6 text-base font-medium text-body-color dark:border-white dark:border-opacity-10">
                  <span className="text-dark dark:text-black">
                    {" "}
                    Number of Teams :{" "}
                  </span>
                  {tournament.nbTeamPartipate}
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
                        By {tournament.creatorInfo.firstName}
                      </h4>
                      <p className="text-xs text-body-color">
                        {tournament.creatorInfo.lastName}
                      </p>
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
              <div className="flex flex-wrap justify-center md:justify-start">
                <button
                  onClick={() =>
                    navigate(`/tournament/details/${tournament._id}`)
                  }
                  className="mb-4 -mt-2 mr-2 ease-in-up rounded-full bg-primary py-2 px-6 text-sm font-bold text-white transition duration-300 hover:bg-opacity-90 hover:shadow-signUp md:block md:px-8 lg:px-3 xl:px-8"
                >
                  Details
                </button>
                {userInfo && userInfo.role === "TRM" && (
                  <button
                    onClick={() =>
                      navigate(`/tournament/update`, { state: { tournament } })
                    }
                    className="mb-4 -mt-2 mr-2 ease-in-up rounded-full bg-primary py-2 px-6 text-sm font-bold text-white transition duration-300 hover:bg-opacity-90 hover:shadow-signUp md:block md:px-8 lg:px-3 xl:px-8"
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
                <div className="flex items-stretch">
                  <button
                    onClick={() =>
                      navigate(`/hotels/details/${tournament._id}`)
                    }
                    className="mb-4 -mt-2 lg:mr-15 max-sm:mr-3 ease-in-up rounded-full bg-primary py-2 px-6 text-sm font-bold text-white transition duration-300 hover:bg-opacity-90 hover:shadow-signUp md:block md:px-8 lg:px-3 xl:px-8"
                  >
                    Hotels
                  </button>
                  {userInfo && userInfo.userId === tournament.creator && (
                    <div>
                      {likedTournaments[tournament._id] ? (
                        isHovered[tournament._id] ? (
                          <BrokenHeart
                            onMouseEnter={() =>
                              setIsHovered((prevState) => ({
                                ...prevState,
                                [tournament._id]: true,
                              }))
                            }
                            onMouseLeave={() =>
                              setIsHovered((prevState) => ({
                                ...prevState,
                                [tournament._id]: false,
                              }))
                            }
                            size={25}
                            onClick={() => unlike(tournament._id)}
                            className="text-red-500 self-end mr-4 cursor-pointer transition ease-in-out hover:-translate-y-1 hover:scale-110  duration-130"
                          />
                        ) : (
                          <FullHeart
                            onMouseEnter={() =>
                              setIsHovered((prevState) => ({
                                ...prevState,
                                [tournament._id]: true,
                              }))
                            }
                            onMouseLeave={() =>
                              setIsHovered((prevState) => ({
                                ...prevState,
                                [tournament._id]: false,
                              }))
                            }
                            size={25}
                            className="text-red-500 self-end mr-4 cursor-pointer transition ease-in-out duration-500"
                          />
                        )
                      ) : isHovered[tournament._id] ? (
                        <FullHeart
                          onMouseEnter={() =>
                            setIsHovered((prevState) => ({
                              ...prevState,
                              [tournament._id]: true,
                            }))
                          }
                          onMouseLeave={() =>
                            setIsHovered((prevState) => ({
                              ...prevState,
                              [tournament._id]: false,
                            }))
                          }
                          size={25}
                          onClick={() => like(tournament._id)}
                          className="text-red-600 self-end mr-4 cursor-pointer transition ease-in-out hover:-translate-y-1 hover:scale-110  duration-130"
                        />
                      ) : (
                        <EmptyHeart
                          onMouseEnter={() =>
                            setIsHovered((prevState) => ({
                              ...prevState,
                              [tournament._id]: true,
                            }))
                          }
                          onMouseLeave={() =>
                            setIsHovered((prevState) => ({
                              ...prevState,
                              [tournament._id]: false,
                            }))
                          }
                          size={25}
                          className="text-gray-500 self-end mr-4 cursor-pointer transition ease-in-out duration-500"
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default DisplayAllTournaments;
