import reducerUtils from '../../core/common/reducer-utils';

export default function menusReducer(state = {}, action) {
	let myState = {};
	switch(action.type) {
    	case 'LOAD_INIT_MENUS': {
    		return processInit(state,action);
    	}
    	case 'LOAD_LIST_MENUS': {
			return processList(state,action);
		}
    	default:
    		return state;
	}
}

const processInit = (state,action) => {
  if (action.responseJson != null && action.responseJson.params != null) {
    return Object.assign({}, state, {
      prefForms: Object.assign({}, state.prefForms, reducerUtils.getPrefForms(action)),
      prefTexts: Object.assign({}, state.prefTexts, reducerUtils.getPrefTexts(action)),
      prefLabels: Object.assign({}, state.prefLabels, reducerUtils.getPrefLabels(action)),
      prefOptions: Object.assign({}, state.prefOptions, reducerUtils.getPrefOptions(action)),
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