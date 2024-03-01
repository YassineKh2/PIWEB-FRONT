import {Link} from "react-router-dom";
import {FaRegHeart as EmptyHeart} from "react-icons/fa";
import {FaHeart as  FullHeart } from "react-icons/fa";
import {FaHeartBroken as BrokenHeart } from "react-icons/fa";


import {useEffect, useState} from "react";


export default function TeamsCard({team,user}) {
    const path = "http://localhost:3000/public/images/teams/";
    const [followedTeams, setTeams] = useState(user.followedTeams);
    const [liked, setLiked] = useState(false);
    const [isHovered, setIsHovered] = useState(false);


    useEffect(()=>{
        followedTeams.map((follow) => {
                if(follow === team._id)
                {
                    setLiked(true);
                }
            }
        )

    })



    const like = () => {
    followedTeams.push(team._id);
    setLiked(true);

    }


    const unlike = () => {
        followedTeams.pop(team._id);
        setLiked(false);
    }


    return (
        <>

            <div
                className="bg-white dark:bg-gray-200 shadow-2xl dark:shadow-gray-600 rounded-3xl flex flex-col justify-center items-center gap-5 p-4 ">

                {liked ?
                    (isHovered ?
                            <BrokenHeart
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                                size={25}
                                className="text-red-500 self-end mr-4 cursor-pointer transition ease-in-out hover:-translate-y-1 hover:scale-110  duration-130"
                            />
                            :
                            <FullHeart
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                                onClick={unlike}
                                size={25}
                                className="text-red-500 self-end mr-4 cursor-pointer transition ease-in-out duration-500"
                            />
                    )

                  :(isHovered ?
                            <FullHeart
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                                size={25}
                                className="text-red-500 self-end mr-4 cursor-pointer transition ease-in-out hover:-translate-y-1 hover:scale-110  duration-130"
                            />
                            :
                            <EmptyHeart
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                                onClick={like}
                                size={25}
                                className="text-gray-500 self-end mr-4 cursor-pointer transition ease-in-out duration-500"
                            />
                    )
                }


                <Link className="px-10 pt-10" to="/teamDetail">
                    <img src={path + team?.image} alt="team image" className="rounded-xl h-60"/>
                </Link>
                <h2 className="font-semibold dark:text-gray-600">{team?.name}</h2>
                <p className="p-4 dark:text-gray-800">Team Description comes here normally :p</p>
            </div>

        </>
    )
}