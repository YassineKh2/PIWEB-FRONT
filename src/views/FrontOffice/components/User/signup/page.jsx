import { useState, useEffect } from "react";
import { signup } from "../../../../../Services/apiUser";
import { useNavigate } from "react-router-dom";
function SignupPage() {
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
      await signup(User);
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
      navigate('/page_de_redirection');
    } catch (error) {
      console.error("Erreur lors de l'inscription de l'utilisateur :", error);
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
                  Create your account
                </h3>
                <p className="mb-11 text-center text-base font-medium text-body-color">
                  It’s totally free and super easy
                </p>
                <form onSubmit={handleSubmit}>
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
                  </div>
                  <div className="mb-6">
                    <button 
                      type="submit"
                      className="flex w-full items-center justify-center rounded-md bg-primary py-4 px-9 text-base font-medium text-white transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp"
                    >
                      Sign up
                    </button>
                  </div>
                </form>
                <p className="text-center text-base font-medium text-body-color">
                  Already using Startup?
                  <a href="/signin" className="text-primary hover:underline">
                    Sign in
                  </a>
                </p>
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

export default SignupPage;