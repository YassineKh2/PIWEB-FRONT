
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import Swal from "sweetalert2";
import { addTRM } from "../../../../../Services/apiUser";// Assurez-vous que le chemin d'importation est correct
import { isDragActive } from "framer-motion";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


import * as yup from "yup";

const schema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Must be a valid email address").required("Email is required"),
  password: yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
  birthDate: yup.date().typeError("Birth date must be a valid date").required("Birth date is required"),
  cin: yup.string().required("CIN is required"),
  certificate: yup.mixed().required("Certificate is required"),
});

function SignupPage() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [User, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        birthDate: '',
        cin: '',
    });
    const [certificate, setCertificate] = useState(null);
    const [errors, setErrors] = useState({});
  /*  const handleChange = (e) => {
        setUser({ ...User, [e.target.name]: e.target.value });
    };*/

    const handleChange = (e) => {
      setUser({ ...User, [e.target.name]: e.target.value });
      if (errors[e.target.name]) {
        const newErrors = {...errors};
        delete newErrors[e.target.name];
        setErrors(newErrors);
      }
    };

    const { getRootProps, getInputProps } = useDropzone({
        accept: 'application/pdf,image/*',
        onDrop: acceptedFiles => setCertificate(acceptedFiles[0]),
    });

    /*const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (currentStep === 0) {
            setCurrentStep(1); // Avance à l'étape du dropzone pour le certificat
        } else {
          try {
            const formData = new FormData();
            Object.entries(User).forEach(([key, value]) => formData.append(key, value));
            if (certificate) formData.append("certificate", certificate, certificate.name);
            
            await addTRM(formData);
            Swal.fire('Success!', 'Your account has been created successfully.', 'success');
            
            navigate('/signin');
        } catch (error) {
            console.error("Error during registration:", error); // Log the error for debugging
            Swal.fire('Error!', 'There was a problem with your registration. Please try again later.', 'error');
        }
        }
    };*/
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      // Tentative de validation des champs pour la première étape
      if (currentStep === 0) {
          try {
              // Valide uniquement les champs nécessaires pour la première étape
              await schema.pick(['firstName', 'lastName', 'email', 'password', 'birthDate', 'cin']).validate(User, {abortEarly: false});
              // Si la validation réussit, passez à l'étape suivante et réinitialisez les erreurs
              setCurrentStep(1);
              setErrors({});
          } catch (error) {
              if (error instanceof yup.ValidationError) {
                  // Transforme les erreurs de validation en un objet pour l'affichage
                  const newErrors = error.inner.reduce((acc, cur) => ({...acc, [cur.path]: cur.message}), {});
                  setErrors(newErrors);
              } else {
                  console.error("Error during validation:", error);
              }
          }
      } else if (currentStep === 1) {
          // Validation et soumission pour la deuxième étape (incluant le certificat)
          try {
              // Valide l'ensemble du formulaire y compris le certificat
              await schema.validate({...User, certificate: certificate ? 'present' : undefined}, {abortEarly: false});
              // Si la validation réussit, procéder à la soumission
              const formData = new FormData();
              Object.entries(User).forEach(([key, value]) => formData.append(key, value));
              if (certificate) formData.append("certificate", certificate, certificate.name);
  
              const response = await addTRM(formData);
              Swal.fire('Success!', 'Your account has been created successfully.', 'success');
              navigate('/signin');
              setErrors({}); // Réinitialisation des erreurs après la soumission réussie
          } catch (error) {
              if (error instanceof yup.ValidationError) {
                  // Gestion des erreurs de validation spécifiques à cette étape
                  const newErrors = error.inner.reduce((acc, cur) => ({...acc, [cur.path]: cur.message}), {});
                  setErrors(newErrors);
              } else {
                  console.error("Error during submission:", error);
                  Swal.fire('Error!', 'There was a problem with your registration. Please try again later.', 'error');
              }
          }
      }
  };
  
    

    return (
      <>
          <section className="relative z-10 overflow-hidden pt-36 pb-16 md:pb-20 lg:pt-[180px] lg:pb-28">
              <div className="container">
                  <div className="-mx-4 flex flex-wrap">
                      <div className="w-full px-4">
                          <div className="mx-auto max-w-[500px] rounded-md bg-primary bg-opacity-5 py-10 px-6 dark:bg-dark sm:p-[60px]">
                              <h3 className="mb-3 text-center text-2xl font-bold text-black dark:text-white sm:text-3xl">
                                  {currentStep === 0 ? "Create Your Account" : "Upload Your Certificate"}
                              </h3>
                              <p className="mb-11 text-center text-base font-medium text-body-color">
                                  It’s totally free and super easy.
                              </p>
                              <form onSubmit={handleSubmit}>
                                  {currentStep === 0 ? (
                                      <>
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
                      name="firstName"
                      placeholder="Enter your first name"
                      value={User.firstName}
                      onChange={handleChange}
                      className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
                    />
                     {errors.firstName && (
          <p className="text-red-500 text-sm mt-2">{errors.firstName}</p>
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
                      value={User.lastName}
                      onChange={handleChange}
                      className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
                    />
                     {errors.lastName && (
          <p className="text-red-500 text-sm mt-2">{errors.lastName}</p>
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
                      value={User.email}
                      onChange={handleChange}
                      className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
                    />
                     {errors.email && (
          <p className="text-red-500 text-sm mt-2">{errors.email}</p>
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
                      value={User.password}
                      onChange={handleChange}
                      className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
                    />
                     {errors.password && (
          <p className="text-red-500 text-sm mt-2">{errors.password}</p>
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
                      value={User.birthDate}
                      onChange={handleChange}
                      className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
                    />
                     {errors.birthDate && (
          <p className="text-red-500 text-sm mt-2">{errors.birthDate}</p>
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
                      placeholder="Enter your CIN"
                      value={User.cin}
                      onChange={handleChange}
                      className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
                    />
                     {errors.cin && (
          <p className="text-red-500 text-sm mt-2">{errors.cin}</p>
        )}
                  </div>
                                      </>
                                  ) : (
                                    <div {...getRootProps()} className="dropzone">
  <input {...getInputProps()} />
  {certificate ? (
    <img src={URL.createObjectURL(certificate)} alt="Preview" className="w-full h-64 object-cover rounded-lg" />
  ) : (
    <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 cursor-pointer dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
      <div className="flex flex-col items-center justify-center pt-5 pb-6">
        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M33 18l-9 9-9-9m9 9V6m14 30H6"></path>
        </svg>
        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
          {isDragActive ? "Drop the files here ..." : "Drag 'n' drop some files here, or click to select files"}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">PDFs, JPGs, PNGs accepted</p>
      </div>
    </div>
  )}
   {errors.certificate && (
          <p className="text-red-500 text-sm mt-2">{errors.certificate}</p>
        )}
</div>
                                  )}
                                  <div className="flex justify-between mt-4">
                                      {currentStep > 0 && (
                                           <button type="button" onClick={() => setCurrentStep(0)} className="back-btn "  >
                                           <FontAwesomeIcon icon={faArrowLeft} /> 
                                         </button>
                                      )}
                                      <button 
                      type="submit"
                      className="flex w-50 items-center justify-center rounded-md bg-primary py-4 px-9 text-base font-medium text-white transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp"
                    >
                      {currentStep === 0 ? "Next" : "Sign up"}
                    </button>
                                  </div>
                              </form>
                          </div>
                      </div>
                  </div>
              </div>
          </section>
      </>
  );
}

export default SignupPage;