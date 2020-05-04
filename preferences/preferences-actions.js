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
export function init({state,stateSubView,listStart,listLimit,searchCriteria,orderCriteria,info,item,viewType}) {
	return function(dispatch) {
		let requestParams = {};
	    requestParams.action = "LIST";
	    if (viewType != null) {
		    if (viewType === "FORM") {
				requestParams.service = "PREF_FORMFIELD_SVC";
				requestParams.prefTextKeys = new Array("ADMIN_FORMFIELD_PAGE");
				requestParams.prefLabelKeys = new Array("ADMIN_FORMFIELD_PAGE");
			} else if (viewType === "LABEL") {
				requestParams.service = "PREF_LABEL_SVC";
				requestParams.prefTextKeys = new Array("ADMIN_LABEL_PAGE");
				requestParams.prefLabelKeys = new Array("ADMIN_LABEL_PAGE");
			} else if (viewType === "TEXT") {
				requestParams.service = "PREF_TEXT_SVC";
				requestParams.prefTextKeys = new Array("ADMIN_TEXT_PAGE");
				requestParams.prefLabelKeys = new Array("ADMIN_TEXT_PAGE");
			} else if (viewType === "OPTION") {
				requestParams.service = "PREF_OPTION_SVC";
				requestParams.prefTextKeys = new Array("ADMIN_OPTION_PAGE");
				requestParams.prefLabelKeys = new Array("ADMIN_OPTION_PAGE");
			}
		    if (state.selected != null) {
		    	requestParams.parentId = state.selected.id;
		    } else if (item != null){
		    	requestParams.parentId = item.id;
		    }
	    } else {
	    	requestParams.service = "PREF_SVC";
	    	requestParams.prefTextKeys = new Array("ADMIN_PREFERENCE_PAGE");
		    requestParams.prefLabelKeys = new Array("ADMIN_PREFERENCE_PAGE");
	    }
	    
	    requestParams.orderCriteria = orderCriteria;
	    let params = {};
	    params.requestParams = requestParams;
	    params.URI = '/api/admin/callService';

	    return callService(params).then( (responseJson) => {
	    	if (responseJson != null && responseJson.protocalError == null){
	    		if (viewType != null) {
	    			if(responseJson.status != null && responseJson.status == "ACTIONFAILED"){  
	    				dispatch({type:'SHOW_STATUS',error:responseJson.errors});
	    			} else {
	    				dispatch({ type: 'PREFERENCE_SUBVIEW_INIT',responseJson, item, viewType, orderCriteria, searchCriteria});	
	    			}
		    	} else {
		    		if(responseJson.status != null && responseJson.status == "ACTIONFAILED"){
		    			dispatch({type:'SHOW_STATUS',error:responseJson.errors});
		    		} else {
		    			dispatch({ type: "LOAD_INIT_PREFERENCE", responseJson, orderCriteria, searchCriteria });
		    		}
		    	}
	    	} else {
				actionUtils.checkConnectivity(responseJson,dispatch);
			}
	    }).catch(error => {
	    	throw(error);
	    });

	};
}

