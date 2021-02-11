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

export default function usersReducer(state = {}, action) {
	switch(action.type) {
		case 'LOAD_INIT_USERS': {
			if (action.responseJson != null && action.responseJson.params != null) {
				return Object.assign({}, state, {
					prefTexts: Object.assign({}, state.prefTexts, reducerUtils.getPrefTexts(action)),
					prefLabels: Object.assign({}, state.prefLabels, reducerUtils.getPrefLabels(action)),
					prefOptions: Object.assign({}, state.prefOptions, reducerUtils.getPrefOptions(action)),
					columns: reducerUtils.getColumns(action),
					itemCount: reducerUtils.getItemCount(action),
					items: reducerUtils.getItems(action),
					listLimit: reducerUtils.getListLimit(action),
					listStart: reducerUtils.getListStart(action),
					orderCriteria: [{'orderColumn':'ADMIN_USER_TABLE_USERNAME','orderDir':'ASC'}],
    				searchCriteria: [{'searchValue':'','searchColumn':'ADMIN_USER_TABLE_USERNAME'}],
					paginationSegment: 1,
					selected: null,
					isModifyOpen: false,
					pageName:"ADMIN_USER",
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
		case 'LOAD_LIST_USERS': {
			if (action.responseJson != null && action.responseJson.params != null) {
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
		case 'USERS_ITEM': {
			if (action.responseJson !=  null && action.responseJson.params != null) {
				// load inputFields
				let inputFields = {};
				let prefForms = reducerUtils.getPrefForms(action);
				inputFields = reducerUtils.loadInputFields(action.responseJson.params.item,prefForms.ADMIN_USER_FORM,inputFields,action.appPrefs,"FORM1");
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
		case 'USERS_INPUT_CHANGE': {
			return reducerUtils.updateInputChange(state,action);
		}
		case 'USERS_SELECT_CHANGE': {
			return reducerUtils.selectChange(state,action);
		}
		case 'USERS_CLEAR_FIELD': {
			return reducerUtils.updateClearField(state,action);
		}
		case 'USERS_LISTLIMIT': {
			return reducerUtils.updateListLimit(state,action);
		}
		case 'USERS_SEARCH': { 
			return reducerUtils.updateSearch(state,action);
		}
		case 'USERS_SEARCH_CHANGE': { 
			return Object.assign({}, state, {
				searchValue: action.value
			});
		}
		case 'USERS_ORDERBY': { 
			return reducerUtils.updateOrderBy(state,action);
		}
		case 'USERS_SET_ERRORS': {
			return Object.assign({}, state, {
				errors: action.errors
			});
		}
		case 'USERS_CLOSE_DELETE_MODAL': {
			return Object.assign({}, state, {
				isDeleteModalOpen: false
			});
		}
		case 'USERS_OPEN_DELETE_MODAL': {
			return Object.assign({}, state, {
				isDeleteModalOpen: true,
				selected: action.item
			});
		}
		default:
			return state;
	}
}


