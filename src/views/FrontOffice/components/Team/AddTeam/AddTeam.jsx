import {useForm} from "react-hook-form";
import {addTeam} from "../../../../../Services/FrontOffice/apiTeam.js";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {useEffect, useRef, useState} from "react";
import {GetCitybyStateAndCountry, GetCountries, GetStateByCountry} from "../../../../../Services/APis/CountryAPI.js";
import {DatePickerDemo} from "./DatePicker.jsx";
import {AiOutlinePicture as Picture} from "react-icons/ai";
import {motion} from 'framer-motion'
import SectionTitle from "../../../HomePage/components/Common/SectionTitle.jsx";
import PricingBox from "./PricingBoxTeam.jsx";
import OfferList from "../../../HomePage/components/Pricing/OfferList.jsx";
import { useNavigate } from "react-router-dom";
import { addSponsors } from "../../../../../Services/FrontOffice/apiSponsors.js";




const schema = yup.object().shape({

    name: yup.string().required().min(3),
    nameAbbreviation: yup.string().max(3).min(3).required(),
    country: yup.string().required(),
    state: yup.string().required(),
    city: yup.string().required(),
    description: yup.string().required(),
    nickname: yup.string(),
    slogan: yup.string(),
    founder: yup.string().required(),
    image: yup.string(),
    foundedIn: yup.date(),
    

});
const schemasp=yup.object().shape({
    name: yup.string().required("Name is required").matches(/^[A-Za-z]+$/, "Name must contain only letters"),
    description: yup.string().required("Description is required"),
    contact: yup.number().required("Contact is required").typeError("Contact must be a number").test('len', 'Contact must be exactly 8 digits', val => String(val).length === 8),
    adresse: yup.string().required("Adresse is required")
});
const steps = [
    {
        id: 'Step 1',
        name: 'General Information',
        fields: ['name', 'nameAbbreviation', 'country', 'state', 'city', 'image']
    },
    {
        id: 'Step 2',
        name: 'Team Description',
        fields: ['description', 'slogan', 'nickname', 'foundedIn', 'founder']
    },
    {
        id: 'Step 3',
        name: 'Players And Coaches',
        fields: ['']
    },
    {
        id: 'Step 4',
        name: 'Additional Information',
        fields: ['']
    },
    {id: 'Step 5', name: 'Choosing Your Plan'}
]


