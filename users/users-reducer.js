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
		case 'ADMIN_USER_INIT': {
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
					view: "MAIN",
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
		case 'ADMIN_USER_LIST': {
			if (action.responseJson != null && action.responseJson.params != null) {
				return Object.assign({}, state, {
					itemCount: reducerUtils.getItemCount(action),
					items: reducerUtils.getItems(action),
					listLimit: reducerUtils.getListLimit(action),
					listStart: reducerUtils.getListStart(action),
					paginationSegment: action.paginationSegment,
					selected: null,
					view: "MAIN",
					isDeleteModalOpen: false,
					errors:null, 
					warns:null, 
					successes:null
				});
			} else {
				return state;
			}
		}
		case 'ADMIN_USER_ITEM': {
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
					view: "MODIFY"
				});
			} else {
				return state;
			}
		}
		case 'ADMIN_USER_INPUT_CHANGE': {
			return reducerUtils.updateInputChange(state,action);
		}
		case 'ADMIN_USER_SELECT_CHANGE': {
			return reducerUtils.selectChange(state,action);
		}
		case 'ADMIN_USER_CLEAR_FIELD': {
			return reducerUtils.updateClearField(state,action);
		}
		case 'ADMIN_USER_LISTLIMIT': {
			return reducerUtils.updateListLimit(state,action);
		}
		case 'ADMIN_USER_SEARCH': { 
			return reducerUtils.updateSearch(state,action);
		}
		case 'ADMIN_USER_SEARCH_CHANGE': { 
			return Object.assign({}, state, {
				searchValue: action.value
			});
		}
		case 'ADMIN_USER_ORDERBY': { 
			return reducerUtils.updateOrderBy(state,action);
		}
		case 'ADMIN_USER_SET_STATUS': {
			reducerUtils.updateStatus(state,action);
		}
		case 'ADMIN_USER_CLOSE_DELETE_MODAL': {
			return Object.assign({}, state, {
				isDeleteModalOpen: false
			});
		}
		case 'ADMIN_USER_OPEN_DELETE_MODAL': {
			return Object.assign({}, state, {
				isDeleteModalOpen: true,
				selected: action.item
			});
		}
		case 'ADMIN_USER_CANCEL': {
			return Object.assign({}, state, {
				view: "MAIN",
				selected:null,
				inputFields:null
			});
		}
		default:
			return state;
	}
}


