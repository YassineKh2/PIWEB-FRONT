import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom";
import './index.css'
import {PrimeReactProvider} from 'primereact/api';
import Tailwind from 'primereact/passthrough/tailwind';
import { GoogleOAuthProvider } from '@react-oauth/google';
ReactDOM.createRoot(document.getElementById('root')).render(


    
        <BrowserRouter>
            <PrimeReactProvider value={{ unstyled: true, pt: Tailwind }}>
            <GoogleOAuthProvider clientId="555697194556-cn6eo2qkn3p84fjfmnkvoa83ipi27me1.apps.googleusercontent.com">
                <App/>
                </GoogleOAuthProvider>
            </PrimeReactProvider>
        </BrowserRouter>
    
)
