    import {useEffect, useRef, useState} from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import './live.css'
import {getMatchInfo} from "../../../../../src/Services/FrontOffice/apiMatch.js";
import {useParams} from "react-router-dom";
import {getTeam, getTeams} from "../../../../../src/Services/FrontOffice/apiTeam.js";
import io from 'socket.io-client';
import {jwtDecode} from "jwt-decode";
import {getUserData} from "../../../../../src/Services/apiUser.js";

export default function LivePage() {

    const videoNode = useRef(null);
    const player = useRef(null);
    const {id} = useParams();
    const socket = io('http://localhost:3000');

    const [Match, setMatch] = useState([]);
    const [Teams, setTeams] = useState([]);
    const [text, setText] = useState("");
    const [User,SetUser] = useState({})
    const [messages, setMessages] = useState([]);


    const path = "http://localhost:3000/public/images/teams/";


    useEffect(() => {

        try {
            if (localStorage.getItem('token') === null)
                return;

            const userToken = localStorage.getItem('token');
            const decodedToken = jwtDecode(userToken);
            getUserData(decodedToken.userId).then((response) => {
                SetUser(response.user)
            })
        } catch (e) {
            console.log(e.message)
        }


        getMatchInfo(id).then((response) => {
            setMatch(response)
            let teamsid = [response.idTeam1, response.idTeam2]
            getTeams(teamsid).then((response) => {
                setTeams(response)
            }).catch((error) => {
                console.log(error)
            })
        }).catch((error) => {
            console.log(error)
        })
    }, [])

    useEffect(() => {
        player.current = videojs(videoNode.current, {
            autoplay: true,
            controls: true,
            sources: [{
                src: "http://127.0.0.1:8888/live/"+id+"/index.m3u8",
                type: 'application/x-mpegURL'
            }]
        });

        return () => {
            if (player.current) {
                player.current.dispose();
            }
        };
    }, []);

    const sendMessage = (e) => {
        e.preventDefault();
        if (text === '') return;

        let textData = {
            sender: User._id,
            message: text,
            RoomId: id,
            SentAt: new Date()
        }

        socket.emit('message', textData);
        setText('');
    };

    useEffect(() => {
        socket.on('message', (message) => {
            if(message.RoomId !== id) return;
            setMessages((messages) => [...messages, message]);
        });

        return () => {
            socket.off('message');
        };
    }, []);

    return (
        <div className="my-20">
            <div className="">
                <div className="flex items-center justify-evenly my-10">
                    <img
                        alt="Team logo"
                        className="rounded-lg overflow-hidden w-[15%]"
                        src={path + Teams[0]?.image}
                    />
                    <img
                        alt="Team logo"
                        className="rounded-lg overflow-hidden  w-2/12"
                        src={"https://img.freepik.com/premium-vector/vs-versus-icon-logo-black-white-symbol-fight-competition-battle-sport-game-grunge-drawing-paint_101884-2201.jpg"}
                    />
                    <img
                        alt="Team logo2"
                        className="rounded-lg  overflow-hidden  w-[15%]"
                        src={path + Teams[1]?.image}                    />
                </div>
            </div>
            <div className="w-[90%] ms-20"> {/* Center the content */}
                <div className=" flex gap-4"
                     style={{width: '100%', margin: '0 auto', borderRadius: "10px"}}> {/* Adjust style */}
                    <video ref={videoNode} className="video-js vjs-default-skin"
                           style={{width: '100%', height: 'auto', position: "relative", borderRadius: "10px"}}/>
                    <main>
                        <div className="panel">
                            <div className="messages">
                                <div className="inner">
                                    {messages.map((message, index) => (
                                        <div key={index} className="message">
                                            <div className={`user-${message.sender === User._id ? 'self' : 'them'}`}>
                                                {message.message}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <form className="chatform" onSubmit={sendMessage}>
                                <input
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    className="chatinput"
                                />
                                <button className="chatbutton">+</button>
                            </form>
                        </div>
                    </main>
                </div>

            </div>
        </div>

    )
}

