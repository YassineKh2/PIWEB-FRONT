import { useCallback, useEffect, useState } from "react";
import { redirect, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { FaArrowAltCircleLeft as Back } from "react-icons/fa";
import {
  finishplayerprofile,
  getUserData,
} from "../../../../../Services/apiUser.js";
import { jwtDecode } from "jwt-decode";

const schema = yup.object().shape({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    email: yup.string().required(),
    password: yup.string().required(),
    confirmPassword: yup.string().required(),
    birthDate: yup.date().required(),
    cin: yup.number().required(),
    height: yup.number().positive().required(),
    position: yup.string(),
    image: yup.string(),
    bio: yup.string(),
    preferredFoot: yup.string(),
    socialMediaHandle: yup.string(),
});
export default function CompleteSingUp() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [user, setUser] = useState({});

  const [previousStep, setPreviousStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const delta = currentStep - previousStep;

  const onDrop = useCallback((acceptedFiles) => {
    try {
      setFile(URL.createObjectURL(acceptedFiles[0]));
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    if (!params.get("token")) navigate("/");
    try {
      let authToken = params.get("token");
      let decodedToken = jwtDecode(authToken);
      getUserData(decodedToken.userId).then((data) => {
        setUser(data.user);
      });
    } catch (e) {
      navigate("/");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  const steps = [
    {
      id: "Step 1",
      name: "General Information",
      fields: [
        "firstName",
        "lastName",
        "email",
        "password",
        "password",
        "birthDate",
        "cin",
      ],
      stage: 0,
    },
    {
      id: "Step 2",
      name: "Players Details",
      fields: [
        "height",
        "position",
        "image",
        "description",
        "preferredFoot",
        "socialMediaHandle",
      ],
      stage: 1,
    },
    {
      id: "Step 3",
      name: "Preferences And Customization",
      fields: [""],
      stage: 2,
    },
  ];

  const next = async () => {
    const fields = steps[currentStep].fields;
    const output = await trigger(fields, { shouldFocus: true });

    if (!output) return;

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

  const setstep = async (step) => {
    const fields = steps[currentStep].fields;
    const isValid = await trigger(fields);

    // If the form is valid, move to the requested step
    if (isValid) {
      setPreviousStep(currentStep);
      setCurrentStep(step);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    watch,
    trigger,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: user.firstName,
      email: user.email,
    },
  });

  const image = watch("image", true);
  const [file, setFile] = useState();

  const onSubmit = async (data) => {
    try {
      data.image = image[0];
      data.imagename = image[0].name;
      data._id = user._id;
      await finishplayerprofile(data);
      navigate("/");
    } catch (error) {
      console.log(error.message);
      setError("root", {
        message: error.message,
      });
    }
  };

  useEffect(() => {
    let file = image[0];
    try {
      setFile(URL.createObjectURL(file));
    } catch (e) {
      console.log(e);
    }
  }, [image]);

  return (
    <>
      <section className="relative z-10 overflow-hidden pt-36 pb-16 md:pb-20 lg:pt-[180px] lg:pb-28">
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4 flex justify-center flex-col md:flex-row gap-10">
              <ol className=" space-y-4  md:mt-30 ">
                {steps.map((step) => {
                  let style = "";
                  if (step.stage < currentStep) {
                    style =
                      " w-full p-4  rounded-lg   text-green-700 bg-green-50 dark:bg-gray-800 dark:border-green-800 dark:text-green-400  border border-green-300";
                  }
                  if (step.stage === currentStep) {
                    style =
                      "w-full p-4 text-blue-700 bg-blue-100 border border-blue-300 rounded-lg dark:bg-gray-800 dark:border-blue-800 dark:text-blue-400";
                  }
                  if (step.stage > currentStep) {
                    style =
                      "w-full p-4 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400";
                  }

                  return (
                    <li
                      key={step.id}
                      onClick={() => setstep(step.stage)}
                      className="cursor-pointer"
                    >
                      <div className={style} role="alert">
                        <div className="flex items-center justify-between">
                          <span className="sr-only">{step.name}</span>
                          <h3 className="font-medium">
                            {step.stage + 1}. {step.name}
                          </h3>

                          {step.stage === currentStep && (
                            <svg
                              className="ml-2 rtl:rotate-180 w-4 h-4"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 14 10"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M1 5h12m0 0L9 1m4 4L9 9"
                              />
                            </svg>
                          )}
                          {step.stage < currentStep && (
                            <svg
                              className=" w-4 h-4"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 16 12"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M1 5.917 5.724 10.5 15 1.5"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>

              <div className="w-full mx-auto max-w-[500px] rounded-md bg-primary bg-opacity-5 py-10 px-6 dark:bg-dark sm:p-[60px]">
                {currentStep !== 0 && (
                  <Back
                    size={25}
                    className="text-blue-800 mb-10"
                    onClick={prev}
                  ></Back>
                )}
                <h3 className="mb-3 text-center text-2xl font-bold text-black dark:text-white sm:text-3xl">
                  Complete Your Account
                </h3>
                <p className="mb-11 text-center text-base font-medium text-body-color">
                  And Start Winning
                </p>

                <form onSubmit={handleSubmit(onSubmit)}>
                  {currentStep === 0 && (
                    <motion.div
                      initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="mb-8">
                        <label
                          htmlFor="firstName"
                          className="mb-3 block text-sm font-medium text-dark dark:text-white"
                        >
                          {" "}
                          First Name{" "}
                        </label>
                        <input
                          type="text"
                          {...register("firstName")}
                          name="firstName"
                          placeholder="Enter your first name"
                          className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
                        />
                        {errors.firstName && (
                          <p className="text-danger my-2">
                            {errors.firstName.message}
                          </p>
                        )}
                      </div>
                      <div className="mb-8">
                        <label
                          htmlFor="lastName"
                          className="mb-3 block text-sm font-medium text-dark dark:text-white"
                        >
                          {" "}
                          Last Name{" "}
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          placeholder="Enter your last name"
                          {...register("lastName")}
                          className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
                        />
                        {errors.lastName && (
                          <p className="text-danger my-2">
                            {errors.lastName.message}
                          </p>
                        )}
                      </div>
                      <div className="mb-8">
                        <label
                          htmlFor="email"
                          className="mb-3 block text-sm font-medium text-dark dark:text-white"
                        >
                          {" "}
                          Email{" "}
                        </label>
                        <input
                          type="email"
                          name="email"
                          placeholder="Enter your email"
                          {...register("email")}
                          className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
                        />

                        {errors.email && (
                          <p className="text-danger my-2">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                      <div className="mb-8">
                        <label
                          htmlFor="password"
                          className="mb-3 block text-sm font-medium text-dark dark:text-white"
                        >
                          {" "}
                          Password{" "}
                        </label>
                        <input
                          type="password"
                          name="password"
                          placeholder="Enter your password"
                          {...register("password")}
                          className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
                        />

                        {errors.password && (
                          <p className="text-danger my-2">
                            {errors.password.message}
                          </p>
                        )}
                      </div>
                      <div className="mb-8">
                        <label
                          htmlFor="confirmPassword"
                          className="mb-3 block text-sm font-medium text-dark dark:text-white"
                        >
                          {" "}
                          Confirm Password{" "}
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          placeholder="Confirm your password"
                          {...register("confirmPassword")}
                          className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
                        />

                        {errors.confirmPassword && (
                          <p className="text-danger my-2">
                            {errors.confirmPassword.message}
                          </p>
                        )}
                      </div>
                      <div className="mb-8">
                        <label
                          htmlFor="birthDate"
                          className="mb-3 block text-sm font-medium text-dark dark:text-white"
                        >
                          {" "}
                          Birth Date{" "}
                        </label>
                        <input
                          type="date"
                          name="birthDate"
                          placeholder="Enter your birth date"
                          {...register("birthDate")}
                          className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
                        />

                        {errors.birthDate && (
                          <p className="text-danger my-2">
                            {errors.birthDate.message}
                          </p>
                        )}
                      </div>
                      <div className="mb-8">
                        <label
                          htmlFor="cin"
                          className="mb-3 block text-sm font-medium text-dark dark:text-white"
                        >
                          {" "}
                          CIN{" "}
                        </label>
                        <input
                          type="number"
                          name="cin"
                          placeholder="Enter your CIN (Or Guaridan's CIN)"
                          {...register("cin")}
                          className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
                        />
                      </div>

                      {errors.cin && (
                        <p className="text-danger my-2">{errors.cin.message}</p>
                      )}
                      <div className="mb-6">
                        <button
                          onClick={next}
                          disabled={currentStep === steps.length - 1}
                          type="submit"
                          className="flex w-full items-center justify-center rounded-md bg-primary py-4 px-9 text-base font-medium text-white transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp"
                        >
                          Next
                        </button>
                      </div>
                    </motion.div>
                  )}
                  {currentStep === 1 && (
                    <motion.div
                      initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="mb-8">
                        <label
                          htmlFor="height"
                          className="mb-3 block text-sm font-medium text-dark dark:text-white"
                        >
                          {" "}
                          Height{" "}
                        </label>
                        <input
                          type="number"
                          {...register("height")}
                          name="height"
                          placeholder="Enter your height in cm"
                          className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
                        />

                        {errors.height && (
                          <p className="text-danger my-2">
                            {errors.height.message}
                          </p>
                        )}
                      </div>
                      <div className="mb-8">
                        <label
                          htmlFor="preferredFoot"
                          className="mb-3 block text-sm font-medium text-dark dark:text-white"
                        >
                          {" "}
                          Preferred Foot{" "}
                        </label>
                        <div className="flex justify-between w-full gap-4 ">
                          <div className="flex items-center w-full ps-4 border border-gray-200 rounded-br-2xl dark:border-gray-700">
                            <input
                              id="bordered-radio-1"
                              type="radio"
                              value="Left"
                              name="preferredFoot"
                              {...register("preferredFoot")}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <label
                              htmlFor="bordered-radio-1"
                              className="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                            >
                              Left
                            </label>
                          </div>
                          <div className="flex items-center w-full ps-4 border border-gray-200 rounded-b-2xl dark:border-gray-700">
                            <input
                              id="bordered-radio-2"
                              type="radio"
                              value="Both"
                              name="preferredFoot"
                              {...register("preferredFoot")}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <label
                              htmlFor="bordered-radio-2"
                              className="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                            >
                              Both
                            </label>
                          </div>
                          <div className="flex items-center w-full ps-4 border border-gray-200 rounded-bl-2xl dark:border-gray-700">
                            <input
                              id="bordered-radio-3"
                              type="radio"
                              value="Right"
                              name="preferredFoot"
                              {...register("preferredFoot")}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <label
                              htmlFor="bordered-radio-3"
                              className="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                            >
                              Right
                            </label>
                          </div>
                        </div>

                        {errors.preferredFoot && (
                          <p className="text-danger my-2">
                            {errors.preferredFoot.message}
                          </p>
                        )}
                      </div>
                      <div className="mb-8">
                        <label
                          htmlFor="position"
                          className="mb-3 block text-sm font-medium text-dark dark:text-white"
                        >
                          {" "}
                          Preferred Foot{" "}
                        </label>
                        <select
                          {...register("position")}
                          name="position"
                          className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
                        >
                          <option defaultValue value="AM">
                            Attacking Midfielder
                          </option>
                          <option value="CB">Center Back</option>
                          <option value="CF">Center Forward</option>
                          <option value="CM">Central Midfielder</option>
                          <option value="D">Defender</option>
                          <option value="DM">Defensive Midfielder</option>
                          <option value="FB">Full Back</option>
                          <option value="F">Forward</option>
                          <option value="GK">Goalkeeper</option>
                          <option value="LM">Left Midfielder</option>
                          <option value="M">Midfielder</option>
                          <option value="RM">Right Midfielder</option>
                          <option value="S">Striker</option>
                          <option value="SS">Second Striker</option>
                          <option value="WB">Wing Back</option>
                          <option value="W">Winger</option>
                        </select>

                        {errors.position && (
                          <p className="text-danger my-2">
                            {errors.position.message}
                          </p>
                        )}
                      </div>
                      <div className="mb-8">
                        <label
                          htmlFor="description"
                          className="mb-3 block text-sm font-medium text-dark dark:text-white"
                        >
                          {" "}
                          About you{" "}
                        </label>
                        <textarea
                          {...register("description")}
                          name="description"
                          placeholder="Introduce your self to the world in a few words"
                          className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
                        ></textarea>

                        {errors.description && (
                          <p className="text-danger my-2">
                            {errors.description.message}
                          </p>
                        )}
                      </div>
                      <div className="mb-8">
                        <label
                          htmlFor="socialMediaHandle"
                          className="mb-3 block text-sm font-medium text-dark dark:text-white"
                        >
                          {" "}
                          Social Media Handles{" "}
                        </label>
                        <input
                          type="text"
                          {...register("socialMediaHandle")}
                          name="socialMediaHandle"
                          placeholder="Plug your @ Social Media Handle here"
                          className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
                        />

                        {errors.socialMediaHandle && (
                          <p className="text-danger my-2">
                            {errors.socialMediaHandle.message}
                          </p>
                        )}
                      </div>
                      <div className="mb-8">
                        <label
                          htmlFor="image"
                          className="mb-3 block text-sm font-medium text-dark dark:text-white"
                        >
                          {" "}
                          Profile Picture{" "}
                        </label>
                        <div
                          className="flex flex-col items-center justify-center w-full gap-6"
                          {...getRootProps()}
                        >
                          <label
                            htmlFor="dropzone-file"
                            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                          >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <svg
                                className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 16"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                />
                              </svg>
                              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-semibold">
                                  Click to upload
                                </span>{" "}
                                or drag and drop
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                SVG, PNG, JPG or GIF (MAX. 800x400px)
                              </p>
                            </div>
                            <input
                              id="dropzone-file"
                              type="file"
                              className="hidden"
                              {...getInputProps()}
                              name="image"
                              {...register("image")}
                            />
                          </label>
                          {file && (
                            <img
                              className="rounded-2xl w-2/4 h-2/4"
                              src={file}
                              alt="Extra large avatar"
                            />
                          )}

                          {errors.image && (
                            <p className="text-danger my-2">
                              {errors.image.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={next}
                        disabled={currentStep === steps.length - 1}
                        type="submit"
                        className="flex w-full items-center justify-center rounded-md bg-primary py-4 px-9 text-base font-medium text-white transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp"
                      >
                        Next
                      </button>
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div
                      initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="flex-col flex gap-6"
                    >
                      <hr />
                      <p className=" text-base font-semibold text-body-color">
                        Notifications And Teams
                      </p>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked={true}
                          value=""
                          className="sr-only peer"
                        />
                        <div className="relative w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                          Allow Team Invitations
                        </span>
                      </label>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          value=""
                          className="sr-only peer"
                        />
                        <div className="relative w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                          Allow{" "}
                        </span>
                      </label>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          value=""
                          className="sr-only peer"
                        />
                        <div className="relative w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                          Large toggle
                        </span>
                      </label>
                      <hr />
                      <p className=" text-base font-semibold text-body-color">
                        Mail And Updates
                      </p>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          value=""
                          className="sr-only peer"
                        />
                        <div className="relative w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                          Receive Updates And News
                        </span>
                      </label>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-md bg-primary mt-4 py-4 px-9 text-base font-medium text-white transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp"
                      >
                        {isSubmitting ? "Loading..." : "Submit"}
                      </button>
                    </motion.div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute left-0 top-0 z-[-1]">
          <svg
            width="1440"
            height="969"
            viewBox="0 0 1440 969"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* SVG for background */}
          </svg>
        </div>
      </section>
    </>
  );
}
