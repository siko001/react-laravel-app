import { Link } from 'react-router-dom';
import axiosClient from '../axiosClient';
import { useStateContext } from '../contexts/ContextProvider';
import { useRef, useState } from 'react';

export default function SignUp() {
	const nameRef = useRef();
	const emailRef = useRef();
	const passwordRef = useRef();
	const passwordConfirmationRef = useRef();
	const [errors, setErrors] = useState();
	const [showSpinner, setShowSpinner] = useState(false);
	const { setUser, setToken } = useStateContext();

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [passwordConfirmation, setPasswordConfirmation] = useState('');

	const isNameValid = name.length >= 4 && !/\d/.test(name);
	const isEmailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
	const isPasswordValid = password.length >= 8 && /^(?=.*[@$!%*?&])/.test(password);
	const isPasswordConfirmationValid = passwordConfirmation === password;

	const onSubmit = (e) => {
		e.preventDefault();
		setShowSpinner(true);

		const payload = {
			name,
			email,
			password,
			password_confirmation: passwordConfirmation,
		};
		axiosClient
			.post('/signup', payload)
			.then(({ data }) => {
				setUser(data.user);
				setToken(data.token);
			})
			.catch((errors) => {
				const response = errors.response;
				if (response && response.status == 422) {
					console.log(response.data.errors);
					setErrors(response.data.errors);
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
					<h1 className="title">Create a new account</h1>
					<div>{showSpinner && <div className="spinner"></div>}</div>
					{errors && (
						<div className="alert">
							{Object.keys(errors).map((key) => (
								<p key={key}>{errors[key][0]}</p>
							))}
						</div>
					)}
					<input
						type="text"
						placeholder="Name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						className={name === '' ? '' : isNameValid ? 'validInput' : 'notValid'}
					/>
					<input
						type="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className={email === '' ? '' : isEmailValid ? 'validInput' : 'notValid'}
					/>
					<input
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className={password === '' ? '' : isPasswordValid ? 'validInput' : 'notValid'}
					/>
					<input
						type="password"
						placeholder="Confirm Password"
						value={passwordConfirmation}
						onChange={(e) => setPasswordConfirmation(e.target.value)}
						className={passwordConfirmation === '' ? '' : isPasswordConfirmationValid ? 'validInput' : 'notValid'}
					/>
					<button className="btn btn-block">Sign Up Now</button>
					<p className="message">
						Already Registered? <Link to="/login">Login here!</Link>
					</p>
				</form>
			</div>
		</div>
	);
}
