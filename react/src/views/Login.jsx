import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStateContext } from '../contexts/ContextProvider';
import axiosClient from '../axiosClient';

export default function Login() {
	const emailRef = useRef();
	const passwordRef = useRef();
	const [errors, setErrors] = useState();
	const [showSpinner, setShowSpinner] = useState(false);
	const { setUser, setToken } = useStateContext();

	const onSubmit = (e) => {
		e.preventDefault();
		const payload = {
			email: emailRef.current.value,
			password: passwordRef.current.value,
		};

		setErrors(null);
		setShowSpinner(true);

		axiosClient
			.post('/login', payload)
			.then(({ data }) => {
				setUser(data.user);
				setToken(data.token);
			})
			.catch((error) => {
				const response = error.response;
				if (response && response.status === 422) {
					if (response.data.errors) {
						setErrors(response.data.errors);
					} else {
						setErrors({
							email: [response.data.message],
						});
					}
				}
			})
			.finally(() => {
				setShowSpinner(false);
			});
	};

	return (
		<div className="login-signup-form animated fadeInRotate">
			<div className="form">
				<form onSubmit={onSubmit}>
					<h1 className="title">Login to your account</h1>
					<div>{showSpinner && <div className="spinner"></div>}</div>
					{errors && (
						<div className="alert">
							{Object.keys(errors).map((key) => (
								<p key={key}>{errors[key][0]}</p>
							))}
						</div>
					)}
					<input ref={emailRef} type="email" placeholder="Email" />
					<input ref={passwordRef} type="password" placeholder="Password" />
					<button className="btn btn-block">Login</button>
					<p className="message">
						Not Registered? <Link to="/signup">Create a new Account!</Link>
					</p>
				</form>
			</div>
		</div>
	);
}
