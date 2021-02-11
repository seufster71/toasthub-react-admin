/*
 * Copyright (C) 2016 The ToastHub Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import reducerUtils from '../../core/common/reducer-utils';

export default function preferenceSubViewReducer(state = {}, action) {
	switch(action.type) {
		case 'PREFERENCES_SUB_INIT': {
			if (action.responseJson !=  null && action.responseJson.params != null) {
				let orderCriteria = [];
				let searchCriteria = [];
				if (action.subType === "FORM") {
					orderCriteria = [{'orderColumn':'ADMIN_FORMFIELD_TABLE_TITLE','orderDir':'ASC'}];
					searchCriteria = [{'searchValue':'','searchColumn':'ADMIN_FORMFIELD_TABLE_TITLE'}];
				} else if (action.subType === "LABEL") {
					orderCriteria = [{'orderColumn':'ADMIN_LABEL_TABLE_TITLE','orderDir':'ASC'}];
					searchCriteria = [{'searchValue':'','searchColumn':'ADMIN_LABEL_TABLE_TITLE'}];
				} else if (action.subType === "TEXT") {
					orderCriteria = [{'orderColumn':'ADMIN_TEXT_TABLE_TITLE','orderDir':'ASC'}];
					searchCriteria = [{'searchValue':'','searchColumn':'ADMIN_TEXT_TABLE_TITLE'}];
				} else {
					orderCriteria = [{'orderColumn':'ADMIN_OPTION_TABLE_TITLE','orderDir':'ASC'}];
					searchCriteria = [{'searchValue':'','searchColumn':'ADMIN_OPTION_TABLE_TITLE'}];
				}
				return Object.assign({}, state, {
					prefTexts: Object.assign({}, state.prefTexts, reducerUtils.getPrefTexts(action)),
	    			prefLabels: Object.assign({}, state.prefLabels, reducerUtils.getPrefLabels(action)),
	    			prefOptions: Object.assign({}, state.prefOptions, reducerUtils.getPrefOptions(action)),
	    		 	columns: reducerUtils.getColumns(action),
	    		 	itemCount: reducerUtils.getItemCount(action),
	    		 	items: reducerUtils.getItems(action),
	    		  	listLimit: reducerUtils.getListLimit(action),
	    			listStart: reducerUtils.getListStart(action),
	    			orderCriteria: orderCriteria,
    				searchCriteria: searchCriteria,
					paginationSegment: 1,
					selected: null,
					parent: action.parent,
					isModifyOpen: false,
					subType: action.subType,
					pageName:"ADMIN_PREFERENCE_SUB",
					isDeleteModalOpen: false,
					errors:null, 
					warns:null, 
					successes:null,
					searchValue:""
			    });
			} else {
				return state;
			}
		}
		case 'PREFERENCES_SUB_LIST': {
			if (action.responseJson !=  null && action.responseJson.params != null) {
				return Object.assign({}, state, {
	    			itemCount: reducerUtils.getItemCount(action),
	    		 	items: reducerUtils.getItems(action),
	    		  	listLimit: reducerUtils.getListLimit(action),
	    			listStart: reducerUtils.getListStart(action),
	    			paginationSegment: action.paginationSegment,
	    			selected: null,
    				isModifyOpen: false,
    				isDeleteModalOpen: false,
					errors:null, 
					warns:null, 
					successes:null
    		    });
			} else {
				return state;
			}
		}
		case 'PREFERENCES_SUB_ITEM': {
			if (action.responseJson !=  null && action.responseJson.params != null) {
				// load inputFields
				let inputFields = {};
				let prefForms = reducerUtils.getPrefForms(action);
				if (action.subType === "FORM") {
					inputFields = reducerUtils.loadInputFields(action.responseJson.params.item,prefForms.ADMIN_FORMFIELD_FORM,inputFields,action.appPrefs,"FORM1");
				} else if (action.subType === "LABEL") {
					inputFields = reducerUtils.loadInputFields(action.responseJson.params.item,prefForms.ADMIN_LABEL_FORM,inputFields,action.appPrefs,"FORM1");
				} else if (action.subType === "TEXT") {
					inputFields = reducerUtils.loadInputFields(action.responseJson.params.item,prefForms.ADMIN_TEXT_FORM,inputFields,action.appPrefs,"FORM1");
				} else if (action.subType === "OPTION") {
					inputFields = reducerUtils.loadInputFields(action.responseJson.params.item,prefForms.ADMIN_OPTION_FORM,inputFields,action.appPrefs,"FORM1");
				}
				
				// add id if this is existing item
				if (action.responseJson.params.item != null) {
					inputFields.itemId = action.responseJson.params.item.id;
				}
				return Object.assign({}, state, {
					prefForms: Object.assign({}, state.prefForms, reducerUtils.getPrefForms(action)),
					selected : action.responseJson.params.item,
					inputFields : inputFields,
					isModifyOpen: true
				});
			} else {
				return state;
			}
		}
		case 'PREFERENCES_SUB_INPUT_CHANGE': {
			return reducerUtils.updateInputChange(state,action);
		}
		case 'PREFERENCES_SUB_LISTLIMIT': {
			return reducerUtils.updateListLimit(state,action);
		}
		case 'PREFERENCES_SUB_SEARCH': { 
			return reducerUtils.updateSearch(state,action);
		}
		case 'PREFERENCES_SUB_SEARCH_CHANGE': { 
			return Object.assign({}, state, {
				searchValue: action.value
			});
		}
		case 'PREFERENCES_SUB_ORDERBY': { 
			return reducerUtils.updateOrderBy(state,action);
		}
		case 'PREFERENCES_SUB_GOBACK': {
			if (action != null) {
				 return Object.assign({}, state, {
					 items: null,
					 parent: null,
					 selected: null,
					 inputfields: null,
					 subType: null,
					 isModifyOpen: false,
					 moveSelectedItem: null
				 });
			} else {
		        return state;
		    }
		}
		case 'PREFERENCES_SUB_MOVE_SELECT': {
			if (action.item != null) {
				return Object.assign({}, state, {
					moveSelectedItem: action.item
				});
			} else {
		        return state;
		    }
		}
		case 'PREFERENCES_SUBVIEW_MOVE_CANCEL': {
			return Object.assign({}, state, {
				moveSelectedItem: null
			});
		}
		case 'PREFERENCES_SUB_ADD_PARENT': {
			if (action.parent != null) {
				return Object.assign({}, state, {
					parent: action.parent
				});
			} else {
		        return state;
		    }
		}
		case 'PREFERENCES_SUB_CLEAR_PARENT': {
			return Object.assign({}, state, {
				parent: null
			});
		}
		case 'PREFERENCES_SUB_SET_ERRORS': {
			return Object.assign({}, state, {
				errors: action.errors
			});
		}
		case 'PREFERENCES_SUB_CLOSE_DELETE_MODAL': {
			return Object.assign({}, state, {
				isDeleteModalOpen: false
			});
		}
		case 'PREFERENCES_SUB_OPEN_DELETE_MODAL': {
			return Object.assign({}, state, {
				isDeleteModalOpen: true,
				selected: action.item
			});
		}
    	default:
    		return state;
	}
}
