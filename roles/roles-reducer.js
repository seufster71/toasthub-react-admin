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

export default function rolesReducer(state = {}, action) {
	let myState = {};
	switch(action.type) {
    	case 'LOAD_INIT_ROLES': {
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
    				orderCriteria: [{'orderColumn':'ADMIN_ROLE_TABLE_NAME','orderDir':'ASC'}],
    				searchCriteria: [{'searchValue':'','searchColumn':'ADMIN_ROLE_TABLE_NAME'}],
    				selected: null,
    				isModifyOpen: false,
    				isUserRoleOpen: false
    			});
    		} else {
    			return state;
    		}
    	}
    	case 'LOAD_LIST_ROLES': {
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
    	case 'ROLES_ROLE': {
			if (action.responseJson !=  null && action.responseJson.params != null) {
				// load inputFields
				let inputFields = {};
				let prefForms = reducerUtils.getPrefForms(action);
				for (let i = 0; i < prefForms.ADMIN_ROLE_FORM.length; i++) {
					let classModel = JSON.parse(prefForms.ADMIN_ROLE_FORM[i].classModel);
					if (action.responseJson.params.item != null && action.responseJson.params.item.hasOwnProperty(classModel.field)) {
						if (classModel.defaultClazz != null) {
							inputFields[prefForms.ADMIN_ROLE_FORM[i].name+"-DEFAULT"] = action.responseJson.params.item[classModel.field].defaultText;
						}
						if (classModel.textClazz != null) {
							for (let j = 0; j < action.responseJson.params.item[classModel.field].langTexts.length; j++) {
								inputFields[prefForms.ADMIN_ROLE_FORM[i].name+"-TEXT-"+action.responseJson.params.item[classModel.field].langTexts[j].lang] = action.responseJson.params.item[classModel.field].langTexts[j].text;
							}
						}
						if (classModel.type == "Object") {
							inputFields[prefForms.ADMIN_ROLE_FORM[i].name] = "Object";
						} else {
							inputFields[prefForms.ADMIN_ROLE_FORM[i].name] = action.responseJson.params.item[classModel.field];
						}
					} else {
						let result = "";
						if (prefForms.ADMIN_ROLE_FORM[i].value != null && prefForms.ADMIN_ROLE_FORM[i].value != ""){
							if (prefForms.ADMIN_ROLE_FORM[i].value.includes("{")) {
								let formValue = JSON.parse(prefForms.ADMIN_ROLE_FORM[i].value);
								if (formValue.options != null) {
									for (let j = 0; j < formValue.options.length; j++) {
										if (formValue.options[j] != null && formValue.options[j].defaultInd == true){
											result = formValue.options[j].value;
										}
									}
								}
							} else {
								result = prefForms.ADMIN_ROLE_FORM[i].value;
							}
						}
						inputFields[prefForms.ADMIN_ROLE_FORM[i].name] = result;
					}
				}
				// add id if this is existing item
				if (action.responseJson.params.item != null) {
					inputFields.itemId = action.responseJson.params.item.id;
				}
				return Object.assign({}, state, {
					prefForms: Object.assign({}, state.prefForms, reducerUtils.getPrefForms(action)),
					selected : action.responseJson.params.item,
					inputFields : inputFields,
					applicationSelectList : action.responseJson.params.applicationSelectList,
					isModifyOpen: true
				});
			} else {
				return state;
			}
		}
		case 'ROLES_INPUT_CHANGE': {
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
		case 'ROLES_ADD_USER': {
			if (action.user != null) {
				return Object.assign({}, state, {
					parent: action.user
				});
			} else {
		        return state;
		    }
		}
		case 'ROLES_CLEAR_USER': {
			return Object.assign({}, state, {
				parent: null
			});
		}
		case 'ROLES_USER_ROLE': {
			if (action.responseJson !=  null && action.responseJson.params != null) {
				// load inputFields
				let inputFields = {};
				let prefForms = reducerUtils.getPrefForms(action);
				for (let i = 0; i < prefForms.ADMIN_USER_ROLE_FORM.length; i++) {
					let classModel = JSON.parse(prefForms.ADMIN_USER_ROLE_FORM[i].classModel);
					if (action.responseJson.params.item != null && action.responseJson.params.item.hasOwnProperty(classModel.field)) {
						if (classModel.defaultClazz != null) {
							inputFields[prefForms.ADMIN_USER_ROLE_FORM[i].name+"-DEFAULT"] = action.responseJson.params.item[classModel.field].defaultText;
						}
						if (classModel.textClazz != null) {
							for (let j = 0; j < action.responseJson.params.item[classModel.field].langTexts.length; j++) {
								inputFields[prefForms.ADMIN_USER_ROLE_FORM[i].name+"-TEXT-"+action.responseJson.params.item[classModel.field].langTexts[j].lang] = action.responseJson.params.item[classModel.field].langTexts[j].text;
							}
						}
						if (classModel.type == "Object") {
							inputFields[prefForms.ADMIN_USER_ROLE_FORM[i].name] = "Object";
						} else {
							inputFields[prefForms.ADMIN_USER_ROLE_FORM[i].name] = action.responseJson.params.item[classModel.field];
						}
					} else {
						let result = "";
						if (prefForms.ADMIN_USER_ROLE_FORM[i].value != null && prefForms.ADMIN_USER_ROLE_FORM[i].value != ""){
							if (prefForms.ADMIN_USER_ROLE_FORM[i].value.includes("{")) {
								let formValue = JSON.parse(prefForms.ADMIN_USER_ROLE_FORM[i].value);
								if (formValue.options != null) {
									for (let j = 0; j < formValue.options.length; j++) {
										if (formValue.options[j] != null && formValue.options[j].defaultInd == true){
											result = formValue.options[j].value;
										}
									}
								}
							} else {
								result = prefForms.ADMIN_USER_ROLE_FORM[i].value;
							}
						}
						inputFields[prefForms.ADMIN_USER_ROLE_FORM[i].name] = result;
					}
				}
				// add id if this is existing item
				if (action.responseJson.params.item != null) {
					inputFields.itemId = action.responseJson.params.item.id;
				} else {
					action.responseJson.params.item = {roleId:action.responseJson.params.roleId};
				}
				return Object.assign({}, state, {
					prefForms: Object.assign({}, state.prefForms, reducerUtils.getPrefForms(action)),
					selected : action.responseJson.params.item,
					inputFields : inputFields,
					isUserRoleOpen: true
				});
			} else {
				return state;
			}
		}
		case 'ROLES_LISTLIMIT': {
			return reducerUtils.updateListLimit(state,action);
		}
		case 'ROLES_SEARCH': { 
			return reducerUtils.updateSearch(state,action);
		}
		case 'ROLES_ORDERBY': { 
			return reducerUtils.updateOrderBy(state,action);
		}
    	default:
    		return state;
	}
}
