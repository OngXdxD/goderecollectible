import { useState, useEffect } from 'react';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const baseUrl = 'https://kakihobby.com';

    useEffect(() => {
        const rememberedUsername = localStorage.getItem('rememberedUsername');
        if (rememberedUsername) {
            setEmail(rememberedUsername);
            setRememberMe(true);
        }
    }, []);

    const handleLogin = async (event) => {
        event.preventDefault();

        if (!email || !password) {
            setErrorMessage('Both email and password are required.');
            return;
        }

        const adminDto = {
            Username: email,
            Password: btoa(password),
        };

        try {
            const response = await fetch(`${baseUrl}/api/bizadmin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(adminDto),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setErrorMessage(errorData.message);
                return;
            }

            const data = await response.json();

            // Store admin data in localStorage
            const currentTime = new Date().getTime();
            localStorage.setItem('adminId', data.id);
            localStorage.setItem('sessionTime', currentTime);

            // Redirect to the admin dashboard
            window.location.href = '/admin-dashboard';
        } catch (error) {
            setErrorMessage('An error occurred during login.');
        }

        if (rememberMe) {
            localStorage.setItem('rememberedUsername', email);
        } else {
            localStorage.removeItem('rememberedUsername');
        }
    };

    return (
        <div className="form-container mt-5 mb-5">
            <div className="image-holder">
                <img src="/assets/images/kaki_hobby_malaysia_signin.webp" alt="Kaki Hobby Malaysia Sign In" />
            </div>
            <h2 className="center-title mt-3">Admin Sign In</h2>

            {errorMessage && <div className="error-message">{errorMessage}</div>}

            <label className="mb-0 mt-2">Username</label><br />
            <input
                type="text"
                className="input-field"
                id="txtEmail"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            /><br />

            <label className="mb-0 mt-3">Password</label><br />
            <input
                type="password"
                className="input-field"
                id="txtPassword"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            /><br />

            <input
                type="checkbox"
                className="mb-0 mt-4"
                id="remember-me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
            />
            Remember Me<br />

            <button id="btnLogin" className="btnLogin mt-3" onClick={handleLogin}>Sign In</button><br />
        </div>
    );
}
