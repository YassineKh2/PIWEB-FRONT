import React, { useEffect, useState } from "react";
import { addSponsors } from "../../../../Services/FrontOffice/apiSponsors";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import * as yup from 'yup';

function AddSponsors() {
  const navigate = useNavigate();
  const [logo, setLogo] = useState(null);
  const [sponsor, setSponsor] = useState({
    name: "",
    description: "",
    logo: "",
    contact: "",
    adresse: ""
  });
  const [errors, setErrors] = useState({
    name: "",
    description: "",
    contact: "",
    adresse: ""
  });
  const [showForm, setShowForm] = useState(false); 

  const schema = yup.object().shape({
    name: yup.string().required("Name is required").matches(/^[A-Za-z]+$/, "Name must contain only letters"),
    description: yup.string().required("Description is required"),
    contact: yup.number().required("Contact is required").typeError("Contact must be a number").test('len', 'Contact must be exactly 8 digits', val => String(val).length === 8),
    adresse: yup.string().required("Adresse is required")
  });

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setSponsor({ ...sponsor, [name]: value });
    try {
      await yup.reach(schema, name).validate(value);
      setErrors({ ...errors, [name]: "" });
    } catch (error) {
      setErrors({ ...errors, [name]: error.message });
    }
  };

  const handleLogoChange = (e) => {
    setLogo(e.target.files[0]);
  };

  const add = async (e) => {
    e.preventDefault();
    try {
      await schema.validate(sponsor, { abortEarly: false });
      const res = await addSponsors(sponsor);
      console.log("Sponsor added successfully");
      // Display confirmation popup
      Swal.fire({
        title: 'Thank You!',
        text: 'The sponsor has been added successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    } catch (error) {
      console.error("Error adding sponsor:", error);
      // Affichage des erreurs de validation
      const errorMessage = error.errors.join("<br>");
      Swal.fire({
        title: 'Validation Error',
        html: errorMessage,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen mt-16">
      <div className="w-full px-4 lg:w-8/12 xl:w-6/12">
        <div className="wow fadeInUp relative z-10 rounded-md bg-primary/[3%] p-8 dark:bg-primary/10 sm:p-11 lg:p-8 xl:p-11" data-wow-delay=".2s">
          <h3 className="mb-4 text-2xl font-bold leading-tight text-black dark:text-white font-serif">
            Add Sponsor
          </h3>
          <div className="flex items-center">
  <p className="mr-4 text-blue-500 font-bold">Do you have a sponsor to add?</p>
  <div className="flex items-center">
    <input type="radio" id="yes" name="sponsorOption" value="yes" onClick={() => setShowForm(true)} />
    <label htmlFor="yes" className="mr-2">Yes</label>
    <input type="radio" id="no" name="sponsorOption" value="no" onClick={() => setShowForm(false)} />
    <label htmlFor="no" className="mr-4">No</label>
  </div>
</div>


          {showForm && (
            <form>
            <div className="mb-4">
              <label htmlFor="name" className="text-body-color block mb-1 font-serif">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={sponsor.name}
                onChange={(e) => handleChange(e)}
                className="w-full rounded-md border border-body-color border-opacity-10 py-3 px-6 text-base font-medium text-body-color placeholder-body-color outline-none focus:border-primary focus:border-opacity-100 focus-visible:shadow-none dark:border-white dark:border-opacity-10 dark:bg-[#242B51] focus:dark:border-opacity-50"
              />
              {errors.name && <div className="text-red-500">{errors.name}</div>}
            </div>
       
            <div className="mb-4">
              <label htmlFor="description" className="text-body-color block mb-1 font-serif">Description:</label>
              <textarea
                id="description"
                name="description"
                value={sponsor.description}
                onChange={(e) => handleChange(e)}
                className="w-full rounded-md border border-body-color border-opacity-10 py-3 px-6 text-base font-medium text-body-color placeholder-body-color outline-none focus:border-primary focus:border-opacity-100 focus-visible:shadow-none dark:border-white dark:border-opacity-10 dark:bg-[#242B51] focus:dark:border-opacity-50"
              />
              {errors.description && <div className="text-red-500">{errors.description}</div>}
            </div>
            <div className="mb-4">
              <label htmlFor="logo" className="text-body-color block mb-1 font-serif">Logo:</label>
              <input
                type="file"
                name="logo"
                accept="logo/*"
                onChange={(e) => handleLogoChange(e)}
                className="mb-4 w-full rounded-md border border-body-color border-opacity-10 py-3 px-6 text-base font-medium text-body-color placeholder-body-color outline-none focus:border-primary focus:border-opacity-100 focus-visible:shadow-none dark:border-white dark:border-opacity-10 dark:bg-[#242B51] focus:dark:border-opacity-50" // Added mb-4 for margin-bottom
              />
              {errors.logo && <div className="text-red-500">{errors.logo}</div>}
            </div>
            <div className="mb-4">
              <label htmlFor="contact" className="text-body-color block mb-1 font-serif">Contact:</label>
              <input
                type="text"
                id="contact"
                name="contact"
                value={sponsor.contact}
                onChange={(e) => handleChange(e)}
                className="w-full rounded-md border border-body-color border-opacity-10 py-3 px-6 text-base font-medium text-body-color placeholder-body-color outline-none focus:border-primary focus:border-opacity-100 focus-visible:shadow-none dark:border-white dark:border-opacity-10 dark:bg-[#242B51] focus:dark:border-opacity-50"
              />
              {errors.contact && <div className="text-red-500">{errors.contact}</div>}
            </div>
            <div className="mb-4">
              <label htmlFor="adresse" className="text-body-color block mb-1 font-serif">Adresse:</label>
              <input
                type="text"
                id="adresse"
                name="adresse"
                value={sponsor.adresse}
                onChange={(e) => handleChange(e)}
                className="w-full rounded-md border border-body-color border-opacity-10 py-3 px-6 text-base font-medium text-body-color placeholder-body-color outline-none focus:border-primary focus:border-opacity-100 focus-visible:shadow-none dark:border-white dark:border-opacity-10 dark:bg-[#242B51] focus:dark:border-opacity-50"
              />
              {errors.adresse && <div className="text-red-500">{errors.adresse}</div>}
            </div>
            <div className="flex justify-center">
              <input
                type="submit"
                value="Confirm"
                onClick={(e) => {
                  e.preventDefault();
                  // Display confirmation popup with SweetAlert
                  Swal.fire({
                    title: 'Do you really want to confirm adding this sponsor?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Confirm',
                    cancelButtonText: 'Cancel'
                  }).then((result) => {
                    if (result.isConfirmed) {
                      add(e);
                    }
                  });
                }}
                className="duration-80 cursor-pointer rounded-md border border-transparent bg-primary py-2 px-4 sm:py-3 sm:px-6 text-center text-base font-medium text-white outline-none transition ease-in-out hover:bg-opacity-80 hover:shadow-signUp focus-visible:shadow-none"
              />
            </div>
          </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddSponsors;
