import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DataContext } from '../../../context/DataContext';
import { generateFromString } from 'generate-avatar';
import axios from 'axios';
import CameraCapture from './CameraCapture';

const RoomData = () => {
    const { setCurrRoom, setUser, socket } = useContext(DataContext);
    const [isLoading, setIsLoading] = useState(false);
    const [capturedPhoto, setCapturedPhoto] = useState(null);
    const { user } = useSelector((state) => state.profile);
    const { roomId } = useParams();
    const navigate = useNavigate();
    const REACT_APP_BACKEND_URL = 'https://interrospot-backend.vercel.app/';

    function loadingStart() {
        setIsLoading(true);
    }

    function loadingStop() {
        setIsLoading(false);
    }

    useEffect(() => {
        if (user?.firstName) {
            toast.success(`Welcome ${user.firstName}!`, {
                // position: toast.POSITION.TOP_RIGHT
            });
        }
    }, [user?.firstName]);

    const joinRoom = async (roomId) => {
        if (!capturedPhoto) {
            toast.error('Please capture a photo for validation.');
            return;
        }

        loadingStart();
        axios({
            method: 'get',
            url: `${REACT_APP_BACKEND_URL}rooms/fetch?id=${roomId}`,
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        })
            .then((response) => {
                setCurrRoom(response.data);
                socket.emit('joinRoom', { roomId, user });
                loadingStop();
                navigate(`/room/${roomId}`, { state: { roomid: roomId } });
            })
            .catch((error) => {
                loadingStop();
                toast.error('Room not found', {
                    // position: toast.POSITION.TOP_RIGHT
                });
                console.log(error);
            });
    };

    const copyRoomId = (e) => {
        const id = e.target.innerText;
        navigator.clipboard.writeText(id);
        toast.success('Room ID Copied ', {
            // position: toast.POSITION.TOP_RIGHT
        });
    };

    useEffect(() => {
        if (user && !user.rooms.every(room => !room.updatedAt.includes("T"))) {
            user.rooms.forEach((item) => {
                let temp = item.updatedAt.replace('T', ' ').split(":");
                temp.pop();
                item.updatedAt = temp.join(":");
            });
            user.rooms.sort((a, b) => {
                return new Date(b.updatedAt) - new Date(a.updatedAt);
            });

            setUser({ ...user });
        }

        if (user) {
            document.querySelectorAll(".join-room input").forEach(input => {
                input.addEventListener("keydown", (e) => {
                    if (e.key === "Enter")
                        e.target.nextElementSibling.click();
                });
            });
        }

    }, [user]);

    return (
        <div>
            <div className="room-data text-white">
                <div className="userData">
                    {user.avatar ?
                        <img src={user.avatar} height={100} alt='user profile' style={{ borderRadius: '50%', width: '5rem', height: '5rem' }} />
                        : <img height={100} src={`data:image/svg+xml;utf8,${generateFromString(user.email + user.name)}`} alt="user profile" style={{ borderRadius: '50%', width: '5rem', height: '5rem' }} />
                    }
                </div>
                <div className="join-room">
                    <div>
                        <button onClick={() => joinRoom(roomId)}>Join Room</button>
                    </div>
                </div>
                <CameraCapture onCapture={setCapturedPhoto} roomId={roomId} />
            </div>
        </div>
    );
};

export default RoomData;