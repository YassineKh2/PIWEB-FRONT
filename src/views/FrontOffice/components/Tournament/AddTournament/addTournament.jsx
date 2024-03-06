import { useEffect, useState } from "react";
import {
  addTournament,
  getLatestTournamentId,
} from "../../../../../Services/FrontOffice/apiTournament";
import { useNavigate } from "react-router-dom";
import {
  GetCitybyStateAndCountry,
  GetCountries,
  GetStateByCountry,
} from "../../../../../Services/APis/CountryAPI";
import { getAllTeams } from "../../../../../Services/FrontOffice/apiTeam";
import { addMatch } from "../../../../../Services/FrontOffice/apiMatch";
import { MailCheck } from "lucide-react";
import { Card, CardContent } from "@mui/material";

function AddTournament() {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [Countries, setCountries] = useState([]);
  const [SelectedCountry, setSelectedCountries] = useState("");
  const [States, setStates] = useState([]);
  const [SelectedStates, setSelectedStates] = useState("");
  const [Cities, setCities] = useState([]);
  const [SelectedCities, setSelectedCities] = useState("");
  const [Teams, setTeams] = useState([]);
  const [LastTournamentId, setLastTournamentId] = useState("");
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [Tournament, setTournament] = useState({
    name: "",
    description: "",
    startDate: new Date(),
    endDate: new Date(),
    location: "",
    image: "",
    tournamentType: "",
    nbTeamPartipate: 0,
    country: "",
    state: "",
    city: "",
  });
  const [Match, setMatch] = useState({
    win: "",
    loss: "",
    matchDate: new Date(),
    scoreTeam1: "",
    scoreTeam2: "",
    fixture: "",
    idTeam1: {},
    idTeam2: {},
    idTournament: {},
  });
  const tournamentTypeOptions = ["League", "Knockout", "Group Stage"];
  const handleTeamChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );

    setSelectedTeams(selectedOptions);
  };
  const handlechange = (e) => {
    setTournament({ ...Tournament, [e.target.name]: e.target.value });
  };
  const handleStartDateChange = (date) => {
    const isoDateString = date.toISOString();
    const formattedDate = isoDateString.substring(0, 10);
    setTournament({ ...Tournament, startDate: formattedDate });
  };

  const handleCountryChange = (e) => {
    const { name, value } = e.target;
    if (name === "location") {
      setSelectedCountries(value);
    }
    setTournament({ ...Tournament, country: value });
  };
  const handleStateChange = (e) => {
    const { name, value } = e.target;
    setSelectedStates(value);
    setTournament({ ...Tournament, state: value });
  };
  const handleCitiesChange = (e) => {
    const { name, value } = e.target;
    setSelectedCities(value);
    setTournament({ ...Tournament, city: value });
  };
  useEffect(() => {
    if (SelectedCountry) {
      setCities([]);
      GetStateByCountry(SelectedCountry).then((response) => {
        setStates(response);
      });
    }
  }, [SelectedCountry]);

  useEffect(() => {
    if (SelectedStates) {
      GetCitybyStateAndCountry(SelectedCountry, SelectedStates).then(
        (response) => {
          setCities(response);
        }
      );
    }
  }, [SelectedStates]);
  const handleEndDateChange = (date) => {
    const isoDateString = date.toISOString();
    const formattedDate = isoDateString.substring(0, 10);
    setTournament({ ...Tournament, endDate: formattedDate });
  };
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };
  useEffect(() => {
    GetCountries().then((response) => {
      setCountries(response);
    });
  }, []);
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
  const getLastTournamentId = async () => {
    const res = getLatestTournamentId()
      .then((res) => {
        return res.latestTournamentId;
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getTeams();
  }, []);
  const add = async (e) => {
    e.preventDefault();
    const fileReader = new FileReader();

    fileReader.onloadend = async function () {
      const base64Image = fileReader.result.split(",")[1];
      const imageData = {
        name: Tournament.name,
        description: Tournament.description,
        location: Tournament.location,
        startDate: Tournament.startDate,
        endDate: Tournament.endDate,
        tournamentType: Tournament.tournamentType,
        nbTeamPartipate: Tournament.nbTeamPartipate,
        teams: selectedTeams,
        image: base64Image,
        filename: Tournament.image,
        country: Tournament.country,
        state: Tournament.state,
        city: Tournament.city,
      };

      try {
        await addTournament(imageData);
        const latestTournamentId = await getLatestTournamentId();

        const numTeams = selectedTeams.length;
        let fixtureNumber = 1;
        let fixtureNextTeam = 1;
        let teamsParticipate = [];
        let matchFixture = [];
        let Fixtures = {};
        const matches = [];
        let teamsMatches = {}; // Object to store matches for each team

        for (let i = 0; i < numTeams; i++) {
          const teamId = selectedTeams[i];
          teamsMatches[teamId] = [];
        }
        for (let i = 1; i <= numTeams - 1; i++) {
          Fixtures[i] = [];
        }
        for (let i = 0; i < numTeams; i++) {
          for (let j = i + 1; j < numTeams; j++) {
            const idTeam1 = selectedTeams[i];
            const idTeam2 = selectedTeams[j];
            const matchData = {
              win: "",
              loss: "",
              matchDate: new Date(),
              scoreTeam1: "",
              scoreTeam2: "",
              fixture: "",
              idTeam1,
              idTeam2,
              idTournament: latestTournamentId.latestTournamentId,
            };
            await addMatch(matchData);
            /*matches.push(matchData);
            teamsMatches[idTeam1].push(matchData);
            teamsMatches[idTeam2].push(matchData);*/
          }
        }

        /*let j = 1;
        for (let i = 0; i < matches.length; i++) {
          if (Fixtures[j] === numTeams / 2) {
            j++;
            teamsParticipate = [];
          }
          
          if (
            !teamsParticipate.includes(matches[i].idTeam1) &&
            !teamsParticipate.includes(matches[i].idTeam2)
          ) {
            Fixtures[j].push(matches[i]);
            console.log("hjhjhjh");
            console.log(matches[i].idTeam1);
            teamsParticipate.push(matches[i].idTeam1);
            teamsParticipate.push(matches[i].idTeam2);
            console.log(teamsParticipate);
          }
        }*/
        /*
        let fix = [];
        var i = 0;
        var matchNumbers = selectedTeams.length / 2;
        while (matches.length > 0) {
          let j = 0;

          if (matchNumbers >= 0) {
            if (
              !teamsParticipate.includes(matches[i].idTeam1) ||
              !teamsParticipate.includes(matches[i].idTeam2)
            ) {
              Fixtures[i + 1].push(matches[i]);
              console.log(Fixtures);
              matches.splice(i, 1);
              console.log(matches);
              teamsParticipate.push(matches[i].idTeam1);
              teamsParticipate.push(matches[i].idTeam2);
              console.log(matches);
              matchNumbers--;
            } else {
              i++;
            }
          } else {
            teamsParticipate = [];
            matchNumbers = selectedTeams.length / 2 ;
            i = 0;
          }
        }*/

        //console.log(Fixtures);

        navigate("/tournament/showAll");
      } catch (error) {
        console.log(error.response.data.message);
      }
    };

    if (image) {
      fileReader.readAsDataURL(image);
    }
  };

  return (
    <>
   
      <div className="flex justify-center items-center h-screen mt-22 mb-20">
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
              Add New Tournament
            </h3>
            <form role="form" encType="multipart/form-data">
              <div className="flex mb-4 w-full">
                <input
                  type="text"
                  name="name"
                  placeholder="Tournament Name"
                  onChange={(e) => handlechange(e)}
                  className="mr-2 w-full rounded-md border border-body-color border-opacity-10 py-3 px-6 text-base font-medium text-body-color placeholder-body-color outline-none focus:border-primary focus:border-opacity-100 focus-visible:shadow-none dark:border-white dark:border-opacity-10 dark:bg-[#242B51] focus:dark:border-opacity-50 mb-4" // Added mb-4 for margin-bottom
                />
              </div>
              <div className="flex mb-4 w-full">
                <select
                  onChange={(e) => handleCountryChange(e)}
                  name="location"
                  className="mr-2 w-1/2 rounded-md border border-body-color border-opacity-10 py-3 px-6 text-base font-medium text-body-color placeholder-body-color outline-none focus:border-primary focus:border-opacity-100 focus-visible:shadow-none dark:border-white dark:border-opacity-10 dark:bg-[#242B51] focus:dark:border-opacity-50 mb-4"
                >
                  <option disabled selected>
                    Select Country
                  </option>
                  {Countries.map((country, index) => (
                    <option key={index} value={country.iso2}>
                      {country.name}
                    </option>
                  ))}
                </select>
                <select
                  onChange={(e) => handleStateChange(e)}
                  name="state"
                  className="mr-2 w-1/2 rounded-md border border-body-color border-opacity-10 py-3 px-6 text-base font-medium text-body-color placeholder-body-color outline-none focus:border-primary focus:border-opacity-100 focus-visible:shadow-none dark:border-white dark:border-opacity-10 dark:bg-[#242B51] focus:dark:border-opacity-50 mb-4"
                >
                  <option disabled selected>
                    Select State
                  </option>
                  {States.map((country, index) => (
                    <option key={index} value={country.iso2}>
                      {country.name}
                    </option>
                  ))}
                </select>
                <select
                  onChange={(e) => handleCitiesChange(e)}
                  name="citie"
                  className="mr-2 w-1/2 rounded-md border border-body-color border-opacity-10 py-3 px-6 text-base font-medium text-body-color placeholder-body-color outline-none focus:border-primary focus:border-opacity-100 focus-visible:shadow-none dark:border-white dark:border-opacity-10 dark:bg-[#242B51] focus:dark:border-opacity-50 mb-4"
                >
                  <option disabled selected>
                    Select City
                  </option>
                  {Cities.map((country, index) => (
                    <option key={index} value={country.iso2}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
              <textarea
                name="description"
                placeholder="Tournament Description"
                onChange={(e) => handlechange(e)}
                className="mb-4 w-full flex-grow rounded-md border border-body-color border-opacity-10 py-3 px-6 text-base font-medium text-body-color placeholder-body-color outline-none focus:border-primary focus:border-opacity-100 focus-visible:shadow-none dark:border-white dark:border-opacity-10 dark:bg-[#242B51] focus:dark:border-opacity-50" // Added mb-4 for margin-bottom
              />

              <div className="flex mb-4">
                <input
                  type="date"
                  name="startDate"
                  onChange={(e) =>
                    handleStartDateChange(new Date(e.target.value))
                  }
                  className="mr-2 w-1/2 rounded-md border border-body-color border-opacity-10 py-3 px-6 text-base font-medium text-body-color placeholder-body-color outline-none focus:border-primary focus:border-opacity-100 focus-visible:shadow-none dark:border-white dark:border-opacity-10 dark:bg-[#242B51] focus:dark:border-opacity-50 mb-4" // Added mb-4 for margin-bottom
                />
                <input
                  type="date"
                  name="endDate"
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
                    value={Tournament.tournamentType}
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
                  className="w-full p-2 border border-gray-300 rounded-md mb-5"
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
                onClick={(e) => add(e)}
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

export default AddTournament;
