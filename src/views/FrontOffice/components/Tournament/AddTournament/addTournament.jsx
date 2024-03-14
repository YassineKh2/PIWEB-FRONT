


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
import { getGeocodingData } from "../../../../../Services/APis/Geocoding";
import { AiOutlinePicture as Picture } from "react-icons/ai";

import hotelService from '../../../../../Services/APis/HotelAPI.js';
import HotelService from '../../../../../Services/FrontOffice/apiHotel.js';

import AddHotels from '../../Hotels/AddHotels/AddHotels.jsx'
const steps = [
  {
    id: "Step 1",
    name: "General Information",
    fields: ["name", "nameAbbreviation", "country", "state", "city", "image"],
  },
  {
    id: "Step 2",
    name: "Tournament Details",
    fields: ["description", "slogan", "nickname", "foundedIn", "founder"],
  },
  {
    id: "Step 3",
    name: "Fields",
    fields: [""],
  },
  {
    id: "Step 4",
    name: "Hotels",
    fields: [""],
  },
];
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
  const [selectedTeams, setSelectedTeams] = useState([]);

  //hotel
  
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [radius, setRadius] = useState();
  const [hotelData, setHotelData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hotelsPerPage] = useState(10); // Number of hotels to display per page
  const [selectedHotels, setSelectedHotels] = useState([]);
  const [addedHotelsId, setaddedHotelsId] = useState([]);


  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

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



  const [previousStep, setPreviousStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const delta = currentStep - previousStep;
  const next = async () => {
    if (currentStep < steps.length - 1) {
      if (currentStep === steps.length - 2) {
        // await handleSubmit(processForm)()
      }
      setPreviousStep(currentStep);
      setCurrentStep((step) => step + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step - 1);
    }
  };
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




/////////hotelll
  const hideNotifications = () => {
    setShowErrorNotification(false);
    setShowSuccessNotification(false);
  };




  const fetchData = async (city) => {
    setLoading(true);
  
    try {
      const geocodingData = await getGeocodingData(city);
      console.log('Geocoding Data:', geocodingData);
  
      const response = await hotelService.getHotelsByGeoCode(
        geocodingData.latitude,
        geocodingData.longitude,
        radius
      );
      console.log('API Response:', response);
  
      if (response) {
        setHotelData(response.data); // Assuming response directly contains hotel data
        setError(null);
      } else {
        setHotelData([]);
        setError('Invalid response format. Please try again.');
      }
    } catch (error) {
      console.error('API Error:', error);
  
      if (error.response) {
        setError(`API Error: ${error.response.data.message}`);
      } else if (error.request) {
        setError('Network Error. Please check your internet connection.');
      } else {
        setError('Error fetching hotels. Please try again.');
      }
  
      setHotelData([]);
    } finally {
      setLoading(false);
    }
  };
  
  // useEffect hook
  useEffect(() => {
    fetchData(SelectedCities);
  }, [SelectedCities]);
  
  // Log hotelData state
  console.log('Hotel Data:', hotelData);
  
  // Check hotelData length before slicing
  console.log('Hotel Data Length:', hotelData.length);

 
const toggleHotelSelection = (hotelId) => {
  //setError(null);
  //setShowErrorNotification(null);
  setShowSuccessNotification(null);
// Toggle the selection status of the hotel
  setSelectedHotels((prevSelected) =>
    prevSelected.includes(hotelId)
      ? prevSelected.filter((id) => id !== hotelId)
      : [...prevSelected, hotelId]
  );
};
const handleInputChange = (e) => {
  const { name, value } = e.target;
  if (name === 'radius') {
    setRadius(value);
  }
};
const addHotelsToDatabase = async () => {
  try {
    const hotelsToAdd = hotelData.filter((hotel) => selectedHotels.includes(hotel.hotelId));

    if (hotelsToAdd.length === 0) {
      console.log("No hotels selected to add.");
      return;
    }

    await Promise.all(
      hotelsToAdd.map(async (hotel) => {
        try {
          hotel.idTournament = idTournament;
          const addHotelResponse = await HotelService.addHotel([hotel]);
          console.log('Hotel added to database:', addHotelResponse);
        } catch (error) {
          if (error.response && error.response.status === 400) {
            console.error('Hotel already exists:', error.response.data.message);
          } else {
            console.error('Error adding hotel to database:', error);
          }
        }
      })
    );

    setShowSuccessNotification(true);
    setTimeout(hideNotifications, 2000);
  } catch (error) {
    console.error('Error adding selected hotels to database:', error);
    setShowErrorNotification(true);
    setTimeout(hideNotifications, 2000);
  }
};
const handleCityChange = (e) => {
  setCity(e.target.value);
};
const handleRadiusChange = () => {
  fetchData();
};

// Calculate the index of the last hotel on the current page
const indexOfLastHotel = currentPage * hotelsPerPage;
// Calculate the index of the first hotel on the current page
const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
// Get the hotels for the current page
const currentHotels = hotelData.slice(indexOfFirstHotel, indexOfLastHotel);

// Change page
const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);


