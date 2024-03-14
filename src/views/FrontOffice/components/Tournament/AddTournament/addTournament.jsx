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
import * as yup from "yup";
import { AiOutlinePicture as Picture } from "react-icons/ai";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { jwtDecode } from "jwt-decode";

const animatedComponents = makeAnimated();
const firstStepSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  description: yup.string().required("Description is required"),
  image: yup.string().required("Image is required"),
  country: yup.string().required("Country is required"),
  state: yup.string().required("State is required"),
  city: yup.string().required("City is required"),
});
const secondStepSchema = yup.object().shape({
  startDate: yup
    .date()
    .required("Start Date is required")
    .min(new Date(), "Start Date should be in the future"),
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
    .min(
      yup.ref("nbTeamPartipate"),
      "Selected Teams sould be equal to the number of the teams participating"
    )
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
function AddTournament() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [image, setImage] = useState(null);
  const [Countries, setCountries] = useState([]);
  const [SelectedCountry, setSelectedCountries] = useState("");
  const [States, setStates] = useState([]);
  const [SelectedStates, setSelectedStates] = useState("");
  const [Cities, setCities] = useState([]);
  const [SelectedCities, setSelectedCities] = useState("");
  const [Teams, setTeams] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [showComboboxKnokout, setshowComboboxKnokout] = useState(false);
  const [showLeague, setLeague] = useState(true);
  const [userInfo, setUserInfo] = useState();
  const [Tournament, setTournament] = useState({
    name: "",
    description: "",
    startDate: null,
    endDate: null,
    location: "",
    image: "",
    tournamentType: "",
    nbTeamPartipate: 0,
    country: "",
    state: "",
    city: "",
    teams: [],
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
  useEffect(() => {
    const userToken = localStorage.getItem("token");

    if (userToken) {
      const decodedToken = jwtDecode(userToken);
      setUserInfo(decodedToken);
    }
  }, []);
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
  const tournamentTypeOptions = ["League", "Knockout", "Group Stage"];

  const handleTeamChange = (selectedOptions) => {
    const selectedTeamIds = selectedOptions.map((option) => option.value);
    setSelectedTeams(selectedTeamIds);

    setTournament({
      ...Tournament,
      teams: selectedTeamIds,
    });
  };
  useEffect(() => {
    if (Tournament.tournamentType === "Knockout") {
      setLeague(false);
      setshowComboboxKnokout(true);
    } else if (Tournament.tournamentType === "League") {
      setshowComboboxKnokout(false);
      setLeague(true);
    }
  }, [Tournament.tournamentType]);

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
        creator: userInfo.userId,
      };

      try {
        await addTournament(imageData);
        const latestTournamentId = await getLatestTournamentId();

        const numTeams = selectedTeams.length;
        if (Tournament.tournamentType === "League") {
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
            }
          }
        } else if (Tournament.tournamentType === "Knockout") {
          selectedTeams.sort(() => Math.random() - 0.5);

          while (selectedTeams.length >= 2) {
            const idTeam1 = selectedTeams.pop();
            const idTeam2 = selectedTeams.pop();
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
            console.log(matchData);
            await addMatch(matchData);
          }
        }
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
      <section
        id="contact"
        className="overflow-hidden mt-4 py-16 md:py-20 lg:py-28"
      >
        <form onSubmit={add} noValidate>
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
                      <form
                        role="form"
                        encType="multipart/form-data"
                        noValidate
                      >
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
                              defaultValue={Tournament.country}
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
                              defaultValue={Tournament.state}
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
                              defaultValue={Tournament.city}
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
                        {errors.image && (
                          <span className="text-xs text-red-500 mt-1">
                            {errors.image}
                          </span>
                        )}
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

                        <div>
                          <label
                            htmlFor="teams"
                            className="text-lg font-semibold mb-2"
                          >
                            Select Teams: (Optional)
                          </label>
                          <Select
                            isMulti
                            closeMenuOnSelect={false}
                            components={animatedComponents}
                            name="teams" // Change name to "teams"
                            onChange={handleTeamChange}
                            defaultValue={selectedTeams}
                            options={Teams.map((team) => ({
                              value: team._id,
                              label: team.name,
                            }))}
                            className="basic-multi-select"
                            classNamePrefix="select"
                          />
                        </div>
                        {errors.teams && (
                          <span className="text-red-500">{errors.teams}</span>
                        )}

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
              <p>hello</p>
              /* Step 4 fields and UI */
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

export default AddTournament;
