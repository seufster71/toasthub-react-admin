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
	let myState = {};
	switch(action.type) {
		case 'PREFERENCE_SUBVIEW_LIST': {
			if (action.responseJson !=  null && action.responseJson.params != null) {
				return Object.assign({}, state, {
	    			prefTexts: Object.assign({}, state.prefTexts, reducerUtils.getPrefTexts(action)),
	    			prefLabels: Object.assign({}, state.prefLabels, reducerUtils.getPrefLabels(action)),
	    			prefOptions: Object.assign({}, state.prefOptions, reducerUtils.getPrefOptions(action)),
	    		 	columns: reducerUtils.getColumns(action),
	    			itemCount: reducerUtils.getItemCount(action),
	    		 	items: reducerUtils.getItems(action),
	    		  	listLimit: reducerUtils.getListLimit(action),
	    			listStart: reducerUtils.getListStart(action),
	    			orderCriteria: [{'orderColumn':'ADMIN_PREFERENCE_TABLE_NAME','orderDir':'ASC'}],
    				searchCriteria: [{'searchValue':'','searchColumn':'ADMIN_PREFERENCE_TABLE_NAME'}],
    				parent: action.item,
    				isModifyOpen: false,
    				isUserRoleOpen: false,
    				viewType: action.viewType
    		    });
			} else {
				return state;
			}
		}
		case 'PREFERENCES_SUBVIEW_PREFERENCE': {
			if (action.responseJson !=  null && action.responseJson.params != null) {
				// load inputFields
				let inputFields = {};
				let prefForms = reducerUtils.getPrefForms(action);
				if (action.viewType === "FORM") {
					inputFields = reducerUtils.loadInputFields(action.responseJson.params.item,prefForms.ADMIN_FORMFIELD_PAGE,inputFields);
				} else if (action.viewType === "LABEL") {
					inputFields = reducerUtils.loadInputFields(action.responseJson.params.item,prefForms.ADMIN_LABEL_PAGE,inputFields);
				} else if (action.viewType === "TEXT") {
					inputFields = reducerUtils.loadInputFields(action.responseJson.params.item,prefForms.ADMIN_TEXT_PAGE,inputFields);
				} else if (action.viewType === "OPTION") {
					inputFields = reducerUtils.loadInputFields(action.responseJson.params.item,prefForms.ADMIN_OPTION_PAGE,inputFields);
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
    	default:
    		return state;
	}
}
