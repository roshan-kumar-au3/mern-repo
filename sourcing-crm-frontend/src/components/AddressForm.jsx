import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

export default function AddressForm(props) {
	const { jobTitle, setJobTitle, location, setLocation, company, setCompany, education, setEducation, experience, setExperience, yearOfGrad, setYearOfGrad, skillAssessments, setSkillAssessments, firstname, setFirstname, lastname, setLastname, title, setTitle, school, setSchool } = props;

	return (
		<React.Fragment>
			{/* <Typography variant="h6" gutterBottom>
				Shipping address
			</Typography> */}
			<Grid container spacing={3} style={{ marginBottom: 40 }}>
				<Grid item xs={12} sm={6}>
					<TextField
						required
						id="jobTitle"
						name="jobTitle"
						label="Job Title"
						fullWidth
						// autoComplete="given-name"
						variant="standard"
						value={jobTitle}
						onChange={(e) => setJobTitle(e.target.value)}
					/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField
						required
						id="location"
						name="location"
						label="Location"
						fullWidth
						// autoComplete="family-name"
						variant="standard"
						value={location}
						onChange={(e) => setLocation(e.target.value)}
					/>
				</Grid>
				<Grid item xs={12}>
					<TextField
						required
						id="company"
						name="company"
						label="Company"
						fullWidth
						// autoComplete="shipping address-line1"
						variant="standard"
						value={company}
						onChange={(e) => setCompany(e.target.value)}
					/>
				</Grid>
				<Grid item xs={12}>
					<TextField
						id="education"
						name="education"
						label="Education"
						fullWidth
						// autoComplete="shipping address-line2"
						variant="standard"
						value={education}
						onChange={(e) => setEducation(e.target.value)}
					/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField
						required
						id="experience"
						name="experience"
						label="Experience"
						fullWidth
						// autoComplete="shipping address-level2"
						variant="standard"
						value={experience}
						onChange={(e) => setExperience(e.target.value)}
					/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField
						id="yearOfGrad"
						name="yearOfGrad"
						label="Year of Graduation"
						fullWidth
						variant="standard"
						value={yearOfGrad}
						onChange={(e) => setYearOfGrad(e.target.value)}
					/>
				</Grid>
				<Grid item xs={12} sm={12}>
					<TextField
						required
						id="skillAssessments"
						name="skillAssessments"
						label="Skills & Assessments"
						fullWidth
						// autoComplete="shipping postal-code"
						variant="standard"
						value={skillAssessments}
						onChange={(e) => setSkillAssessments(e.target.value)}
					/>
				</Grid>
				{/* <Grid item xs={12}>
					<FormControlLabel
						control={<Checkbox color="secondary" name="saveAddress" value="yes" />}
						label="Use this address for payment details"
					/>
				</Grid> */}
			</Grid>
			<Typography variant="h6" gutterBottom>
				Keywords
			</Typography>
			<Grid container spacing={3}>
				<Grid item xs={12} sm={6}>
					<TextField
						required
						id="firstName"
						name="firstName"
						label="First name"
						fullWidth
						// autoComplete="given-name"
						variant="standard"
						value={firstname}
						onChange={(e) => setFirstname(e.target.value)}
					/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField
						required
						id="lastName"
						name="lastName"
						label="Last name"
						fullWidth
						// autoComplete="family-name"
						variant="standard"
						value={lastname}
						onChange={(e) => setLastname(e.target.value)}
					/>
				</Grid>
				<Grid item xs={12}>
					<TextField
						required
						id="title"
						name="title"
						label="Title"
						fullWidth
						// autoComplete="shipping address-line1"
						variant="standard"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
				</Grid>
				<Grid item xs={12}>
					<TextField
						id="school"
						name="school"
						label="School"
						fullWidth
						// autoComplete="shipping address-line2"
						variant="standard"
						value={school}
						onChange={(e) => setSchool(e.target.value)}
					/>
				</Grid>
			</Grid>
		</React.Fragment>
	);
}