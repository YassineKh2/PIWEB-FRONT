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
  const [Tournament, setTournament] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
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
  const handleTeamChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );

    setSelectedTeams(selectedOptions);
    setTournament({
      ...Tournament,
      teams: selectedOptions,
    });
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
        let Fixtures = {};
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
                        <div className="flex  w-full">
                          <input
                            type="text"
                            name="name"
                            placeholder="Tournament Name"
                            onChange={(e) => handlechange(e)}
                            defaultValue={Tournament.name}
                            className="mr-2 w-full rounded-md border border-body-color border-opacity-10 py-3 px-6 text-base font-medium text-body-color placeholder-body-color outline-none focus:border-primary focus:border-opacity-100 focus-visible:shadow-none dark:border-white dark:border-opacity-10 dark:bg-[#242B51] focus:dark:border-opacity-50 mb-4" // Added mb-4 for margin-bottom
                          />
                        </div>
                        {errors.name && (
                          <span className="text-red-500">{errors.name}</span>
                        )}
                        <div className="flex mb-4 w-full">
                          <select
                            onChange={(e) => handleCountryChange(e)}
                            name="location"
                            defaultValue={Tournament.country}
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
                          {errors.country && (
                            <span className="text-red-500">
                              {errors.country}
                            </span>
                          )}
                          <select
                            onChange={(e) => handleStateChange(e)}
                            defaultValue={Tournament.state}
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
                          {errors.state && (
                            <span className="text-red-500">{errors.state}</span>
                          )}
                          <select
                            onChange={(e) => handleCitiesChange(e)}
                            name="citie"
                            defaultValue={Tournament.city}
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
                          {errors.city && (
                            <span className="text-red-500">{errors.city}</span>
                          )}
                        </div>
                        <textarea
                          name="description"
                          defaultValue={Tournament.description}
                          placeholder="Tournament Description"
                          onChange={(e) => handlechange(e)}
                          className="mb-2 w-full flex-grow rounded-md border border-body-color border-opacity-10 py-3 px-6 text-base font-medium text-body-color placeholder-body-color outline-none focus:border-primary focus:border-opacity-100 focus-visible:shadow-none dark:border-white dark:border-opacity-10 dark:bg-[#242B51] focus:dark:border-opacity-50" // Added mb-4 for margin-bottom
                        />
                        {errors.description && (
                          <span className="text-red-500">
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
                          <span className="text-red-500">{errors.image}</span>
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
                            defaultValue={Tournament.startDate}
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
                              defaultValue={Tournament.nbTeamPartipate}
                              min="4"
                              placeholder="Enter number of teams"
                              onChange={(e) => handlechange(e)}
                              className="w-full rounded-md border border-body-color border-opacity-10 py-3 px-6 text-base font-medium text-body-color placeholder-body-color outline-none focus:border-primary focus:border-opacity-100 focus-visible:shadow-none dark:border-white dark:border-opacity-10 dark:bg-[#242B51] focus:dark:border-opacity-50"
                            />
                            {errors.nbTeamPartipate && (
                              <span className="text-red-500">
                                {errors.nbTeamPartipate}
                              </span>
                            )}
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="teams"
                            className="text-lg font-semibold mb-2"
                          >
                            Select Teams: (Optionnal)
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
