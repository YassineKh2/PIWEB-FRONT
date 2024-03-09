import {jwtDecode} from 'jwt-decode';
import {useEffect, useState} from "react";
import {getTeamByUser} from "../../../../../../Services/FrontOffice/apiTeam.js";

export default function TeamDetails() {
    const backPath = "http://localhost:3000/public/images/teams"
    const [team,setTeam] = useState();



    const userToken = localStorage.getItem('token');
    const decodedToken = jwtDecode(userToken);

    useEffect(() => {
        getTeamByUser(decodedToken.userId).then((response)=>
        {
            setTeam(response.team[0])
        })

    },[])




    return (
       <>
           <div className="bg-white max-w-2xl shadow overflow-hidden sm:rounded-lg dark:bg-neutral-800">
               <div className="px-4 py-5 sm:px-6">
                   <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                       Team Information
                   </h3>
                   <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                      Here is the information about your team
                   </p>
               </div>
               <div className="border-t border-gray-200">
                   <dl>
                       <div
                           className="dark:bg-neutral-700 bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                           <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">
                               Team Name
                           </dt>

                           <dd className=" gap-6 mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 dark:text-white">

                               {team?.name} <text className="font-semibold">( {team?.nameAbbreviation} )</text>

                           </dd>


                       </div>
                       <div
                           className="dark:bg-neutral-700 bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                       <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">
                              Image
                           </dt>

                           <img src={backPath + "/1709157981435-20230717_034432.jpg"} alt="team image"
                                className="w-2/3"/>

                       </div>
                       <div
                           className="dark:bg-neutral-700 bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                           <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">
                               Total Goals
                           </dt>
                           <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 dark:text-white">
                               940
                           </dd>
                       </div>
                       <div
                           className="dark:bg-neutral-700 bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                           <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">
                               Total Wins
                           </dt>
                           <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 dark:text-white">
                               {team?.wins}
                           </dd>
                       </div>
                       <div
                           className="dark:bg-neutral-700 bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                           <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">
                               Ranking
                           </dt>
                           <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 dark:text-white">
                               {team?.ranking}
                           </dd>
                       </div>

                   </dl>
               </div>
           </div>

       </>
    )
}