import reducerUtils from '../../core/common/reducer-utils';

export default function languagesReducer(state = {}, action) {
	let myState = {};
	switch(action.type) {
		case 'LOAD_INIT_LANGUAGES': {
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
					isModifyOpen: false
				});
			} else {
				return state;
			}
		}
		case 'LOAD_LIST_LANGUAGES': {
			if (action.responseJson != null && action.responseJson.params != null) {
				return Object.assign({}, state, {
					itemCount: reducerUtils.getItemCount(action),
					items: reducerUtils.getItems(action),
					listLimit: reducerUtils.getListLimit(action),
					listStart: reducerUtils.getListStart(action),
					selected: null,
					isModifyOpen: false
				});
			} else {
				return state;
			}
		}
		case 'LANGUAGES_LANGUAGE': {
			if (action.responseJson !=  null && action.responseJson.params != null) {
				// load inputFields
				let inputFields = {};
				let appForms = reducerUtils.getAppForms(action);
				for (let i = 0; i < appForms.ADMIN_LANGUAGE_FORM.length; i++) {
					let classModel = JSON.parse(appForms.ADMIN_LANGUAGE_FORM[i].classModel);
					if (action.responseJson.params.item != null && action.responseJson.params.item[classModel.field]) {
						inputFields[appForms.ADMIN_LANGUAGE_FORM[i].name] = action.responseJson.params.item[classModel.field];
					} else {
						let result = "";
						if (appForms.ADMIN_LANGUAGE_FORM[i].value != null && appForms.ADMIN_LANGUAGE_FORM[i].value != ""){
							let formValue = JSON.parse(appForms.ADMIN_LANGUAGE_FORM[i].value);
							for (let j = 0; j < formValue.options.length; j++) {
								if (formValue.options[j] != null && formValue.options[j].defaultInd == true){
									result = formValue.options[j].value;
								}
							}
						}
						inputFields[appForms.ADMIN_LANGUAGE_FORM[i].name] = result;
					}
				}
				// add id if this is existing item
				if (action.responseJson.params.item != null) {
					inputFields.ID = action.responseJson.params.item.id;
				}
				return Object.assign({}, state, {
					appForms: Object.assign({}, state.appForms, reducerUtils.getAppForms(action)),
					selectedUser : action.responseJson.params.item,
					inputFields : inputFields,
					isModifyOpen: true
				});
			} else {
				return state;
			}
		}
		case 'LANGUAGES_INPUT_CHANGE': {
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
		default:
			return state;
	}
}

