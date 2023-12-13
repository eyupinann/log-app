import React, {useState, useEffect} from 'react';
import {useRouter} from 'next/router';
import api from '../utils/api';
import '../../styles/globals.css';
import {toastError, toastSuccess} from '../utils/toast';
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState(null);

    const router = useRouter();

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (user) {
                router.push('/user');
            }
        }, 3000);

        return () => clearInterval(intervalId);
        e
    }, [user])

    const handleLogin = async () => {
        if (!email || !password) {
            toastError('Username and password are required.')
            return;
        }

        try {
            const checkResponse = await api.get('/users/filter?key=email&value=' + email);
            const usersArray = checkResponse.data.users;

            if (usersArray && usersArray.length > 0) {
                const userName = usersArray[0].username;

                const response = await api.post('/auth/login', {
                    username: userName,
                    password,
                });

                console.log('Login response:', response);

                setUser(response.data);
                localStorage.setItem('user', JSON.stringify(response.data));
                toastSuccess('Login successful. Redirecting...')
            } else {
                console.log('Invalid username or password.');
                toastError('Invalid username or password.',);
            }
        } catch (error) {
            console.error('Login error:', error);
            toastError('Invalid username or password.');
        }

    };

    return (
        <div
            className="flex items-center justify-center h-screen bg-cover"
            style={{backgroundImage: "url('/bg.jpg')"}}
        >
            <div className="bg-gray-100 p-8 rounded shadow-lg">
                <h1 className="text-4xl text-purple-600 font-bold mb-4 text-center">Login</h1>
                <ToastContainer/>
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-2 mb-4 border rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-2 mb-4 border rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    onClick={handleLogin}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                    Login
                </button>
            </div>
        </div>
    );
};

export default Home;
