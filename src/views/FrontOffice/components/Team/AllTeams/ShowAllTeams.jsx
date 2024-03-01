import {useEffect, useState} from "react";
import {getAllTeams} from "../../../../../Services/FrontOffice/apiTeam.js";
import TeamsCard from "./TeamsCard.jsx";
import SectionTitle from "../../../HomePage/components/Common/SectionTitle.jsx";
import {jwtDecode} from "jwt-decode";
import {getUserData} from "../../../../../Services/apiUser.js";


export default function ShowAllTeams() {
    const [teams, setTeams] = useState([]);
    const [user, setUser] = useState([]);

    useEffect(() => {
        let decodedToken = jwtDecode(localStorage.getItem('token'));
        getUserData(decodedToken.userId).then((response) => {
            setUser(response.user);
        })

        getAllTeams().then((response) => {
            setTeams(response.teams);
        })



    }, [])


    return (
        <>
        {!teams ? <h1>Loading...</h1> :
            <>
                <section id="blog" className="bg-primary/5 py-16 md:py-20 lg:py-28">
                    <div className="container">
                        <SectionTitle
                            title="Disvover All Teams"
                            paragraph="Explore the wide range of teams participating in our tournaments. Get to know their history, achievements, and more."
                            center
                        />

                        <div
                            className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 md:gap-x-6 lg:gap-x-8 xl:grid-cols-3">
                            {teams.map((team, index) => {
                                return (
                                    <TeamsCard key={index} team={team} user={user}/>
                                )
                            })
                            }
                        </div>
                    </div>
                </section>

            </>
        }
        </>
    )
}