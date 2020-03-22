import reducerUtils from '../../core/common/reducer-utils';

export default function preferencesReducer(state = {}, action) {
	let myState = {};
	switch(action.type) {
    	case 'LOAD_INIT_PREFERENCE': {
    		if (action.responseJson != null && action.responseJson.params != null) {
    		    return Object.assign({}, state, {
	    			appTexts: Object.assign({}, state.appTexts, reducerUtils.getAppTexts(action)),
	    			appLabels: Object.assign({}, state.appLabels, reducerUtils.getAppLabels(action)),
	    			appOptions: Object.assign({}, state.appOptions, reducerUtils.getAppOptions(action)),
	    		 	columns: reducerUtils.getColumns(action),
	    			itemCount: reducerUtils.getItemCount(action),
	    		 	items: reducerUtils.getItems(action),
	    		  	listLimit: reducerUtils.getListLimit(action),
	    			listStart: reducerUtils.getListStart(action),
	    			orderCriteria: [{'orderColumn':'ADMIN_PREFERENCE_TABLE_NAME','orderDir':'ASC'}],
    				searchCriteria: [{'searchValue':'','searchColumn':'ADMIN_PREFERENCE_TABLE_NAME'}],
    				selected: null,
    				isModifyOpen: false,
    				isUserRoleOpen: false
    		    });
    		} else {
    		    return state;
    		}
    	}
    	case 'LOAD_LIST_PREFERENCE': {
    		if (action.responseJson != null && action.responseJson.params != null) {
    		    return Object.assign({}, state, {
    		    	itemCount: reducerUtils.getItemCount(action),
    		    	items: reducerUtils.getItems(action),
    		    	listLimit: reducerUtils.getListLimit(action),
    		    	listStart: reducerUtils.getListStart(action),
    		    	selected: null,
    				isModifyOpen: false,
    				isUserRoleOpen: false
    		    });
    		} else {
    		    return state;
    		}
    	}
    	case 'PREFERENCES_PREFERENCE': {
			if (action.responseJson !=  null && action.responseJson.params != null) {
				// load inputFields
				let inputFields = {};
				let appForms = reducerUtils.getAppForms(action);
				inputFields = reducerUtils.loadInputFields(action.responseJson.params.item,appForms.ADMIN_PREFERENCE_FORM,inputFields);
				// add id if this is existing item
				if (action.responseJson.params.item != null) {
					inputFields.itemId = action.responseJson.params.item.id;
				}
				return Object.assign({}, state, {
					appForms: Object.assign({}, state.appForms, reducerUtils.getAppForms(action)),
					selected : action.responseJson.params.item,
					inputFields : inputFields,
					isModifyOpen: true
				});
			} else {
				return state;
			}
		}
		case 'PREFERENCES_INPUT_CHANGE': {
			if (action.params != null) {
				let inputFields = Object.assign({}, state.inputFields);
				inputFields[action.params.field] = action.params.value;
				let clone = Object.assign({}, state);
				clone.inputFields = inputFields;
				return clone;
			} else {
		        return state;
		    }
		}
		case 'PREFERENCES_LISTLIMIT': {
			return reducerUtils.updateListLimit(state,action);
		}
		case 'PREFERENCES_SEARCH': { 
			return reducerUtils.updateSearch(state,action);
		}
		case 'PREFERENCES_ORDERBY': { 
			return reducerUtils.updateOrderBy(state,action);
		}
    	default:
    		return state;
	}
}
