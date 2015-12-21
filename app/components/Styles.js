export default {
	buttons: {
		base: {
			display: 'inline-block',
			width: 100,
			height: 100,
			backgroundColor: '#8BC34A',
			textAlign: 'center',
			lineHeight: '100px',
			color: 'white',
			textDecoration: 'none',
			borderRadius: '50px',
			transition: 'background-color .2s, box-shadow .2s',

			':hover': {
				boxShadow: '0 0 5px black'
			},
			':active': {
				backgroundColor: '#7CB342',
				boxShadow: 'none'
			}
		}
	}
};