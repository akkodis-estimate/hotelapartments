import actionTypes from './masking.actionTypes'

const showMasking = () => ({
	type: actionTypes.SHOW_MASKING,
})

const hideMasking = () => ({
	type: actionTypes.HIDE_MASKING,
})

export default {
	showMasking,
	hideMasking,
}
