import {useEffect, useState} from "react";

import {getAllTeams} from "../../../../../Services/FrontOffice/apiTeam";


const ConsultTeams = () => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {

    const fetchTeams = async () => {
      const data = await getAllTeams();
      setTeams(data.teams);
    };

    fetchTeams();
  }, []);




  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Teams
      </h4>

      <div className="flex flex-col">
        <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Team Name
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Team Abbreviation
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Founded In
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Wins/Losses/Draws
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Ranking
            </h5>
          </div>
        </div>

        {teams.map((team, key) => (
          <div
            className={`grid grid-cols-3 sm:grid-cols-5 ${
              key === teams.length - 1
                ? ''
                : 'border-b border-stroke dark:border-strokedark'
            }`}
            key={key}
          >
            <div className="flex items-center gap-3 p-2.5 xl:p-5">
              <div className="flex-shrink-0">
                <img src={team.image} alt="Team's Logo"/>
              </div>
              <p className="hidden text-black dark:text-white sm:block">
                {team.name}
              </p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{team.nameAbbreviation}K</p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-meta-3">{team.foundedIn}</p>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-black dark:text-white">{team.wins} / {team.losses} / {team.draws}</p>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-meta-5">{team.ranking}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConsultTeams;
