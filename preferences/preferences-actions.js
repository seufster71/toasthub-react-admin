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
export function init(category) {
	return function(dispatch) {
		let orderCriteria = [{'orderColumn':'ADMIN_PREFERENCE_TABLE_CATEGORY','orderDir':'ASC'},{'orderColumn':'ADMIN_PREFERENCE_TABLE_TITLE','orderDir':'ASC'}];
		let searchCriteria = [{'searchValue':'','searchColumn':'ADMIN_PREFERENCE_TABLE_TITLE'}];
		let requestParams = {};
	    requestParams.action = "LIST";
	    requestParams.service = "PREF_SVC";
	    requestParams.prefTexts = new Array("ADMIN_PREFERENCE_PAGE");
	    requestParams.prefLabels = new Array("ADMIN_PREFERENCE_PAGE");
	    requestParams.orderCriteria = orderCriteria;
	    let params = {};
	    params.requestParams = requestParams;
	    params.URI = '/api/admin/callService';

	    return callService(params).then( (responseJson) => {
	    	if (responseJson != null && responseJson.protocalError == null){
	    		dispatch({ type: "LOAD_INIT_PREFERENCE", responseJson, orderCriteria, searchCriteria });
	    	} else {
				actionUtils.checkConnectivity(responseJson,dispatch);
			}
	    }).catch(error => {
	    	throw(error);
	    });

	};
}

export function list({state,listStart,listLimit,searchCriteria,orderCriteria,info,item,viewType}) {
	return function(dispatch) {
		let requestParams = {};
	    requestParams.action = "LIST";
	    if (viewType != null) {
		    if (viewType === "FORM") {
				requestParams.service = "PREF_FORMFIELD_SVC";
				requestParams.prefTexts = new Array("ADMIN_FORMFIELD_PAGE");
				requestParams.prefLabels = new Array("ADMIN_FORMFIELD_PAGE");
			} else if (viewType === "LABEL") {
				requestParams.service = "PREF_LABEL_SVC";
				requestParams.prefTexts = new Array("ADMIN_LABEL_PAGE");
				requestParams.prefLabels = new Array("ADMIN_LABEL_PAGE");
			} else if (viewType === "TEXT") {
				requestParams.service = "PREF_TEXT_SVC";
				requestParams.prefTexts = new Array("ADMIN_TEXT_PAGE");
				requestParams.prefLabels = new Array("ADMIN_TEXT_PAGE");
			} else if (viewType === "OPTION") {
				requestParams.service = "PREF_OPTION_SVC";
				requestParams.prefTexts = new Array("ADMIN_OPTION_PAGE");
				requestParams.prefLabels = new Array("ADMIN_OPTION_PAGE");
			}
		    if (state.selected != null) {
		    	requestParams.parentId = state.selected.id;
		    } else {
		    	requestParams.parentId = item.id;
		    }
	    } else {
	    	requestParams.service = "PREF_SVC";
	    }
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
	    	  if (viewType != null) {
	    		  if(responseJson.status != null && responseJson.status == "ACTIONFAILED"){  
	    			  dispatch({type:'SHOW_STATUS',error:responseJson.errors});
	    		  } else {
	    			  dispatch({ type: 'PREFERENCE_SUBVIEW_LIST',responseJson, item, viewType});	
	    		  }
	    	  } else {
	    		  if(responseJson.status != null && responseJson.status == "ACTIONFAILED"){
	    			  dispatch({type:'SHOW_STATUS',error:responseJson.errors});
	    		  } else {
	    			  dispatch({ type: "LOAD_LIST_PREFERENCE", responseJson });
	    		  }
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
		 dispatch({ type:"PREFERENCES_LISTLIMIT",listLimit});
		 dispatch(list({state,listLimit}));
	 };
}

export function search({state,searchCriteria}) {
	return function(dispatch) {
		 dispatch({ type:"PREFERENCES_SEARCH",searchCriteria});
		 dispatch(list({state,searchCriteria,listStart:0}));
	 };
}

export function savePreference({state}) {
	return function(dispatch) {
		let requestParams = {};
	    requestParams.action = "SAVE";
	    requestParams.service = "PREF_SVC";
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


export function deletePreference({state,id}) {
	return function(dispatch) {
	    let requestParams = {};
	    requestParams.action = "DELETE";
	    requestParams.service = "PREF_SVC";
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

export function preference({id,viewType}) {
	return function(dispatch) {
	    let requestParams = {};
	    requestParams.action = "ITEM";

	    if (viewType === "FORM") {
	    	requestParams.service = "PREF_FORMFIELD_SVC";
	    	requestParams.prefForms = new Array("ADMIN_FORMFIELD_PAGE");
	    } else if (viewType === "LABEL") {
	    	requestParams.service = "PREF_LABEL_SVC";
	    	requestParams.prefForms = new Array("ADMIN_LABEL_PAGE");
	    } else if (viewType === "TEXT") {
	    	requestParams.service = "PREF_TEXT_SVC";
	    	requestParams.prefForms = new Array("ADMIN_TEXT_PAGE");
	    } else if (viewType === "OPTION") {
	    	requestParams.service = "PREF_OPTION_SVC";
	    	requestParams.prefForms = new Array("ADMIN_OPTION_PAGE");
	    } else {
	    	requestParams.service = "PREF_SVC";
		    requestParams.prefForms = new Array("ADMIN_PREFERENCE_PAGE");
	    }
	    
	    if (id != null) {
	    	requestParams.itemId = id;
	    }
	    let params = {};
	    params.requestParams = requestParams;
	    params.URI = '/api/admin/callService';

	    return callService(params).then( (responseJson) => {
	    	if (responseJson != null && responseJson.protocalError == null){
	    		if (viewType != null) {
	    			dispatch({ type: 'PREFERENCES_SUBVIEW_PREFERENCE', responseJson, viewType});
	    		} else {
	    			dispatch({ type: 'PREFERENCES_PREFERENCE', responseJson});
	    		}
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
		 dispatch({ type:"PREFERENCES_INPUT_CHANGE",params});
	 };
}

export function orderBy({state,orderCriteria,viewType}) {
	 return function(dispatch) {
		 let type = "PREFERENCES_ORDERBY";
		 if (viewType != null) {
			 
		 }
		 dispatch({ type,orderCriteria});
		 dispatch(list({state,orderCriteria,viewType}));
	 };
}

export function clearPreference() {
	return function(dispatch) {
		dispatch({ type:"PREFERENCES_CLEAR_PREFERENCE"});
	};
}

export function goBack() {
	 return function(dispatch) {
		 dispatch({ type:"PREFERENCES_GOBACK"});
	 };
}
