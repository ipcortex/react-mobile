const initialRecentsState = [];

export const actions = {
	AddRecentCall: 'ADD_RECENT'
};

export default function recentsReducer(state = initialRecentsState, action) {
	switch (action.type) {
		case actions.AddRecentCall:
			return state.concat(action.call).sort(function (a, b) {
				return b.stamp - a.stamp;
			});
		default:
			return state;
	}
}

