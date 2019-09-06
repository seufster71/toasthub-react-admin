import reducerUtils from '../../core/common/reducer-utils';

export default function languagesReducer(state = {}, action) {
	let myState = {};
	switch(action.type) {
		case 'LOAD_INIT_LANGUAGES': {
			return processInit(state,action);
		}
		case 'LOAD_LIST_LANGUAGES': {
			return processList(state,action);
		}
		default:
			return state;
	}
}

const processInit = (state,action) => {
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
			listStart: reducerUtils.getListStart(action)
		});
	} else {
		return state;
	}
};

const processList = (state,action) => {
	if (action.responseJson != null && action.responseJson.params != null) {
		return Object.assign({}, state, {
			itemCount: reducerUtils.getItemCount(action),
			items: reducerUtils.getItems(action),
			listLimit: reducerUtils.getListLimit(action),
			listStart: reducerUtils.getListStart(action)
		});
	} else {
		return state;
	}
};
