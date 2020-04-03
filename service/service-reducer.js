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

export default function serviceReducer(state = {}, action) {
	let myState = {};
	switch(action.type) {
		case 'LOAD_INIT_SERVICES': {
			return processInit(state,action);
		}
		case 'LOAD_LIST_SERVICES': {
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