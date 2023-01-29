import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useSearchParams } from 'react-router-dom';
import { getSearchDataAsync, setSelectedProfile } from '../redux/filterSlice';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { mainListItems } from './listItems';
// import Chart from './Chart';
// import Deposits from './Deposits';
// import Orders from './Orders';

function Copyright(props) {
	return (
		<Typography variant="body2" color="text.secondary" align="center" {...props}>
			{'Copyright © '}
			<Link color="inherit" href="https://mui.com/">
				Your Website
			</Link>{' '}
			{new Date().getFullYear()}
			{'.'}
		</Typography>
	);
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
	zIndex: theme.zIndex.drawer + 1,
	transition: theme.transitions.create(['width', 'margin'], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	...(open && {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	}),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
	({ theme, open }) => ({
		'& .MuiDrawer-paper': {
			position: 'relative',
			whiteSpace: 'nowrap',
			width: drawerWidth,
			transition: theme.transitions.create('width', {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.enteringScreen,
			}),
			boxSizing: 'border-box',
			...(!open && {
				overflowX: 'hidden',
				transition: theme.transitions.create('width', {
					easing: theme.transitions.easing.sharp,
					duration: theme.transitions.duration.leavingScreen,
				}),
				width: theme.spacing(7),
				[theme.breakpoints.up('sm')]: {
					width: theme.spacing(9),
				},
			}),
		},
	}),
);

const mdTheme = createTheme();

const profileData = [
	{
		"id": 1,
		"jobTitle": "Software Engineer",
		"location": "San Francisco, CA",
		"company": "Google",
		"skillAssessments": "Java, Python, C++",
		"education": "Bachelors",
		"experience": "5 years",
		"yearOfGrad": "2015",
		"firstname": "John",
		"lastname": "Doe",
		"title": "Software Engineer",
		"school": "Stanford University"
	},
	{
		"id": 2,
		"jobTitle": "Software Engineer",
		"location": "San Francisco, CA",
		"company": "Google",
		"skillAssessments": "Java, Python, C++",
		"education": "Bachelors",
		"experience": "5 years",
		"yearOfGrad": "2015",
		"firstname": "Jane",
		"lastname": "Doe",
		"title": "Software Engineer",
		"school": "Stanford University"
	},
	{
		"id": 3,
		"jobTitle": "Software Engineer",
		"location": "San Francisco, CA",
		"company": "Google",
		"skillAssessments": "Java, Python, C++",
		"education": "Bachelors",
		"experience": "5 years",
		"yearOfGrad": "2015",
		"firstname": "John",
		"lastname": "Smith",
		"title": "Software Engineer",
		"school": "Stanford University"
	},
]

const Search = () => {
	//   const location = useLocation();
	let [searchParams, setSearchParams] = useSearchParams();
	const [open, setOpen] = useState(true);
	const toggleDrawer = () => {
		setOpen(!open);
	};
	const { jobTitle, location, company, education, experience, school, skillAssessments, yearOfGrad, keywords } = useSelector(state => state.filter.linkedInfilter);
	const [project, setProject] = React.useState('');
	const [projectList, setProjectList] = React.useState([]);
	const selectedProfile = useSelector(state => state.filter.selectedProfile);
	const linkedSearchResult = useSelector(state => state.filter.linkedSearchResult);

	const dispatch = useDispatch();

	useEffect(() => {
		if (searchParams.get('q')) {
			dispatch(getSearchDataAsync({ searchQuery: searchParams.get('q') }))
		}
	}, []);

	const handleCheckboxChange = (e, profile) => {
		console.log(e.target.checked, profile);
		dispatch(setSelectedProfile(profile));
	}

	const isProfileSelected = (profile) => {
		const getSelectedProfile = selectedProfile.find((item) => item.id === profile.id);
		if (getSelectedProfile) {
			return true;
		}
		return false;
	}

	const handleAddProject = (e, profile) => {
		e.preventDefault();
		setProject(e.target.value);
		setProjectList([...projectList, { ...profile, project: e.target.value }]);
		console.log({ profile, value: e.target.value });
	}

	const getProjectValue = (profile) => {
		const getSelectedProfile = projectList.find((item) => item.id === profile.id);
		if (getSelectedProfile) {
			return getSelectedProfile.project;
		}
		return '';
	}

	const handleSave = () => {

	}

	return (
		// <Box sx={{ width: '100vw', padding: '0 12px' }}>
		//     <h2>Search/Result page</h2>
		//     <Box sx={{ display: 'flex', flexDirection: 'row', gap: '10px', width: '100%', height: '100%'}}>
		//         <section id='leftPanel' style={{ border: '1px solid black', height: '95vh', width: '20%', padding: '8px' }}>
		//             <h3>Left Panel</h3>
		//             <hr></hr>
		//             <div>
		//                 <h4>Job Title</h4>
		//                 {/* show job title from filter */}
		//                 <p>{jobTitle ?? ""}</p>
		//             </div>
		//             <div>
		//                 <h4>Location</h4>
		//                 {/* show location from filter */}
		//                 {location ?? ""}
		//             </div>
		//             <div>
		//                 <h4>Company</h4>
		//                 {/* show company from filter */}
		//                 {company ?? ""}
		//             </div>
		//             <div>
		//                 <h4>Skills & Assesment</h4>
		//                 {/* show skills & assesment from filter */}
		//                 {skillAssessments ?? ""}
		//             </div>
		//             <div>
		//                 <h4>Education</h4>
		//                 {/* show education from filter */}
		//                 {education ?? ""}
		//             </div>
		//             <div>
		//                 <h4>Experience</h4>
		//                 {/* show experience from filter */}
		//                 {experience ?? ""}
		//             </div>
		//             <div>
		//                 <h4>Year of Graduation</h4>
		//                 {/* show year of graduation from filter */}
		//                 {yearOfGrad ?? ""}
		//             </div>
		//             <div>
		//                 <h4>Keywords</h4>
		//                 {/* Show keywords from filter */}
		//                 {/* <div>
		//                     <h5>First Name :  {keywords?.firstname ?? ""}</h5>
		//                     <h5>Last Name :  {keywords?.lastname ?? ""}</h5>
		//                     <h5>Title :  {keywords?.title ?? ""}</h5>
		//                     <h5>School :  {keywords?.school ?? ""}</h5>
		//                 </div> */}
		//             </div>
		//         </section>
		//         <section id='result_list' style={{ border: '1px solid black', width: '80%'}}>
		//             <h3>Result List</h3>
		//             <hr></hr>
		//             <div style={{ padding: '12px',}}>
		//                 {
		//                     Array.isArray(linkedSearchResult?.data) && linkedSearchResult?.data.length > 0 &&  linkedSearchResult.data.map((profile) => {
		//                         return (
		//                             <div key={profile.id} style={{ display: 'flex', flexDirection: 'row', gap: '10px', width: '100%', height: '100%', marginBottom: '10px'}}>
		//                                 <div>
		//                                     <input type='checkbox' checked={isProfileSelected(profile)} onChange={(e) => handleCheckboxChange(e, profile)}/>
		//                                 </div>
		//                                 <div style={{ border: '1px solid black', width: '10%'}}>
		//                                     <img src={profile?.profilePicUrl  ?? ''} alt='profile' style={{ width: '100%', height: '100%'}}/>
		//                                 </div>
		//                                 <div style={{ border: '1px solid black', width: '80%'}}>
		//                                     <h4>{profile?.name ?? ''}</h4>
		//                                     <h4>{profile?.location ?? ''}</h4>
		//                                     <h4>{profile?.jobTitle ?? ''}</h4>
		//                                 </div>
		//                                 <FormControl sx={{ width: '250px'}}>
		//                                     <InputLabel id="demo-simple-select-label">Add To Project</InputLabel>
		//                                     <Select
		//                                     labelId="demo-simple-select-label"
		//                                     id="demo-simple-select"
		//                                     value={getProjectValue(profile)}
		//                                     label="Age"
		//                                     onChange={(e) => handleAddProject(e, profile)}
		//                                     sx={{ height: '45px'}}
		//                                     >
		//                                     <MenuItem value={"sales drive"}>Sales Drive</MenuItem>
		//                                     <MenuItem value={"tech drive"}>Tech Drive</MenuItem>
		//                                     </Select>
		//                                 </FormControl>
		//                             </div>
		//                         )
		//                     })
		//                 }
		//             </div>
		//             <button onClick={handleSave}>Save</button>
		//         </section>
		//     </Box>
		// </Box>
		<ThemeProvider theme={mdTheme}>
			<Box sx={{ display: 'flex' }}>
				<CssBaseline />
				<AppBar position="absolute" open={open}>
					<Toolbar
						sx={{
							pr: '24px', // keep right padding when drawer closed
						}}
					>
						<IconButton
							edge="start"
							color="inherit"
							aria-label="open drawer"
							onClick={toggleDrawer}
							sx={{
								marginRight: '36px',
								...(open && { display: 'none' }),
							}}
						>
							<MenuIcon />
						</IconButton>
						<Typography
							component="h1"
							variant="h6"
							color="inherit"
							noWrap
							sx={{ flexGrow: 1 }}
						>
							Search Results
						</Typography>
					</Toolbar>
				</AppBar>
				<Drawer variant="permanent" open={open}>
					<Toolbar
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'flex-end',
							px: [1],
						}}
					>
						<IconButton onClick={toggleDrawer}>
							<ChevronLeftIcon />
						</IconButton>
					</Toolbar>
					<Divider />
					<List component="nav">
						{mainListItems}
						<Divider sx={{ my: 1 }} />
						{/* {secondaryListItems} */}
					</List>
				</Drawer>
				<Box
					component="main"
					sx={{
						backgroundColor: (theme) =>
							theme.palette.mode === 'light'
								? theme.palette.grey[100]
								: theme.palette.grey[900],
						flexGrow: 1,
						height: '100vh',
						overflow: 'auto',
					}}
				>
					<Toolbar />
					<Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
						{/* <Grid container spacing={3}> */}
						{/* Chart */}
						<Grid container xs={12} md={8} lg={9} spacing={2}>
							{
								linkedSearchResult?.data && linkedSearchResult.data.map((profile) => (
									<Grid item xs={12} md={12} lg={12}>
										<CardActionArea component="a" href="#">
											<Card sx={{ display: 'flex' }}>
												<CardMedia
													component="img"
													sx={{ width: 160, display: { xs: 'none', sm: 'block' } }}
													image={profile.profilePicUrl}
													alt=''
												/>
												<CardContent sx={{ flex: 1 }}>
													<Typography component="h2" variant="h5">
														{profile.name}
													</Typography>
													<Typography component="h2" variant="h5">
														{profile.email ? profile.email : ''}
													</Typography>
													<Typography variant="subtitle1" color="text.secondary">
														{profile.location}
													</Typography>
													<Typography variant="subtitle1" paragraph>
														{profile.jobTitle}
													</Typography>
													{/* <Typography variant="subtitle1" color="primary">
														Continue reading...
													</Typography> */}
												</CardContent>
											</Card>
										</CardActionArea>
									</Grid>
								))
							}
						</Grid>
						{/* Recent Deposits */}
						{/* <Grid item xs={12} md={4} lg={3}>
								<Paper
									sx={{
										p: 2,
										display: 'flex',
										flexDirection: 'column',
										height: 240,
									}}
								>
									<Deposits />
								</Paper>
							</Grid> */}
						{/* Recent Orders */}
						{/* <Grid item xs={12}>
								<Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
									<Orders />
								</Paper>
							</Grid> */}
						{/* </Grid> */}
						{/* <Copyright sx={{ pt: 4 }} /> */}
					</Container>
				</Box>
			</Box>
		</ThemeProvider>
	)
}

export default Search