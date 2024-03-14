import {useEffect, useState} from "react";
import {getTeamDetails} from "../../../../../Services/FrontOffice/apiTeam.js";
import UpdateForm from "./UpdateForm.jsx";

export  default function UpdateTeam() {
    const [team, setTeam] = useState(null);

    useEffect(() => {
        getTeamDetails("65d5c0abec3a57e83b8376e2").then((response) => {
            setTeam(response.team);
        });
    }, []);


    return(
        team ? <UpdateForm team={team} /> : <h1>Loading...</h1>
    )



}