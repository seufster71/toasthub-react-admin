import reducerUtils from '../../core/common/reducer-utils';

export default function usersReducer(state = {}, action) {
	let myState = {};
	switch(action.type) {
		case 'LOAD_INIT_USERS': {
			if (action.responseJson != null && action.responseJson.params != null) {
				return Object.assign({}, state, {
					appForms: Object.assign({}, state.appForms, reducerUtils.getAppForms(action)),
					appTexts: Object.assign({}, state.appTexts, reducerUtils.getAppTexts(action)),
					appLabels: Object.assign({}, state.appLabels, reducerUtils.getAppLabels(action)),
					appOptions: Object.assign({}, state.appOptions, reducerUtils.getAppOptions(action)),
					columns: reducerUtils.getColumns(action),
					itemCount: reducerUtils.getItemCount(action),
					items: reducerUtils.getItems(action),
					listLimit: reducerUtils.getListLimit(action),
					listStart: reducerUtils.getListStart(action),
					selectedUser: null,
					isModifyOpen: false
				});
			} else {
				return state;
			}
		}
		case 'LOAD_LIST_USERS': {
			if (action.responseJson != null && action.responseJson.params != null) {
				return Object.assign({}, state, {
					itemCount: reducerUtils.getItemCount(action),
					items: reducerUtils.getItems(action),
					listLimit: reducerUtils.getListLimit(action),
					listStart: reducerUtils.getListStart(action),
					selectedUser: null,
					isModifyOpen: false
				});
			} else {
				return state;
			}
		}
		case 'USERS_USER': {
			if (action.responseJson !=  null && action.responseJson.params != null) {
				return Object.assign({}, state, {
					selectedUser : action.responseJson.params.item,
					isModifyOpen: true
				});
			} else {
				return state;
			}
		}
		case 'USERS_INPUT_CHANGE': {
			if (action.params != null) {
				let selectedUser = Object.assign({}, state.selectedUser);
				selectedUser[action.params.field] = action.params.value;
				let clone = Object.assign({}, state);
				clone.selectedUser = selectedUser;
				return clone;
			} else {
		        return state;
		    }
		}
		default:
			return state;
	}
}


