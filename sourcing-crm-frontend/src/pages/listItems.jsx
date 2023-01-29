import React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

export const mainListItems = (
	<React.Fragment>
		<ListItemButton>
			<ListItemText primary="Job Title" />
		</ListItemButton>
		<ListItemButton>
			<ListItemText primary="Location" />
		</ListItemButton>
		<ListItemButton>
			<ListItemText primary="Company" />
		</ListItemButton>
		<ListItemButton>
			<ListItemText primary="Skills & Assesment" />
		</ListItemButton>
		<ListItemButton>
			<ListItemText primary="Education" />
		</ListItemButton>
		<ListItemButton>
			<ListItemText primary="Experience" />
		</ListItemButton>
		<ListItemButton>
			<ListItemText primary="Year of Graduation" />
		</ListItemButton>
		<ListItemButton>
			<ListItemText primary="Keywords" />
		</ListItemButton>
	</React.Fragment>
);
