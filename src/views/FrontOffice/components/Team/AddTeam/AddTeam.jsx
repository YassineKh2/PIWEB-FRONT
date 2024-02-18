import {useForm} from "react-hook-form";
import {addTeam} from "../../../../../Services/FrontOffice/apiTeam.js";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {useEffect, useState} from "react";
import GetCountries from "../../../../../Services/APis/CountryAPI.js";

const schema = yup.object().shape({
    name: yup.string().required().min(3),
    nameAbbreviation: yup.string().max(3).min(3).required(),
    country: yup.string().required(),
    city: yup.string().required(),
    foundedIn: yup.date().required()
});


export default function AddTeam() {
    const [Countries, setCountries] = useState([]);

    useEffect(() => {
        GetCountries().then((response) => {
            console.log(response)
            const countryNames = response.map((country) => country.name.common);

            setCountries(countryNames.sort());
        });
    },[]);


    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
        setError
    } = useForm({
        resolver: yupResolver(schema)
    });


    const onSubmit = async (data) => {

        try {
            await addTeam(data);
        } catch (error) {
            setError("root", {
                message: error.message
            });
        }
    }

    return (
        <>

            <div className="flex justify-center items-center h-screen ">
                <div className="px-4 lg:w-8/12 xl:w-6/12">
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
                            Add New Team
                        </h3>
                        <form role="form" onSubmit={handleSubmit(onSubmit)}>
                            <div className="flex mb-4 flex-col md:flex-row gap-2">
                                <div className="flex flex-col">
                                    <input
                                        {...register("name")}
                                        type="text"
                                        name="name"
                                        placeholder="Team Name"
                                        className=" w-full  rounded-md border border-body-color border-opacity-10 py-3 px-6 text-base font-medium text-body-color placeholder-body-color outline-none focus:border-primary focus:border-opacity-100 focus-visible:shadow-none dark:border-white dark:border-opacity-10 dark:bg-[#242B51] focus:dark:border-opacity-50 mb-4" // Added mb-4 for margin-bottom
                                    />
                                    {errors.name && <p className="text-danger mb-2">{errors.name.message}</p>}
                                </div>

                                <div className="flex flex-col">
                                    <input
                                        {...register("nameAbbreviation")}
                                        type="text"
                                        name="nameAbbreviation"
                                        placeholder="Team Abbreviation"
                                        className="mr-2 w-full rounded-md border border-body-color border-opacity-10 py-3 px-6 text-base font-medium text-body-color placeholder-body-color outline-none focus:border-primary focus:border-opacity-100 focus-visible:shadow-none dark:border-white dark:border-opacity-10 dark:bg-[#242B51] focus:dark:border-opacity-50 mb-4" // Added mb-4 for margin-bottom
                                    />
                                    {errors.nameAbbreviation &&
                                        <p className="text-danger">{errors.nameAbbreviation.message}</p>}
                                </div>
                            </div>


                            <div className="flex flex-col md:flex-row mb-4 ">

                                <div className="flex flex-col ">
                                    <select
                                        {...register("country")}
                                        name="country"
                                        className="mr-2 rounded-md border border-body-color border-opacity-10 py-3 px-6 text-base font-medium text-body-color placeholder-body-color outline-none focus:border-primary focus:border-opacity-100 focus-visible:shadow-none dark:border-white dark:border-opacity-10 dark:bg-[#242B51] focus:dark:border-opacity-50 mb-4"
                                    >
                                        {Countries.map((country, index) => (
                                            <option key={index} value={country}>
                                                {country}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.country &&
                                        <p className="text-danger">{errors.country.message}</p>}
                                </div>
                                <div className="flex flex-col ">
                                    <select
                                        {...register("city")}
                                        name="city"
                                        className="mr-2 rounded-md border border-body-color border-opacity-10 py-3 px-6 text-base font-medium text-body-color placeholder-body-color outline-none focus:border-primary focus:border-opacity-100 focus-visible:shadow-none dark:border-white dark:border-opacity-10 dark:bg-[#242B51] focus:dark:border-opacity-50 mb-4"
                                    >
                                        {Countries.map((country, index) => (
                                            <option key={index} value={country}>
                                                {country}
                                            </option>

                                        ))}
                                    </select>
                                    {errors.city &&
                                        <p className="text-danger">{errors.city.message}</p>}
                                </div>
                                <div className="flex flex-col ">
                                    <select
                                        {...register("city")}
                                        name="city"
                                        className="mr-2 rounded-md border border-body-color border-opacity-10 py-3 px-6 text-base font-medium text-body-color placeholder-body-color outline-none focus:border-primary focus:border-opacity-100 focus-visible:shadow-none dark:border-white dark:border-opacity-10 dark:bg-[#242B51] focus:dark:border-opacity-50 mb-4"
                                    >
                                        {Countries.map((country, index) => (
                                            <option key={index} value={country}>
                                                {country}
                                            </option>

                                        ))}
                                    </select>
                                    {errors.city &&
                                        <p className="text-danger">{errors.city.message}</p>}
                                </div>
                            </div>

                            <div className="flex flex-col mb-4">
                                <input
                                    {...register("foundedIn")}
                                    type="date"
                                    name="foundedIn"
                                    className="mr-2 w-full rounded-md border border-body-color border-opacity-10 py-3 px-6 text-base font-medium text-body-color placeholder-body-color outline-none focus:border-primary focus:border-opacity-100 focus-visible:shadow-none dark:border-white dark:border-opacity-10 dark:bg-[#242B51] focus:dark:border-opacity-50 mb-4" // Added mb-4 for margin-bottom
                                />
                                {errors.foundedIn &&
                                    <p className="text-danger">You must insert a date</p>}
                            </div>
                            {errors.root && (
                                <div className="flex mb-4">
                                    {errors.root.message}
                                </div>
                            )}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="duration-80 mb-4 w-full cursor-pointer rounded-md border border-transparent bg-primary py-3 px-6 text-center text-base font-medium text-white outline-none transition ease-in-out hover:bg-opacity-80 hover:shadow-signUp focus-visible:shadow-none"
                            >{isSubmitting ? "Loading..." : "Submit"}</button>
                        </form>

                         {/*  SVG Styling  */}
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
                                    style={{maskType: "alpha"}}
                                    maskUnits="userSpaceOnUse"
                                    x="0"
                                    y="0"
                                    width="370"
                                    height="596"
                                >
                                    <rect width="370" height="596" rx="2" fill="#1D2144"/>
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
                                        <stop stopColor="white"/>
                                        <stop offset="1" stopColor="white" stopOpacity="0"/>
                                    </linearGradient>
                                    <linearGradient
                                        id="paint1_linear_88:141"
                                        x1="28.1579"
                                        y1="501.301"
                                        x2="8.69936"
                                        y2="464.391"
                                        gradientUnits="userSpaceOnUse"
                                    >
                                        <stop stopColor="white"/>
                                        <stop offset="1" stopColor="white" stopOpacity="0"/>
                                    </linearGradient>
                                    <linearGradient
                                        id="paint2_linear_88:141"
                                        x1="338"
                                        y1="167"
                                        x2="349.488"
                                        y2="200.004"
                                        gradientUnits="userSpaceOnUse"
                                    >
                                        <stop stopColor="white"/>
                                        <stop offset="1" stopColor="white" stopOpacity="0"/>
                                    </linearGradient>
                                    <linearGradient
                                        id="paint3_linear_88:141"
                                        x1="369.5"
                                        y1="-53"
                                        x2="369.5"
                                        y2="89.9999"
                                        gradientUnits="userSpaceOnUse"
                                    >
                                        <stop stopColor="white"/>
                                        <stop offset="1" stopColor="white" stopOpacity="0"/>
                                    </linearGradient>
                                    <linearGradient
                                        id="paint4_linear_88:141"
                                        x1="411.5"
                                        y1="-78"
                                        x2="411.5"
                                        y2="64.9999"
                                        gradientUnits="userSpaceOnUse"
                                    >
                                        <stop stopColor="white"/>
                                        <stop offset="1" stopColor="white" stopOpacity="0"/>
                                    </linearGradient>
                                    <linearGradient
                                        id="paint5_linear_88:141"
                                        x1="372.5"
                                        y1="-69"
                                        x2="372.5"
                                        y2="73.9999"
                                        gradientUnits="userSpaceOnUse"
                                    >
                                        <stop stopColor="white"/>
                                        <stop offset="1" stopColor="white" stopOpacity="0"/>
                                    </linearGradient>
                                    <linearGradient
                                        id="paint6_linear_88:141"
                                        x1="409.5"
                                        y1="-102"
                                        x2="409.5"
                                        y2="40.9999"
                                        gradientUnits="userSpaceOnUse"
                                    >
                                        <stop stopColor="white"/>
                                        <stop offset="1" stopColor="white" stopOpacity="0"/>
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>



        </>
    )


}