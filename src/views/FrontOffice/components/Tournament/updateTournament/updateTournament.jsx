import { useEffect, useState } from "react";
import { updateTournament } from "../../../../../Services/FrontOffice/apiTournament";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllTeams } from "../../../../../Services/FrontOffice/apiTeam";
import {
  GetCitybyStateAndCountry,
  GetCountries,
  GetStateByCountry,
} from "../../../../../Services/APis/CountryAPI";
import { AiOutlinePicture as Picture } from "react-icons/ai";


import stadiumService from "../../../../../Services/FrontOffice/apiStadium";
import hotelService from "../../../../../Services/APis/HotelAPI.js";
import HotelService from "../../../../../Services/FrontOffice/apiHotel.js";
import { getGeocodingData } from "../../../../../Services/APis/Geocoding";

import * as yup from "yup";
import {
  addMatch,
  deleteMatcheByTournament,
  getTournamentMatches,
} from "../../../../../Services/FrontOffice/apiMatch";
import Select from "react-select";
import makeAnimated from "react-select/animated";

import { HTML5Backend } from "react-dnd-html5-backend";
import { useDrag, useDrop, DndProvider } from "react-dnd";
const animatedComponents = makeAnimated();
const firstStepSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  description: yup.string().required("Description is required"),
  country: yup.string().required("Country is required"),
  state: yup.string().required("State is required"),
  city: yup.string().required("City is required"),
});
const secondStepSchema = yup.object().shape({
  startDate: yup.date().required("Start Date is required"),
  endDate: yup
    .date()
    .required("End Date is required")
    .min(yup.ref("startDate"), "End Date should be after Start Date"),
  nbTeamPartipate: yup
    .mixed()
    .required("Number of Teams to Participate is required"),
  tournamentType: yup.string().required("Tournament Type is required"),
  teams: yup
    .array()
    .required("Select at least one team")
    /*.min(
      yup.ref("nbTeamPartipate"),
      "Selected Teams sould be equal to the number of the teams participating"
    )*/
    .max(
      yup.ref("nbTeamPartipate"),
      "Selected Teams sould be equal to the number of the teams participating"
    ),
});
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
function UpdateTournament() {
  const path = "http://localhost:3000/public/images/teams/";
  const navigate = useNavigate();
  const { state } = useLocation();
  const [errors, setErrors] = useState({});
  const formattedStartDate = new Date(state.tournament.startDate)
    .toISOString()
    .split("T")[0];
  const formattedEndDate = new Date(state.tournament.endDate)
    .toISOString()
    .split("T")[0];
  const [image, setImage] = useState(null);
  const [Countries, setCountries] = useState([]);
  const [SelectedCountry, setSelectedCountries] = useState("");
  const [States, setStates] = useState([]);
  const [SelectedStates, setSelectedStates] = useState("");
  const [Cities, setCities] = useState([]);
  const [SelectedCities, setSelectedCities] = useState("");
  const [Teams, setTeams] = useState([]);



  const [stadiums, setStadiums] = useState([]);
  const [selectedStadiums, setSelectedStadiums] = useState([]);
  const [existingStadiumIds, setExistingStadiumIds] = useState([]);
  const [filteredStadiums, setFilteredStadiums] = useState([]);

  //hotel//

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
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
  const [previousCity, setPreviousCity] = useState(state.tournament.city); // Initialize with the initially selected city


  const [TeamsAffected, setTeamsAffected] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState(state.tournament.teams);
  const [RealMatches, setRealMatches] = useState([]);
  const [showComboboxKnokout, setshowComboboxKnokout] = useState(false);
  const [showLeague, setLeague] = useState(false);
  const [showPots, setShowPots] = useState(false);
  const [selectTeamPots, setSelectTeamsPots] = useState({});
  const [Tournament, setTournament] = useState({
    _id: state.tournament._id,
    name: state.tournament.name,
    description: state.tournament.description,
    startDate: state.tournament.startDate,
    endDate: state.tournament.endDate,
    location: state.tournament.location,
    tournamentType: state.tournament.tournamentType,
    nbTeamPartipate: state.tournament.nbTeamPartipate,
    country: state.tournament.country,
    state: state.tournament.state,
    city: state.tournament.city,
    teams: state.tournament.teams,
  });
  const randomDate = (start, end) => {
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    );
  };
  useEffect(() => {
    if (Tournament.tournamentType === "Knockout") {
      setLeague(false);
      setshowComboboxKnokout(true);
      setShowPots(false);
    } else if (Tournament.tournamentType === "League") {
      setshowComboboxKnokout(false);
      setShowPots(false);
      setLeague(true);
    }
    if (Tournament.tournamentType === "Group Stage") {
      setLeague(false);
      setShowPots(true);
      setshowComboboxKnokout(true);
    }
  }, [Tournament.tournamentType]);
  const deleteAllMAtches = async () => {
    try {
      const res = await deleteMatcheByTournament(Tournament._id);
    } catch (err) {
      console.error(err);
    }
  };
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
  const handleTeamChange = (selectedOptions) => {
    const selectedTeamIds = selectedOptions.map((option) => option.value);
    setSelectedTeams(selectedTeamIds);
    console.log(selectedTeamIds);
    setTournament({
      ...Tournament,
      teams: selectedTeamIds,
    });
    console.log(Tournament);
  };
  /*useEffect(() => {
    if (image && image.name) {
      setTournament((prevTournament) => ({
        ...prevTournament,
        image: image.name,
      }));
    }
  }, [image]);*/
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

    console.log('New City:', value);
    console.log('Previous City:', previousCity);
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
  useEffect(() => {
    GetCountries().then((response) => {
      setCountries(response);
    });
  }, []);
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
/////////////////////////////////////////////////////////////////stadiums/////////////////////////////////////////////////////////
  useEffect(() => {
    const fetchStadiumsAndSetExisting = async () => {
      try {
        // Fetch all stadiums
        const allStadiumsResponse = await stadiumService.getAllStadiums();
        const allStadiums = allStadiumsResponse.Stadiums;
        console.log("All stadiums data:", allStadiums);
        console.log("tournament._id:", state.tournament._id);

        // Fetch existing stadium IDs based on the tournament ID
        const existingStadiumIdsResponse = await stadiumService.getStadiumsByTournamentId(state.tournament._id);
        const existingStadiumIds = existingStadiumIdsResponse.map(stadium => stadium._id);
        console.log("Existing stadium IDs:", existingStadiumIds);

        if (Array.isArray(allStadiums)) {
          const updatedStadiums = allStadiums.map(stadium => ({
            ...stadium,
            selected: existingStadiumIds.includes(stadium._id),
            available: existingStadiumIds.includes(stadium._id)
          }));
          console.log("Updated stadiums:", updatedStadiums);
          setStadiums(updatedStadiums);
        } else {
          console.error("Error fetching stadiums: All stadiums data is not an array");
          setStadiums([]);
        }

        setExistingStadiumIds(existingStadiumIds);
      } catch (error) {
        console.error("Error fetching stadiums:", error);
      }
    };

    fetchStadiumsAndSetExisting();
  }, [state.tournament._id]);

  const handleStadiumSelect = (e, stadiumId) => {
    if (e.target.checked) {
      setSelectedStadiums([...selectedStadiums, stadiumId]);
    } else {
      setSelectedStadiums(selectedStadiums.filter(id => id !== stadiumId));
    }
  };


  useEffect(() => {
    if (Array.isArray(stadiums) && stadiums.length > 0 && state.tournament.city) {
      const filtered = stadiums.filter(stadium =>
          stadium.address && stadium.address.city === state.tournament.city
      );
      console.log("Filtered stadiums:", filtered);
      setFilteredStadiums(filtered);
    }
  }, [stadiums, state.tournament.city]);

  useEffect(() => {
    const updateStadiumAvailability = async () => {
      try {
        // Filter stadiums based on the tournament city
        const filtered = stadiums.filter(stadium =>
            stadium.address && stadium.address.city === state.tournament.city
        );

        const updatedStadiums = await Promise.all(filtered.map(async (stadium) => {
          const isSelectedForTournament = state.tournament.stadiums.some(tournamentStadium => tournamentStadium._id === stadium._id);
          console.log("Is selected for tournament:", isSelectedForTournament);

          if (!isSelectedForTournament) {
            return { ...stadium, available: true };
          } else {
            const available = await fetchStadiumAvailability(stadium._id, state.tournament.startDate, state.tournament.endDate);
            console.log(`Stadium ${stadium.name} availability:`, available);
            return { ...stadium, available: available };
          }

        }));

        console.log("Updated stadiums with availability:", updatedStadiums);
        setFilteredStadiums(updatedStadiums);
      } catch (error) {
        console.error('Error updating stadium availability:', error);
      }
    };

    updateStadiumAvailability();
  }, [stadiums, state.tournament.startDate, state.tournament.endDate, state.tournament.stadiums]);

  const fetchStadiumAvailability = async (stadiumId, startDate, endDate) => {
    try {
      // Check the availability directly without considering maintenance periods
      const response = await stadiumService.checkStadiumAvailability(stadiumId, startDate, endDate);
      console.log('Response from checkStadiumAvailability:', response);

      if (response && response.available !== undefined) {
        return response.available;
      } else {
        console.error('Invalid response format:', response);
        return false;
      }
    } catch (error) {
      console.error('Error fetching stadium availability:', error);
      return false;
    }
  };




  const isSelected = (stadiumId) => {
    return selectedStadiums.includes(stadiumId);
  };

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////Hotel/////////////////////////////////////////////////////////////
  const hideNotifications = () => {
    setShowErrorNotification(false);
    setShowSuccessNotification(false);
  };




  const fetchData = async (city) => {
    setLoading(true);

    try {
      let targetCity = city || Tournament.city; // Use selected city if provided, otherwise use tournament's city

      const geocodingData = await getGeocodingData(targetCity);
      const response = await hotelService.getHotelsByGeoCode(
          geocodingData.latitude,
          geocodingData.longitude,
          radius
      );

      if (response) {
        setHotelData(response.data);
        setError(null);
      } else {
        setHotelData([]);
        setError("Invalid response format. Please try again.");
      }
    } catch (error) {
      console.error("API Error:", error);
      if (error.response) {
        setError(`API Error: ${error.response.data.message}`);
      } else if (error.request) {
        setError("Network Error. Please check your internet connection.");
      } else {
        setError("Error fetching hotels. Please try again.");
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
    if (name === "radius") {
      setRadius(value);
    }
  };

  const addHotelsToDatabase = async (hotels, tournamentId) => {
    try {
      // Check if the city has changed from the previous one and if the previous city exists

      await HotelService.deleteHotelsByTournamentAndCity(tournamentId, Tournament.city);

      // Filter selected hotels to add
      const hotelsToAdd = hotels.filter((hotel) =>
          selectedHotels.includes(hotel.hotelId)
      );

      if (hotelsToAdd.length === 0) {
        console.log("No hotels selected to add.");
        return;
      }

      // Add selected hotels to the database
      await Promise.all(
          hotelsToAdd.map(async (hotel) => {
            try {
              hotel.idTournament = tournamentId;
              const addHotelResponse = await HotelService.addHotel([hotel]);
              console.log("Hotel added to database:", addHotelResponse);
            } catch (error) {
              if (error.response && error.response.status === 400) {
                console.error(
                    "Hotel already exists:",
                    error.response.data.message
                );
              } else {
                console.error("Error adding hotel to database:", error);
              }
            }
          })
      );

      // Update the previous city with the current city
      setPreviousCity(Tournament.city);

      setShowSuccessNotification(true);
      setTimeout(hideNotifications, 2000);
    } catch (error) {
      console.error("Error adding selected hotels to database:", error);
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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  useEffect(() => {
    const teamOptions = Tournament.teams.map((teamId) => ({
      value: teamId,
      label: Teams.find((team) => team._id === teamId)?.name || "Unknown Team",
    }));
    setTeamsAffected(teamOptions);
  }, [Tournament.teams]);

  const update = async (e) => {
    e.preventDefault();
    await deleteAllMAtches();
    setSelectedTeams(Tournament.teams);
    let imageData = {};
    if (Tournament.tournamentType === "Group Stage") {
      const numberGroups = Math.ceil(Tournament.nbTeamPartipate / 4);
      const teamsByPot = { ...selectTeamPots };
      const teamsGroupStage = {};

      Object.keys(teamsByPot).forEach((potNumber) => {
        teamsByPot[potNumber] = shuffleArray(teamsByPot[potNumber]);
      });

      for (let groupNumber = 1; groupNumber <= numberGroups; groupNumber++) {
        const group = [];
        Object.keys(teamsByPot).forEach((potNumber) => {
          if (teamsByPot[potNumber].length > 0) {
            const team = teamsByPot[potNumber].shift();
            if (team && team.team && team.team._id) {
              group.push({
                teamId: team.team._id,
                potNumber,
                groupNumber,
              });
            }
            if (group.length === 4) return;
          }
        });
        teamsGroupStage[groupNumber] = group;
      }
      imageData = {
        _id: state.tournament._id,
        name: Tournament.name,
        description: Tournament.description,
        location: Tournament.location,
        startDate: Tournament.startDate,
        endDate: Tournament.endDate,
        tournamentType: Tournament.tournamentType,
        nbTeamPartipate: Tournament.nbTeamPartipate,
        teamsGroupStage: Object.entries(teamsGroupStage).flatMap(
          ([groupNumber, teams]) => {
            return teams.map((team) => ({
              teamId: team.teamId,
              potNumber: team.potNumber,
              groupNumber: groupNumber,
            }));
          }
        ),
        country: Tournament.country,
        state: Tournament.state,
        city: Tournament.city,
      };
      for (let groupNumber = 1; groupNumber <= numberGroups; groupNumber++) {
        const teams = teamsGroupStage[groupNumber];
        for (let i = 0; i < teams.length; i++) {
          const team1 = teams[i].teamId;
          for (let j = i + 1; j < teams.length; j++) {
            const team2 = teams[j].teamId;

            // Create match data
            const matchData = {
              win: "",
              loss: "",
              matchDate: new Date(),
              scoreTeam1: "",
              scoreTeam2: "",
              groupNumber, // Assign the group number to the match
              idTeam1: team1,
              idTeam2: team2,
              idTournament: Tournament._id,
            };

            await addMatch(matchData);
          }
        }
      }
    } else {
      imageData = {
        _id: state.tournament._id,
        name: Tournament.name,
        description: Tournament.description,
        location: Tournament.location,
        startDate: Tournament.startDate,
        endDate: Tournament.endDate,
        tournamentType: Tournament.tournamentType,
        nbTeamPartipate: Tournament.nbTeamPartipate,
        teams: selectedTeams,
        country: Tournament.country,
        state: Tournament.state,
        city: Tournament.city,
      };
    }

    if (Tournament.tournamentType === "League") {
      const numTeams = selectedTeams.length;
      let idNextMatch = selectedTeams.length / 2;
      let loopCounter = 0;
      let j = 1;
      let index = 0;
      const totalRounds = numTeams - 1;
      const matchesPerRound = numTeams / 2;

      let teamOrder = selectedTeams.slice();
      const tournamentStartDate = new Date(Tournament.startDate);
      const tournamentEndDate = new Date(Tournament.endDate);
      let currentDate = new Date(tournamentStartDate);
      // Initialize the match date (start from the tournament start date)

      for (let round = 0; round < totalRounds; round++) {
        const randomHour = 8 + Math.floor(Math.random() * 12); // Random hour between 8 and 19
        currentDate.setHours(randomHour, 0, 0, 0);
        for (let match = 0; match < matchesPerRound; match++) {
          // Determine the indices for the home and away teams
          const homeIndex = match;
          const awayIndex = numTeams - 1 - match;

          // Get the team IDs based on the current order
          const idTeam1 = teamOrder[homeIndex];
          const idTeam2 = teamOrder[awayIndex];

          // Create match data only if it's not the same team
          if (idTeam1 !== idTeam2) {
            const matchData = {
              win: "",
              loss: "",
              matchDate: new Date(currentDate),
              scoreTeam1: "",
              scoreTeam2: "",
              fixture: round + 1, // Assign the round number as the fixture number
              idTeam1,
              idTeam2,
              idTournament: Tournament._id,
            };

            await addMatch(matchData);
            currentDate.setHours(currentDate.getHours() + 3);
          }
        }
        currentDate.setDate(currentDate.getDate() + 1);

        // Rotate the array of teams for the next round, keeping the first team fixed
        teamOrder = [teamOrder[0]].concat(teamOrder.slice(2), teamOrder[1]);
      }
    } else if (Tournament.tournamentType === "Knockout") {
      const numTeams = selectedTeams.length;
      let idNextMatch = selectedTeams.length / 2;
      let loopCounter = 0;
      let j = 1;
      let index = 0;
      const RealMatches = [];
      selectedTeams.sort(() => Math.random() - 0.5);

      while (selectedTeams.length >= 2) {
        const idTeam1 = selectedTeams.pop();
        const idTeam2 = selectedTeams.pop();
        const matchData = {
          id: index + 1,
          win: "",
          loss: "",
          nextMatchId: j + idNextMatch,
          matchDate: Tournament.startDate,
          scoreTeam1: "",
          scoreTeam2: "",
          fixture: "",
          idTeam1,
          idTeam2,
          idTournament: Tournament._id,
        };
        loopCounter++;
        index++;
        if (loopCounter % 2 === 0) {
          idNextMatch++;
        }
        RealMatches.push(matchData);
        await addMatch(matchData);
      }
      let matchDate = new Date(Tournament.startDate);
      console.log(matchDate);
      for (let i = 0; i < RealMatches.length - 1; i++) {
        if (i % 2 === 0) {
          idNextMatch++;
          matchDate = randomDate(matchDate, new Date(Tournament.endDate));
        }

        if (idNextMatch > RealMatches.length * 2 - 1) {
          idNextMatch = null;
          matchDate = Tournament.endDate;
        }

        const emptyMatch = {
          id: RealMatches.length + i + 1,
          win: "",
          loss: "",
          nextMatchId: idNextMatch,
          matchDate: matchDate,
          scoreTeam1: "",
          scoreTeam2: "",
          fixture: "",
          participants: [],
          idTournament: Tournament._id,
        };
        await addMatch(emptyMatch);
      }
    }

    const res = updateTournament(imageData)
      .then(() => {
        addHotelsToDatabase(hotelData, state.tournament._id);
        console.log("update passed");
        navigate("/tournament/showAll");
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });

  };

  const [previousStep, setPreviousStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const delta = currentStep - previousStep;
  const next = async () => {
    try {
      // Validate based on the current step
      if (currentStep === 0) {
        await firstStepSchema.validate(Tournament, { abortEarly: false });
      } else if (currentStep === 1) {
        await secondStepSchema.validate(Tournament, { abortEarly: false });
      }

      // Proceed to the next step
      if (currentStep < steps.length - 1) {
        setErrors({}); // Clear previous errors
        setPreviousStep(currentStep);
        setCurrentStep((step) => step + 1);
      }
    } catch (error) {
      // Handle validation errors
      if (error instanceof yup.ValidationError) {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      } else {
        // Handle other errors
        console.error(error);
      }
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step - 1);
    }
  };
  const TeamItem = ({ team }) => {
    const [{ isDragging }, drag] = useDrag({
      type: "TEAM",
      item: { team: team },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    return (
      <div
        ref={drag}
        style={{ opacity: isDragging ? 0.5 : 1 }}
        className="team-item flex items-center "
      >
        <img
          alt="Team A logo"
          className="overflow-hidden border object-cover w-7 h-7 ml-2 mr-2"
          height="30"
          src={path + team.image}
          style={{
            aspectRatio: "30/30",
            objectFit: "cover",
          }}
          width="30"
        />
        {team.name}
      </div>
    );
  };
  const TeamList = ({ teams }) => {
    const filteredTeams = teams.filter((team) => {
      return !Object.values(selectTeamPots).some((potTeams) =>
        potTeams.some((potTeam) => potTeam.team.name === team.name)
      );
    });

    return (
      <div
        className="team-list-container"
        style={{
          maxHeight: "100px",
          overflowY: "auto",
        }}
      >
        {filteredTeams.map((team, index) => (
          <TeamItem key={index} team={team} />
        ))}
      </div>
    );
  };
  const Pot = ({ potNumber }) => {
    const [{ isOver }, drop] = useDrop({
      accept: "TEAM",
      drop: (item) => {
        setSelectTeamsPots((prevTeams) => ({
          ...prevTeams,
          [potNumber]: [...(prevTeams[potNumber] || []), item],
        }));
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    });

    return (
      <div
        ref={drop}
        className="border border-gray-300 rounded-lg p-4 flex flex-col items-center"
      >
        <h2 className="text-lg font-semibold mb-4">Pot {potNumber}</h2>
        <div className="team-pair">
          {/* Render selected teams for this pot */}
          {selectTeamPots[potNumber] &&
            selectTeamPots[potNumber].map((team, index) => (
              <div className="flex items-cente mb-1.5">
                <img
                  alt="Team A logo"
                  className="overflow-hidden border object-cover w-6 h-6 mr-2"
                  height="30"
                  src={path + team.team.image}
                  style={{
                    aspectRatio: "30/30",
                    objectFit: "cover",
                  }}
                  width="30"
                />
                <p key={index}>{team.team.name}</p>
              </div>
            ))}
        </div>
      </div>
    );
  };
  return (
    <>
      <section
        id="contact"
        className="overflow-hidden mt-4 py-16 md:py-20 lg:py-28"
      >
        <form onSubmit={update} noValidate>
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
                      Update Your Tournament Details
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
                      <form
                        role="form"
                        encType="multipart/form-data"
                        noValidate
                      >
                        {/* Step 1 fields */}
                        <div
                          className={`flex w-full  ${
                            errors.name
                              ? "border border-red-500"
                              : "border-body-color border-opacity-10"
                          } ${errors.name ? "" : "mb-4"}`}
                        >
                          <input
                            type="text"
                            name="name"
                            placeholder="Tournament Name"
                            onChange={(e) => handlechange(e)}
                            defaultValue={Tournament.name}
                            className="py-3 px-6 w-full rounded-md text-base font-medium text-body-color placeholder-body-color outline-none focus:border-primary focus:border-opacity-100 focus-visible:shadow-none dark:border-white dark:border-opacity-10 dark:bg-[#242B51] focus:dark:border-opacity-50"
                          />
                        </div>
                        {errors.name && (
                          <span className="text-xs text-red-500 mt-1">
                            {errors.name}
                          </span>
                        )}
                        <div className="flex w-full mb-4">
                          <div className="flex flex-col w-full mr-4">
                            <select
                              onChange={(e) => handleCountryChange(e)}
                              name="location"
                              value={Tournament.country}
                              className={`rounded-md border ${
                                errors.country
                                  ? "border-red-500"
                                  : "border-body-color border-opacity-10"
                              } py-3 px-6 text-base font-medium text-body-color placeholder-body-color outline-none focus:border-primary focus:border-opacity-100 focus-visible:shadow-none dark:border-white dark:border-opacity-10 dark:bg-[#242B51] focus:dark:border-opacity-50`}
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
                            {errors.country && (
                              <span className="text-xs text-red-500 mt-1">
                                {errors.country}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col w-full mr-4">
                            <select
                              onChange={(e) => handleStateChange(e)}
                              name="state"
                              value={Tournament.state}
                              className={`rounded-md border ${
                                errors.state
                                  ? "border-red-500"
                                  : "border-body-color border-opacity-10"
                              } py-3 px-6 text-base font-medium text-body-color placeholder-body-color outline-none focus:border-primary focus:border-opacity-100 focus-visible:shadow-none dark:border-white dark:border-opacity-10 dark:bg-[#242B51] focus:dark:border-opacity-50`}
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
                            {errors.state && (
                              <span className="text-xs text-red-500 mt-1">
                                {errors.state}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col w-full">
                            <select
                              onChange={(e) => handleCitiesChange(e)}
                              name="citie"
                              value={Tournament.city}
                              className={`rounded-md border ${
                                errors.city
                                  ? "border-red-500"
                                  : "border-body-color border-opacity-10"
                              } py-3 px-6 text-base font-medium text-body-color placeholder-body-color outline-none focus:border-primary focus:border-opacity-100 focus-visible:shadow-none dark:border-white dark:border-opacity-10 dark:bg-[#242B51] focus:dark:border-opacity-50`}
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
                            {errors.city && (
                              <span className="text-xs text-red-500 mt-1">
                                {errors.city}
                              </span>
                            )}
                          </div>
                        </div>

                        <textarea
                          name="description"
                          defaultValue={Tournament.description}
                          placeholder="Tournament Description"
                          onChange={(e) => handlechange(e)}
                          className={` w-full flex-grow rounded-md border ${
                            errors.description
                              ? "border-red-500"
                              : "border-body-color border-opacity-10"
                          } ${
                            errors.description ? "" : "mb-4"
                          } py-3 px-6 text-base font-medium text-body-color placeholder-body-color outline-none focus:border-primary focus:border-opacity-100 focus-visible:shadow-none dark:border-white dark:border-opacity-10 dark:bg-[#242B51] focus:dark:border-opacity-50`}
                        />
                        {errors.description && (
                          <span className="text-xs text-red-500 mt-1">
                            {errors.description}
                          </span>
                        )}
                      </form>
                    )}

                    {currentStep === 1 && (
                      <form role="form" encType="multipart/form-data">
                        {/* Step 2 fields */}
                        <div className="flex mb-4">
                          <input
                            type="date"
                            name="startDate"
                            defaultValue={Tournament.startDate || ""}
                            onChange={(e) =>
                              handleStartDateChange(new Date(e.target.value))
                            }
                            className="mr-2 w-1/2 rounded-md border border-body-color border-opacity-10 py-3 px-6 text-base font-medium text-body-color placeholder-body-color outline-none focus:border-primary focus:border-opacity-100 focus-visible:shadow-none dark:border-white dark:border-opacity-10 dark:bg-[#242B51] focus:dark:border-opacity-50 mb-4" // Added mb-4 for margin-bottom
                          />
                          {errors.startDate && (
                            <span className="text-red-500">
                              {errors.startDate}
                            </span>
                          )}
                          <input
                            type="date"
                            name="endDate"
                            defaultValue={Tournament.endDate}
                            onChange={(e) =>
                              handleEndDateChange(new Date(e.target.value))
                            }
                            className="w-1/2 rounded-md border border-body-color border-opacity-10 py-3 px-6 text-base font-medium text-body-color placeholder-body-color outline-none focus:border-primary focus:border-opacity-100 focus-visible:shadow-none dark:border-white dark:border-opacity-10 dark:bg-[#242B51] focus:dark:border-opacity-50 mb-4" // Added mb-4 for margin-bottom
                          />
                          {errors.endDate && (
                            <span className="text-red-500">
                              {errors.endDate}
                            </span>
                          )}
                        </div>

                        <div className="mb-4 w-full flex flex-wrap items-center">
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
                              defaultValue={Tournament.tournamentType}
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
                            {errors.tournamentType && (
                              <span className="text-red-500">
                                {errors.tournamentType}
                              </span>
                            )}
                          </div>

                          {showComboboxKnokout && (
                            <div className="mr-2">
                              {/* Render combobox specific to knockout tournament */}
                              <label
                                htmlFor="teamCount"
                                className="text-base font-medium text-body-color"
                              >
                                Number of Teams
                              </label>
                              <select
                                id="teamCount"
                                name="nbTeamPartipate"
                                defaultValue={Tournament.nbTeamPartipate}
                                onChange={(e) => handlechange(e)}
                                className="w-full rounded-md border border-body-color border-opacity-10 py-3 px-6 text-base font-medium text-body-color placeholder-body-color outline-none focus:border-primary focus:border-opacity-100 focus-visible:shadow-none dark:border-white dark:border-opacity-10 dark:bg-[#242B51] focus:dark:border-opacity-50"
                              >
                                {[...Array(7).keys()].map(
                                  (index) =>
                                    index >= 2 && ( // Exclude 0 and 1 from the options
                                      <option
                                        key={index}
                                        value={Math.pow(2, index)}
                                      >
                                        {Math.pow(2, index)}
                                      </option>
                                    )
                                )}
                              </select>
                            </div>
                          )}

                          {showLeague && (
                            <div className="mr-2">
                              {/* Render number input specific to league tournament */}
                              <label
                                htmlFor="teamCount"
                                className="text-base font-medium text-body-color"
                              >
                                Number of Teams
                              </label>
                              <div className="flex items-center">
                                <input
                                  type="number"
                                  id="teamCount"
                                  name="nbTeamPartipate"
                                  min={"4"}
                                  step={"2"}
                                  defaultValue={Tournament.nbTeamPartipate}
                                  onChange={(e) => handlechange(e)}
                                  onKeyDown={(e) => e.preventDefault()}
                                  placeholder="Enter number of teams"
                                  className="w-full rounded-md border border-body-color border-opacity-10 py-3 px-6 text-base font-medium text-body-color placeholder-body-color outline-none focus:border-primary focus:border-opacity-100 focus-visible:shadow-none dark:border-white dark:border-opacity-10 dark:bg-[#242B51] focus:dark:border-opacity-50"
                                />
                              </div>
                              {errors.nbTeamPartipate && (
                                <span className="text-red-500">
                                  {errors.nbTeamPartipate}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        {!showPots && (
                          <div>
                            <label
                              htmlFor="teams"
                              className="text-lg font-semibold mb-2"
                            >
                              Select Teams:
                            </label>
                            <Select
                              isMulti
                              closeMenuOnSelect={false}
                              components={animatedComponents}
                              name="teams" // Change name to "teams"
                              onChange={handleTeamChange}
                              defaultValue={Tournament.teams.map((teamId) => ({
                                value: teamId,
                                label:
                                  Teams.find((team) => team._id === teamId)
                                    ?.name || "Unknown Team",
                              }))}
                              options={Teams.map((team) => ({
                                value: team._id,
                                label: team.name,
                              }))}
                              className="basic-multi-select"
                              classNamePrefix="select"
                            />
                          </div>
                        )}
                        {errors.teams && (
                          <span className="text-red-500">{errors.teams}</span>
                        )}

                        <DndProvider backend={HTML5Backend}>
                          {showPots && (
                            <>
                              <div className="grid grid-cols-4 gap-8 mt-2 mb-5">
                                {/* Pot 1 */}
                                <Pot potNumber={1} />

                                {/* Pot 2 */}
                                <Pot potNumber={2} />

                                {/* Pot 3 */}
                                <Pot potNumber={3} />

                                {/* Pot 4 */}
                                <Pot potNumber={4} />
                              </div>

                              <TeamList teams={Teams} />
                            </>
                          )}
                        </DndProvider>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            )}
{currentStep === 2 && (
  <>
    <div className="mt-6 mb-12 ml-10 mr-10 grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 md:gap-x-6 lg:gap-x-8 xl:grid-cols-3">
      {filteredStadiums.length === 0 ? (
        <div className="mt-6 mb-12 ml-10 mr-10">
          <p className="text-xl text-center text-gray-500">There are no stadiums available in this city.</p>
        </div>
      ) : (
        filteredStadiums.map((stadium) => (
          <div key={stadium._id} className="w-full">
            <div className="wow fadeInUp relative overflow-hidden rounded-md bg-white shadow-one dark:bg-dark">
              <input
                type="checkbox"
                id={stadium._id}
                value={stadium._id}
                onChange={(e) => handleStadiumSelect(e, stadium._id)}
                checked={existingStadiumIds.includes(stadium._id)} // Check if stadium ID is in existingStadiumIds
                disabled={!stadium.available}
              />
              {!stadium.available && (
                <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center text-white font-semibold text-xl">
                  Unavailable
                </div>
              )}
              <label htmlFor={stadium._id} className="absolute top-6 right-6 z-20 inline-flex items-center justify-center rounded-full bg-primary py-2 px-4 text-sm font-semibold capitalize text-white">
                {stadium.name}
              </label>
              <a href="/" className="relative block h-[220px] w-full">
                <img
                  src="https://via.placeholder.com/350" // Replace with actual image source
                  alt="Stadium"
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
                    {stadium.name}
                  </a>
                </h3>
                <p className="border-b border-body-color border-opacity-10 pb-6 text-base font-medium text-body-color dark:border-white dark:border-opacity-10">
                  <span className="text-dark dark:text-black">Location:</span>&nbsp;{stadium.address && stadium.address.city}, {stadium.address && stadium.address.state}, {stadium.address && stadium.address.country}&nbsp;&nbsp;&nbsp;
                  <span className="text-dark dark:text-black">Description:</span>&nbsp;{stadium.description}
                </p>
                <p className="mt-4 mb-6 border-b border-body-color border-opacity-10 pb-6 text-base font-medium text-body-color dark:border-white dark:border-opacity-10">
                  <span className="text-dark dark:text-black">Capacity:</span>&nbsp;{stadium.capacity}
                </p>
                <p className="mt-4 mb-6 border-b border-body-color border-opacity-10 pb-6 text-base font-medium text-body-color dark:border-white dark:border-opacity-10">
                  <span className="text-dark dark:text-black">Status:</span>&nbsp;{stadium.status}
                </p>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start">
                {/* Add buttons or additional actions here */}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  </>
)}





{currentStep === 3 && (
              <>
                {
                  <div>
                    <div>
                      <h1 className="text-center pb-8 ">Hotel List</h1>
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
                        <button
                          onClick={handleRadiusChange}
                          type="button"
                          className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                          Change Radius
                        </button>
                      </div>
                    </div>

                    {loading && <p>Loading...</p>}
                    {error && <p style={{ color: "red" }}>{error}</p>}

                    <div
                      className={`flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 ${
                        showErrorNotification ? "block" : "hidden"
                      }`}
                      role="alert"
                    >
                      <svg
                        className="flex-shrink-0 inline w-4 h-4 me-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                      </svg>
                      <span className="sr-only">Info</span>
                      <div>
                        <span className="font-medium">
                          Hotel already exists!
                        </span>{" "}
                        Change a few things up and try submitting again.
                      </div>
                    </div>

                    <div
                      className={`flex items-center p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-green-800 dark:text-green-400 ${
                        showSuccessNotification ? "block" : "hidden"
                      }`}
                      role="alert"
                    >
                      <svg
                        className="flex-shrink-0 inline w-4 h-4 me-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16ZM3 10a7 7 0 1 0 14 0ZM10 12a1 1 0 0 1-1-1V6a1 1 0 0 1 2 0v5a1 1 0 0 1-1 1Z" />
                      </svg>
                      <span className="sr-only">Success</span>
                      <div>
                        <span className="font-medium">Success alert!</span>{" "}
                        Hotel successfully added.
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4  mx-10">
                      {currentHotels.map((hotel, index) => (
                        <div key={index} className="border p-4 rounded-md ">
                          <label>
                            <input
                              className=" mx-2"
                              type="checkbox"
                              checked={selectedHotels.includes(hotel.hotelId)}
                              onChange={() =>
                                toggleHotelSelection(hotel.hotelId)
                              }
                            />
                            {hotel.name}
                          </label>
                          <h3>chainCode:{hotel.chainCode}</h3>
                          <p> Id: {hotel.hotelId}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-center mt-4">
                      {Array.from({
                        length: Math.ceil(hotelData.length / hotelsPerPage),
                      }).map((_, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handlePageChange(index + 1)}
                          className={`mx-2 px-3 py-2 border ${
                            currentPage === index + 1
                              ? "bg-blue-500 text-white"
                              : "bg-white text-blue-500"
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                }
              </>
              /* Include form fields and validation logic */
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
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
export default UpdateTournament;
