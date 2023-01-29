import React, { useState } from 'react';
import { Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Error from '../components/Error';
import Loader from '../components/Loader';
import { registerUserAsync } from '../redux/authSlice';

import logo from '../assets/logo.png';
import typing from '../assets/typing.png';

import '../styles/login.scss';
import { validateLoginInput } from '../util/validations';

const Signup = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isError, setIsError] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');
	const isCreateUserLoading = useSelector((state) => state.auth.createUser.isLoading);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsError(false);

		const data = {
			email,
			password
		};

		const errorResult = validateLoginInput(data);

		if (!errorResult.isValid) {
			setIsError(true);
			Object.keys(errorResult.errors).forEach((item) => {
				if (item) {
					setErrorMsg(errorResult.errors[item]);
					return;
				}
			});

			return;
		}

		try {
			await dispatch(registerUserAsync({ email, password }))
			setIsError(false);
			navigate('/login');
		} catch (error) {
			throw error;
		}
	}


	return (
		<div style={{ background: "#fff", minHeight: "100vh", height: "100%", width: "100%" }}>
			<div id="loginPage">
				<form style={{ width: "100%", flex: "1" }} onSubmit={handleSubmit}>
					<div className='login-wrapper' style={{ height: "100%", padding: "0 20px", display: "flex", justifyContent: "center", alignItems: "center" }}>
						<div className='login-left'>
							<div style={{ marginBottom: 50 }}>
								<img
									src={logo}
									alt="logo"
									style={{
										maxWidth: 150,
										marginBottom: 10
									}}
								/>
								<h1
									style={{
										fontSize: 30,
										color: '#008095',
										marginBottom: 15,
										fontWeight: '800',
										marginTop: 0
									}}
								>
									EasySource
								</h1>
							</div>
							<div>
								<div style={{ marginBottom: 20 }}>
									<input
										style={{ background: "transparent", borderBottom: "1.5px solid rgba(0,0,0,0.2)", borderRadius: 0 }}
										required
										className="login-input"
										placeholder='Username'
										type='email'
										value={email}
										onChange={(e) => setEmail(e.target.value)}
									/>
								</div>
								<div style={{ marginBottom: 20 }}>
									<input
										style={{ background: "transparent", borderBottom: "1.5px solid rgba(0,0,0,0.2)", borderRadius: 0 }}
										required
										placeholder='Password'
										className="login-input"
										type='password'
										value={password}
										onChange={(e) => setPassword(e.target.value)}
									/>
								</div>
								<div style={{ marginTop: 40 }}>
									<Button
										size="small"
										variant="contained"
										style={{
											background: '#008095',
											fontFamily: "Poppins",
											letterSpacing: "0.01em",
											borderRadius: 15,
											padding: '5px 50px',
											fontSize: 16,
											backgroundImage: "linear-gradient(to right, #23597C, #008095)"
										}}
										type='submit'
										disabled={isCreateUserLoading}
									>
										Signup
									</Button>
								</div>
								<Link to={'/login'} style={{ marginTop: 15, color: '#008095', fontWeight: '600', marginBottom: 10, fontSize: 16, textDecoration: 'none', display: 'block' }}>
									Login
								</Link>
								<div style={{ minHeight: 55, margin: "1rem" }}>
									{isCreateUserLoading && <Loader />}
									{isError && <Error errorMsg={errorMsg} />}
								</div>
							</div>
						</div>
						<div className='login-right' style={{ maxWidth: "50%" }}>
							<img
								src={typing}
								alt="logo"
								style={{ width: "100%", maxWidth: 500 }}
							/>
						</div>
					</div>
				</form>
				<div style={{ width: "100%", height: 20, backgroundColor: "#23597C" }}></div>
			</div>
		</div>
	)
};

export default Signup;