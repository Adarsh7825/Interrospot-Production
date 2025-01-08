import React, { useContext, useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DataContext } from '../../../context/DataContext';
import { generateFromString } from 'generate-avatar';
import CameraCapture from './CameraCapture';
import { fetchRoom } from '../../../services/operations/roomAPI';
import AceEditor from 'react-ace';

// Import ace builds
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';

const RoomData = () => {
    const { setCurrRoom, setUser, socket } = useContext(DataContext);
    const [isLoading, setIsLoading] = useState(false);
    const [capturedPhoto, setCapturedPhoto] = useState(null);
    const { user } = useSelector((state) => state.profile);
    const { roomId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cameraRef = useRef(null);

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
        try {
            const roomData = dispatch(fetchRoom(roomId, user.token));
            setCurrRoom(roomData);
            socket.emit('joinRoom', { roomId, user });
            navigate(`/room/${roomId}`, { state: { roomid: roomId } });
        } catch (error) {
            toast.error('Room not found', {
                // position: toast.POSITION.TOP_RIGHT
            });
            console.log(error);
        } finally {
            loadingStop();
        }
    };

    useEffect(() => {
        if (user && Array.isArray(user.rooms)) {
            const roomsWithUpdatedAt = user.rooms.filter(room => room.updatedAt);
            if (!roomsWithUpdatedAt.every(room => !room.updatedAt.includes("T"))) {
                roomsWithUpdatedAt.forEach((item) => {
                    let temp = item.updatedAt.replace('T', ' ').split(":");
                    temp.pop();
                    item.updatedAt = temp.join(":");
                });
                roomsWithUpdatedAt.sort((a, b) => {
                    return new Date(b.updatedAt) - new Date(a.updatedAt);
                });

                setUser({ ...user, rooms: roomsWithUpdatedAt });
            }

            document.querySelectorAll(".join-room input").forEach(input => {
                input.addEventListener("keydown", (e) => {
                    if (e.key === "Enter")
                        e.target.nextElementSibling.click();
                });
            });
        }

    }, [user]);

    const handleCapture = () => {
        if (!capturedPhoto && cameraRef.current) {
            cameraRef.current.capture();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1A1A2E] to-[#16213E] flex items-center justify-center p-4">
            <div className="w-full text-white max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                {/* Left Section - User Profile */}
                <div className="bg-[#0F3460]/30 backdrop-blur-lg rounded-2xl border border-[#533483]/20 shadow-xl p-8 hover:shadow-[#E94560]/20 transition-all duration-300">
                    <div className="flex flex-col items-center">
                        <div className="relative mb-6 group">
                            {user.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt='user profile'
                                    className="w-28 h-28 rounded-2xl border-2 border-[#E94560] shadow-lg shadow-[#E94560]/30 transform transition-all duration-300 group-hover:scale-105"
                                />
                            ) : (
                                <img
                                    src={`data:image/svg+xml;utf8,${generateFromString(user.email + user.name)}`}
                                    alt="user profile"
                                    className="w-28 h-28 rounded-2xl border-2 border-[#E94560] shadow-lg shadow-[#E94560]/30 transform transition-all duration-300 group-hover:scale-105"
                                />
                            )}
                            <div className="absolute -bottom-2 -right-2 bg-[#E94560] text-white text-xs px-2 py-1 rounded-lg">
                                Active
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-[#E94560] to-[#533483] bg-clip-text text-transparent">
                            Welcome, {user.firstName}!
                        </h2>
                        <p className="text-gray-300 text-sm mb-6 flex items-center gap-2">
                            <span className="bg-[#E94560] w-2 h-2 rounded-full animate-pulse"></span>
                            Room ID: <span className="text-[#E94560] font-medium">{roomId}</span>
                        </p>

                        {/* Room Details */}
                        <div className="w-full bg-[#1A1A2E] rounded-xl p-6 mb-6 border border-[#533483]/30 transform hover:scale-[1.02] transition-all duration-300">
                            <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                                <span className="text-[#E94560]">��</span>
                                Room Features
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-gray-300 bg-[#0F3460]/30 p-3 rounded-lg">
                                    <span className="text-[#E94560] text-xl">📹</span>
                                    <div>
                                        <p className="font-medium">Secure Video Conference</p>
                                        <p className="text-xs text-gray-400">End-to-end encrypted calls</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-gray-300 bg-[#0F3460]/30 p-3 rounded-lg">
                                    <span className="text-[#E94560] text-xl">💻</span>
                                    <div>
                                        <p className="font-medium">Real-time Code Editor</p>
                                        <p className="text-xs text-gray-400">Collaborative coding environment</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-gray-300 bg-[#0F3460]/30 p-3 rounded-lg">
                                    <span className="text-[#E94560] text-xl">🖌</span>
                                    <div>
                                        <p className="font-medium">Interactive Whiteboard</p>
                                        <p className="text-xs text-gray-400">Visual explanation tools</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Section - Camera and Join */}
                <div className="bg-[#0F3460]/30 backdrop-blur-lg rounded-2xl border border-[#533483]/20 shadow-xl p-8 hover:shadow-[#E94560]/20 transition-all duration-300">
                    <h3 className="text-2xl font-semibold text-white mb-2 flex items-center gap-2">
                        <span className="text-[#E94560]">��</span>
                        Verification Required
                    </h3>
                    <p className="text-gray-300 text-sm mb-6 pl-7">
                        Please capture your photo to verify your identity
                    </p>

                    {/* Camera Section with Instructions */}
                    <div className="bg-[#1A1A2E] rounded-xl p-6 mb-6 border border-[#533483]/30 transform hover:scale-[1.02] transition-all duration-300">
                        <div className="relative">
                            {/* Instructions Overlay */}
                            {!capturedPhoto && (
                                <div
                                    className="absolute inset-0 flex flex-col items-center justify-center bg-[#1A1A2E]/80 rounded-lg backdrop-blur-sm z-10 p-4 cursor-pointer"
                                    onClick={handleCapture}
                                >
                                    <div className="animate-bounce text-4xl mb-4">📸</div>
                                    <h4 className="text-[#E94560] font-semibold text-lg mb-2">Click Here to Capture</h4>
                                    <p className="text-gray-300 text-center text-sm max-w-md">
                                        Position yourself in the frame and click anywhere in this area to take your photo
                                    </p>
                                </div>
                            )}

                            {/* Camera Component */}
                            <div
                                className="relative group cursor-pointer"
                                onClick={handleCapture}
                            >
                                <CameraCapture
                                    ref={cameraRef}
                                    onCapture={setCapturedPhoto}
                                    roomId={roomId}
                                />

                                {/* Capture Indicator */}
                                {!capturedPhoto && (
                                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-[#E94560]/80 text-white px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <span className="animate-pulse">●</span>
                                        Click to Capture
                                    </div>
                                )}

                                {/* Success Message */}
                                {capturedPhoto && (
                                    <div className="absolute top-4 right-4 bg-green-500/80 text-white px-3 py-1 rounded-full flex items-center gap-2">
                                        <span>✓</span>
                                        Photo Captured
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Camera Instructions */}
                        <div className="mt-4 space-y-2">
                            <div className="flex items-center gap-2 text-gray-300 text-sm">
                                <span className="text-[#E94560]">1.</span>
                                <span>Ensure good lighting and face the camera directly</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-300 text-sm">
                                <span className="text-[#E94560]">2.</span>
                                <span>Keep a neutral background for better quality</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-300 text-sm">
                                <span className="text-[#E94560]">3.</span>
                                <span>Click anywhere in the camera view to capture</span>
                            </div>
                        </div>

                        {/* Retake Option */}
                        {capturedPhoto && (
                            <button
                                onClick={() => setCapturedPhoto(null)}
                                className="mt-4 w-full flex items-center justify-center gap-2 text-[#E94560] hover:text-[#E94560]/80 transition-colors duration-300"
                            >
                                <span>↺</span>
                                Retake Photo
                            </button>
                        )}
                    </div>

                    {/* Join Button */}
                    <button
                        onClick={() => joinRoom(roomId)}
                        disabled={isLoading}
                        className="w-full py-4 px-6 bg-gradient-to-r from-[#E94560] to-[#533483] hover:from-[#533483] hover:to-[#E94560] text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-[#E94560]/50 flex items-center justify-center gap-3 group"
                    >
                        {isLoading ? (
                            <>
                                <span className="animate-spin text-xl">⟳</span>
                                <span className="text-lg">Joining Room...</span>
                            </>
                        ) : (
                            <>
                                <span className="text-lg">Join Interview Room</span>
                                <span className="transform group-hover:translate-x-1 transition-transform text-xl">
                                    →
                                </span>
                            </>
                        )}
                    </button>

                    {/* Security Note */}
                    <p className="text-gray-400 text-xs mt-4 text-center flex items-center justify-center gap-2">
                        <span className="text-[#E94560]">��</span>
                        Your session is protected with end-to-end encryption
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RoomData;