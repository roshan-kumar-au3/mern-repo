import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/system';

const Error = (props) => {
	const { errorMsg } = props;

	const [style, setStyle] = useState({ display: 'block' });

	if (!errorMsg) return <> </>;

	setTimeout(() => {
		setStyle({ display: 'none' })
	}, 3000);

	return (
		<div>
			<Box align='center' mt={2} mb={2} style={style}>
				<h3 style={{ color: 'red' }}> {errorMsg}</h3>
			</Box>
		</div>
	)
}

Error.propTypes = {
	errorMsg: PropTypes.string
}

export default Error;
