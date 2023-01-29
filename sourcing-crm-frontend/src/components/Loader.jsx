import React from 'react';

import loadingGif from '../assets/loading.gif';

const Loader = () => {
	return (
		<div style={{ margin: '1rem' }}>
			<img src={loadingGif} alt='' height='50px' />
		</div>
	)
}

export default Loader;
