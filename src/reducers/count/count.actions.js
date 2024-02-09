import actionTypes from './count.actionTypes'

const updateInboxCount = (data) => ({
	type: actionTypes.UPDATE_INBOX_COUNT,
	payload: data,
})

const resetInboxCount = () => ({
	type: actionTypes.RESET_INBOX_COUNT,
})

// eslint-disable-next-line import/no-anonymous-default-export
export default {
	updateInboxCount,
	resetInboxCount
}
