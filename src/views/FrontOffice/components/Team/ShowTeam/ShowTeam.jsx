import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {getMatchesByTeam, getTeam} from "../../../../../Services/FrontOffice/apiTeam.js";
import classnames from "classnames";
import { useNavigate } from "react-router-dom";


export default function ShowTeam() {
    const path = "http://localhost:3000/public/images/teams/";
    const [team, setTeam] = useState({});
    const {id} = useParams();
    const [matches, setMatches] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        getTeam(id).then((response) => {
            setTeam(response.team)
        })
        getMatchesByTeam(id).then((response) => {
            setMatches(response.matchList)
            console.log(response.matchList)
        });
    }, [])
    const modifierButtonClass = classnames(
        "duration-50",
        "cursor-pointer",
        "rounded-md",
        "border",
        "border-transparent",
        "bg-blue-500",
        "py-1",
        "px-4",
        "sm:py-1",
        "sm:px-2",
        "text-center",
        "text-base",
        "font-smal",
        "text-white",
        "outline-none",
        "transition",
        "ease-in-out",
        "hover:bg-opacity-80",
        "hover:shadow-signUp",
        "focus-visible:shadow-none",
        "absolute", // Position absolue pour le positionnement précis
        "top-44", // Marge en bas de 4 unités
        "right-3", // Ajout de la classe pour aligner à droite
    );
    const handleModifySponsors = () => {
        navigate("/upsp", {
            state: {
                _id: team.sponsors[0]._id,
                name: team.sponsors[0].name,
                description: team.sponsors[0].description,
                contact: team.sponsors[0].contact,
                adresse: team.sponsors[0].adresse
            }
        });
    };
    
      
      
    function transformDate(date) {
        const dateObj = new Date(date);
        const options = {year: 'numeric', month: 'long', day: 'numeric'};
        return dateObj.toLocaleDateString('en-US', options);
    }


    return (
        <div className="w-full py-6 space-y-6 md:py-12 bg-primary/5">
            <div className="container grid max-w-6xl gap-6 px-4 md:px-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">{team.name}</h1>
                    <p className="text-gray-500 dark:text-gray-400">{team?.slogan}</p>
                </div>
                <div className="grid items-start gap-6 lg:grid-cols-[200px,1fr] xl:gap-10">
                    <div className="flex items-start gap-4">
                        <img
                            alt="Team logo"
                            className="rounded-lg  overflow-hidden  object-center w-2/5 md:w-full"
                            src={path + team.image}
                        />
                    </div>
                    <div className="grid gap-4">
                        <div className="grid gap-1">
                            <h2 className="text-2xl font-bold">About</h2>
                            <p className="text-gray-500 md:max-w-prose dark:text-gray-400">
                                {team?.description}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="absolute top-50 right-70" >
                {team?.sponsors && team.sponsors.length > 0 && (
                <div className="grid gap-4">
                    <div className="grid gap-1">
                        <h2 className="text-2xl font-bold">Our Sponsors</h2>
                        {team.sponsors.map((sponsor, index) => (
                            <div key={index} className="flex flex-col gap-2">
                                <h3 className="text-lg font-semibold">{sponsor.name}</h3>
                                <p className="text-gray-500 md:max-w-prose dark:text-gray-400">
                                    Description: {sponsor.description}
                                </p>
                             
                                <p className="text-gray-500 md:max-w-prose dark:text-gray-400">
                                    Contact: {sponsor.contact}
                                </p>
                                <p className="text-gray-500 md:max-w-prose dark:text-gray-400">
                                    Address: {sponsor.adresse}
                                </p>
                            </div>
                        ))}  </div>
                        </div>
                    )}
{team?.sponsors && team.sponsors.length > 0 && (
    <button className={modifierButtonClass} onClick={handleModifySponsors}>Update</button>
)}

 </div>

                <div className="flex flex-wrap items-center justify-between gap-6">
                    <div>
                        <div className="grid gap-1">
                            <h2 className="text-2xl font-bold">Top Players</h2>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="flex items-center gap-4">
                                    <img
                                        alt="Player"
                                        className="rounded-full object-cover object-center"
                                        height="80"
                                        src="https://www.lejdd.fr/lmnr/var/jdd/public/media/image/2023/06/03/19/2023-06-01t120701z_1658076920_rc2xx0afkmhj_rtrmadp_3_soccer-france-psg-messi.jpg?VersionId=ccdteb_6p_PJSRhwBsEpnaP2R4iN27b1"
                                        style={{
                                            aspectRatio: "80/80",
                                            objectFit: "cover",
                                        }}
                                        width="80"
                                    />
                                    <div className="grid gap-1.5">
                                        <h3 className="font-bold">Lionel Messi</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Forward</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <img
                                        alt="Player"
                                        className="rounded-full object-cover object-center"
                                        height="80"
                                        src="data:image/webp;base64,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cC8xLjAvADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+Cjx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iPgoJPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KCQk8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOklwdGM0eG1wQ29yZT0iaHR0cDovL2lwdGMub3JnL3N0ZC9JcHRjNHhtcENvcmUvMS4wL3htbG5zLyIgICB4bWxuczpHZXR0eUltYWdlc0dJRlQ9Imh0dHA6Ly94bXAuZ2V0dHlpbWFnZXMuY29tL2dpZnQvMS4wLyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwbHVzPSJodHRwOi8vbnMudXNlcGx1cy5vcmcvbGRmL3htcC8xLjAvIiAgeG1sbnM6aXB0Y0V4dD0iaHR0cDovL2lwdGMub3JnL3N0ZC9JcHRjNHhtcEV4dC8yMDA4LTAyLTI5LyIgeG1sbnM6eG1wUmlnaHRzPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvcmlnaHRzLyIgZGM6UmlnaHRzPSIyMDIzIFF1YWxpdHkgU3BvcnQgSW1hZ2VzIiBwaG90b3Nob3A6Q3JlZGl0PSJHZXR0eSBJbWFnZXMiIEdldHR5SW1hZ2VzR0lGVDpBc3NldElEPSIxNzQ2MjkyMDgyIiB4bXBSaWdodHM6V2ViU3RhdGVtZW50PSJodHRwczovL3d3dy5nZXR0eWltYWdlcy5jb20vZXVsYT91dG1fbWVkaXVtPW9yZ2FuaWMmYW1wO3V0bV9zb3VyY2U9Z29vZ2xlJmFtcDt1dG1fY2FtcGFpZ249aXB0Y3VybCIgPgo8ZGM6Y3JlYXRvcj48cmRmOlNlcT48cmRmOmxpPlF1YWxpdHkgU3BvcnQgSW1hZ2VzPC9yZGY6bGk+PC9yZGY6U2VxPjwvZGM6Y3JlYXRvcj48ZGM6ZGVzY3JpcHRpb24+PHJkZjpBbHQ+PHJkZjpsaSB4bWw6bGFuZz0ieC1kZWZhdWx0Ij5NQUxBR0EsIFNQQUlOIC0gT0NUT0JFUiAxNDogR2VyYXJkIFBpcXVlLCBwcmVzaWRlbnQgb2YgS2luZ3MgTGVhZ3VlIGxvb2tzIG9uIGR1cmluZyB0aGUgS2luZ3MgQ3VwICZhbXA7IFF1ZWVucyBDdXAgRmluYWxzIGF0IEVzdGFkaW8gTGEgUm9zYWxlZGEgb24gT2N0b2JlciAxNCwgMjAyMyBpbiBNYWxhZ2EsIFNwYWluLiAoUGhvdG8gYnkgQ3Jpc3RpYW4gVHJ1amlsbG8vUXVhbGl0eSBTcG9ydCBJbWFnZXMvR2V0dHkgSW1hZ2VzKTwvcmRmOmxpPjwvcmRmOkFsdD48L2RjOmRlc2NyaXB0aW9uPgo8cGx1czpMaWNlbnNvcj48cmRmOlNlcT48cmRmOmxpIHJkZjpwYXJzZVR5cGU9J1Jlc291cmNlJz48cGx1czpMaWNlbnNvclVSTD5odHRwczovL3d3dy5nZXR0eWltYWdlcy5jb20vZGV0YWlsLzE3NDYyOTIwODI/dXRtX21lZGl1bT1vcmdhbmljJmFtcDt1dG1fc291cmNlPWdvb2dsZSZhbXA7dXRtX2NhbXBhaWduPWlwdGN1cmw8L3BsdXM6TGljZW5zb3JVUkw+PC9yZGY6bGk+PC9yZGY6U2VxPjwvcGx1czpMaWNlbnNvcj4KCQk8L3JkZjpEZXNjcmlwdGlvbj4KCTwvcmRmOlJERj4KPC94OnhtcG1ldGE+Cjw/eHBhY2tldCBlbmQ9InciPz4K"
                                        style={{
                                            aspectRatio: "80/80",
                                            objectFit: "cover",
                                        }}
                                        width="80"
                                    />
                                    <div className="grid gap-1.5">
                                        <h3 className="font-bold">Gerard Pique</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Defender</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <img
                                        alt="Player"
                                        className="rounded-full object-cover object-center"
                                        height="80"
                                        src="data:image/webp;base64,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ZWFsIEJldGlzIGF0IFNwb3RpZnkgQ2FtcCBOb3Ugb24gQXByaWwgMjksIDIwMjMgaW4gQmFyY2Vsb25hLCBTcGFpbi4gKFBob3RvIGJ5IEFsZXggQ2FwYXJyb3MvR2V0dHkgSW1hZ2VzKTIwMjMgQWxleCBDYXBhcnJvc1hNUCAFBgAAaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/Pgo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIj4KCTxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CgkJPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczpJcHRjNHhtcENvcmU9Imh0dHA6Ly9pcHRjLm9yZy9zdGQvSXB0YzR4bXBDb3JlLzEuMC94bWxucy8iICAgeG1sbnM6R2V0dHlJbWFnZXNHSUZUPSJodHRwOi8veG1wLmdldHR5aW1hZ2VzLmNvbS9naWZ0LzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGx1cz0iaHR0cDovL25zLnVzZXBsdXMub3JnL2xkZi94bXAvMS4wLyIgIHhtbG5zOmlwdGNFeHQ9Imh0dHA6Ly9pcHRjLm9yZy9zdGQvSXB0YzR4bXBFeHQvMjAwOC0wMi0yOS8iIHhtbG5zOnhtcFJpZ2h0cz0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3JpZ2h0cy8iIGRjOlJpZ2h0cz0iMjAyMyBBbGV4IENhcGFycm9zIiBwaG90b3Nob3A6Q3JlZGl0PSJHZXR0eSBJbWFnZXMiIEdldHR5SW1hZ2VzR0lGVDpBc3NldElEPSIxNDg3NDgxNjI2IiB4bXBSaWdodHM6V2ViU3RhdGVtZW50PSJodHRwczovL3d3dy5nZXR0eWltYWdlcy5jb20vZXVsYT91dG1fbWVkaXVtPW9yZ2FuaWMmYW1wO3V0bV9zb3VyY2U9Z29vZ2xlJmFtcDt1dG1fY2FtcGFpZ249aXB0Y3VybCIgPgo8ZGM6Y3JlYXRvcj48cmRmOlNlcT48cmRmOmxpPkFsZXggQ2FwYXJyb3M8L3JkZjpsaT48L3JkZjpTZXE+PC9kYzpjcmVhdG9yPjxkYzpkZXNjcmlwdGlvbj48cmRmOkFsdD48cmRmOmxpIHhtbDpsYW5nPSJ4LWRlZmF1bHQiPkJBUkNFTE9OQSwgU1BBSU4gLSBBUFJJTCAyOTogU2VyZ2lvIEJ1c3F1ZXRzIG9mIEZDIEJhcmNlbG9uYSBsb29rcyBvbiBkdXJpbmcgdGhlIExhTGlnYSBTYW50YW5kZXIgbWF0Y2ggYmV0d2VlbiBGQyBCYXJjZWxvbmEgYW5kIFJlYWwgQmV0aXMgYXQgU3BvdGlmeSBDYW1wIE5vdSBvbiBBcHJpbCAyOSwgMjAyMyBpbiBCYXJjZWxvbmEsIFNwYWluLiAoUGhvdG8gYnkgQWxleCBDYXBhcnJvcy9HZXR0eSBJbWFnZXMpPC9yZGY6bGk+PC9yZGY6QWx0PjwvZGM6ZGVzY3JpcHRpb24+CjxwbHVzOkxpY2Vuc29yPjxyZGY6U2VxPjxyZGY6bGkgcmRmOnBhcnNlVHlwZT0nUmVzb3VyY2UnPjxwbHVzOkxpY2Vuc29yVVJMPmh0dHBzOi8vd3d3LmdldHR5aW1hZ2VzLmNvbS9kZXRhaWwvMTQ4NzQ4MTYyNj91dG1fbWVkaXVtPW9yZ2FuaWMmYW1wO3V0bV9zb3VyY2U9Z29vZ2xlJmFtcDt1dG1fY2FtcGFpZ249aXB0Y3VybDwvcGx1czpMaWNlbnNvclVSTD48L3JkZjpsaT48L3JkZjpTZXE+PC9wbHVzOkxpY2Vuc29yPgoJCTwvcmRmOkRlc2NyaXB0aW9uPgoJPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KPD94cGFja2V0IGVuZD0idyI/PgoA"
                                        style={{
                                            aspectRatio: "80/80",
                                            objectFit: "cover",
                                        }}
                                        width="80"
                                    />
                                    <div className="grid gap-1.5">
                                        <Link to=""><h3 className="font-bold">Sergio Busquets</h3></Link>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Midfielder</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <img
                                        alt="Player"
                                        className="rounded-full object-cover object-center"
                                        height="80"
                                        src="data:image/webp;base64,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"
                                        style={{
                                            aspectRatio: "80/80",
                                            objectFit: "cover",
                                        }}
                                        width="80"
                                    />
                                    <div className="grid gap-1.5">
                                        <h3 className="font-bold">Ansu Fati</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Forward</p>
                                    </div>
                                </div>
                            </div>
                            {/*<Link to="">*/}
                            {/*    <p className="text-white text-center bg-blue-400 rounded-2xl p-2 text-xs w-1/6">See More</p>*/}
                            {/*</Link>*/}
                        </div>
                    </div>
                    <div>
                        <div className="flex flex-col gap-6">
                            <h2 className="text-2xl font-bold">Achievements</h2>
                            <div className="flex flex-col gap-4">

                                <div className="grid grid-cols-2 items-center gap-2">
                                    <p>La Liga: 26 titles</p>
                                </div>
                                {/*<a href="#"*/}
                                {/*   className="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-white hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">*/}
                                {/*    <svg aria-hidden="true" className="h-5" viewBox="0 0 292 292" fill="none"*/}
                                {/*         xmlns="http://www.w3.org/2000/svg">*/}
                                {/*        <path*/}
                                {/*            d="M145.7 291.66C226.146 291.66 291.36 226.446 291.36 146C291.36 65.5541 226.146 0.339844 145.7 0.339844C65.2542 0.339844 0.0400391 65.5541 0.0400391 146C0.0400391 226.446 65.2542 291.66 145.7 291.66Z"*/}
                                {/*            fill="#3259A5"/>*/}
                                {/*        <path*/}
                                {/*            d="M195.94 155.5C191.49 179.08 170.8 196.91 145.93 196.91C117.81 196.91 95.0204 174.12 95.0204 146C95.0204 117.88 117.81 95.0897 145.93 95.0897C170.8 95.0897 191.49 112.93 195.94 136.5H247.31C242.52 84.7197 198.96 44.1797 145.93 44.1797C89.6904 44.1797 44.1104 89.7697 44.1104 146C44.1104 202.24 89.7004 247.82 145.93 247.82C198.96 247.82 242.52 207.28 247.31 155.5H195.94Z"*/}
                                {/*            fill="white"/>*/}
                                {/*    </svg>*/}
                                {/*    <span className="flex-1 ms-3 whitespace-nowrap">Coinbase Wallet</span>*/}
                                {/*</a>*/}
                                <div className="grid grid-cols-2 items-center gap-2">
                                    <p>FIFA Club World Cup: 3 titles</p>
                                </div>
                                <div className="grid grid-cols-2 items-center gap-2">
                                    <p>FIFA Club World Cup: 3 titles</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="flex flex-col gap-6">
                            <h2 className="text-2xl font-bold">Upcoming Matches</h2>
                            <div className="flex flex-col gap-4">
                                {matches.map((match, index) => {
                                    return (
                                        <>
                                            <Link to="" key={index}
                                                  className="flex items-center gap-2 p-3 md:gap-10 text-base font-bold text-gray-900 rounded-lg bg-white hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                                                <span className="flex-1 ms-3 whitespace-nowrap">{match.team1.name}
                                                    <text className="text-xl">&nbsp;vs{' '}&nbsp;</text>
                                                    {match.team2.name}</span>
                                                <p className="text-center text-white bg-blue-400 rounded-2xl p-2 text-xs">{transformDate(match.matchDate)}</p>
                                            </Link>
                                        </>
                                    )
                                })}


                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="flex flex-col gap-6">
                            <h2 className="text-2xl font-bold">Recent Matches</h2>
                            <div className="flex flex-col gap-4">
                                {matches.map((match, index) => {
                                    if(match.team1._id === team._id){
                                        let currentTeam = match.team1;
                                        let enemyTeam = match.team2;
                                    }else{
                                        let currentTeam = match.team2;
                                        let enemyTeam = match.team1;
                                    }

                                    let linkStyle="flex items-center gap-2 p-3 md:gap-10 text-base font-bold text-gray-900 rounded-lg  group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
                                    if (match.scoreTeam1 === 0 || match.scoreTeam2 === 0)
                                        linkStyle += " bg-gray-300 hover:bg-gray-400";
                                    else if(match.team1._id === team._id && match.scoreTeam1 > match.scoreTeam2)
                                        linkStyle += " bg-green-500 hover:bg-green-600 ";
                                    else
                                        linkStyle += " bg-red-400 hover:bg-red-500 ";

                                        return (
                                            <Link to="" key={index} className={linkStyle}>
                                                <span className="flex-1 ms-3 whitespace-nowrap">{match.team1.name}
                                                 <text className="">&nbsp;{match.scoreTeam1} - {match.scoreTeam2}{' '}&nbsp;</text>
                                                 {match.team2.name}</span>
                                                <p className="text-center text-white bg-blue-400 rounded-2xl p-2 text-xs">{match.tournament.name}</p>
                                            </Link>
                                        )
                                })}


                            </div>
                        </div>
                    </div>

                </div>
                <div className="grid gap-1">
                    <h2 className="text-2xl font-bold">Gallery</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        <img
                            alt="Photo"
                            className="rounded-lg object-cover aspect-video overflow-hidden object-center"
                            height="300"
                            src="/placeholder.svg"
                            width="500"
                        />
                        <img
                            alt="Photo"
                            className="rounded-lg object-cover aspect-video overflow-hidden object-center"
                            height="300"
                            src="/placeholder.svg"
                            width="500"
                        />
                        <img
                            alt="Photo"
                            className="rounded-lg object-cover aspect-video overflow-hidden object-center"
                            height="300"
                            src="/placeholder.svg"
                            width="500"
                        />
                        <img
                            alt="Photo"
                            className="rounded-lg object-cover aspect-video overflow-hidden object-center"
                            height="300"
                            src="/placeholder.svg"
                            width="500"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

