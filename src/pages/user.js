import React, {useEffect, useState} from 'react';
import '../../styles/globals.css';
import {useRouter} from 'next/router';
import axios from 'axios';

const User = () => {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        setUser(parsedUser);

        if (!parsedUser) {
            router.push('/');
        }


        async function fetchDataAndLog() {
            try {
                const ipResponse = await axios.get('https://api.ipify.org?format=json');
                const ip = ipResponse.data.ip;

                const today = new Date();
                const month = today.getMonth()+1;
                const year = today.getFullYear();
                const date = today. getDate();
                const currentDate = month + "/" + date + "/" + year + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

                const logResponse = await axios.post('https://log-21hz.onrender.com/log', {
                    timestamp: currentDate,
                    userAgent: navigator.userAgent,
                    ip: ip
                }, {withCredentials: false});

                console.log('Check response:', logResponse);
            } catch (error) {
                console.error('Error:', error.message);
            }
        }

        fetchDataAndLog();

    }, []);

    const handleLogout = async () => {
        try {
            localStorage.removeItem('user');
            setUser(null);
            router.push('/');
        } catch (error) {
            console.log('Logout error:', error);
        }
    };

    return (
        <div
            className="flex items-center justify-center h-screen bg-cover"
            style={{backgroundImage: "url('/user-bg.jpg')"}}
        >
            <div className="flex items-center justify-center h-screen">
                <div
                    className="bg-gray-100 p-8  rounded-lg shadow-lg transition-transform transform hover:scale-110 hover:bg-blue-200">
                    <h1 className="text-2xl mb-4">User Page <button
                        onClick={handleLogout}
                        className="bg-yellow-500 text-white px-4  py-2  rounded hover:bg-yellow-600 float-right"
                    >
                        Logout
                    </button></h1>

                    {user && (
                        <>
                            <div className="flex items-center mb-4">
                                <img src={user.image} alt="Avatar" className="w-25 h-15 rounded-full "/>
                                <div>
                                    <p className="text-xl font-bold">{user.firstName} {user.lastName}</p>
                                    <p className="text-lg-gray-500">{user.username}</p>
                                    <p className="text-lg-gray-500">{user.gender}</p>
                                    <p className="text-lg-gray-500">{user.email}</p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default User;
