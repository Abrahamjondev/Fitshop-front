const DISPLAY = '"Clash Display", "Plus Jakarta Sans", sans-serif';
const BODY = '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif';

const typography = {
	fontFamily: BODY,
	h1: {
		fontFamily: DISPLAY,
		fontWeight: 600,
		fontSize: 35,
		letterSpacing: '-0.24px',
	},
	h2: {
		fontFamily: DISPLAY,
		fontWeight: 600,
		fontSize: 29,
		letterSpacing: '-0.24px',
	},
	h3: {
		fontFamily: DISPLAY,
		fontWeight: 600,
		fontSize: 24,
		letterSpacing: '-0.06px',
	},
	h4: {
		fontWeight: 500,
		fontSize: 20,
		letterSpacing: '-0.06px',
	},
	h5: {
		fontWeight: 500,
		fontSize: 16,
		letterSpacing: '-0.05px',
	},
	h6: {
		fontWeight: 500,
		fontSize: 14,
		letterSpacing: '-0.05px',
	},
	overline: {
		fontWeight: 500,
	},
};

export default typography;
