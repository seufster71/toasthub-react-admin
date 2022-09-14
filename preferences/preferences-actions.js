/*
 * Copyright (C) 2016 - 2050 The ToastHub Project
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
export function init({parent,parentType}) {
	return function(dispatch) {
		let requestParams = {};
	    requestParams.action = "INIT";
    	requestParams.service = "ADMIN_PREF_SVC";
    	requestParams.prefTextKeys = new Array("ADMIN_PREFERENCE_PAGE");
	    requestParams.prefLabelKeys = new Array("ADMIN_PREFERENCE_PAGE");
	    
	    let params = {};
	    params.requestParams = requestParams;
	    params.URI = '/api/admin/callService';

	    return callService(params).then( (responseJson) => {
	    	if (responseJson != null && responseJson.protocalError == null){
	    		if(responseJson.status != null && responseJson.status == "ACTIONFAILED"){
	    			dispatch({type:'SHOW_STATUS',error:responseJson.errors});
	    		} else {
	    			dispatch({ type: "ADMIN_PREFERENCE_INIT", responseJson});
	    		}
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
	    requestParams.service = "ADMIN_PREF_SVC";
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
		
	    let userPrefChange = {"page":"preferences","orderCriteria":requestParams.orderCriteria,"listStart":requestParams.listStart,"listLimit":requestParams.listLimit};
	    dispatch({type:"USER_PREF_CHANGE", userPrefChange});
	    let params = {};
	    params.requestParams = requestParams;
	    params.URI = '/api/admin/callService';

	    return callService(params).then( (responseJson) => {
	      if (responseJson != null && responseJson.protocalError == null){
    		  if(responseJson.status != null && responseJson.status == "ACTIONFAILED"){
    			  dispatch({type:'SHOW_STATUS',error:responseJson.errors});
    		  } else {
    			  dispatch({ type: "ADMIN_PREFERENCE_LIST", responseJson, paginationSegment });
    		  }
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
		dispatch({type:"ADMIN_PREFERENCE_LISTLIMIT",listLimit});
		dispatch(list({state,listLimit}));
	};
}

export function search({state,searchCriteria}) {
	return function(dispatch) {
		dispatch({type:"ADMIN_PREFERENCE_SEARCH",searchCriteria});
		dispatch(list({state,searchCriteria,listStart:0}));
	 };
}

export function saveItem({state}) {
	return function(dispatch) {
		let requestParams = {};
	    requestParams.action = "SAVE";
	    requestParams.service = "ADMIN_PREF_SVC";
	    requestParams.inputFields = state.inputFields;
	    if (state.parent != null){
	    	requestParams.parentId = state.parent.id;
	    }

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
	    requestParams.itemId = id;
	    requestParams.service = "ADMIN_PREF_SVC";
	    
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

export function modifyItem({id,appPrefs}) {
	return function(dispatch) {
	    let requestParams = {};
	    requestParams.action = "ITEM";
	    requestParams.service = "ADMIN_PREF_SVC";
		requestParams.prefFormKeys = new Array("ADMIN_PREFERENCE_FORM");
	    
	    if (id != null) {
	    	requestParams.itemId = id;
	    }
	    let params = {};
	    params.requestParams = requestParams;
	    params.URI = '/api/admin/callService';

	    return callService(params).then( (responseJson) => {
	    	if (responseJson != null && responseJson.protocalError == null){
	    		dispatch({ type: 'ADMIN_PREFERENCE_ITEM', responseJson, appPrefs});
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
		dispatch({ type:"ADMIN_PREFERENCE_INPUT_CHANGE",params});
	};
}

export function searchChange({value}) {
	 return function(dispatch) {
		 dispatch({ type:"ADMIN_PREFERENCE_SEARCH_CHANGE",value});
	 };
}

export function orderBy({state,orderCriteria}) {
	 return function(dispatch) {
		 dispatch({type:"ADMIN_PREFERENCE_ORDERBY",orderCriteria});
		 dispatch(list({state,orderCriteria}));
	 };
}

export function clearPreference() {
	return function(dispatch) {
		dispatch({ type:"ADMIN_PREFERENCE_CLEAR_PREFERENCE"});
	};
}

export function goBack() {
	 return function(dispatch) {
		 dispatch({ type:"ADMIN_PREFERENCE_GOBACK"});
	 };
}

export function setStatus({successes,errors}) {
	 return function(dispatch) {
		 dispatch({ type:"ADMIN_PREFERENCE_SET_STATUS",successes,errors});
	 };
}

export function openDeleteModal({item}) {
	 return function(dispatch) {
		 dispatch({type:"ADMIN_PREFERENCE_OPEN_DELETE_MODAL",item});
	 };
}

export function closeDeleteModal() {
	 return function(dispatch) {
		 dispatch({type:"ADMIN_PREFERENCE_CLOSE_DELETE_MODAL"});
	 };
}

export function initSubView({state}){
	return function(dispatch) {
		 dispatch({type:"ADMIN_PREFERENCE_INIT_SUBVIEW"});
	 };
}

export function moveSelect({state}){
	return function(dispatch) {
		
	 };
}

export function moveSave({state}){
	return function(dispatch) {
		 
	 };
}

export function moveCancel({state}){
	return function(dispatch) {
		
	 };
}

export function cancel({state}) {
	return function(dispatch) {
		dispatch({type:"ADMIN_PREFERENCE_CANCEL"});
		dispatch(list({state}));
	 };
}