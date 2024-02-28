
export default function TeamDetails() {
    const backPath = "http://localhost:3000/public/images/teams"


    return (
       <>
           <div className="bg-white max-w-2xl shadow overflow-hidden sm:rounded-lg dark:bg-neutral-800">
               <div className="px-4 py-5 sm:px-6">
                   <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                       User database
                   </h3>
                   <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                       Details and informations about user.
                   </p>
               </div>
               <div className="border-t border-gray-200">
                   <dl>
                       <div
                           className="dark:bg-neutral-700 bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                           <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">
                               Team Name
                           </dt>

                           <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 dark:text-white">
                               Mickael Poulaz

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
                               67
                           </dd>
                       </div>
                       <div
                           className="dark:bg-neutral-700 bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                           <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">
                               Ranking
                           </dt>
                           <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 dark:text-white">
                               1000
                           </dd>
                       </div>

                   </dl>
               </div>
           </div>

       </>
    )
}