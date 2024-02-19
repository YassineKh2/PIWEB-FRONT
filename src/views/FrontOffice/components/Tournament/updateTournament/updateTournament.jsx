import { useEffect, useState } from "react";
import {
  addTournament,
  updateTournament,
} from "../../../../../Services/FrontOffice/apiTournament";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllTeams } from "../../../../../Services/FrontOffice/apiTeam";

function UpdateTournament() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const formattedStartDate = new Date(state.tournament.startDate)
    .toISOString()
    .split("T")[0];
  const formattedEndDate = new Date(state.tournament.endDate)
    .toISOString()
    .split("T")[0];
  const [image, setImage] = useState(null);
  const [Teams, setTeams] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [Tournament, setTournament] = useState({
    _id: state.tournament._id,
    name: state.tournament.name,
    description: state.tournament.description,
    startDate: state.tournament.startDate,
    endDate: state.tournament.endDate,
    location: state.tournament.location,
    image: state.tournament.image,
    tournamentType: state.tournament.tournamentType,
    nbTeamPartipate: state.tournament.nbTeamPartipate,
  });
  const tournamentTypeOptions = ["League", "Knockout", "Group Stage"];
  const handlechange = (e) => {
    setTournament({ ...Tournament, [e.target.name]: e.target.value });
  };
  const handleStartDateChange = (date) => {
    const isoDateString = date.toISOString();
    const formattedDate = isoDateString.substring(0, 10);
    setTournament({ ...Tournament, startDate: formattedDate });
  };

  const handleEndDateChange = (date) => {
    const isoDateString = date.toISOString();
    const formattedDate = isoDateString.substring(0, 10);
    setTournament({ ...Tournament, endDate: formattedDate });
  };
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };
  const handleTeamChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSelectedTeams(selectedOptions);
    console.log(selectedTeams);
  };
  useEffect(() => {
    if (image && image.name) {
      setTournament((prevTournament) => ({
        ...prevTournament,
        image: image.name,
      }));
    }
  }, [image]);
  const getTeams = async () => {
    const res = getAllTeams()
      .then((res) => {
        setTeams(res.teams);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getTeams();
  }, []);

  const update = async (e) => {
    e.preventDefault();
    const fileReader = new FileReader();
    fileReader.onloadend = function () {
      const base64Image = fileReader.result.split(",")[1]; // Extract base64 encoded image data
      const imageData = {
        _id: state.tournament._id,
        name: Tournament.name,
        description: Tournament.description,
        location: Tournament.location,
        startDate: Tournament.startDate,
        endDate: Tournament.endDate,
        tournamentType: Tournament.tournamentType,
        nbTeamPartipate: Tournament.nbTeamPartipate,
        teams: selectedTeams,
      };
      console.log(imageData);
      const res = updateTournament(imageData)
        .then(() => {
          console.log("update passe");
          navigate("/getAllTournament");
        })
        .catch((error) => {
          console.log(error.response.data.message);
        });
    };

    if (image) {
      fileReader.readAsDataURL(image);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center h-screen mt-40 mb-30">
        <div className="w-full px-4 lg:w-8/12 xl:w-6/12">
          <div
            className="wow fadeInUp relative z-10 rounded-md bg-primary/[3%] p-8 dark:bg-primary/10 sm:p-11 lg:p-8 xl:p-11"
            data-wow-delay=".2s"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%", // Make sure the parent div has a defined height
            }}
          >
            <h3 className="mb-4 text-2xl font-bold leading-tight text-black dark:text-white">
              Update Tournament Information
            </h3>
            <form role="form" encType="multipart/form-data">
              <div className="flex mb-4 w-full">
                <input
                  type="text"
                  name="name"
                  placeholder="Tournament Name"
                  onChange={(e) => handlechange(e)}
                  defaultValue={state.tournament.name}
                  className="mr-2 w-1/2 rounded-md border border-body-color border-opacity-10 py-3 px-6 text-base font-medium text-body-color placeholder-body-color outline-none focus:border-primary focus:border-opacity-100 focus-visible:shadow-none dark:border-white dark:border-opacity-10 dark:bg-[#242B51] focus:dark:border-opacity-50 mb-4"
                />
                <input
                  type="text"
                  name="location"
                  placeholder="Tournament Location"
                  defaultValue={state.tournament.location}
                  onChange={(e) => handlechange(e)}
                  className="w-1/2 rounded-md border border-body-color border-opacity-10 py-3 px-6 text-base font-medium text-body-color placeholder-body-color outline-none focus:border-primary focus:border-opacity-100 focus-visible:shadow-none dark:border-white dark:border-opacity-10 dark:bg-[#242B51] focus:dark:border-opacity-50 mb-4" // Added mb-4 for margin-bottom
                />
              </div>

              <textarea
                name="description"
                placeholder="Tournament Description"
                defaultValue={state.tournament.description}
                onChange={(e) => handlechange(e)}
                className="mb-4 w-full flex-grow rounded-md border border-body-color border-opacity-10 py-3 px-6 text-base font-medium text-body-color placeholder-body-color outline-none focus:border-primary focus:border-opacity-100 focus-visible:shadow-none dark:border-white dark:border-opacity-10 dark:bg-[#242B51] focus:dark:border-opacity-50" // Added mb-4 for margin-bottom
              />

              <div className="flex mb-4">
                <input
                  type="date"
                  name="startDate"
                  defaultValue={formattedStartDate}
                  onChange={(e) =>
                    handleStartDateChange(new Date(e.target.value))
                  }
                  className="mr-2 w-1/2 rounded-md border border-body-color border-opacity-10 py-3 px-6 text-base font-medium text-body-color placeholder-body-color outline-none focus:border-primary focus:border-opacity-100 focus-visible:shadow-none dark:border-white dark:border-opacity-10 dark:bg-[#242B51] focus:dark:border-opacity-50 mb-4" // Added mb-4 for margin-bottom
                />
                <input
                  type="date"
                  name="endDate"
                  defaultValue={formattedEndDate}
                  onChange={(e) =>
                    handleEndDateChange(new Date(e.target.value))
                  }
                  className="w-1/2 rounded-md border border-body-color border-opacity-10 py-3 px-6 text-base font-medium text-body-color placeholder-body-color outline-none focus:border-primary focus:border-opacity-100 focus-visible:shadow-none dark:border-white dark:border-opacity-10 dark:bg-[#242B51] focus:dark:border-opacity-50 mb-4" // Added mb-4 for margin-bottom
                />
              </div>

              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={(e) => handleImageChange(e)}
                className="mb-4 w-full rounded-md border border-body-color border-opacity-10 py-3 px-6 text-base font-medium text-body-color placeholder-body-color outline-none focus:border-primary focus:border-opacity-100 focus-visible:shadow-none dark:border-white dark:border-opacity-10 dark:bg-[#242B51] focus:dark:border-opacity-50" // Added mb-4 for margin-bottom
              />
              <div className="mb-4 w-full flex">
                <div className="mr-2">
                  <label
                    htmlFor="tournamentType"
                    className="text-base font-medium text-body-color"
                  >
                    Tournament Type
                  </label>
                  <select
                    id="tournamentType"
                    name="tournamentType"
                    onChange={(e) => handlechange(e)}
                    defaultValue={state.tournament.tournamentType}
                    className="w-full rounded-md border border-body-color border-opacity-10 py-3 px-6 text-base font-medium text-body-color placeholder-body-color outline-none focus:border-primary focus:border-opacity-100 focus-visible:shadow-none dark:border-white dark:border-opacity-10 dark:bg-[#242B51] focus:dark:border-opacity-50"
                  >
                    <option value="" disabled>
                      Select Tournament Type
                    </option>
                    {tournamentTypeOptions.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="teamCount"
                    className="text-base font-medium text-body-color"
                  >
                    Number of Teams
                  </label>
                  <input
                    type="number"
                    id="teamCount"
                    name="nbTeamPartipate"
                    defaultValue={state.tournament.nbTeamPartipate}
                    min="4"
                    placeholder="Enter number of teams"
                    onChange={(e) => handlechange(e)}
                    className="w-full rounded-md border border-body-color border-opacity-10 py-3 px-6 text-base font-medium text-body-color placeholder-body-color outline-none focus:border-primary focus:border-opacity-100 focus-visible:shadow-none dark:border-white dark:border-opacity-10 dark:bg-[#242B51] focus:dark:border-opacity-50"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="teams" className="text-lg font-semibold mb-2">
                  Select Teams:
                </label>
                <select
                  id="teams"
                  name="teams"
                  multiple
                  onChange={handleTeamChange}
                  defaultValue={selectedTeams}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  {Teams != null &&
                    Teams.map((team) => (
                      <option key={team._id} value={team._id}>
                        {team.name}
                      </option>
                    ))}
                </select>
              </div>
              <input
                type="submit"
                value="Subscribe"
                onClick={(e) => update(e)}
                className="duration-80 mb-4 w-full cursor-pointer rounded-md border border-transparent bg-primary py-3 px-6 text-center text-base font-medium text-white outline-none transition ease-in-out hover:bg-opacity-80 hover:shadow-signUp focus-visible:shadow-none"
              />
            </form>
            <div className="absolute top-0 left-0 z-[-1]">
              <svg
                width="370"
                height="596"
                viewBox="0 0 370 596"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <mask
                  id="mask0_88:141"
                  style={{ maskType: "alpha" }}
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="370"
                  height="596"
                >
                  <rect width="370" height="596" rx="2" fill="#1D2144" />
                </mask>
                <g mask="url(#mask0_88:141)">
                  <path
                    opacity="0.15"
                    d="M15.4076 50.9571L54.1541 99.0711L71.4489 35.1605L15.4076 50.9571Z"
                    fill="url(#paint0_linear_88:141)"
                  />
                  <path
                    opacity="0.15"
                    d="M20.7137 501.422L44.6431 474.241L6 470.624L20.7137 501.422Z"
                    fill="url(#paint1_linear_88:141)"
                  />
                  <path
                    opacity="0.1"
                    d="M331.676 198.309C344.398 204.636 359.168 194.704 358.107 180.536C357.12 167.363 342.941 159.531 331.265 165.71C318.077 172.69 318.317 191.664 331.676 198.309Z"
                    fill="url(#paint2_linear_88:141)"
                  />
                  <g opacity="0.3">
                    <path
                      d="M209 89.9999C216 77.3332 235.7 50.7999 258.5 45.9999C287 39.9999 303 41.9999 314 30.4999C325 18.9999 334 -3.50014 357 -3.50014C380 -3.50014 395 4.99986 408.5 -8.50014C422 -22.0001 418.5 -46.0001 452 -37.5001C478.8 -30.7001 515.167 -45 530 -53"
                      stroke="url(#paint3_linear_88:141)"
                    />
                    <path
                      d="M251 64.9999C258 52.3332 277.7 25.7999 300.5 20.9999C329 14.9999 345 16.9999 356 5.49986C367 -6.00014 376 -28.5001 399 -28.5001C422 -28.5001 437 -20.0001 450.5 -33.5001C464 -47.0001 460.5 -71.0001 494 -62.5001C520.8 -55.7001 557.167 -70 572 -78"
                      stroke="url(#paint4_linear_88:141)"
                    />
                    <path
                      d="M212 73.9999C219 61.3332 238.7 34.7999 261.5 29.9999C290 23.9999 306 25.9999 317 14.4999C328 2.99986 337 -19.5001 360 -19.5001C383 -19.5001 398 -11.0001 411.5 -24.5001C425 -38.0001 421.5 -62.0001 455 -53.5001C481.8 -46.7001 518.167 -61 533 -69"
                      stroke="url(#paint5_linear_88:141)"
                    />
                    <path
                      d="M249 40.9999C256 28.3332 275.7 1.79986 298.5 -3.00014C327 -9.00014 343 -7.00014 354 -18.5001C365 -30.0001 374 -52.5001 397 -52.5001C420 -52.5001 435 -44.0001 448.5 -57.5001C462 -71.0001 458.5 -95.0001 492 -86.5001C518.8 -79.7001 555.167 -94 570 -102"
                      stroke="url(#paint6_linear_88:141)"
                    />
                  </g>
                </g>
                <defs>
                  <linearGradient
                    id="paint0_linear_88:141"
                    x1="13.4497"
                    y1="63.5059"
                    x2="81.144"
                    y2="41.5072"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="white" />
                    <stop offset="1" stopColor="white" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient
                    id="paint1_linear_88:141"
                    x1="28.1579"
                    y1="501.301"
                    x2="8.69936"
                    y2="464.391"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="white" />
                    <stop offset="1" stopColor="white" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient
                    id="paint2_linear_88:141"
                    x1="338"
                    y1="167"
                    x2="349.488"
                    y2="200.004"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="white" />
                    <stop offset="1" stopColor="white" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient
                    id="paint3_linear_88:141"
                    x1="369.5"
                    y1="-53"
                    x2="369.5"
                    y2="89.9999"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="white" />
                    <stop offset="1" stopColor="white" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient
                    id="paint4_linear_88:141"
                    x1="411.5"
                    y1="-78"
                    x2="411.5"
                    y2="64.9999"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="white" />
                    <stop offset="1" stopColor="white" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient
                    id="paint5_linear_88:141"
                    x1="372.5"
                    y1="-69"
                    x2="372.5"
                    y2="73.9999"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="white" />
                    <stop offset="1" stopColor="white" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient
                    id="paint6_linear_88:141"
                    x1="409.5"
                    y1="-102"
                    x2="409.5"
                    y2="40.9999"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="white" />
                    <stop offset="1" stopColor="white" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UpdateTournament;