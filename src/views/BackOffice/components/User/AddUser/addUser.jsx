import { useState, useEffect } from "react";
import { addAdmin } from "../../../../../Services/apiUser";
import { useNavigate } from "react-router-dom";

function AddAdmin() {
const navigate = useNavigate();

  const [User, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    birthDate: '',
    cin: '',
});

  const handleChange = (e) => {
    setUser({ ...User, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Appel de la fonction signup du service avec les données utilisateur
      await addAdmin(User);
      console.log("Utilisateur inscrit avec succès");
      // Réinitialiser les champs du formulaire après la soumission réussie
      setUser({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        birthDate: '',
        cin: '',
      });
      // Redirection vers une autre page après l'inscription réussie
      navigate('.');
    } catch (error) {
      console.error("Erreur lors de l'inscription de l'utilisateur :", error);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center h-screen mt-16">
        <div className="w-full px-4 lg:w-8/12 xl:w-6/12">
          <div className="wow fadeInUp relative z-10 rounded-md bg-primary/[3%] p-8 dark:bg-primary/10 sm:p-11 lg:p-8 xl:p-11" data-wow-delay=".2s" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
            <h3 className="mb-4 text-2xl font-bold leading-tight text-black dark:text-white"> Create Admin</h3>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="flex mb-4 w-full">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={User.firstName}
                  onChange={handleChange}
                  className="mr-2 w-1/2 rounded-md border border-body-color border-opacity-10 py-3 px-6 text-base font-medium text-body-color placeholder-body-color outline-none focus:border-primary focus:border-opacity-100 focus-visible:shadow-none dark:border-white dark:border-opacity-10 dark:bg-[#242B51] focus:dark:border-opacity-50 mb-4"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={User.lastName}
                  onChange={handleChange}
                  className="w-1/2 rounded-md border border-body-color border-opacity-10 py-3 px-6 text-base font-medium text-body-color placeholder-body-color outline-none focus:border-primary focus:border-opacity-100 focus-visible:shadow-none dark:border-white dark:border-opacity-10 dark:bg-[#242B51] focus:dark:border-opacity-50 mb-4"
                />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={User.email}
                onChange={handleChange}
                className="mb-4 w-full rounded-md border border-body-color border-opacity-10 py-3 px-6 text-base font-medium text-body-color placeholder-body-color outline-none focus:border-primary focus:border-opacity-100 focus-visible:shadow-none dark:border-white dark:border-opacity-10 dark:bg-[#242B51] focus:dark:border-opacity-50"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={User.password}
                onChange={handleChange}
                className="mb-4 w-full rounded-md border border-body-color border-opacity-10 py-3 px-6 text-base font-medium text-body-color placeholder-body-color outline-none focus:border-primary focus:border-opacity-100 focus-visible:shadow-none dark:border-white dark:border-opacity-10 dark:bg-[#242B51] focus:dark:border-opacity-50"
              />
              <input
                type="date"
                name="birthDate"
                placeholder="Birth Date"
                value={User.birthDate}
                onChange={handleChange}
                className="mb-4 w-full rounded-md border border-body-color border-opacity-10 py-3 px-6 text-base font-medium text-body-color placeholder-body-color outline-none focus:border-primary focus:border-opacity-100 focus-visible:shadow-none dark:border-white dark:border-opacity-10 dark:bg-[#242B51] focus:dark:border-opacity-50"
              />
              <input
                type="number"
                name="cin"
                placeholder="CIN"
                value={User.cin}
                onChange={handleChange}
                className="mb-4 w-full rounded-md border border-body-color border-opacity-10 py-3 px-6 text-base font-medium text-body-color placeholder-body-color outline-none focus:border-primary focus:border-opacity-100 focus-visible:shadow-none dark:border-white dark:border-opacity-10 dark:bg-[#242B51] focus:dark:border-opacity-50"
              />
              <input
                type="submit"
                value="Sign up"
                className="duration-80 mb-4 w-full cursor-pointer rounded-md border border-transparent bg-primary py-3 px-6 text-center text-base font-medium text-white outline-none transition ease-in-out hover:bg-opacity-80 hover:shadow-signUp focus-visible:shadow-none"
              />
            </form>
            
          </div>
        </div>
      </div>
      <div className="absolute top-0 left-0 z-[-1]">
        <svg
          width="370"
          height="596"
          viewBox="0 0 370 596"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Les définitions SVG */}
        </svg>
      </div>
    </>
  );
}

export default AddAdmin;