///////////////////////////////////////////////////////////////////////////////////////////////


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
addHotelsToDatabase();
        //console.log(Fixtures);
        const hotelSearch = {
          city:Tournament.city,
           idTournament: latestTournamentId.latestTournamentId,
         };
         navigate("/listhotels",{state:{hotelSearch}});
         getGeocodingData(hotelSearch.city);
         console.log()
       
         // navigate("/tournament/showAll");
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
      <section
        id="contact"
        className="overflow-hidden mt-4 py-16 md:py-20 lg:py-28"
      >
        <form onSubmit={add}>
          <div className="container">
            <nav aria-label="Progress" className="mb-10">
              <ol
                role="list"
                className="space-y-4 md:flex md:space-x-8 md:space-y-0"
              >
                {steps.map((step, index) => (
                  <li key={step.name} className="md:flex-1">
                    {currentStep > index ? (
                      <div className="group flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                        <span className="text-sm font-medium text-sky-600 transition-colors ">
                          {step.id}
                        </span>
                        <span className="text-sm font-medium">{step.name}</span>
                      </div>
                    ) : currentStep === index ? (
                      <div
                        className="flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                        aria-current="step"
                      >
                        <span className="text-sm font-medium text-sky-600">
                          {step.id}
                        </span>
                        <span className="text-sm font-medium">{step.name}</span>
                      </div>
                    ) : (
                      <div className="group flex w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                        <span className="text-sm font-medium text-gray-500 transition-colors">
                          {step.id}
                        </span>
                        <span className="text-sm font-medium">{step.name}</span>
                      </div>
                    )}
                  </li>
                ))}
              </ol>
            </nav>

            {/* Render form fields based on the current step */}
            {currentStep !== 3 && (
              <div className="-mx-4 flex justify-center flex-wrap">
                <div className="w-full px-4 lg:w-7/12 xl:w-8/12">
                  <div
                    className="wow fadeInUp mb-12 rounded-md bg-primary/[3%] py-11 px-8 dark:bg-dark sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]"
                    data-wow-delay=".15s"
                  >
                    <h2 className="mb-3 text-2xl font-bold text-black dark:text-white sm:text-3xl lg:text-2xl xl:text-3xl">
                      Create Your Tournament
                    </h2>
                    <p
                      className="mb-12 text-base font-medium text-body-color"
                      id="formP"
                    >
                      {currentStep === 0 &&
                        "Start your journey with us by registering your tournament information."}
                      {currentStep === 1 &&
                        "Enter your tournament's description details here."}
                      {currentStep === 2 && "Add your fields here."}
                      {currentStep === 3 && "Add your hotels here."}
                    </p>
                    {currentStep === 0 && (
                      <form role="form" encType="multipart/form-data">
                        {/* Step 1 fields */}
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
                        <div className="rounded-full bg-[#EBEBE5] p-6 w-1/5 md:p-5 lg:p-6 md:w-1/12">
                          <input
                            onChange={(e) => handleImageChange(e)}
                            type="file"
                            name="image"
                            accept="image/*"
                            id="image"
                            className="hidden"
                          />
                          <label
                            htmlFor={"image"}
                            className="flex items-baseline justify-center"
                          >
                            <Picture className="text-black-2"></Picture>
                          </label>
                        </div>
                        {/* Add any other fields for Step 1 */}
                      </form>
                    )}

                    {currentStep === 1 && (
                      <form role="form" encType="multipart/form-data">
                        {/* Step 2 fields */}
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
                          <label
                            htmlFor="teams"
                            className="text-lg font-semibold mb-2"
                          >
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

                        {/* Add any other fields for Step 2 */}
                      </form>
                    )}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <p>hello2</p>
              /* Step 3 fields and UI */
              /* Include form fields and validation logic */
            )}

            {currentStep === 3 && (
             <>
              <div>
      <div>
      <h1 className="text-center pb-8 " >Hotel List</h1>
      </div>
<div className="flex  gap-4 ml-10 ">
  <div className="">
      <label>
        Radius (in km):
        <input
          type="number"
          name="radius"
          value={radius}
          onChange={handleInputChange}
          placeholder="Enter Radius"
        />
      </label>
  </div>
      <div className="pb-5 ">
      <button onClick={handleRadiusChange} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Change Radius</button>
      </div>
</div>
  <div className="flex  justify-end ">
<button
  onClick={addHotelsToDatabase}
  disabled={selectedHotels.length === 0}
  type="button"
  className={`text-white w-48 bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-3 text-center me-2 mb-4 mr-15 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 ${selectedHotels.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
>
  Confirm Addition</button>
  </div>

 
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}


      <div className={`flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 ${showErrorNotification ? 'block' : 'hidden'}`} role="alert">
        <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
        </svg>
        <span className="sr-only">Info</span>
        <div>
          <span className="font-medium">Hotel already exists!</span> Change a few things up and try submitting again.
        </div>
      </div>

      <div className={`flex items-center p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-green-800 dark:text-green-400 ${showSuccessNotification ? 'block' : 'hidden'}`} role="alert">
        <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16ZM3 10a7 7 0 1 0 14 0ZM10 12a1 1 0 0 1-1-1V6a1 1 0 0 1 2 0v5a1 1 0 0 1-1 1Z"/>
        </svg>
        <span className="sr-only">Success</span>
        <div>
          <span className="font-medium">Success alert!</span> Hotel successfully added.
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4  mx-10">
        {currentHotels.map((hotel, index) => (
           <div key={index} className="border p-4 rounded-md ">
           <label>
             <input className=" mx-2"
               type="checkbox"
               checked={selectedHotels.includes(hotel.hotelId)}
               onChange={() => toggleHotelSelection(hotel.hotelId)}
             />
             {hotel.name}
           </label>
           <h3>chainCode:{hotel.chainCode}</h3>
           <p> Id: {hotel.hotelId}</p>
         </div>
       ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        {Array.from({ length: Math.ceil(hotelData.length / hotelsPerPage) }).map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`mx-2 px-3 py-2 border ${
              currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
              </>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-around">
              <button
                type="button"
                onClick={prev}
                disabled={currentStep === 0}
                className="rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
              </button>

              {currentStep !== steps.length - 1 ? (
                <button
                  type="button"
                  onClick={next}
                  disabled={currentStep === steps.length - 1}
                  className="rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </button>
              ) : (
                <div className="flex justify-center">
                  {/* Center the submit button */}
                  <button
                    type="submit"
                    className="flex justify-center duration-80 mb-4 w-50 cursor-pointer rounded-md border border-transparent bg-primary py-3 px-6 text-center text-base font-medium text-white outline-none transition ease-in-out hover:bg-opacity-80 hover:shadow-signUp focus-visible:shadow-none"
                  >
                    Submit
                  </button>
                </div>
              )}
            </div>
          </div>
        </form>
      </section>
    </>
  );
}

export default AddTournament;