import { useEffect, useState } from "react";
import {
 
  getAllStadiums,
} from "../../../../../Services/FrontOffice/apiStadium";
import { Link, useNavigate } from "react-router-dom";

function DisplayStadiums() {
  //const path = "http://localhost:3000/public/images/tournaments/";
  const navigate = useNavigate();
  const [Stadiums, setStadiums] = useState([]);

  const [filteredStadiums, setFilteredStadiums] = useState([]);
  // Filter states
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [capacity, setCapacity] = useState(1000);
  const [status, setStatus] = useState({ available: false, notAvailable: false });

  const getStadiums = async () => {
    const res = getAllStadiums()
      .then((res) => {
        setStadiums(res.Stadiums);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getStadiums();
  }, []);
 


  
  return (
    <div className="mt-6 mb-12 ml-10 mr-10 grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 md:gap-x-6 lg:gap-x-8 xl:grid-cols-3">
      {Stadiums.map((stadium) => (
  <div key={stadium._id} className="w-full">
    <div className="wow fadeInUp relative overflow-hidden rounded-md bg-white shadow-one dark:bg-dark">
      <a href="/" className="relative block h-[220px] w-full">
        <span className="absolute top-6 right-6 z-20 inline-flex items-center justify-center rounded-full bg-primary py-2 px-4 text-sm font-semibold capitalize text-white">
          {stadium.name}
        </span>
        <img
          src="https://via.placeholder.com/350" // Replace with actual image source
          alt="Stadium"
          style={{
            maxHeight: "100%",
            width: "100%",
            objectFit: "cover",
          }}
        />
      </a>
      <div className="p-6 sm:p-8 md:py-8 md:px-6 lg:p-8 xl:py-8 xl:px-5 2xl:p-8">
        <h3>
          <a
            href="/"
            className="mb-4 block text-xl font-bold text-black hover:text-primary dark:text-white dark:hover:text-primary sm:text-2xl"
          >
            {stadium.name}
          </a>
        </h3>
        <p className="border-b border-body-color border-opacity-10 pb-6 text-base font-medium text-body-color dark:border-white dark:border-opacity-10">
          <span className="text-dark dark:text-black">Location:</span>&nbsp;{stadium.address && stadium.address.city}, {stadium.address && stadium.address.state}, {stadium.address && stadium.address.country}&nbsp;&nbsp;&nbsp;
          <span className="text-dark dark:text-black">Description:</span>&nbsp;{stadium.description}
        </p>
        <p className="mt-4 mb-6 border-b border-body-color border-opacity-10 pb-6 text-base font-medium text-body-color dark:border-white dark:border-opacity-10">
          <span className="text-dark dark:text-black">Capacity:</span>&nbsp;{stadium.capacity}
        </p>
        <p className="mt-4 mb-6 border-b border-body-color border-opacity-10 pb-6 text-base font-medium text-body-color dark:border-white dark:border-opacity-10">
          <span className="text-dark dark:text-black">Status:</span>&nbsp;{stadium.status}
        </p>
      </div>
      <div className="flex flex-wrap justify-center md:justify-start">
       {/* <button
          onClick={() => navigate(`/stadium/details/${stadium._id}`)}
          className="mb-4 -mt-4 mr-2 ease-in-up rounded-full bg-primary py-2 px-6 text-sm font-bold text-white transition duration-300 hover:bg-opacity-90 hover:shadow-signUp md:block md:px-8 lg:px-3 xl:px-8"
        >
          Details
        </button>*/}
      </div>
    </div>
  </div>
))}
    </div>
  );
}

export default DisplayStadiums;


  
