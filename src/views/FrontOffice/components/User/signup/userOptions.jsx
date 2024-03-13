import { useState } from "react";
import SectionTitle from "../../../HomePage/components/Common/SectionTitle";
import OfferList from "../../../HomePage/components/Pricing/OfferList.jsx";
import PricingBox from "../../../HomePage/components/Pricing/PricingBox2.jsx";
import { useNavigate } from 'react-router-dom';
const Pricing = () => {
  const [isMonthly, setIsMonthly] = useState(true);
  const navigate = useNavigate();
  const handleSignUpTrmClick = () => {
    navigate('/signupTRM');
  };

  const handleSignUpTmClick = () => {
    navigate('/signupTM');
  };
  
  const handleSignUpClick = () => {
    navigate('/signupu');
  };
  return (
    <section id="pricing" className="relative z-10 py-16 md:py-20 lg:py-28">
      <div className="container">
      <SectionTitle
  title="Welcome! Define Your Experience"
  paragraph="To tailor your registration process, please select the type of account that best describes you. Your choice will help us provide a more customized experience."
  center
  width="665px"
/>

       

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          <PricingBox
            packageName="I'm a Tournament Manager"
            subtitle="Optimize and manage your tournaments with ease. Access a suite of tools designed for tournament organizers."
          >
            <div className="mb-8 border-b border-body-color border-opacity-10 pb-8 dark:border-white dark:border-opacity-10">
    <button
      onClick={handleSignUpTrmClick}
      className="flex w-full items-center justify-center rounded-md bg-primary p-3 text-base font-semibold text-white transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp"
    >
      Sign Up Now
    </button>
  </div>
            <OfferList text="Create & Schedule Tournaments" status="active" />
            <OfferList text="Manage Brackets & Leaderboards" status="active" />
            <OfferList text="Automate Participant Notifications" status="active" />
            <OfferList text="Customize Tournament Rules" status="active" />
            <OfferList text="Generate Detailed Reports" status="active" />
            
          </PricingBox>
          <PricingBox
           packageName="I'm a Team Manager"
           subtitle="Organize your team, plan for tournaments, and manage registrations seamlessly. Get access to comprehensive team management tools."
          >
            <div className="mb-8 border-b border-body-color border-opacity-10 pb-8 dark:border-white dark:border-opacity-10">
            <button
      onClick={handleSignUpTmClick}
      className="flex w-full items-center justify-center rounded-md bg-primary p-3 text-base font-semibold text-white transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp"
    >
      Sign Up Now
    </button>
            </div>
            <OfferList text="Team Roster Management" status="active" />
            <OfferList text="Tournament Registration & Planning" status="active" />
            <OfferList text="Scheduling & Communication Tools" status="active" />
            <OfferList text="Dedicated Support for Teams" status="active" />
            <OfferList text="Performance Analytics & Insights" status="active" />
            
          </PricingBox>
          <PricingBox
            packageName="I'm a Simple User"
            subtitle="Join and participate in tournaments with ease. Connect with teams and stay updated on your favorite events."
          >
             <div className="mb-8 border-b border-body-color border-opacity-10 pb-8 dark:border-white dark:border-opacity-10">
    <button
      onClick={handleSignUpClick}
      className="flex w-full items-center justify-center rounded-md bg-primary p-3 text-base font-semibold text-white transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp"
    >
      Sign Up Now
    </button>
  </div>
  <OfferList text="Consult Upcoming Tournaments" status="active" />
<OfferList text="Reserve & Purchase Tickets" status="active" />
<OfferList text="Watch Live Tournament Streams" status="active" />
<OfferList text="Access to Exclusive Content" status="active" />
<OfferList text="Participate in Fan Polls & Surveys" status="active" />
            
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
              <stop stopColor="#4A6CF7" />
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_93:235"
              x1="-159.441"
              y1="204.714"
              x2="-159.441"
              y2="915.952"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" />
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
};

export default Pricing;
