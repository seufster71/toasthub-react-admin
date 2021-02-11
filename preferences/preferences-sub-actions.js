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
export function init({parent, subType}) {
	return function(dispatch) {
		let requestParams = {};
	    requestParams.action = "INIT";
	    
	    if (subType != null) {
		    if (subType === "FORM") {
				requestParams.service = "PREF_FORMFIELD_SVC";
				requestParams.prefTextKeys = new Array("ADMIN_FORMFIELD_PAGE");
				requestParams.prefLabelKeys = new Array("ADMIN_FORMFIELD_PAGE");
			} else if (subType === "LABEL") {
				requestParams.service = "PREF_LABEL_SVC";
				requestParams.prefTextKeys = new Array("ADMIN_LABEL_PAGE");
				requestParams.prefLabelKeys = new Array("ADMIN_LABEL_PAGE");
			} else if (subType === "TEXT") {
				requestParams.service = "PREF_TEXT_SVC";
				requestParams.prefTextKeys = new Array("ADMIN_TEXT_PAGE");
				requestParams.prefLabelKeys = new Array("ADMIN_TEXT_PAGE");
			} else if (subType === "OPTION") {
				requestParams.service = "PREF_OPTION_SVC";
				requestParams.prefTextKeys = new Array("ADMIN_OPTION_PAGE");
				requestParams.prefLabelKeys = new Array("ADMIN_OPTION_PAGE");
			}
	    }
	    
	    if (parent != null) {
			requestParams.parentId = parent.id;
			dispatch({type:"PREFERENCES_SUB_ADD_PARENT", parent});
		} else {
			dispatch({type:"PREFERENCES_SUB_CLEAR_PARENT"});
		}
	    
	    let params = {};
	    params.requestParams = requestParams;
	    params.URI = '/api/admin/callService';

	    return callService(params).then( (responseJson) => {
	    	if (responseJson != null && responseJson.protocalError == null){
    			if(responseJson.status != null && responseJson.status == "ACTIONFAILED"){  
    				dispatch({type:'SHOW_STATUS',error:responseJson.errors});
    			} else {
    				dispatch({ type: 'PREFERENCES_SUB_INIT',responseJson, parent, subType});	
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
	    let page = "preferences";
	    
	    if (state.subType === "FORM") {
			requestParams.service = "PREF_FORMFIELD_SVC";
			page = "pref_formfields";
		} else if (state.subType === "LABEL") {
			requestParams.service = "PREF_LABEL_SVC";
			page = "pref_labels";
		} else if (state.subType === "TEXT") {
			requestParams.service = "PREF_TEXT_SVC";
			page = "pref_texts";
		} else if (state.subType === "OPTION") {
			requestParams.service = "PREF_OPTION_SVC";
			page = "pref_options";
		}
	    if (state.parent != null) {
	    	requestParams.parentId = state.parent.id;
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
		
	    let userPrefChange = {"page":page,"orderCriteria":requestParams.orderCriteria,"listStart":requestParams.listStart,"listLimit":requestParams.listLimit};
	    dispatch({type:"USER_PREF_CHANGE", userPrefChange});
	    let params = {};
	    params.requestParams = requestParams;
	    params.URI = '/api/admin/callService';

	    return callService(params).then( (responseJson) => {
	      if (responseJson != null && responseJson.protocalError == null){
    		  if(responseJson.status != null && responseJson.status == "ACTIONFAILED"){
    			  dispatch({type:'SHOW_STATUS',error:responseJson.errors});
    		  } else {
    			  dispatch({ type: "PREFERENCES_SUB_LIST", responseJson, paginationSegment });
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
		dispatch({type:"PREFERENCES_SUB_LISTLIMIT",listLimit});
		dispatch(list({state,listLimit}));
	};
}

export function search({state,searchCriteria}) {
	return function(dispatch) {
		dispatch({type:"PREFERENCES_SUB_SEARCH",searchCriteria});
		dispatch(list({state,searchCriteria,listStart:0}));
	 };
}

export function saveItem({state,parent}) {
	return function(dispatch) {
		let requestParams = {};
	    requestParams.action = "SAVE";

	    if (state.subType === "FORM") {
	    	requestParams.service = "PREF_FORMFIELD_SVC";
	    } else if (state.subType === "LABEL") {
	    	requestParams.service = "PREF_LABEL_SVC";
	    } else if (state.subType === "TEXT") {
	    	requestParams.service = "PREF_TEXT_SVC";
	    } else if (state.subType === "OPTION") {
	    	requestParams.service = "PREF_OPTION_SVC";
	    }
	    requestParams.inputFields = state.inputFields;

	    if (parent != null){
	    	requestParams.parentId = parent.id;
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

	    if (state.subType === "FORM") {
	    	requestParams.service = "PREF_FORMFIELD_SVC";
	    } else if (state.subType === "LABEL") {
	    	requestParams.service = "PREF_LABEL_SVC";
	    } else if (state.subType === "TEXT") {
	    	requestParams.service = "PREF_TEXT_SVC";
	    } else if (state.subType === "OPTION") {
	    	requestParams.service = "PREF_OPTION_SVC";
	    }

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

export function modifyItem({state,id,appPrefs}) {
	return function(dispatch) {
	    let requestParams = {};
	    requestParams.action = "ITEM";
	    if (state.subType === "FORM") {
	    	requestParams.service = "PREF_FORMFIELD_SVC";
	    	requestParams.prefFormKeys = new Array("ADMIN_FORMFIELD_FORM");
	    } else if (state.subType === "LABEL") {
	    	requestParams.service = "PREF_LABEL_SVC";
	    	requestParams.prefFormKeys = new Array("ADMIN_LABEL_FORM");
	    } else if (state.subType === "TEXT") {
	    	requestParams.service = "PREF_TEXT_SVC";
	    	requestParams.prefFormKeys = new Array("ADMIN_TEXT_FORM");
	    } else if (state.subType === "OPTION") {
	    	requestParams.service = "PREF_OPTION_SVC";
	    	requestParams.prefFormKeys = new Array("ADMIN_OPTION_FORM");
	    }
	    
	    if (id != null) {
	    	requestParams.itemId = id;
	    }
	    let params = {};
	    params.requestParams = requestParams;
	    params.URI = '/api/admin/callService';

	    return callService(params).then( (responseJson) => {
	    	if (responseJson != null && responseJson.protocalError == null){
	    		dispatch({ type: 'PREFERENCES_SUB_ITEM', responseJson, subType:state.subType, appPrefs});
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
		dispatch({ type:"PREFERENCES_SUB_INPUT_CHANGE",params});
	 };
}

export function searchChange({value}) {
	 return function(dispatch) {
		 dispatch({ type:"PREFERENCES_SUB_SEARCH_CHANGE",value});
	 };
}

export function orderBy({state,orderCriteria}) {
	 return function(dispatch) {
		 dispatch({type:"PREFERENCES_SUB_ORDERBY",orderCriteria});
		 dispatch(list({state,stateSubView,orderCriteria}));
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

export function moveSelect({state,item}) {
	 return function(dispatch) {
		 dispatch({ type:"PREFERENCES_SUB_MOVE_SELECT",item});
		 dispatch(list({state,item,orderCriteria:[],searchCriteria:[]}));
	 };
}

export function moveCancel({state}) {
	 return function(dispatch) {
		 dispatch({ type:"PREFERENCES_SUB_MOVE_CANCEL"});
		 dispatch(list({state}));
	 };
}

export function moveSave({state,code,item}) {
	return function(dispatch) {
		let requestParams = {};
	    requestParams.action = "MOVE_SAVE";
	    if (state != null) {
		    if (state.subType === "FORM") {
		    	requestParams.service = "PREF_FORMFIELD_SVC";
		    } else if (state.subType === "LABEL") {
		    	requestParams.service = "PREF_LABEL_SVC";
		    } else if (state.subType === "TEXT") {
		    	requestParams.service = "PREF_TEXT_SVC";
		    } else if (state.subType === "OPTION") {
		    	requestParams.service = "PREF_OPTION_SVC";
		    }
	    }
	    
	    requestParams.code = code;
	    requestParams.moveSelectedItemId = state.moveSelectedItem.id;
	    requestParams.itemId = item.id
	    
	    if (state.parent != null) {
			requestParams.parentId = state.parent.id;
		}
	    
	    let params = {};
	    params.requestParams = requestParams;
	    params.URI = '/api/admin/callService';

	    return callService(params).then( (responseJson) => {
	    	if (responseJson != null && responseJson.protocalError == null){
	    		if(responseJson != null && responseJson.status != null && responseJson.status == "SUCCESS"){  
	    			dispatch({ type:"PREFERENCES_SUB_MOVE_CANCEL"});
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

export function setErrors({errors}) {
	 return function(dispatch) {
		 dispatch({ type:"PREFERENCES_SUB_SET_ERRORS",errors});
	 };
}

export function openDeleteModal({item}) {
	 return function(dispatch) {
		 dispatch({type:"PREFERENCES_SUB_OPEN_DELETE_MODAL",item});
	 };
}

export function closeDeleteModal() {
	 return function(dispatch) {
		 dispatch({type:"PREFERENCES_SUB_CLOSE_DELETE_MODAL"});
	 };
}