import actionTypes from './masking.actionTypes'
import initialState from './masking.initialState'

const configReducer = (state, { type }) => {
	if (typeof state === 'undefined') {
		return initialState
	}

	switch (type) {
		case actionTypes.SHOW_MASKING:
			return {
				isMasked: true,
			}

		case actionTypes.HIDE_MASKING:
			return {
				isMasked: false,
			}

		default:
			return state
	}
}

export default configReducer
