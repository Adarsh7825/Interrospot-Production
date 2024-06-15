import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { ACCOUNT_TYPE } from '../../../utils/constants';
import { useSelector } from 'react-redux';

const CameraCapture = ({ onCapture, roomId }) => {
    const videoRef = useRef(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const user = useSelector((state) => state.profile.user);

    useEffect(() => {
        return () => {
            // Cleanup the video stream when the component unmounts
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const startCamera = () => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            })
            .catch(err => {
                console.error("Error accessing camera: ", err);
            });
    };

    const capturePhoto = () => {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/png');
        setCapturedImage(imageData);
        onCapture(imageData);
    };

    const uploadPhotoforCandidate = async () => {
        const blob = await fetch(capturedImage).then(res => res.blob());
        const formData = new FormData();
        formData.append('imageUrl', blob, 'photo.png'); // Ensure the key matches the backend expectation

        try {
            const response = await axios.post(`https://interrospot-backend.vercel.app/api/v1/captureImage/uploadImage/${roomId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('File uploaded successfully:', response.data);

            if (response.data && response.data.room && response.data.room.imageUrl) {
                console.log('Image URL:', response.data.room.imageUrl);
            } else {
                console.error('Unexpected response structure:', response.data);
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const uploadPhotoforInterviewer = async () => {
        const blob = await fetch(capturedImage).then(res => res.blob());
        const formData = new FormData();
        formData.append('imageUrl', blob, 'photo.png'); // Ensure the key matches the backend expectation

        try {
            const response = await axios.post(`https://interrospot-backend.vercel.app/api/v1/captureImage/uploadImageforInterviewer/${roomId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('File uploaded successfully:', response.data);

            if (response.data && response.data.room && response.data.room.imageUrl) {
                console.log('Image URL:', response.data.room.imageUrlforInterviewer);
            } else {
                console.error('Unexpected response structure:', response.data);
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const uploadPhoto = () => {
        if (user.accountType === ACCOUNT_TYPE.CANDIDATE) {
            uploadPhotoforCandidate();
        } else {
            uploadPhotoforInterviewer();
        }
    };

    return (
        <div>
            <video ref={videoRef} style={{ width: '100%' }}></video>
            <button onClick={startCamera}>Start Camera</button>
            <button onClick={capturePhoto}>Capture Photo</button>
            {capturedImage && <img src={capturedImage} alt="Captured" />}
            <button onClick={uploadPhoto}>Upload Photo</button>
        </div>
    );
};

export default CameraCapture;