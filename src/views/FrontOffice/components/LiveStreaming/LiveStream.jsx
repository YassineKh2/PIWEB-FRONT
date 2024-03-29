import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    MeetingProvider,
    useMeeting,
    useParticipant,
    Constants,
} from "@videosdk.live/react-sdk";
import ReactPlayer from "react-player";
import Hls from "hls.js";
export default function LiveStream(){
    const [mode, setMode] = useState(null);

    return mode ? (
        <MeetingProvider
            config={{
                meetingId: "q40m-pup1-zlgi",
                micEnabled: true,
                webcamEnabled: true,
                name: "Yassine's Org",
                mode,
            }}
            joinWithoutUserInteraction
            token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiJmMjUzNjNkYS1jYTJkLTQ4NWQtOTJlNy1lNzgzMWRiZjRmODYiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTcwOTIwMTczMCwiZXhwIjoxNzA5Mjg4MTMwfQ.xh1p8pguOnm9UHQx3UPVjHuKfADHYurnHSXjn5arojQ"
        >
            {mode === Constants.modes.CONFERENCE ? <SpeakerView /> : <ViewerView />}
        </MeetingProvider>
    ) : (
        <div>
            <button
                onClick={() => {
                    setMode(Constants.modes.CONFERENCE);
                }}
            >
                Join as Speaker
            </button>
            <button
                style={{ marginLeft: 12 }}
                onClick={() => {
                    setMode(Constants.modes.VIEWER);
                }}
            >
                Join as Viewer
            </button>
        </div>
    );

}

function SpeakerView() {

    const [joined, setJoined] = useState(null);
    //Get the method which will be used to join the meeting.
    //We will also get the participant list to display all participants
    const { participants } = useMeeting();
    const mMeeting = useMeeting({
        onMeetingJoined: () => {
            setJoined("JOINED");
            //we will pin the local participant if he joins in CONFERENCE mode
            if (mMeetingRef.current.localParticipant.mode == "CONFERENCE") {
                mMeetingRef.current.localParticipant.pin();
            }
        },
    });
    //We will create a ref to meeting object so that when used inside the
    //Callback functions, meeting state is maintained
    const mMeetingRef = useRef(mMeeting);
    useEffect(() => {
        mMeetingRef.current = mMeeting;
    }, [mMeeting]);
    //Filtering the host/speakers from all the participants
    const speakers = useMemo(() => {
        const speakerParticipants = [...participants.values()].filter(
            (participant) => {
                return participant.mode == Constants.modes.CONFERENCE;
            }
        );
        return speakerParticipants;
    }, [participants]);
    return (
        <div className="container">
            {joined && joined == "JOINED" ? (
                <div>
                    {speakers.map((participant) => (
                        <ParticipantView
                            participantId={participant.id}
                            key={participant.id}
                        />
                    ))}
                    <Controls />
                </div>
            ) : (
                <p>Joining the meeting...</p>
            )}
        </div>
    );
}
function ParticipantView(props) {
    const micRef = useRef(null);
    const { webcamStream, micStream, webcamOn, micOn, isLocal, displayName } =
        useParticipant(props.participantId);
    const videoStream = useMemo(() => {
        if (webcamOn && webcamStream) {
            const mediaStream = new MediaStream();
            mediaStream.addTrack(webcamStream.track);
            return mediaStream;
        }
    }, [webcamStream, webcamOn]);
    useEffect(() => {
        if (micRef.current) {
            if (micOn && micStream) {
                const mediaStream = new MediaStream();
                mediaStream.addTrack(micStream.track);
                micRef.current.srcObject = mediaStream;
                micRef.current
                    .play()
                    .catch((error) =>
                        console.error("videoElem.current.play() failed", error)
                    );
            } else {
                micRef.current.srcObject = null;
            }
        }
    }, [micStream, micOn]);
    return (
        <div>
            <audio ref={micRef} autoPlay playsInline muted={isLocal} />
            {webcamOn && (
                <ReactPlayer
                    playsinline // very very imp prop
                    pip={false}
                    light={false}
                    controls={false}
                    muted={true}
                    playing={true}
                    url={videoStream}
                    height={"300px"}
                    width={"300px"}
                    onError={(err) => {
                        console.log(err, "participant video error");
                    }}
                />
            )}
        </div>
    );
}
function Controls() {
    const { hlsState, startHls, stopHls } = useMeeting();
    const _handleHLS = () => {
        console.log("hlsState", hlsState);
        if (!hlsState || hlsState === "HLS_STOPPED") {
            startHls({
                layout: {
                    type: "SPOTLIGHT",
                    priority: "PIN",
                    gridSize: 4,
                },
                theme: "DARK",
                orientation: "landscape",
            });
        } else if (hlsState === "HLS_STARTED" || hlsState === "HLS_PLAYABLE") {
            stopHls();
        }
    };
    return (
        <>
            {hlsState === "HLS_STARTED" ||
            hlsState === "HLS_STOPPING" ||
            hlsState === "HLS_STARTING" ||
            hlsState === "HLS_PLAYABLE" ? (
                <button
                    onClick={() => {
                        _handleHLS();
                    }}
                    style={{
                        backgroundColor: "#FF5D5D",
                    }}
                >
                    {hlsState === "HLS_STARTED"
                        ? "Live Starting"
                        : hlsState === "HLS_STOPPING"
                            ? "Live Stopping"
                            : hlsState === "HLS_PLAYABLE"
                                ? "Stop Live"
                                : "Loading..."}
                </button>
            ) : (
                <button
                    onClick={() => {
                        _handleHLS();
                    }}
                    style={{
                        backgroundColor: "#FF5D5D",
                    }}
                >
                    Go Live
                </button>
            )}
        </>
    );
};
function ViewerView() {
// States to store downstream url and current HLS state
    const playerRef = useRef(null);
//Getting the hlsUrls
    const { hlsUrls, hlsState } = useMeeting();
//Playing the HLS stream when the downstreamUrl is present and it is playable
    useEffect(() => {
        if (hlsUrls.downstreamUrl && hlsState == "HLS_PLAYABLE") {
            if (Hls.isSupported()) {
                const hls = new Hls({
                    capLevelToPlayerSize: true,
                    maxLoadingDelay: 4,
                    minAutoBitrate: 0,
                    autoStartLoad: true,
                    defaultAudioCodec: "mp4a.40.2",
                });
                let player = document.querySelector("#hlsPlayer");
                hls.loadSource(hlsUrls.downstreamUrl);
                hls.attachMedia(player);
            } else {
                if (typeof playerRef.current?.play === "function") {
                    playerRef.current.src = hlsUrls.downstreamUrl;
                    playerRef.current.play();
                }
            }
        }
    }, [hlsUrls, hlsState, playerRef.current]);
    return (
        <div>
            {/* Showing message if HLS is not started or is stopped by HOST */}
            {hlsState != "HLS_PLAYABLE" ? (
                <div>
                    <p>Please Click Go Live Button to start HLS</p>
                </div>
            ) : (
                hlsState == "HLS_PLAYABLE" && (
                    <div>
                        <video
                            ref={playerRef}
                            id="hlsPlayer"
                            autoPlay={true}
                            controls
                            style={{ width: "50%", height: "50%" }}
                            playsinline
                            playsInline
                            muted={true}
                            playing
                            onError={(err) => {
                                console.log(err, "hls video error");
                            }}
                        ></video>
                    </div>
                )
            )}
        </div>
    );
}