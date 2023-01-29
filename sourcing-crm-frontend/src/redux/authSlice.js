import axios from "axios";
import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import { baseApiUrl } from "../constants/app";

export const authSlice = createSlice({
	name: "auth",
	initialState: {
		isLoggedIn: false,
		user: null,
		accessToken: null,
		refreshToken: null,
		createUser: {
			isLoading: false,
			isSuccess: false,
			isError: false,
			errorMessage: null,
		},
		loginApiResult: {
			isLoading: false,
			isSuccess: false,
			isError: false,
			errorMessage: null,
		},
	},
	reducers: {
		login: (state, action) => {
			state.user = action.payload.user;
			state.accessToken = action.payload.accessToken;
			state.refreshToken = action.payload.refreshToken;
			state.loginApiResult.isLoading = false;
			state.loginApiResult.isSuccess = true;
			state.loginApiResult.isError = false;
			state.loginApiResult.errorMessage = null;
			state.isLoggedIn = true;
		},
		loginLoading: (state) => {
			state.loginApiResult.isLoading = true;
			state.loginApiResult.isSuccess = false;
			state.loginApiResult.isError = false;
			state.loginApiResult.errorMessage = null;
		},
		logout: (state) => {
			state.user = null;
			state.accessToken = null;
			state.refreshToken = null;
		},
		registerUserLoading: (state) => {
			state.createUser.isLoading = true;
		},
		registerUserSuccess: (state) => {
			state.createUser.isLoading = false;
			state.createUser.isSuccess = true;
		},
		registerUserError: (state, action) => {
			state.createUser.isLoading = false;
			state.createUser.isError = true;
			state.createUser.errorMessage = action.payload;
		}

	},
	extraReducers: {

	},
});

export const registerUserAsync = (data) => async (dispatch) => {
	try {
		dispatch(registerUserLoading());
		toast("Registering user...", { type: "info" });
		console.log(data);
		const response = await axios.post(`${baseApiUrl}/users/register`, data);
		console.log(response);
		dispatch(registerUserSuccess());
		toast("User registered successfully", { type: "success" });
		//   history.push("/login");
		//   return <Redirect to="/login" />;
		return response;
	} catch (err) {
		//   throw new Error(err);
		console.log(err);
		const msg = err?.response?.data?.errors[0]?.msg ?? "Something went wrong";
		const param = err?.response?.data?.errors[0]?.param ?? "";
		const errMsg = param ? `${param}: ${msg}` : msg;
		dispatch(registerUserError(errMsg));
		toast(errMsg, { type: "error" });
	}
};

export const loginUserAsync = (data) => async (dispatch) => {
	try {
		dispatch(loginLoading());
		toast("Logging user...", { type: "info" });
		console.log(data);
		const response = await axios.post(`${baseApiUrl}/users/login`, data);
		console.log(response);
		dispatch(login(response.data));
		toast("Login Success", { type: "success" });
		//   history.push("/login");
		//   return <Redirect to="/login" />;
		return response;
	} catch (err) {
		//   throw new Error(err);
		console.log(err);
		const msg = err?.response?.data?.errors[0]?.msg ?? "Something went wrong";
		const param = err?.response?.data?.errors[0]?.param ?? "";
		const errMsg = param ? `${param}: ${msg}` : msg;
		dispatch(registerUserError(errMsg));
		toast(errMsg, { type: "error" });
	}
};

export const { login, logout, registerUserLoading, registerUserSuccess, registerUserError, loginLoading, } = authSlice.actions;

export default authSlice.reducer;
