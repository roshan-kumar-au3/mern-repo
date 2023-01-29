import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Protected from "./components/Protected";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Search from "./pages/Search";

import "react-toastify/dist/ReactToastify.css";
import "./App.scss";

const App = () => {
	const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

	return (
		<Box>
			<Routes>
				<Route path="/" element={
					<Protected isLoggedIn={isLoggedIn}>
						<Home />
					</Protected>
				}
				/>
				<Route path="/search" element={<Search />} />
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<Signup />} />
				<Route path="*" element={<h1>404</h1>} />
			</Routes>
			<ToastContainer autoClose={1000} />
		</Box>
	);
}

export default App;
