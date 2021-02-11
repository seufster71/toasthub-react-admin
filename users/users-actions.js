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
import callService from '../../core/api/api-call';
import actionUtils from '../../core/common/action-utils';

// action helpers



// thunks
export function init() {
  return function(dispatch) {
    let requestParams = {};
    requestParams.action = "INIT";
    requestParams.service = "USERS_SVC";
    requestParams.prefTextKeys = new Array("ADMIN_USER_PAGE");
    requestParams.prefLabelKeys = new Array("ADMIN_USER_PAGE");
    let params = {};
    params.requestParams = requestParams;
    params.URI = '/api/admin/callService';

    return callService(params).then( (responseJson) => {
    	if (responseJson != null && responseJson.protocalError == null){
    		dispatch({ type: "LOAD_INIT_USERS", responseJson });
		} else {
			actionUtils.checkConnectivity(responseJson,dispatch);
		}
    }).catch(error => {
      throw(error);
    });

  };
}

export function list({state,listStart,listLimit,searchCriteria,orderCriteria,info,paginationSegment}) {
	return function(dispatch) {
		let requestParams = {};
		requestParams.action = "LIST";
		requestParams.service = "USERS_SVC";
		if (listStart != null) {
			requestParams.listStart = listStart;
		} else {
			requestParams.listStart = state.listStart;
		}
		if (listLimit != null) {
			requestParams.listLimit = listLimit;
		} else {
			requestParams.listLimit = state.listLimit;
		}
		if (searchCriteria != null) {
			requestParams.searchCriteria = searchCriteria;
		} else {
			requestParams.searchCriteria = state.searchCriteria;
		}
		if (orderCriteria != null) {
			requestParams.orderCriteria = orderCriteria;
		} else {
			requestParams.orderCriteria = state.orderCriteria;
		}
		let userPrefChange = {"page":"users","orderCriteria":requestParams.orderCriteria,"listStart":requestParams.listStart,"listLimit":requestParams.listLimit};
		dispatch({type:"USER_PREF_CHANGE", userPrefChange});
		let params = {};
		params.requestParams = requestParams;
		params.URI = '/api/admin/callService';

		return callService(params).then( (responseJson) => {
			if (responseJson != null && responseJson.protocalError == null){
				dispatch({ type: "LOAD_LIST_USERS", responseJson, paginationSegment });
				if (info != null) {
		        	  dispatch({type:'SHOW_STATUS',info:info});  
		        }
			} else {
				actionUtils.checkConnectivity(responseJson,dispatch);
			}
		}).catch(error => {
			throw(error);
		});

	};
}

export function listLimit({state,listLimit}) {
	return function(dispatch) {
		 dispatch({ type:"USERS_LISTLIMIT",listLimit});
		 dispatch(list({state,listLimit}));
	 };
}

export function search({state,searchCriteria}) {
	return function(dispatch) {
		 dispatch({ type:"USERS_SEARCH",searchCriteria});
		 dispatch(list({state,searchCriteria,listStart:0}));
	 };
}

export function saveItem({state}) {
	return function(dispatch) {
		let requestParams = {};
	    requestParams.action = "SAVE";
	    requestParams.service = "USERS_SVC";
	    requestParams.inputFields = state.inputFields;

	    let params = {};
	    params.requestParams = requestParams;
	    params.URI = '/api/admin/callService';

	    return callService(params).then( (responseJson) => {
	    	if (responseJson != null && responseJson.protocalError == null){
	    		if(responseJson != null && responseJson.status != null && responseJson.status == "SUCCESS"){  
	    			dispatch(list({state,info:["Save Successful"]}));
	    		} else if (responseJson != null && responseJson.status != null && responseJson.status == "ACTIONFAILED") {
	    			dispatch({type:'SHOW_STATUS',error:responseJson.errors});
	    		}
	    	} else {
	    		actionUtils.checkConnectivity(responseJson,dispatch);
	    	}
	    }).catch(error => {
	    	throw(error);
	    });
	};
}


export function deleteItem({state,id}) {
	return function(dispatch) {
	    let requestParams = {};
	    requestParams.action = "DELETE";
	    requestParams.service = "USERS_SVC";
	    requestParams.itemId = id;
	    
	    let params = {};
	    params.requestParams = requestParams;
	    params.URI = '/api/admin/callService';

	    return callService(params).then( (responseJson) => {
	    	if (responseJson != null && responseJson.protocalError == null){
	    		if(responseJson != null && responseJson.status != null && responseJson.status == "SUCCESS"){  
	    			dispatch(list({state,info:["Delete Successful"]}));
	    		} else if (responseJson != null && responseJson.status != null && responseJson.status == "ACTIONFAILED") {
	    			dispatch({type:'SHOW_STATUS',warn:responseJson.errors});
	    		}
	    	} else {
	    		actionUtils.checkConnectivity(responseJson,dispatch);
	    	}
	    }).catch(error => {
	    	throw(error);
	    });
	};
}

export function modifyItem({id, appPrefs}) {
	return function(dispatch) {
	    let requestParams = {};
	    requestParams.action = "ITEM";
	    requestParams.service = "USERS_SVC";
	    requestParams.prefFormKeys = new Array("ADMIN_USER_FORM");
	    if (id != null) {
	    	requestParams.itemId = id;
	    }
	    let params = {};
	    params.requestParams = requestParams;
	    params.URI = '/api/admin/callService';

	    return callService(params).then( (responseJson) => {
	    	if (responseJson != null && responseJson.protocalError == null){
	    		dispatch({ type: 'USERS_ITEM',responseJson, appPrefs});
	    	} else {
	    		actionUtils.checkConnectivity(responseJson,dispatch);
	    	}
	    }).catch(error => {
	    	throw(error);
	    });
	};
}

export function inputChange(field,value) {
	 return function(dispatch) {
		 let params = {};
		 params.field = field;
		 params.value = value;
		 dispatch({ type:"USERS_INPUT_CHANGE",params});
	 };
}

export function selectChange({field,value}) {
	return function(dispatch) {
		let params = {};
		params.field = field;
		params.value = value;
		dispatch({ type:"USERS_INPUT_CHANGE",params});
	 };
}

export function searchChange({value}) {
	 return function(dispatch) {
		 dispatch({ type:"USERS_SEARCH_CHANGE",value});
	 };
}

export function orderBy({state,orderCriteria}) {
	 return function(dispatch) {
		 dispatch({ type:"USERS_ORDERBY",orderCriteria});
		 dispatch(list({state,orderCriteria}));
	 };
}

export function clearItem() {
	return function(dispatch) {
		dispatch({ type:"USERS_CLEAR_ITEM"});
	};
}

export function clearField(field) {
	return function(dispatch) {
		let params = {};
		 params.field = field;
		dispatch({ type:"USERS_CLEAR_FIELD",params});
	};
}

export function setErrors({errors}) {
	 return function(dispatch) {
		 dispatch({ type:"USERS_SET_ERRORS",errors});
	 };
}

export function openDeleteModal({item}) {
	 return function(dispatch) {
		 dispatch({type:"USERS_OPEN_DELETE_MODAL",item});
	 };
}

export function closeDeleteModal() {
	 return function(dispatch) {
		 dispatch({type:"USERS_CLOSE_DELETE_MODAL"});
	 };
}