export function list({state,stateSubView,listStart,listLimit,searchCriteria,orderCriteria,info,item}) {
	return function(dispatch) {
		let requestParams = {};
	    requestParams.action = "LIST";
	    let page = "preferences";
	    if (stateSubView != null && stateSubView.viewType != null) {
		    if (stateSubView.viewType === "FORM") {
				requestParams.service = "PREF_FORMFIELD_SVC";
				page = "pref_formfields";
			} else if (stateSubView.viewType === "LABEL") {
				requestParams.service = "PREF_LABEL_SVC";
				page = "pref_labels";
			} else if (stateSubView.viewType === "TEXT") {
				requestParams.service = "PREF_TEXT_SVC";
				page = "pref_texts";
			} else if (stateSubView.viewType === "OPTION") {
				requestParams.service = "PREF_OPTION_SVC";
				page = "pref_options";
			}
		    if (state.selected != null) {
		    	requestParams.parentId = state.selected.id;
		    } else if (item != null){
		    	requestParams.parentId = item.id;
		    }
	    } else {
	    	requestParams.service = "PREF_SVC";
	    }
	    if (listStart != null) {
			requestParams.listStart = listStart;
		} else {
			if (stateSubView != null && stateSubView.viewType != null) {
				requestParams.listStart = stateSubView.listStart;
			} else {
				requestParams.listStart = state.listStart;
			}
		}
		if (listLimit != null) {
			requestParams.listLimit = listLimit;
		} else {
			if (stateSubView != null && stateSubView.viewType != null) {
				requestParams.listLimit = stateSubView.listLimit;
			} else {
				requestParams.listLimit = state.listLimit;
			}
		}
		if (searchCriteria != null) {
			requestParams.searchCriteria = searchCriteria;
		} else {
			if (stateSubView != null && stateSubView.viewType != null) {
				requestParams.searchCriteria = stateSubView.searchCriteria;
			} else {
				requestParams.searchCriteria = state.searchCriteria;
			}
		}
		if (orderCriteria != null) {
			requestParams.orderCriteria = orderCriteria;
		} else {
			if (stateSubView != null && stateSubView.viewType != null) {
				requestParams.orderCriteria = stateSubView.orderCriteria;
			} else {
				requestParams.orderCriteria = state.orderCriteria;
			}
		}
		
	    let userPrefChange = {"page":page,"orderCriteria":requestParams.orderCriteria,"listStart":requestParams.listStart,"listLimit":requestParams.listLimit};
	    dispatch({type:"USER_PREF_CHANGE", userPrefChange});
	    let params = {};
	    params.requestParams = requestParams;
	    params.URI = '/api/admin/callService';

	    return callService(params).then( (responseJson) => {
	      if (responseJson != null && responseJson.protocalError == null){
	    	  if (stateSubView != null && stateSubView.viewType != null) {
	    		  if(responseJson.status != null && responseJson.status == "ACTIONFAILED"){  
	    			  dispatch({type:'SHOW_STATUS',error:responseJson.errors});
	    		  } else {
	    			  dispatch({ type: 'PREFERENCE_SUBVIEW_LIST',responseJson});	
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

export function listLimit({state,stateSubView,listLimit,viewType}) {
	return function(dispatch) {
		let type = "PREFERENCES_LISTLIMIT";
		if (viewType != null) {
			type = "PREFERENCE_SUBVIEW_LISTLIMIT";
		}
		dispatch({type,listLimit});
		dispatch(list({state,stateSubView,listLimit,viewType}));
	};
}

export function search({state,stateSubView,searchCriteria,viewType}) {
	return function(dispatch) {
		let type = "PREFERENCES_SEARCH";
		if (viewType != null) {
			type = "PREFERENCE_SUBVIEW_SEARCH";
		}
		dispatch({type,searchCriteria});
		dispatch(list({state,stateSubView,searchCriteria,listStart:0,viewType}));
	 };
}

export function savePreference({state,stateSubView,parent}) {
	return function(dispatch) {
		let requestParams = {};
	    requestParams.action = "SAVE";
	    if (stateSubView != null && stateSubView.viewType != null) {
		    if (stateSubView.viewType === "FORM") {
		    	requestParams.service = "PREF_FORMFIELD_SVC";
		    } else if (stateSubView.viewType === "LABEL") {
		    	requestParams.service = "PREF_LABEL_SVC";
		    } else if (stateSubView.viewType === "TEXT") {
		    	requestParams.service = "PREF_TEXT_SVC";
		    } else if (stateSubView.viewType === "OPTION") {
		    	requestParams.service = "PREF_OPTION_SVC";
		    }
		    requestParams.inputFields = stateSubView.inputFields;
	    } else {
	    	requestParams.service = "PREF_SVC";
	    	requestParams.inputFields = state.inputFields;
	    }
	    if (parent != null){
	    	requestParams.parentId = parent.id;
	    }

	    let params = {};
	    params.requestParams = requestParams;
	    params.URI = '/api/admin/callService';

	    return callService(params).then( (responseJson) => {
	    	if (responseJson != null && responseJson.protocalError == null){
	    		if(responseJson != null && responseJson.status != null && responseJson.status == "SUCCESS"){  
	    			dispatch(list({state,stateSubView,info:["Save Successful"]}));
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


export function deletePreference({state,stateSubView,id,viewType}) {
	return function(dispatch) {
	    let requestParams = {};
	    requestParams.action = "DELETE";
	    requestParams.itemId = id;
	    if (viewType === "FORM") {
	    	requestParams.service = "PREF_FORMFIELD_SVC";
	    } else if (viewType === "LABEL") {
	    	requestParams.service = "PREF_LABEL_SVC";
	    } else if (viewType === "TEXT") {
	    	requestParams.service = "PREF_TEXT_SVC";
	    } else if (viewType === "OPTION") {
	    	requestParams.service = "PREF_OPTION_SVC";
	    } else {
	    	requestParams.service = "PREF_SVC";
	    }
	    
	    let params = {};
	    params.requestParams = requestParams;
	    params.URI = '/api/admin/callService';

	    return callService(params).then( (responseJson) => {
	    	if (responseJson != null && responseJson.protocalError == null){
	    		if(responseJson != null && responseJson.status != null && responseJson.status == "SUCCESS"){  
	    			dispatch(list({state,stateSubView,info:["Delete Successful"]}));
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

export function preference({id,viewType,languages}) {
	return function(dispatch) {
	    let requestParams = {};
	    requestParams.action = "ITEM";
	    
	    if (viewType === "FORM") {
	    	requestParams.service = "PREF_FORMFIELD_SVC";
	    	requestParams.prefFormKeys = new Array("ADMIN_FORMFIELD_PAGE");
	    } else if (viewType === "LABEL") {
	    	requestParams.service = "PREF_LABEL_SVC";
	    	requestParams.prefFormKeys = new Array("ADMIN_LABEL_PAGE");
	    } else if (viewType === "TEXT") {
	    	requestParams.service = "PREF_TEXT_SVC";
	    	requestParams.prefFormKeys = new Array("ADMIN_TEXT_PAGE");
	    } else if (viewType === "OPTION") {
	    	requestParams.service = "PREF_OPTION_SVC";
	    	requestParams.prefFormKeys = new Array("ADMIN_OPTION_PAGE");
	    } else {
	    	requestParams.service = "PREF_SVC";
		    requestParams.prefFormKeys = new Array("ADMIN_PREFERENCE_PAGE");
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
	    			dispatch({ type: 'PREFERENCES_SUBVIEW_PREFERENCE', responseJson, viewType, languages});
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


export function inputChange(field,value,viewType) {
	 return function(dispatch) {
		 let params = {};
		 params.field = field;
		 params.value = value;
		 if (viewType != null){
			 dispatch({ type:"PREFERENCE_SUBVIEW_INPUT_CHANGE",params});
		 } else {
			 dispatch({ type:"PREFERENCES_INPUT_CHANGE",params});
		 }
	 };
}

export function orderBy({state,stateSubView,orderCriteria,viewType}) {
	 return function(dispatch) {
		 let type = "PREFERENCES_ORDERBY";
		 if (viewType != null) {
			 type = "PREFERENCE_SUBVIEW_ORDERBY";
		 }
		 dispatch({type,orderCriteria});
		 dispatch(list({state,stateSubView,orderCriteria,viewType}));
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

export function subViewInit({state,stateSubView,listStart,listLimit,searchCriteria,orderCriteria,info,item,viewType}) {
	 return function(dispatch) {
		 dispatch({type:"PREFERENCE_SUBVIEW_INIT",orderCriteria,searchCriteria,item,viewType});
		 dispatch(list({state,stateSubView,listStart,listLimit,searchCriteria,orderCriteria,item,viewType}));
	 };
}