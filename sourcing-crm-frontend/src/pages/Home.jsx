import { Box } from '@mui/system';
import React from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getLinkedInSearchDataAsync, setFilter } from '../redux/filterSlice';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AddressForm from '../components/AddressForm';

const theme = createTheme();

const Home = () => {
	const [jobTitle, setJobTitle] = React.useState('');
	const [location, setLocation] = React.useState('');
	const [company, setCompany] = React.useState('');
	const [skillAssessments, setSkillAssessments] = React.useState('');
	const [education, setEducation] = React.useState('');
	const [experience, setExperience] = React.useState('');
	const [yearOfGrad, setYearOfGrad] = React.useState('');
	const [firstname, setFirstname] = React.useState('');
	const [lastname, setLastname] = React.useState('');
	const [title, setTitle] = React.useState('');
	const [school, setSchool] = React.useState('');

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleSearch = async (e) => {
		e.preventDefault();
		await dispatch(setFilter({ jobTitle, location, company, skillAssessments, education, experience, yearOfGrad, keywords: { firstname, lastname, title, school } }))
		await dispatch(getLinkedInSearchDataAsync({ jobTitle, location, company, skillAssessments, education, experience, yearOfGrad, keywords: { firstname, lastname, title, school } }));
		navigate("/search");
	}

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<AppBar
				position="absolute"
				color="default"
				elevation={0}
				sx={{
					position: 'relative',
					borderBottom: (t) => `1px solid ${t.palette.divider}`,
				}}
			>
				<Toolbar>
					<Typography variant="h6" color="inherit" noWrap>
						EasySource
					</Typography>
				</Toolbar>
			</AppBar>
			<Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
				<Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
					<Typography component="h1" variant="h4" align="center">
						Search Filters
					</Typography>
					<React.Fragment>
						<AddressForm
							jobTitle={jobTitle}
							setJobTitle={setJobTitle}
							location={location}
							setLocation={setLocation}
							company={company}
							setCompany={setCompany}
							education={education}
							setEducation={setEducation}
							experience={experience}
							setExperience={setExperience}
							yearOfGrad={yearOfGrad}
							setYearOfGrad={setYearOfGrad}
							skillAssessments={skillAssessments}
							setSkillAssessments={setSkillAssessments}
							firstname={firstname}
							setFirstname={setFirstname}
							lastname={lastname}
							setLastname={setLastname}
							title={title}
							setTitle={setTitle}
							school={school}
							setSchool={setSchool}
						/>
						<Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
							<Button
								variant="contained"
								onClick={handleSearch}
								sx={{ mt: 3, ml: 1 }}
							>
								Submit
							</Button>
						</Box>
					</React.Fragment>
				</Paper>
				{/* <Copyright /> */}
			</Container>
		</ThemeProvider>
	)
}

export default Home;