export default function AddTeam() {
    const [Countries, setCountries] = useState([]);
    const [States, setStates] = useState([]);
    const [Cites, setCites] = useState([]);
    const [date, setDate] = useState();

    const [previousStep, setPreviousStep] = useState(0)
    const [currentStep, setCurrentStep] = useState(0)
    const delta = currentStep - previousStep

    const [isMonthly, setIsMonthly] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const formRef = useRef();
    const navigate = useNavigate();
    const [logo, setLogo] = useState(null);
    const [sponsor, setSponsor] = useState({
      name: "",
      description: "",
      logo: "",
      contact: "",
      adresse: ""
    });
    const [error, setErrors] = useState({
        name: "",
        description: "",
        contact: "",
        adresse: ""
      });

    useEffect(() => {
        GetCountries().then((response) => {
            setCountries(response);
        });
    }, []);


    const next = async () => {
        const fields = steps[currentStep].fields
        const output = await trigger(fields, {shouldFocus: true})

        if (!output) return

        if (currentStep < steps.length - 1) {
            if (currentStep === steps.length - 2) {
                // await handleSubmit(processForm)()
            }
            setPreviousStep(currentStep)
            setCurrentStep(step => step + 1)
        }
    }

    const prev = () => {
        if (currentStep > 0) {
            setPreviousStep(currentStep)
            setCurrentStep(step => step - 1)
        }
    }
    const handleChange = async (e) => {
        const { name, value } = e.target;
        setSponsor({ ...sponsor, [name]: value });
        try {
            await yup.reach(schemasp, name).validate(value);
            setErrors({ ...error, [name]: "" });
        } catch (error) {
            setErrors({ ...error, [name]: error.message });
        }
    };
    
  

    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting, dirtyFields},
        setError,
        watch,
        trigger
    } = useForm({
        resolver: yupResolver(schema)
    });

    const selectedCountry = watch("country", true);
    const selectedState = watch("state", true);
    const image = watch("image", true);


    useEffect(() => {
        if (selectedCountry) {
            setCites([]);
            GetStateByCountry(selectedCountry).then((response) => {
                setStates(response);
            });
        }
    }, [selectedCountry]);

    useEffect(() => {
        if (selectedState) {
            GetCitybyStateAndCountry(selectedCountry, selectedState).then((response) => {
                setCites(response);
            });
        }
    }, [selectedState]);


    const onSubmit = async (data) => {
        try {
            data.image = image[0];
            data.imagename = image[0].name;
            data.foundedIn = date;
            await schemasp.validate(sponsor);
            // Ajout de l'équipe
            const addedTeam = await addTeam(data);
            const teamId = addedTeam.data._id; // Obtenez l'identifiant de l'équipe nouvellement ajoutée
            
            // Ajout du sponsor avec l'ID de l'équipe associée
            const sponsorData = { ...data, teamId };
            await addSponsors(sponsorData);
    
            // Afficher les données du sponsor ajouté
            console.log("Données du sponsor ajouté :", sponsorData);
        
    
            navigate('/team/all');
    
        } catch (error) {
            setError("root", {
                message: error.message
            });
        }
    }
    
    
    

    return (
        <>
            <section id="contact" className="overflow-hidden mt-4 py-16 md:py-20 lg:py-28">
                <form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
                    <div className="container">
                        <nav aria-label='Progress' className="mb-10">
                            <ol role='list' className='space-y-4 md:flex md:space-x-8 md:space-y-0'>
                                {steps.map((step, index) => (
                                    <li key={step.name} className='md:flex-1'>
                                        {currentStep > index ? (
                                            <div
                                                className='group flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'>
                  <span className='text-sm font-medium text-sky-600 transition-colors '>
                    {step.id}
                  </span>
                                                <span className='text-sm font-medium'>{step.name}</span>
                                            </div>
                                        ) : currentStep === index ? (
                                            <div
                                                className='flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'
                                                aria-current='step'
                                            >
                  <span className='text-sm font-medium text-sky-600'>
                    {step.id}
                  </span>
                                                <span className='text-sm font-medium'>{step.name}</span>
                                            </div>
                                        ) : (
                                            <div
                                                className='group flex w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'>
                  <span className='text-sm font-medium text-gray-500 transition-colors'>
                    {step.id}
                  </span>
                                                <span className='text-sm font-medium'>{step.name}</span>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ol>
                        </nav>
                        {currentStep !== 4 && (
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
                                        <p className="mb-12 text-base font-medium text-body-color" id="formP">
                                            {currentStep === 0 && "Start your journey with us by registering your team."}
                                            {currentStep === 1 && "Enter your team's description details here."}
                                            {currentStep === 2 && "Add your players and coaches here."}
                                            {currentStep === 3 && "Add your sponsors and other details here."}
                                        </p>

                                        {currentStep === 0 && (
                                            <motion.div
                                                initial={{x: delta >= 0 ? '50%' : '-50%', opacity: 0}}
                                                animate={{x: 0, opacity: 1}}
                                                transition={{duration: 0.3, ease: 'easeInOut'}}
                                            >
                                                <div
                                                    className="rounded-full bg-amber-50 p-6 w-1/5 md:p-5 lg:p-6 md:w-1/12">
                                                    <input {...register("image")} type="file" name="image"
                                                           accept="image/*"
                                                           id="image"
                                                           className="hidden"/>
                                                    <label htmlFor={"image"}
                                                           className="flex items-baseline justify-center"><Picture
                                                        className="text-black-2"></Picture></label>
                                                </div>

                                                <div className="-mx-4 flex flex-wrap">
                                                    <div className="w-full px-4 md:w-1/2">
                                                        <div className="mb-8">
                                                            <label
                                                                htmlFor="name"
                                                                className="mb-3 block text-sm font-medium text-dark dark:text-white"
                                                            >
                                                                Team Name
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
                                                                        Select your Country
                                                                    </option>
                                                                    {Countries.map((country, index) => (
                                                                        <option key={index} value={country.iso2}>
                                                                            {country.name}
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
                                                                    {...register("state")}
                                                                    name="state"
                                                                    className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
                                                                >
                                                                    <option disabled selected>
                                                                        Select your State
                                                                    </option>
                                                                    {States.map((state, index) => (
                                                                        <option key={index} value={state.iso2}>
                                                                            {state.name}
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
                                                                    <option disabled selected>
                                                                        Select your City
                                                                    </option>
                                                                    {Cites.map((city, index) => (
                                                                        <option key={index} value={city.iso2}>
                                                                            {city.name}
                                                                        </option>

                                                                    ))}
                                                                </select>
                                                                {errors.city &&
                                                                    <p className="text-danger">{errors.city.message}</p>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                        {currentStep === 1 && (
                                            <motion.div
                                                initial={{x: delta >= 0 ? '50%' : '-50%', opacity: 0}}
                                                animate={{x: 0, opacity: 1}}
                                                transition={{duration: 0.3, ease: 'easeInOut'}}
                                            >

                                                <div className="-mx-4 flex flex-wrap">
                                                    <div className="w-full px-4 md:w-1/2">
                                                        <div className="mb-8">
                                                            <label
                                                                htmlFor="date"
                                                                className="mb-3 block text-sm font-medium text-dark dark:text-white"
                                                            >
                                                                Founded In
                                                            </label>
                                                            <div className="flex flex-col ">
                                                                <DatePickerDemo date={date} setDate={setDate}/>
                                                                {!date &&
                                                                    <p className="text-danger">You must insert a
                                                                        date</p>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="w-full px-4 md:w-1/2">
                                                        <div className="mb-8">
                                                            <label
                                                                htmlFor="name"
                                                                className="mb-3 block text-sm font-medium text-dark dark:text-white"
                                                            >
                                                                Nickname
                                                            </label>
                                                            <div className="flex flex-col">
                                                                <input
                                                                    {...register("nickname")}
                                                                    type="text"
                                                                    name="nickname"
                                                                    placeholder="Team's Nickname"
                                                                    className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
                                                                />

                                                                {errors.nickname &&
                                                                    <p className="text-danger mb-2">{errors.nickname.message}</p>}
                                                            </div>
                                                        </div>

                                                    </div>
                                                    <div className="w-full px-4">
                                                        <div className="mb-8">
                                                            <label
                                                                htmlFor="description"
                                                                className="mb-3 block text-sm font-medium text-dark dark:text-white"
                                                            >
                                                                Description
                                                            </label>
                                                            <div className="flex flex-col">
                                                            <textarea
                                                                {...register("description")}
                                                                name="description"
                                                                placeholder="Team's Description"
                                                                className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
                                                            >
                                                            </textarea>
                                                                {errors.description &&
                                                                    <p className="text-danger mb-2">{errors.description.message}</p>}
                                                            </div>
                                                        </div>

                                                    </div>
                                                    <div className="w-full px-4 md:w-1/2">
                                                        <div className="mb-8">
                                                            <label
                                                                htmlFor="name"
                                                                className="mb-3 block text-sm font-medium text-dark dark:text-white"
                                                            >
                                                                Founder
                                                            </label>
                                                            <div className="flex flex-col">
                                                                <input
                                                                    {...register("founder")}
                                                                    type="text"
                                                                    name="founder"
                                                                    placeholder="Team's Founder"
                                                                    className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
                                                                />

                                                                {errors.founder &&
                                                                    <p className="text-danger mb-2">{errors.founder.message}</p>}
                                                            </div>
                                                        </div>

                                                    </div>
                                                    <div className="w-full px-4 md:w-1/2">
                                                        <div className="mb-8">
                                                            <label
                                                                htmlFor="name"
                                                                className="mb-3 block text-sm font-medium text-dark dark:text-white"
                                                            >
                                                                Slogan
                                                            </label>
                                                            <div className="flex flex-col">
                                                                <input
                                                                    {...register("slogan")}
                                                                    type="text"
                                                                    name="slogan"
                                                                    placeholder="Team's Slogan"
                                                                    className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
                                                                />

                                                                {errors.slogan &&
                                                                    <p className="text-danger mb-2">{errors.slogan.message}</p>}
                                                            </div>
                                                        </div>

                                                    </div>


                                                </div>

                                            </motion.div>
                                        )}
                                        {currentStep === 2 && (
                                            <motion.div
                                                initial={{x: delta >= 0 ? '50%' : '-50%', opacity: 0}}
                                                animate={{x: 0, opacity: 1}}
                                                transition={{duration: 0.3, ease: 'easeInOut'}}
                                            >
                                                Players And Coaches goes here
                                            </motion.div>
                                        )}

{currentStep === 3 && (
    <motion.div
        initial={{x: delta >= 0 ? '50%' : '-50%', opacity: 0}}
        animate={{x: 0, opacity: 1}}
        transition={{duration: 0.3, ease: 'easeInOut'}}
    >
        <div className="flex items-center">
        <p className="mr-4 font-bold text-blue-800">Do you have a sponsor to add ?</p>
    <div className="flex">
        <input type="radio" id="yes" name="sponsorOption" value="yes" onClick={() => setShowForm(true)} />
        <label htmlFor="yes" className="mr-2">Yes</label>
        <input type="radio" id="no" name="sponsorOption" value="no" onClick={() => setShowForm(false)} />
        <label htmlFor="no" className="mr-4">No</label>
    </div>
</div>


{showForm && (
            <div className="wow fadeInUp relative z-10 rounded-md p-8 sm:p-11 lg:p-8 xl:p-11" data-wow-delay=".2s">
                <div className="flex justify-center items-center mt-16">
                    <div className="w-full px-4 lg:w-8/12 xl:w-6/12">
                        <form>
                            <div className="mb-4">
                                <label htmlFor="name" className="mb-3 block text-sm font-medium text-dark dark:text-white">
                                    Name:
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={sponsor.name}
                                    onChange={(e) => handleChange(e)}
                                    className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
                                />
                                {error.name && <div className="text-red-500">{error.name}</div>}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="description" className="mb-3 block text-sm font-medium text-dark dark:text-white">
                                    Description:
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={sponsor.description}
                                    onChange={(e) => handleChange(e)}
                                    className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
                                />
                                {error.description && <div className="text-red-500">{error.description}</div>}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="logo" className="mb-3 block text-sm font-medium text-dark dark:text-white">
                                    Logo:
                                </label>
                                <input
                                    type="file"
                                    name="logo"
                                    accept="image/*"
                                    onChange={(e) => handleLogoChange(e)}
                                    className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
                                />
                                {error.logo && <div className="text-red-500">{error.logo}</div>}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="contact" className="mb-3 block text-sm font-medium text-dark dark:text-white">
                                    Contact:
                                </label>
                                <input
                                    type="text"
                                    id="contact"
                                    name="contact"
                                    value={sponsor.contact}
                                    onChange={(e) => handleChange(e)}
                                    className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
                                />
                                {error.contact && <div className="text-red-500">{error.contact}</div>}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="address" className="mb-3 block text-sm font-medium text-dark dark:text-white">
                                    Adresse:
                                </label>
                                <input
                                    type="text"
                                    id="adresse"
                                    name="adresse"
                                    value={sponsor.adresse}
                                    onChange={(e) => handleChange(e)}
                                    className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
                                />
                                {error.adresse && <div className="text-red-500">{error.adresse}</div>}
                            </div>
                        </form>
                   
                </div>
            </div>
        </div>
         )}
    </motion.div>
)}





                                    </div>
                                </div>
                            </div>
                        )}
                    </div>


                    {currentStep === 4 && (
                        <motion.div
                            initial={{x: delta >= 0 ? '50%' : '-50%', opacity: 0}}
                            animate={{x: 0, opacity: 1}}
                            transition={{duration: 0.3, ease: 'easeInOut'}}
                        >
                            <section id="pricing" className="relative z-10 py-16 md:py-20 lg:py-28">
                                <div className="container">
                                    <SectionTitle
                                        title="Simple and Affordable Pricing"
                                        paragraph="There are many variations of passages of Lorem Ipsum available but the majority have suffered alteration in some form."
                                        center
                                        width="665px"
                                    />

                                    <div className="w-full">
                                        <div
                                            className="wow fadeInUp mb-8 flex justify-center md:mb-12 lg:mb-16"
                                            data-wow-delay=".1s"
                                        >
            <span
                onClick={() => setIsMonthly(true)}
                className={`${
                    isMonthly
                        ? "pointer-events-none text-primary"
                        : "text-dark dark:text-white"
                } mr-4 cursor-pointer text-base font-semibold`}
            >
              Monthly
            </span>
                                            <div
                                                onClick={() => setIsMonthly(!isMonthly)}
                                                className="flex cursor-pointer items-center"
                                            >
                                                <div className="relative">
                                                    <div
                                                        className="h-5 w-14 rounded-full bg-[#1D2144] shadow-inner"></div>
                                                    <div
                                                        className={`${
                                                            isMonthly ? "" : "translate-x-full"
                                                        } shadow-switch-1 absolute left-0 top-[-4px] flex h-7 w-7 items-center justify-center rounded-full bg-primary transition`}
                                                    >
                                                                        <span
                                                                            className="active h-4 w-4 rounded-full bg-white"></span>
                                                    </div>
                                                </div>
                                            </div>
                                            <span
                                                onClick={() => setIsMonthly(false)}
                                                className={`${
                                                    isMonthly
                                                        ? "text-dark dark:text-white"
                                                        : "pointer-events-none text-primary"
                                                } ml-4 cursor-pointer text-base font-semibold`}
                                            >
              Yearly
            </span>
                                        </div>
                                    </div>

                                    <div
                                        className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
                                        <PricingBox
                                            packageName="Free"
                                            price="0"
                                            duration={isMonthly ? "mo" : "yr"}
                                            subtitle="Enjoy essential features with our free plan."
                                            type="free"
                                            isSubmitting={isSubmitting}
                                            formRef={formRef}
                                        >
                                            <OfferList text="Access To All Tournaments" status="active" />
                                            <OfferList text="Limited Team Management" status="active" />
                                            <OfferList text="Basic Match Scheduling" status="active" />
                                            <OfferList text="Access to Basic Football Stats" status="active" />
                                            <OfferList text="Ad-Free Experience" status="inactive" />
                                            <OfferList text="Historical Data" status="inactive" />
                                            <OfferList text="Match Replays" status="inactive" />
                                        </PricingBox>

                                        <PricingBox
                                            packageName="Basic"
                                            price={isMonthly ? "99" : "999"}
                                            duration={isMonthly ? "mo" : "yr"}
                                            subtitle="Unlock more features with our Basic plan."
                                            type="basic"
                                            isSubmitting={isSubmitting}
                                            formRef={formRef}
                                        >
                                            <OfferList text="Access To All Tournaments" status="active" />
                                            <OfferList text="Full Team Management" status="active" />
                                            <OfferList text="Full Match Scheduling" status="active" />
                                            <OfferList text="Full Football Stats" status="active" />
                                            <OfferList text="Ad-Free Experience" status="active" />
                                            <OfferList text="Historical Data" status="inactive" />
                                            <OfferList text="Match Replays" status="inactive" />
                                        </PricingBox>

                                        <PricingBox
                                            packageName="Plus"
                                            price={isMonthly ? "199" : "2199"}
                                            duration={isMonthly ? "mo" : "yr"}
                                            subtitle="Experience the ultimate with our Plus plan."
                                            type="plus"
                                            isSubmitting={isSubmitting}
                                            formRef={formRef}
                                        >
                                            <OfferList text="Access To All Tournaments" status="active" />
                                            <OfferList text="Full Team Management" status="active" />
                                            <OfferList text="Full Match Scheduling" status="active" />
                                            <OfferList text="Full Football Stats" status="active" />
                                            <OfferList text="Ad-Free Experience" status="active" />
                                            <OfferList text="Historical Data And Match Replays" status="active" />
                                            <OfferList text="Dedicated Support Line " status="active" />
                                        </PricingBox>
                                    </div>
                                </div>

                                <div className="absolute left-0 bottom-0 z-[-1]">
                                    <svg
                                        width="239"
                                        height="601"
                                        viewBox="0 0 239 601"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <rect
                                            opacity="0.3"
                                            x="-184.451"
                                            y="600.973"
                                            width="196"
                                            height="541.607"
                                            rx="2"
                                            transform="rotate(-128.7 -184.451 600.973)"
                                            fill="url(#paint0_linear_93:235)"
                                        />
                                        <rect
                                            opacity="0.3"
                                            x="-188.201"
                                            y="385.272"
                                            width="59.7544"
                                            height="541.607"
                                            rx="2"
                                            transform="rotate(-128.7 -188.201 385.272)"
                                            fill="url(#paint1_linear_93:235)"
                                        />
                                        <defs>
                                            <linearGradient
                                                id="paint0_linear_93:235"
                                                x1="-90.1184"
                                                y1="420.414"
                                                x2="-90.1184"
                                                y2="1131.65"
                                                gradientUnits="userSpaceOnUse"
                                            >
                                                <stop stopColor="#4A6CF7"/>
                                                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0"/>
                                            </linearGradient>
                                            <linearGradient
                                                id="paint1_linear_93:235"
                                                x1="-159.441"
                                                y1="204.714"
                                                x2="-159.441"
                                                y2="915.952"
                                                gradientUnits="userSpaceOnUse"
                                            >
                                                <stop stopColor="#4A6CF7"/>
                                                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0"/>
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>
                            </section>

                        </motion.div>
                    )}
                    <div className='flex justify-around'>
                        <button
                            type='button'
                            onClick={prev}
                            disabled={currentStep === 0}
                            className='rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50'
                        >
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 24 24'
                                strokeWidth='1.5'
                                stroke='currentColor'
                                className='h-6 w-6'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    d='M15.75 19.5L8.25 12l7.5-7.5'
                                />
                            </svg>
                        </button>
                        <button
                            type='button'
                            onClick={next}
                            disabled={currentStep === steps.length - 1}
                            className='rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50'
                        >
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 24 24'
                                strokeWidth='1.5'
                                stroke='currentColor'
                                className='h-6 w-6'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    d='M8.25 4.5l7.5 7.5-7.5 7.5'
                                />
                            </svg>
                        </button>
                    </div>
                    {errors.root && (
                        <div className="flex mb-4">
                            {errors.root.message}
                        </div>
                    )}
                </form>
            </section>

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
        </>
    )


}