import reducerUtils from '../../core/common/reducer-utils';

export default function permissionsReducer(state = {}, action) {
	let myState = {};
	switch(action.type) {
    	case 'LOAD_INIT_PERMISSIONS': {
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
    				selected: null,
    				isModifyOpen: false,
    				isRolePermissionOpen: false
    			});
    		} else {
    			return state;
    		}
    	}
    	case 'LOAD_LIST_PERMISSIONS': {
    		if (action.responseJson != null && action.responseJson.params != null) {
    			return Object.assign({}, state, {
    				itemCount: reducerUtils.getItemCount(action),
    				items: reducerUtils.getItems(action),
    				listLimit: reducerUtils.getListLimit(action),
    				listStart: reducerUtils.getListStart(action),
    				selected: null,
    				isModifyOpen: false,
    				isRolePermissionOpen: false
    			});
    		} else {
    			return state;
    		}
		}
    	case 'PERMISSIONS_PERMISSION': {
			if (action.responseJson !=  null && action.responseJson.params != null) {
				// load inputFields
				let inputFields = {};
				let appForms = reducerUtils.getAppForms(action);
				for (let i = 0; i < appForms.ADMIN_PERMISSION_FORM.length; i++) {
					let classModel = JSON.parse(appForms.ADMIN_PERMISSION_FORM[i].classModel);
					if (action.responseJson.params.item != null && action.responseJson.params.item.hasOwnProperty(classModel.field)) {
						if (classModel.defaultClazz != null) {
							inputFields[appForms.ADMIN_PERMISSION_FORM[i].name+"-DEFAULT"] = action.responseJson.params.item[classModel.field].defaultText;
						}
						if (classModel.textClazz != null) {
							for (let j = 0; j < action.responseJson.params.item[classModel.field].langTexts.length; j++) {
								inputFields[appForms.ADMIN_PERMISSION_FORM[i].name+"-TEXT-"+action.responseJson.params.item[classModel.field].langTexts[j].lang] = action.responseJson.params.item[classModel.field].langTexts[j].text;
							}
						}
						if (classModel.type == "Object") {
							inputFields[appForms.ADMIN_PERMISSION_FORM[i].name] = "Object";
						} else {
							inputFields[appForms.ADMIN_PERMISSION_FORM[i].name] = action.responseJson.params.item[classModel.field];
						}
					} else {
						let result = "";
						if (appForms.ADMIN_PERMISSION_FORM[i].value != null && appForms.ADMIN_PERMISSION_FORM[i].value != ""){
							let formValue = JSON.parse(appForms.ADMIN_PERMISSION_FORM[i].value);
							for (let j = 0; j < formValue.options.length; j++) {
								if (formValue.options[j] != null && formValue.options[j].defaultInd == true){
									result = formValue.options[j].value;
								}
							}
						}
						inputFields[appForms.ADMIN_PERMISSION_FORM[i].name] = result;
					}
				}
				// add id if this is existing item
				if (action.responseJson.params.item != null) {
					inputFields.itemId = action.responseJson.params.item.id;
				}
				return Object.assign({}, state, {
					appForms: Object.assign({}, state.appForms, reducerUtils.getAppForms(action)),
					selected : action.responseJson.params.item,
					inputFields : inputFields,
					applicationSelectList : action.responseJson.params.applicationSelectList,
					isModifyOpen: true
				});
			} else {
				return state;
			}
		}
		case 'PERMISSIONS_INPUT_CHANGE': {
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
		case 'PERMISSIONS_ADD_ROLE': {
			if (action.role != null) {
				return Object.assign({}, state, {
					parent: action.role
				});
			} else {
		        return state;
		    }
		}
		case 'PERMISSIONS_CLEAR_ROLE': {
			return Object.assign({}, state, {
				parent: null
			});
		}
		case 'PERMISSIONS_ROLE_PERMISSION': {
			if (action.responseJson !=  null && action.responseJson.params != null) {
				// load inputFields
				let inputFields = {};
				let appForms = reducerUtils.getAppForms(action);
				for (let i = 0; i < appForms.ADMIN_ROLE_PERMISSION_FORM.length; i++) {
					let classModel = JSON.parse(appForms.ADMIN_ROLE_PERMISSION_FORM[i].classModel);
					if (action.responseJson.params.item != null && action.responseJson.params.item.hasOwnProperty(classModel.field)) {
						if (classModel.defaultClazz != null) {
							inputFields[appForms.ADMIN_ROLE_PERMISSION_FORM[i].name+"-DEFAULT"] = action.responseJson.params.item[classModel.field].defaultText;
						}
						if (classModel.textClazz != null) {
							for (let j = 0; j < action.responseJson.params.item[classModel.field].langTexts.length; j++) {
								inputFields[appForms.ADMIN_ROLE_PERMISSION_FORM[i].name+"-TEXT-"+action.responseJson.params.item[classModel.field].langTexts[j].lang] = action.responseJson.params.item[classModel.field].langTexts[j].text;
							}
						}
						if (classModel.type == "Object") {
							inputFields[appForms.ADMIN_ROLE_PERMISSION_FORM[i].name] = "Object";
						} else {
							inputFields[appForms.ADMIN_ROLE_PERMISSION_FORM[i].name] = action.responseJson.params.item[classModel.field];
						}
					} else {
						let result = "";
						if (appForms.ADMIN_ROLE_PERMISSION_FORM[i].value != null && appForms.ADMIN_ROLE_PERMISSION_FORM[i].value != ""){
							let formValue = JSON.parse(appForms.ADMIN_ROLE_PERMISSION_FORM[i].value);
							for (let j = 0; j < formValue.options.length; j++) {
								if (formValue.options[j] != null && formValue.options[j].defaultInd == true){
									result = formValue.options[j].value;
								}
							}
						}
						inputFields[appForms.ADMIN_ROLE_PERMISSION_FORM[i].name] = result;
					}
				}
				// add id if this is existing item
				if (action.responseJson.params.item != null) {
					inputFields.itemId = action.responseJson.params.item.id;
				} else {
					action.responseJson.params.item = {permissionId:action.responseJson.params.permissionId};
				}
				return Object.assign({}, state, {
					appForms: Object.assign({}, state.appForms, reducerUtils.getAppForms(action)),
					selected : action.responseJson.params.item,
					inputFields : inputFields,
					isRolePermissionOpen: true
				});
			} else {
				return state;
			}
		}
    	default:
    		return state;
	}
}
