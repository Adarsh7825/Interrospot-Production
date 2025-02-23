import { createContext, useState, useMemo, useEffect } from "react";
import { io } from "socket.io-client";

export const DataContext = createContext(null);

const DataContextProvider = ({ children }) => {
    const REACT_APP_BACKEND_URL = 'https://interrospot-production-1.onrender.com/';
    const [user, setUser] = useState(null);
    const [currRoom, setCurrRoom] = useState(null);
    const [socketConnected, setSocketConnected] = useState(false);

    const socket = useMemo(() => {
        const newSocket = io(REACT_APP_BACKEND_URL, {
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });
        return newSocket;
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on('connect', () => {
                console.log('Socket connected');
                setSocketConnected(true);
            });

            socket.on('disconnect', () => {
                console.log('Socket disconnected');
                setSocketConnected(false);
            });

            socket.on('connect_error', (error) => {
                console.error('Socket connection error:', error);
                setSocketConnected(false);
            });
        }

        return () => {
            if (socket) {
                socket.off('connect');
                socket.off('disconnect');
                socket.off('connect_error');
            }
        };
    }, [socket]);

    return (
        <DataContext.Provider value={{
            user,
            currRoom,
            setUser,
            setCurrRoom,
            socket,
            socketConnected
        }}>
            {children}
        </DataContext.Provider>
    );
};

export default DataContextProvider;