import {useForm} from "react-hook-form";
import {addTeam} from "../../../../../Services/FrontOffice/apiTeam.js";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {useEffect, useState} from "react";
import GetCountries from "../../../../../Services/APis/CountryAPI.js";
import NewsLatterBox from "../../../HomePage/components/Contact/NewsLatterBox.jsx";

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
            <section id="contact" className="overflow-hidden py-16 md:py-20 lg:py-28">
                <div className="container">
                    <div className="-mx-4 flex justify-center flex-wrap">
                        <div className="w-full px-4 lg:w-7/12 xl:w-8/12">
                            <div
                                className="wow fadeInUp mb-12 rounded-md bg-primary/[3%] py-11 px-8 dark:bg-dark sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]"
                                data-wow-delay=".15s
              "
                            >
                                <h2 className="mb-3 text-2xl font-bold text-black dark:text-white sm:text-3xl lg:text-2xl xl:text-3xl">
                                    Register your Team
                                </h2>
                                <p className="mb-12 text-base font-medium text-body-color">
                                    Start your journey with us by registering your team.
                                </p>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="-mx-4 flex flex-wrap">
                                        <div className="w-full px-4 md:w-1/2">
                                            <div className="mb-8">
                                                <label
                                                    htmlFor="name"
                                                    className="mb-3 block text-sm font-medium text-dark dark:text-white"
                                                >
                                                    Your Name
                                                </label>
                                                <div className="flex flex-col">
                                                    <input
                                                        {...register("name")}
                                                        type="text"
                                                        name="name"
                                                        placeholder="Team Name"
                                                        className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
                                                    />
                                                    {errors.name &&
                                                        <p className="text-danger mb-2">{errors.name.message}</p>}
                                                </div>
                                            </div>

                                        </div>
                                        <div className="w-full px-4 md:w-1/2">
                                            <div className="mb-8">
                                                <label
                                                    htmlFor="email"
                                                    className="mb-3 block text-sm font-medium text-dark dark:text-white"
                                                >
                                                    Team Abbreviation
                                                </label>
                                                <div className="flex flex-col">
                                                    <input
                                                        {...register("nameAbbreviation")}
                                                        type="text"
                                                        name="nameAbbreviation"
                                                        placeholder="Team Abbreviation"
                                                        className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
                                                    />
                                                    {errors.nameAbbreviation &&
                                                        <p className="text-danger">{errors.nameAbbreviation.message}</p>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-full px-4 md:w-1/2">
                                            <div className="mb-8">
                                                <label
                                                    htmlFor="email"
                                                    className="mb-3 block text-sm font-medium text-dark dark:text-white"
                                                >
                                                    Country
                                                </label>
                                                <div className="flex flex-col ">
                                                    <select
                                                        {...register("country")}
                                                        name="country"
                                                        className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
                                                    >
                                                        <option disabled selected>
                                                            Select Country
                                                        </option>
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
                                        </div>
                                        <div className="w-full px-4 md:w-1/2">
                                            <div className="mb-8">
                                                <label
                                                    htmlFor="email"
                                                    className="mb-3 block text-sm font-medium text-dark dark:text-white"
                                                >
                                                    City
                                                </label>
                                                <div className="flex flex-col ">
                                                    <select
                                                        {...register("city")}
                                                        name="city"
                                                        className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
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
                                        </div>

                                        <div className="w-full px-4 md:w-1/2">
                                            <div className="mb-8">
                                                <label
                                                    htmlFor="email"
                                                    className="mb-3 block text-sm font-medium text-dark dark:text-white"
                                                >
                                                    State
                                                </label>
                                                <div className="flex flex-col ">
                                                    <select
                                                        {...register("city")}
                                                        name="city"
                                                        className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
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
                                        </div>
                                        <div className="w-full px-4 md:w-1/2">
                                            <div className="mb-8">
                                                <label
                                                    htmlFor="email"
                                                    className="mb-3 block text-sm font-medium text-dark dark:text-white"
                                                >
                                                    Founded In
                                                </label>
                                                <div className="flex flex-col ">
                                                    <input
                                                        {...register("foundedIn")}
                                                        type="date"
                                                        name="foundedIn"
                                                        className="mr-2 w-full rounded-md border border-body-color border-opacity-10 py-3 px-6 text-base font-medium text-body-color placeholder-body-color outline-none focus:border-primary focus:border-opacity-100 focus-visible:shadow-none dark:border-white dark:border-opacity-10 dark:bg-[#242B51] focus:dark:border-opacity-50 mb-4" // Added mb-4 for margin-bottom
                                                    />
                                                    {errors.foundedIn &&
                                                        <p className="text-danger">You must insert a date</p>}
                                                </div>
                                            </div>
                                        </div>

                                        {errors.root && (
                                            <div className="flex mb-4">
                                                {errors.root.message}
                                            </div>
                                        )}

                                        <div className="w-full px-4">

                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="rounded-md bg-primary py-4 px-9 text-base font-medium text-white transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp">
                                                {isSubmitting ? "Loading..." : "Submit"}</button>
                                        </div>
                                    </div>
                                </form>



                            </div>
                        </div>
                    </div>
                </div>
            </section>


        </>
    )


}