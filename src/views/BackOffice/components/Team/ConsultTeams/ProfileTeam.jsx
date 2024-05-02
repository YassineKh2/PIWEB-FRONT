import Breadcrumb from '../../Breadcrumbs/Breadcrumb.jsx';
import CoverOne from '../../../images/BackOffice//cover/cover-01.png';
import {Link, useParams} from 'react-router-dom';
import {useEffect, useState} from "react";
import {getTeam, getTournaments} from "../../../../../Services/FrontOffice/apiTeam.js";
import {getTeamMembers} from "../../../../../Services/apiUser.js";
import {FaEdit as Edit} from "react-icons/fa";


export default function TeamProfile() {
    const [Team, SetTeam] = useState([])
    const [Members, SetMembers] = useState([])
    const [MembersCopy, SetMembersCopy] = useState([])
    const [searchTerm, setSearchTerm] = useState("");
    const {id} = useParams();

    const [ShowTournamens, SetShowTournamens] = useState(false)
    const [Tournaments, setTournaments] = useState([])
    const [TournamentsCopy, setTournamentsCopy] = useState([])

    const [searchTournamentTerm, setsearchTournamentTerm] = useState("")

    const path = "http://localhost:3000/public/images/teams/";
    const pathPlayer = "http://localhost:3000/public/images/players/";
    const pathStaff = "http://localhost:3000/public/images/staff/";
    const pathTournament = "http://localhost:3000/public/images/tournaments/";

    useEffect(() => {
        getTeam(id).then((res) => {
            SetTeam(res.team)
            let idTournaments = []
            res.team.tournaments.forEach((tournament) => {
                idTournaments.push(tournament.tournament)
            })
            getTournaments(idTournaments).then((res) => {
                setTournaments(res.Tournaments)
                setTournamentsCopy(res.Tournaments)
            })
        })
        getTeamMembers(id).then((res) => {
            SetMembers(res)
            SetMembersCopy(res)
        })


    }, [])

    const positionMapping = {
        "AM": "Attacking Midfielder",
        "CB": "Center Back",
        "CF": "Center Forward",
        "CM": "Central Midfielder",
        "D": "Defender",
        "DM": "Defensive Midfielder",
        "FB": "Full Back",
        "F": "Forward",
        "GK": "Goalkeeper",
        "LM": "Left Midfielder",
        "M": "Midfielder",
        "RM": "Right Midfielder",
        "S": "Striker",
        "SS": "Second Striker",
        "WB": "Wing Back",
        "W": "Winger",

    }
    const staffPositionMapping = {
        "manager": "Manager",
        "assistant_manager": "Assistant Manager",
        "coach": "Coach",
        "goalkeeping_coach": "Goalkeeping Coach",
        "fitness_coach": "Fitness Coach",
        "analyst": "Analyst",
        "scout": "Scout",
        "physiotherapist": "Physiotherapist",
        "doctor": "Team Doctor",
        "nutritionist": "Nutritionist",
        "psychologist": "Sports Psychologist",
        "media_officer": "Media Officer",
        "kit_manager": "Kit Manager"
    };

    const countryMapping = {
        "AF": "Afghanistan",
        "AX": "Åland Islands",
        "AL": "Albania",
        "DZ": "Algeria",
        "AS": "American Samoa",
        "AD": "Andorra",
        "AO": "Angola",
        "AI": "Anguilla",
        "AQ": "Antarctica",
        "AG": "Antigua and Barbuda",
        "AR": "Argentina",
        "AM": "Armenia",
        "AW": "Aruba",
        "AU": "Australia",
        "AT": "Austria",
        "AZ": "Azerbaijan",
        "BS": "Bahamas",
        "BH": "Bahrain",
        "BD": "Bangladesh",
        "BB": "Barbados",
        "BY": "Belarus",
        "BE": "Belgium",
        "BZ": "Belize",
        "BJ": "Benin",
        "BM": "Bermuda",
        "BT": "Bhutan",
        "BO": "Bolivia (Plurinational State of)",
        "BQ": "Bonaire, Sint Eustatius and Saba",
        "BA": "Bosnia and Herzegovina",
        "BW": "Botswana",
        "BV": "Bouvet Island",
        "BR": "Brazil",
        "IO": "British Indian Ocean Territory",
        "BN": "Brunei Darussalam",
        "BG": "Bulgaria",
        "BF": "Burkina Faso",
        "BI": "Burundi",
        "CV": "Cabo Verde",
        "KH": "Cambodia",
        "CM": "Cameroon",
        "CA": "Canada",
        "KY": "Cayman Islands",
        "CF": "Central African Republic",
        "TD": "Chad",
        "CL": "Chile",
        "CN": "China",
        "CX": "Christmas Island",
        "CC": "Cocos (Keeling) Islands",
        "CO": "Colombia",
        "KM": "Comoros",
        "CG": "Congo",
        "CD": "Congo (Democratic Republic of the)",
        "CK": "Cook Islands",
        "CR": "Costa Rica",
        "CI": "Côte d'Ivoire",
        "HR": "Croatia",
        "CU": "Cuba",
        "CW": "Curaçao",
        "CY": "Cyprus",
        "CZ": "Czech Republic",
        "DK": "Denmark",
        "DJ": "Djibouti",
        "DM": "Dominica",
        "DO": "Dominican Republic",
        "EC": "Ecuador",
        "EG": "Egypt",
        "SV": "El Salvador",
        "GQ": "Equatorial Guinea",
        "ER": "Eritrea",
        "EE": "Estonia",
        "SZ": "Eswatini",
        "ET": "Ethiopia",
        "FK": "Falkland Islands (Malvinas)",
        "FO": "Faroe Islands",
        "FJ": "Fiji",
        "FI": "Finland",
        "FR": "France",
        "GF": "French Guiana",
        "PF": "French Polynesia",
        "TF": "French Southern Territories",
        "GA": "Gabon",
        "GM": "Gambia",
        "GE": "Georgia",
        "DE": "Germany",
        "GH": "Ghana",
        "GI": "Gibraltar",
        "GR": "Greece",
        "GL": "Greenland",
        "GD": "Grenada",
        "GP": "Guadeloupe",
        "GU": "Guam",
        "GT": "Guatemala",
        "GG": "Guernsey",
        "GN": "Guinea",
        "GW": "Guinea-Bissau",
        "GY": "Guyana",
        "HT": "Haiti",
        "HM": "Heard Island and McDonald Islands",
        "VA": "Holy See",
        "HN": "Honduras",
        "HK": "Hong Kong",
        "HU": "Hungary",
        "IS": "Iceland",
        "IN": "India",
        "ID": "Indonesia",
        "IR": "Iran (Islamic Republic of)",
        "IQ": "Iraq",
        "IE": "Ireland",
        "IM": "Isle of Man",
        "IT": "Italy",
        "JM": "Jamaica",
        "JP": "Japan",
        "JE": "Jersey",
        "JO": "Jordan",
        "KZ": "Kazakhstan",
        "KE": "Kenya",
        "KI": "Kiribati",
        "KP": "Korea (Democratic People's Republic of)",
        "KR": "Korea (Republic of)",
        "KW": "Kuwait",
        "KG": "Kyrgyzstan",
        "LA": "Lao People's Democratic Republic",
        "LV": "Latvia",
        "LB": "Lebanon",
        "LS": "Lesotho",
        "LR": "Liberia",
        "LY": "Libya",
        "LI": "Liechtenstein",
        "LT": "Lithuania",
        "LU": "Luxembourg",
        "MO": "Macao",
        "MG": "Madagascar",
        "MW": "Malawi",
        "MY": "Malaysia",
        "MV": "Maldives",
        "ML": "Mali",
        "MT": "Malta",
        "MH": "Marshall Islands",
        "MQ": "Martinique",
        "MR": "Mauritania",
        "MU": "Mauritius",
        "YT": "Mayotte",
        "MX": "Mexico",
        "FM": "Micronesia (Federated States of)",
        "MD": "Moldova (Republic of)",
        "MC": "Monaco",
        "MN": "Mongolia",
        "ME": "Montenegro",
        "MS": "Montserrat",
        "MA": "Morocco",
        "MZ": "Mozambique",
        "MM": "Myanmar",
        "NA": "Namibia",
        "NR": "Nauru",
        "NP": "Nepal",
        "NL": "Netherlands",
        "NC": "New Caledonia",
        "NZ": "New Zealand",
        "NI": "Nicaragua",
        "NE": "Niger",
        "NG": "Nigeria",
        "NU": "Niue",
        "NF": "Norfolk Island",
        "MK": "North Macedonia",
        "MP": "Northern Mariana Islands",
        "NO": "Norway",
        "OM": "Oman",
        "PK": "Pakistan",
        "PW": "Palau",
        "PS": "Palestine, State of",
        "PA": "Panama",
        "PG": "Papua New Guinea",
        "PY": "Paraguay",
        "PE": "Peru",
        "PH": "Philippines",
        "PN": "Pitcairn",
        "PL": "Poland",
        "PT": "Portugal",
        "PR": "Puerto Rico",
        "QA": "Qatar",
        "RE": "Réunion",
        "RO": "Romania",
        "RU": "Russian Federation",
        "RW": "Rwanda",
        "BL": "Saint Barthélemy",
        "SH": "Saint Helena, Ascension and Tristan da Cunha",
        "KN": "Saint Kitts and Nevis",
        "LC": "Saint Lucia",
        "MF": "Saint Martin (French part)",
        "PM": "Saint Pierre and Miquelon",
        "VC": "Saint Vincent and the Grenadines",
        "WS": "Samoa",
        "SM": "San Marino",
        "ST": "Sao Tome and Principe",
        "SA": "Saudi Arabia",
        "SN": "Senegal",
        "RS": "Serbia",
        "SC": "Seychelles",
        "SL": "Sierra Leone",
        "SG": "Singapore",
        "SX": "Sint Maarten (Dutch part)",
        "SK": "Slovakia",
        "SI": "Slovenia",
        "SB": "Solomon Islands",
        "SO": "Somalia",
        "ZA": "South Africa",
        "GS": "South Georgia and the South Sandwich Islands",
        "SS": "South Sudan",
        "ES": "Spain",
        "LK": "Sri Lanka",
        "SD": "Sudan",
        "SR": "Suriname",
        "SJ": "Svalbard and Jan Mayen",
        "SE": "Sweden",
        "CH": "Switzerland",
        "SY": "Syrian Arab Republic",
        "TW": "Taiwan",
        "TJ": "Tajikistan",
        "TZ": "Tanzania, United Republic of",
        "TH": "Thailand",
        "TL": "Timor-Leste",
        "TG": "Togo",
        "TK": "Tokelau",
        "TO": "Tonga",
        "TT": "Trinidad and Tobago",
        "TN": "Tunisia",
        "TR": "Turkey",
        "TM": "Turkmenistan",
        "TC": "Turks and Caicos Islands",
        "TV": "Tuvalu",
        "UG": "Uganda",
        "UA": "Ukraine",
        "AE": "United Arab Emirates",
        "GB": "United Kingdom of Great Britain and Northern Ireland",
        "UM": "United States Minor Outlying Islands",
        "US": "United States of America",
        "UY": "Uruguay",
        "UZ": "Uzbekistan",
        "VU": "Vanuatu",
        "VE": "Venezuela (Bolivarian Republic of)",
        "VN": "Viet Nam",
        "VG": "Virgin Islands (British)",
        "VI": "Virgin Islands (U.S.)",
        "WF": "Wallis and Futuna",
        "EH": "Western Sahara",
        "YE": "Yemen",
        "ZM": "Zambia",
        "ZW": "Zimbabwe"
    };


    function transformDate(date) {
        const dateObj = new Date(date);
        const options = {year: 'numeric', month: 'long', day: 'numeric'};
        return dateObj.toLocaleDateString('en-US', options);
    }

    useEffect(() => {
        SetMembers(MembersCopy.filter((member) => {
            let name = member.firstName + " " + member.lastName

            return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (member.role === "P" ? positionMapping[member.position].toLowerCase().includes(searchTerm.toLowerCase()) : staffPositionMapping[member.position].toLowerCase().includes(searchTerm.toLowerCase()))

        }))
    }, [searchTerm])

    useEffect(() => {
        setTournaments(TournamentsCopy.filter((tournament) => {

            return tournament.name.toLowerCase().includes(searchTournamentTerm.toLowerCase()) ||
                tournament.startDate.toLowerCase().includes(searchTournamentTerm.toLowerCase()) ||
                tournament.endDate.toLowerCase().includes(searchTournamentTerm.toLowerCase()) ||
                countryMapping[tournament.country].toLowerCase().includes(searchTournamentTerm.toLowerCase())
        }))
    }, [searchTournamentTerm])


    return (
        <>
            <Breadcrumb pageName="Team Profile" dashboardPath="/backOffice/teams"/>

            <div
                className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="relative z-20 h-35 md:h-65">
                    <img
                        src={CoverOne}
                        alt="profile cover"
                        className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
                    />
                    <div className="absolute top-1 right-1 z-10 xsm:bottom-4 xsm:right-4">
                        <Link
                            to=""
                            className="flex cursor-pointer items-center justify-center gap-2 rounded bg-primary py-1 px-2 text-sm font-medium text-white hover:bg-opacity-90 xsm:px-4"
                        >

                            <Edit />
                            <span>Edit</span>
                        </Link>
                    </div>
                </div>
                <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
                    <div
                        className="relative z-30 mb-10  mx-auto -mt-22 h-30 w-full max-w-30 rounded-full  p-1 sm:h-44 sm:max-w-44 sm:p-3">
                        <div className="relative drop-shadow-2 ">
                            <img src={path + Team.image} alt="profile" className="rounded-xl"/>
                        </div>
                    </div>
                    <div className="mt-4">
                        <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
                            {Team.name}
                        </h3>
                        <p className="font-medium">{Team.nickname}</p>
                        <div
                            className="mx-auto mt-4.5 mb-5.5 grid max-w-94 grid-cols-3 rounded-md border border-stroke py-2.5 shadow-1 dark:border-strokedark dark:bg-[#37404F]">
                            <div
                                className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-strokedark xsm:flex-row">
                <span className="font-semibold text-black dark:text-white">
                    {Team.wins}
                </span>
                                <span className="text-sm">Wins</span>
                            </div>
                            <div
                                className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-strokedark xsm:flex-row">
                <span className="font-semibold text-black dark:text-white">
                  {Team.draws}
                </span>
                                <span className="text-sm">Draws</span>
                            </div>
                            <div className="flex flex-col items-center justify-center gap-1 px-4 xsm:flex-row">
                <span className="font-semibold text-black dark:text-white">
                   {Team.losses}
                </span>
                                <span className="text-sm">Losses</span>
                            </div>
                        </div>

                        <div className="mx-auto max-w-180">
                            <h4 className="font-semibold text-black dark:text-white">
                                About Us
                            </h4>
                            <p className="mt-4.5">
                                {Team.description}
                            </p>
                        </div>

                        <div className="text-gray-700 mt-10 flex items-center justify-center">
                            <div className="grid gap-6 lg:grid-cols-2">
                                <div className="relative w-72 lg:w-96">
                                    <input className="peer hidden" id="radio_1" type="radio" name="radio"
                                           defaultChecked={true} value={ShowTournamens} onClick={() => {
                                        SetShowTournamens(false)
                                    }}/>
                                    <span
                                        className="peer-checked:border-blue-500 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white"></span>
                                    <label
                                        className="peer-checked:border-2 peer-checked:border-blue-400 dark:text-gray-100 dark:peer-checked:bg-[#37404F] peer-checked:bg-blue-50 flex cursor-pointer select-none rounded-lg border border-gray-300 p-4 pr-20"
                                        htmlFor="radio_1">
                                        <div className="ml-5">
                                            <span className="mt-2 font-semibold">Members</span>
                                        </div>
                                    </label>
                                </div>
                                <div className="relative w-72 lg:w-96">
                                    <input className="peer hidden" id="radio_2" type="radio" name="radio"
                                           value={ShowTournamens} onClick={() => {
                                        SetShowTournamens(true)
                                    }}/>
                                    <span
                                        className="peer-checked:border-blue-500 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white"></span>

                                    <label
                                        className="peer-checked:border-2 peer-checked:border-blue-400 dark:text-gray-100 dark:peer-checked:bg-[#37404F]  peer-checked:bg-blue-50 flex cursor-pointer select-none rounded-lg border border-gray-300 p-4 pr-20"
                                        htmlFor="radio_2">
                                        <div className="ml-5">
                                            <span className="mt-2 font-semibold">Tournaments</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>


                        {!ShowTournamens ? (
                            <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-10">
                                <div
                                    className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4">
                                    <label htmlFor="table-search" className="sr-only">Search</label>
                                    <div className="relative">
                                        <div
                                            className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                                                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                                      strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                            </svg>
                                        </div>
                                        <input
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            type="text" id="table-search-users"
                                            className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder="Search for members"/>
                                    </div>
                                </div>
                                <table
                                    className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    <thead
                                        className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>

                                        <th scope="col" className="px-6 py-3">
                                            Name
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Position
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            PRIVILEGES (FOR STAFF)
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Action
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {Members.map((member, index) => (
                                        <tr key={index}
                                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                            <th scope="row"
                                                className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                                <img className="w-10 h-10 rounded-full"
                                                     src={member.role === "P" ? pathPlayer + member.image : pathStaff + member.image}
                                                     alt="Jese image"/>
                                                <div className="ps-3">
                                                    <div
                                                        className="text-base font-semibold">{member.firstName} {member.lastName}
                                                        <text
                                                            className="text-gray-400 ms-1"> {member.role === "P" ? "Player" : "Staff"} </text>
                                                    </div>
                                                    <div className="font-normal text-gray-500">{member.email}</div>
                                                </div>
                                            </th>
                                            <td className="px-6 py-4">
                                                {member.role === "P" ? positionMapping[member.position] : staffPositionMapping[member.position]}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">

                                                    {member.hasAccessTo.add ? (
                                                        <div className="flex items-center">
                                                            <div
                                                                className="h-2.5 w-2.5 rounded-full bg-green-500 me-2">
                                                            </div>
                                                            <p>Add</p>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center">
                                                            <div
                                                                className="h-2.5 w-2.5 rounded-full bg-red-500 me-2">
                                                            </div>
                                                            <p>Add</p>
                                                        </div>
                                                    )}
                                                    {member.hasAccessTo.kick ? (
                                                        <div className="flex items-center">
                                                            <div
                                                                className="h-2.5 w-2.5 rounded-full bg-green-500 me-2">
                                                            </div>
                                                            <p>Kick</p>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center">
                                                            <div
                                                                className="h-2.5 w-2.5 rounded-full bg-red-500 me-2">
                                                            </div>
                                                            <p>Kick</p>
                                                        </div>
                                                    )}
                                                    {member.hasAccessTo.editlineup ? (
                                                        <div className="flex items-center">
                                                            <div
                                                                className="h-2.5 w-2.5 rounded-full bg-green-500 me-2">
                                                            </div>
                                                            <p>Edit Lineup</p>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center">
                                                            <div
                                                                className="h-2.5 w-2.5 rounded-full bg-red-500 me-2">
                                                            </div>
                                                            <p>Edit Lineup</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-10 py-4">
                                                <Link to={`/backOffice/users/${member.id}`}>
                                                    <Edit size={20}
                                                          className="font-medium text-green-600 dark:text-green-500 hover:underline hover:text-green-700 dark:hover:text-green-600"/>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <>
                                <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-10">
                                    <div
                                        className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4">
                                        <label htmlFor="table-search" className="sr-only">Search</label>
                                        <div className="relative">
                                            <div
                                                className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                                     aria-hidden="true"
                                                     xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                                    <path stroke="currentColor" strokeLinecap="round"
                                                          strokeLinejoin="round"
                                                          strokeWidth="2"
                                                          d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                                </svg>
                                            </div>
                                            <input
                                                value={searchTournamentTerm}
                                                onChange={(e) => setsearchTournamentTerm(e.target.value)}
                                                type="text" id="table-search-users"
                                                className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                placeholder="Search for tournaments"/>
                                        </div>
                                    </div>
                                    <table
                                        className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                        <thead
                                            className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>

                                            <th scope="col" className="px-6 py-3">
                                                Name
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Location
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Date
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Action
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {Tournaments.map((tournament, index) => (
                                            <tr key={index}
                                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                                <th scope="row"
                                                    className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                                    <img className="w-10 h-10 rounded-full"
                                                         src={pathTournament + tournament.image}
                                                         alt="Jese image"/>
                                                    <div className="ps-3">
                                                        <div
                                                            className="text-base font-semibold">{tournament.name}
                                                        </div>
                                                        <div
                                                            className="font-normal text-gray-500">{tournament.type}</div>
                                                    </div>
                                                </th>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <div className="font-semibold">
                                                            {countryMapping[tournament.country]}
                                                        </div>
                                                        <div>
                                                            {tournament.state} {tournament.city}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex  gap-4">

                                                        <div className="flex items-center gap-2">
                                                            <div
                                                                className="h-2.5 w-2.5 rounded-full bg-green-500 ">
                                                            </div>
                                                            <p>{transformDate(tournament.startDate)}</p>
                                                            -
                                                            <p>{transformDate(tournament.endDate)}</p>
                                                            <div
                                                                className="h-2.5 w-2.5 rounded-full bg-red-500 ">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-4">
                                                    <Link to={`/backOffice/tournament/${tournament._id}`}>
                                                        <Edit size={20}
                                                              className="font-medium text-green-600 dark:text-green-500 hover:underline hover:text-green-700 dark:hover:text-green-600"/>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}


                    </div>
                </div>
            </div>
        </>
    );
};
