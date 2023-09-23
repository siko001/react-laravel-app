import { useNavigate, useParams } from 'react-router-dom';
import axiosClient from '../axiosClient';
import { useState, useEffect } from 'react';
import { useStateContext } from '../contexts/ContextProvider';

export default function UserForm() {
	const { setNotification } = useStateContext();
	const navigate = useNavigate();
	const { id } = useParams();
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState();
	const [user, setUser] = useState({
		id: null,
		name: '',
		email: '',
		password: '',
		password_confirmation: '',
	});

	const onSubmit = (e) => {
		e.preventDefault();

		if (user.id) {
			axiosClient
				.put('/users/' + user.id, user)
				.then(() => {
					setNotification('User Was Successfully Update!');
					navigate('/users');
				})
				.catch((errors) => {
					const response = errors.response;
					if (response && response.status == 422) {
						console.log(response.data.errors);
						setErrors(response.data.errors);
						console.log(user);
					}
				});
		} else {
			axiosClient
				.post(`/users`, user)
				.then(() => {
					setNotification('User Was Successfully Created!');
					console.log(user);
					return navigate('/users');
				})
				.catch((errors) => {
					const response = errors.response;
					if (response && response.status == 422) {
						console.log(response.data.errors);
						setErrors(response.data.errors);
					}
				});
		}
	};

	if (id) {
		useEffect(() => {
			setLoading(true);
			axiosClient
				.get(`/users/${id}`)
				.then(({ data }) => {
					setLoading(false);
					setUser(data);
				})
				.catch(() => {
					setLoading(false);
				});
		}, [id]);
	}

	return (
		<>
			{user.id && <h1 style={{ paddingLeft: '15px' }}>Update User: {user.name}</h1>}
			{!user.id && <h1 style={{ paddingLeft: '15px' }}>New User</h1>}
			<div className="card animated fadeInDown">
				{loading && <div className="spinner"></div>}
				{errors && (
					<div className="alert">
						{Object.keys(errors).map((key) => (
							<p key={key}>{errors[key]}</p>
						))}
					</div>
				)}
				{!loading && (
					<form onSubmit={onSubmit}>
						<input value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} placeholder="Name" />
						<input
							type="email	"
							value={user.email}
							onChange={(e) => setUser({ ...user, email: e.target.value })}
							placeholder="Email"
						/>
						<input type="password" onChange={(e) => setUser({ ...user, password: e.target.value })} placeholder="Password" />
						<input
							type="password"
							onChange={(e) => setUser({ ...user, password_confirmation: e.target.value })}
							placeholder="Password Confirmation"
						/>
						<button className="btn">Save</button>
					</form>
				)}
			</div>
		</>
	);
}
