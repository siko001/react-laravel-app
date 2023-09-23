import { Link, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useStateContext } from '../contexts/ContextProvider';
import axiosClient from '../axiosClient';
import { useEffect, useState } from 'react';

export default function DefaultLayout() {
	const { user, token, notification, setUser, setToken } = useStateContext();
	const [loggingOut, setLoggingOut] = useState(false);
	const handleLogout = () => {
		setLoggingOut(true);
		axiosClient
			.post('/logout')
			.then(() => {
				setUser({});
				setToken(null);
			})
			.catch((error) => {
				console.error('Logout failed:', error);
			})
			.finally(() => {
				setLoggingOut(false);
			});
	};

	useEffect(() => {
		axiosClient.get('/user').then(({ data }) => {
			setUser(data);
		});
	}, []);

	if (!token) {
		return <Navigate to="/login" />;
	}

	return (
		<div id="defaultLayout">
			<aside className="text-center">
				<h1 className="logo-heading">User Records</h1>
				<hr></hr>
				<br></br>
				<Link to="/dashboard">Dashboard</Link>
				<Link to="/users">Users</Link>
			</aside>

			<div className="content">
				<header>
					<div className='username'>👋 Hello {user.name}</div>

					<button onClick={handleLogout} className={`btn btn-logout ${loggingOut ? 'logging-out ' : ''}`} disabled={loggingOut}>
						{loggingOut ? 'Logging Out...' : 'Logout'}
					</button>
				</header>
				<main>
					<Outlet />
					{loggingOut ? <div className="spinner"></div> : ''}
				</main>
			</div>

			{notification && <div className="notification">{notification}</div>}
		</div>
	);
}
