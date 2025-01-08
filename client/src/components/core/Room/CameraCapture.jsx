import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { ACCOUNT_TYPE } from '../../../utils/constants';
import { uploadPhotoForCandidate, uploadPhotoForInterviewer } from '../../../services/operations/uploadAPI';

const CameraCapture = forwardRef(({ onCapture, roomId }, ref) => {
    const videoRef = useRef(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const user = useSelector((state) => state.profile.user);
    const dispatch = useDispatch();

    useEffect(() => {
        startCamera();
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: "user"
                }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
            }
        } catch (err) {
            console.error("Error accessing camera: ", err);
            toast.error("Unable to access camera. Please check permissions.");
        }
    };

    const capturePhoto = async () => {
        setIsLoading(true);
        try {
            const video = videoRef.current;
            if (!video) return;

            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');

            // Flip horizontally if using front camera
            context.translate(canvas.width, 0);
            context.scale(-1, 1);

            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = canvas.toDataURL('image/png');
            setCapturedImage(imageData);
            onCapture(imageData);
            await uploadPhoto(imageData);
            toast.success("Photo captured successfully!");
        } catch (error) {
            console.error("Error capturing photo:", error);
            toast.error("Failed to capture photo. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const uploadPhoto = async (imageData) => {
        try {
            const blob = await fetch(imageData).then(res => res.blob());
            if (user.accountType === ACCOUNT_TYPE.CANDIDATE) {
                await dispatch(uploadPhotoForCandidate(roomId, blob));
            } else {
                await dispatch(uploadPhotoForInterviewer(roomId, blob));
            }
        } catch (error) {
            console.error("Error uploading photo:", error);
            throw error;
        }
    };

    const retakePhoto = () => {
        setCapturedImage(null);
        onCapture(null);
        startCamera();
    };

    useImperativeHandle(ref, () => ({
        capture: capturePhoto
    }));

    return (
        <div className="relative w-full">
            {/* Camera View */}
            <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
                {!capturedImage ? (
                    <video
                        ref={videoRef}
                        className="w-full h-full object-cover transform scale-x-[-1]"
                        autoPlay
                        playsInline
                        muted
                    />
                ) : (
                    <img
                        src={capturedImage}
                        alt="Captured"
                        className="w-full h-full object-cover"
                    />
                )}

                {/* Loading Overlay */}
                {isLoading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="animate-spin text-[#E94560] text-4xl">⟳</div>
                    </div>
                )}

                {/* Camera Frame Overlay */}
                <div className="absolute inset-0 border-2 border-[#E94560]/50 rounded-lg pointer-events-none">
                    <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#E94560]"></div>
                    <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#E94560]"></div>
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#E94560]"></div>
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#E94560]"></div>
                </div>
            </div>

            {/* Controls */}
            <div className="mt-4 flex justify-center gap-4">
                {!capturedImage ? (
                    <button
                        onClick={capturePhoto}
                        disabled={isLoading}
                        className="px-6 py-2 bg-[#E94560] text-white rounded-lg hover:bg-[#E94560]/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <span className="text-xl">📸</span>
                        Capture Photo
                    </button>
                ) : (
                    <button
                        onClick={retakePhoto}
                        className="px-6 py-2 bg-[#533483] text-white rounded-lg hover:bg-[#533483]/90 transition-all duration-300 flex items-center gap-2"
                    >
                        <span>↺</span>
                        Retake Photo
                    </button>
                )}
            </div>
        </div>
    );
});

export default CameraCapture;