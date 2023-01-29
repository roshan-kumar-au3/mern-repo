import axios from "axios";
import { createSlice } from "@reduxjs/toolkit";

import { baseApiUrl } from "../constants/app";

const filterSlice = createSlice({
	name: "filter",
	initialState: {
		linkedInfilter: {
		},
		selectedProfile: [],
		linkedSearchResult: {
			isLoading: false,
			isSuccess: false,
			isError: false,
			errorMessage: null,
			data: [],
		}
	},
	reducers: {
		setFilter: (state, action) => {
			state.linkedInfilter = action.payload;
		},
		setSelectedProfile: (state, action) => {
			const isProfileSelected = state.selectedProfile.filter(profile => profile.id === action.payload.id);
			if (isProfileSelected.length === 0) {
				state.selectedProfile.push(action.payload);
			} else {
				state.selectedProfile = state.selectedProfile.filter(profile => profile.id !== action.payload.id);
			}
		},
		linkedSearchLoading: (state) => {
			state.linkedSearchResult.isLoading = true;
		},
		linkedSearchSuccess: (state, action) => {
			state.linkedSearchResult.isLoading = false;
			state.linkedSearchResult.isSuccess = true;
			state.linkedSearchResult.data = action.payload;
		},
		linkedSearchError: (state, action) => {
			state.linkedSearchResult.isLoading = false;
			state.linkedSearchResult.isError = true;
			state.linkedSearchResult.errorMessage = action.payload;
		},
	},
});

export const getLinkedInSearchDataAsync = (filterData) => async (dispatch, getState) => {
	const { filter } = getState();
	const { accessToken } = getState().auth;
	console.log(filter, accessToken, 'filter, accessToken');
	try {
		const url = `${baseApiUrl}/users/linkedin-scrape`;
		const data = { linkedinFilterQuery: filterData }
		const options = {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
				authorization: `Bearer ${accessToken}`
			},
			responseType: 'json',
			responseEncoding: 'utf8',
			url,
			data,
		}
		dispatch(linkedSearchLoading());
		const response = await axios(options);
		console.log(response.data);
		dispatch(linkedSearchSuccess(response.data));
		return response.data;
	} catch (err) {
		console.log(err);
		const msg = err?.response?.data?.errors[0]?.msg ?? "Something went wrong";
		const param = err?.response?.data?.errors[0]?.param ?? "";
		const errMsg = param ? `${param}: ${msg}` : msg;
		dispatch(linkedSearchError(errMsg));
	}
};

export const getSearchDataAsync = (filterData) => async (dispatch, getState) => {
	const { filter } = getState();
	const { accessToken } = getState().auth;
	console.log(filter, accessToken, 'filter, accessToken');
	try {
		const url = `${baseApiUrl}/users/search-results`;
		const data = { searchQuery: filterData.searchQuery }
		const options = {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
				authorization: `Bearer ${accessToken}`
			},
			responseType: 'json',
			responseEncoding: 'utf8',
			url,
			data,
		}
		dispatch(linkedSearchLoading());
		const response = await axios(options);
		dispatch(linkedSearchSuccess(response.data.reverse()));
		return response.data;
	} catch (err) {
		console.log(err);
		const msg = err?.response?.data?.errors[0]?.msg ?? "Something went wrong";
		const param = err?.response?.data?.errors[0]?.param ?? "";
		const errMsg = param ? `${param}: ${msg}` : msg;
		dispatch(linkedSearchError(errMsg));
	}
};

export const saveSelectedProfilesAsync = (selectedProfiles) => async (dispatch, getState) => {

};


export const { setFilter, setSelectedProfile, linkedSearchError, linkedSearchLoading, linkedSearchSuccess } = filterSlice.actions;

export default filterSlice.reducer;
