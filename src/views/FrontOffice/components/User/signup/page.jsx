import { useState, useEffect } from "react";
import { signup } from "../../../../../Services/apiUser";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useGoogleLogin } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { googleAuth }  from "../../../../../Services/apiUser";


const schema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Must be a valid email address").required("Email is required"),
  password: yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
  birthDate: yup.date().typeError("Birth date must be a valid date").required("Birth date is required"),
  cin: yup.string().required("CIN is required"),
 
});
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

const [errors, setErrors] = useState({});

const handleChange = (e) => {
  setUser({ ...User, [e.target.name]: e.target.value });
  if (errors[e.target.name]) {
    const newErrors = {...errors};
    delete newErrors[e.target.name];
    setErrors(newErrors);
  }
};

  /*const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      try {
    
        await schema.pick(['firstName', 'lastName', 'email', 'password', 'birthDate', 'cin']).validate(User, {abortEarly: false});
      
        
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
      navigate('/signin');
    } catch (error) {
      console.error("Erreur lors de l'inscription de l'utilisateur :", error);
    }
  };*/

  /*const handleGoogleSuccess = (credentialResponse) => {
    console.log(credentialResponse);
    // Here you would handle the Google login success scenario
    // For example, you could extract the token and use it to log in to your backend
  };

  // Function to call when Google login fails
  const handleGoogleError = () => {
    console.log('Login Failed');
    // Handle the login failure scenario
  };

  const googleLogin = useGoogleLogin({
    onSuccess: tokenResponse => console.log(tokenResponse),
    onError: () => console.log('Google login failed'),
    // ...additional configuration
  });*/

  /*const handleGoogleSignIn = () => {
    // This function will be triggered when the button is clicked.
    google.accounts.id.prompt((notification) => {
    
  
      
    });
  };*/

 /* function generateRandomString(length) {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }


  const handleGoogleSignIn = async (credentialResponse) => {
    const decodedToken = jwtDecode(credentialResponse.credential);
    const randomDummyPassword = generateRandomString(16); 

    try {
      // Construct user data from the decoded token
      const userData = {
        firstName: decodedToken.given_name,
        lastName: decodedToken.family_name,
        email: decodedToken.email,
        password: randomDummyPassword,  // You might not need a password if signing in via Google
        birthDate: "", // Add if needed and available
        cin: "", // Add if needed and available
      };

      // Check if user exists or register a new user
      const response = await signup(userData);

      // If successful, navigate to the sign-in page or dashboard
      console.log("Google user signed in or registered:", response);
      navigate("/signin"); // or to the dashboard, if already signed in
    } catch (error) {
      console.error("Error handling Google sign in:", error);
      // Handle errors, e.g., show a notification to the user
    }
  };
*/

/*const handleGoogleSignIn = async (response) => {
  try {
    console.log('Réponse complète de Google :', response); // Afficher l'objet response complet
    const { credential } = response;
    if (!credential || !credential.token) {
      console.error('Token non trouvé dans la réponse de Google.');
      return;
    }
    const { token } = credential;
    console.log('Token reçu de Google :', token);
    const authResponse = await googleAuth(token);
    console.log('Authentification Google réussie, réponse du backend :', authResponse);
    localStorage.setItem('token', authResponse.token);
    // Effectuez des actions supplémentaires, comme la redirection ou la mise à jour de l'état du composant
  } catch (error) {
    console.error('Échec de l\'authentification Google :', error);
    console.error('Détails de l\'erreur retournée par googleAuth :', error.response?.data); // Vérifiez si error.response existe avant d'accéder à sa propriété data
  }
};*/

const handleGoogleSignIn = async (response) => {
  try {
    console.log('Réponse complète de Google :', response);
    const { credential } = response;
    if (!credential) {
      console.error('Token non trouvé dans la réponse de Google.');
      return;
    }
    console.log('Token reçu de Google :', credential);

    // Extrait le token de la propriété "credential"
    const token = credential; 
    console.log(token)// Assurez-vous que la propriété contient bien le token

    // Appel de la fonction googleAuth avec le token
    const authResponse = await googleAuth(token);

    if (authResponse && authResponse.user.role === "C") {
      console.log("Redirection vers /profile");
      navigate('/profile');
    }
    // Enregistrement du token dans le local storage
   // localStorage.setItem('token', authResponse.token);

    console.log('Authentification Google réussie, réponse du backend :', authResponse);
    
    // Effectuez des actions supplémentaires, comme la redirection ou la mise à jour de l'état du composant
  } catch (error) {
    console.error('Échec de l\'authentification Google :', error);
    console.error('Détails de l\'erreur retournée par googleAuth :', error.response?.data);
  }
};
// Initialiser la connexion Google
/*const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => console.log('Google login failed'),
    // Autres configurations si nécessaire
});*/
   
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Valider les champs du formulaire avec Yup
      await schema.validate(User, { abortEarly: false });
      setErrors({}); // Réinitialiser les erreurs
  
      // Appel API pour inscription
      const response = await signup(User);
  
      console.log("Utilisateur inscrit avec succès:", response);
      navigate('/signin'); // Redirection après inscription réussie
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        // Gérer les erreurs de validation de Yup
        const newErrors = error.inner.reduce((acc, cur) => ({ ...acc, [cur.path]: cur.message }), {});
        setErrors(newErrors);
      } else if (error.response && error.response.status === 400 && error.response.data.error === "Cet email est déjà utilisé") {
        // Gérer spécifiquement l'erreur d'email déjà utilisé
        setErrors({ ...errors, email: "Cet email est déjà utilisé" });
      } else {
        console.error("Erreur lors de l'inscription de l'utilisateur:", error);
        // Gérer les autres erreurs non prévues
        Swal.fire('Error!', 'There was a problem with your registration. Please try again.', 'error');
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
                  Create your account
                </h3>
                <p className="mb-11 text-center text-base font-medium text-body-color">
                  It’s totally free and super easy
                </p>
                <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <GoogleLogin
        onSuccess={handleGoogleSignIn}
        onFailure={() => {
          console.log('Login Failed');
        }}
        buttonText=""
        render={renderProps => (
          <button onClick={renderProps.onClick} disabled={renderProps.disabled} style={{
            backgroundColor: 'white',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '10px',
            borderRadius: '2px',
            boxShadow: '0 3px 4px 0 rgba(0,0,0,.25)',
            border: 'none',
            cursor: 'pointer',
            outline: 'none',
          }}>
            <div style={{
              marginRight: '10px',
              backgroundColor: 'white',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: '2px',
            }}>
              <img src="your-google-icon.svg" alt="Google sign-in" style={{ width: '18px', height: '18px' }} />
            </div>
            Sign in with Google
          </button>
        )}
      />
    </div>
  
  <br></br>
              
                
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