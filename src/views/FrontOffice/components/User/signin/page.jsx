import React, { useState } from "react";
import { signin,getUserByEmail ,verifyTwoFactorAuth} from "../../../../../Services/apiUser"; // Import the signin function
import { Link, useNavigate } from "react-router-dom";
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { GoogleLogin } from '@react-oauth/google';
import { googleAuth }  from "../../../../../Services/apiUser";
import TwoFASettings from "./TwoFASettings"
const SigninSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
});



function SigninPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
   
    // Supprime l'erreur spécifique pour le champ qui vient d'être modifié
    const newErrors = { ...errors };
    delete newErrors[name];
    setErrors(newErrors);
  };

  /*const handleSignin = async (e) => {
    e.preventDefault();
    try {
      await schema.validate(User, { abortEarly: false });
      setErrors({}); // Réinitialiser les erreurs
      const userData = { email, password };
      const response = await signin(userData);

      
     
      if (response.token) {
       
        localStorage.setItem('token', response.token);


        
        if (response.user.role === 'A') {
        
          navigate('/backoffice', { replace: true });
        } else if (response.user.role !== 'A') {
          navigate('/profile');

        if (response.user.role === "A") {
          navigate("/backoffice", { replace: true });
          window.location.reload();
        } else if (response.user.role !== "A") {
          navigate("/profile");


          //console.log(localStorage);
        }
      } else {
        
        setErro
        r("Token not found");
      } }
    

    } catch (error) {
      // Si `error.response` et `error.response.data` existent, alors utiliser le message d'erreur de l'API
      const errorMessage = error.response?.data?.error;

      // Afficher l'alerte spécifique si le compte est bloqué
      if (errorMessage === "Votre compte est bloqué") {
        Swal.fire({
          icon: "error",
          title: "Compte Bloqué",
          text: "Votre compte est bloqué. Veuillez contacter le support pour plus d'informations.",


        });
      } else {
        // Gérer d'autres types d'erreurs ici
        Swal.fire({
          icon: 'error',
          title: 'Sorry!',
          text: errorMessage || 'This Account is banned',
        });
      }
  


          
      }


      // Logger l'erreur pour le débogage
      console.error("Sign-in error:", errorMessage);
    }*/

    //////////////////////

    /*const handleSignin = async (e) => {
      e.preventDefault();
      const userData = { email, password };
      
  
      try {
        // Valide les champs du formulaire en utilisant le schéma Yup
        await SigninSchema.validate(userData, { abortEarly: false });
        setErrors({}); // Réinitialiser les erreurs si la validation est réussie

        // Vérifie si l'utilisateur existe avant de tenter la connexion
        const userExists = await getUserByEmail(email);
        if (!userExists) {
          // Ici, plutôt que de lancer une erreur, on pourrait directement définir le message d'erreur
          setErrors({ email: "Email does not exist" });
          return; // Stoppe l'exécution de la fonction ici
        }

        // Tentative de connexion
        const response = await signin(userData);
      

        if (response.token) {
          const userDetailsResponse = await getUserByEmail(email);
          console.log(userDetailsResponse.user);
          localStorage.setItem("token", response.token);
          if (response.user.role === "A") {
            navigate("/backoffice", { replace: true });
            window.location.reload();
          } else if(response.user.role === "TM" && !userDetailsResponse.user.PlayingFor ){
            console.log(userDetailsResponse.user.PlayingFor);
           
            navigate("/team/add");
            
          }else{
            navigate("/");
            window.location.reload();
          }
        } else {
          throw new Error("Token not found");
        }

      } catch (error) {
        // Handle Yup validation errors
        if (error instanceof Yup.ValidationError) {
          const newErrors = error.inner.reduce((acc, cur) => ({ ...acc, [cur.path]: cur.message }), {});
          setErrors(newErrors);
        } else if (error && error.error) {
          // Handle API errors based on the error message from backend
          Swal.fire({
            icon: 'error',
            title: 'Sorry',
            text: error.error,
          });
        } else {
          // Handle other kinds of errors (network error, etc.)
          Swal.fire({
            icon: 'error',
            title: 'Sorry',
            text: 'An unexpected error occurred.',
          });
        }
        console.error("Sign-in error:", error.message || error);
      }
    };*/


  
  
  
  
    
      const handleSignin = async (e) => {
        e.preventDefault();
        try {
          const userData = { email, password };
          await SigninSchema.validate(userData, { abortEarly: false });
          const userDetailsResponse = await getUserByEmail(email);
          const userExists = await getUserByEmail(email);
          if (!userExists) {
            // Ici, plutôt que de lancer une erreur, on pourrait directement définir le message d'erreur
            setErrors({ email: "Email does not exist" });
            return; // Stoppe l'exécution de la fonction ici
          }
          const response = await signin(userData);
          console.log(response);
         

          if (response.blocked) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: message || 'Account blocked.'
            });
            return;
          }
    
          localStorage.setItem('userInfo', JSON.stringify(response));
    
          // Check 2FA status and redirect accordingly
          if (!response.twoFactorRequired) {
            navigate('/qrcode'); // Redirect to 2FA setup page
          } else {
            // Redirect based on role after 2FA has been verified
            if (role === "A") {
              navigate("/backoffice", { replace: true });
            } else if (response.user.role === "TM" && !userDetailsResponse.user.PlayingFor) {
              navigate("/team/add");
            } else {
              navigate("/");
            }
          }
        } catch (error) {
          handleSignInErrors(error);
        }
      };
    
     /* const handleSignInErrors = (error) => {
        if (error instanceof Yup.ValidationError) {
          const newErrors = error.inner.reduce((acc, cur) => ({ ...acc, [cur.path]: cur.message }), {});
          setErrors(newErrors);
        } else if (error.response) {
          const message = error.response.data.message.toLowerCase();
          if (error.response.status === 401 || message.includes("invalid credentials")) {
            toast.error('Invalid email or password.');
          } else {
            toast.error(message || 'Login failed. Please try again.');
          }
        } else {
          toast.error('An unexpected error occurred. Please try again.');
        }
      };*/

      const handleSignInErrors = (error) => {
        if (error instanceof Yup.ValidationError) {
          const newErrors = error.inner.reduce((acc, cur) => ({ ...acc, [cur.path]: cur.message }), {});
          setErrors(newErrors);
        } else if (error.response) {
          const message = error.response.data.message.toLowerCase();
          if (error.response.status === 401 ) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Invalid email or password.'
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: message || 'Login failed. Please try again.'
            });
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An unexpected error occurred. Please try again.'
          });
        }
      };
      
    

  /*const navigateBasedOnRole = (role) => {
    if (role === "A") {
      navigate("/backoffice", { replace: true });
    } else if (role === "TM") {
      navigate("/team/add");
    } else {
      navigate("/");
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

    
    


  

  return (
    <>
      <section className="relative z-10 overflow-hidden pt-36 pb-16 md:pb-20 lg:pt-[180px] lg:pb-28">
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div className="mx-auto max-w-[500px] rounded-md bg-primary bg-opacity-5 py-10 px-6 dark:bg-dark sm:p-[60px]">
                <h3 className="mb-3 text-center text-2xl font-bold text-black dark:text-white sm:text-3xl">
                  Sign in to your account
                </h3>
                <p className="mb-11 text-center text-base font-medium text-body-color">
                  Login to your account for a faster checkout.
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
                <div className="mb-8 flex items-center justify-center">
                  <span className="hidden h-[1px] w-full max-w-[70px] bg-body-color sm:block"></span>
                  <p className="w-full px-5 text-center text-base font-medium text-body-color">
                    Or, sign in with your email
                  </p>
                  <span className="hidden h-[1px] w-full max-w-[70px] bg-body-color sm:block"></span>
                </div>
                <form>
                  <div className="mb-8">
                    <label
                      htmlFor="email"
                      className="mb-3 block text-sm font-medium text-dark dark:text-white"
                    >
                      Your Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your Email"
                      className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}

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
                      Your Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      placeholder="Enter your Password"
                      className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                     {errors.password&& (
          <p className="text-red-500 text-sm mt-2">{errors.password}</p>
        )}
                  </div>
                  <div className="mb-8 flex flex-col justify-between sm:flex-row sm:items-center">

                  <div>
  <Link
    to="/forgotPassword"
    className="text-sm font-medium text-primary hover:underline"
  >
    Forgot Password?
  </Link>
</div>
                  </div>
                  <div className="mb-6">
                    <button
                      className="flex w-full items-center justify-center rounded-md bg-primary py-4 px-9 text-base font-medium text-white transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp"
                      onClick={handleSignin}
                    >
                      Sign in
                    </button>
                  </div>
                </form>
                <p className="text-center text-base font-medium text-body-color">
                  Don’t you have an account?
                  <a href="/signup" className="text-primary hover:underline">
                    Sign up
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 left-0 z-[-1]">
          <svg
            width="1440"
            height="969"
            viewBox="0 0 1440 969"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <mask
              id="mask0_95:1005"
              style={{ maskType: "alpha" }}
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="1440"
              height="969"
            >
              <rect width="1440" height="969" fill="#090E34" />
            </mask>
            <g mask="url(#mask0_95:1005)">
              <path
                opacity="0.1"
                d="M1086.96 297.978L632.959 554.978L935.625 535.926L1086.96 297.978Z"
                fill="url(#paint0_linear_95:1005)"
              />
              <path
                opacity="0.1"
                d="M1324.5 755.5L1450 687V886.5L1324.5 967.5L-10 288L1324.5 755.5Z"
                fill="url(#paint1_linear_95:1005)"
              />
            </g>
            <defs>
              <linearGradient
                id="paint0_linear_95:1005"
                x1="1178.4"
                y1="151.853"
                x2="780.959"
                y2="453.581"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_95:1005"
                x1="160.5"
                y1="220"
                x2="1099.45"
                y2="1192.04"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </section>
    </>
  );

};

export default SigninPage;
