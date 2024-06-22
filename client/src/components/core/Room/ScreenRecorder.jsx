import React, { useEffect, useRef, useState } from 'react';

const ScreenRecorder = ({ onStop }) => {
    const mediaRecorderRef = useRef(null);
    const [recording, setRecording] = useState(false);

    useEffect(() => {
        const startRecording = async () => {
            const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            const chunks = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                chunks.push(event.data);
            };

            mediaRecorderRef.current.onstop = async () => {
                const blob = new Blob(chunks, { type: 'video/webm' });
                onStop(blob);
            };

            mediaRecorderRef.current.start();
            setRecording(true);
        };

        startRecording();

        return () => {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
                mediaRecorderRef.current.stop();
            }
        };
    }, [onStop]);

    return (
        <div>
            {recording ? <p>Recording...</p> : <p>Not Recording</p>}
        </div>
    );
};

export default ScreenRecorder;