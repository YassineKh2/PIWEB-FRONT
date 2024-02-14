import { useEffect, useState } from "react";
import { getTournamentDetails } from "../../../../../Services/FrontOffice/apiTournament";
import { useLocation, useNavigate, useParams } from "react-router-dom";

function DisplayAllTournaments() {
  const { id } = useParams();
  const [Tournament, setTournament] = useState({});
  const getTournamentDetail = async () => {
    const res = getTournamentDetails(id)
      .then((res) => {
        setTournament(res.tournaments);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getTournamentDetail();
  }, []);
  return (
    <>
      <p>{Tournament.name}</p>
    </>
  );
}

export default DisplayAllTournaments;
