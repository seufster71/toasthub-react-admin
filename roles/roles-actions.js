import callService from '../../core/api/api-call';
import actionUtils from '../../core/common/action-utils';

// action helpers



// thunks
export function init(user) {
	return function(dispatch) {
		let requestParams = {};
		requestParams.action = "INIT";
		requestParams.service = "ROLES_SVC";
		requestParams.appTexts = new Array("ADMIN_ROLE_PAGE");
		requestParams.appLabels = new Array("ADMIN_ROLE_TABLE");
		if (user != null) {
			requestParams.userId = user.id;
			dispatch({type:"ROLES_ADD_USER", user});
		} else {
			dispatch({type:"ROLES_CLEAR_USER"});
		}
		let params = {};
		params.requestParams = requestParams;
		params.URI = '/api/admin/callService';

		return callService(params).then( (responseJson) => {
			if (responseJson != null && responseJson.protocalError == null){
				dispatch({ type: "LOAD_INIT_ROLES", responseJson });
			} else {
				actionUtils.checkConnectivity(responseJson,dispatch);
			}
		}).catch(error => {
			throw(error);
		});

	};
}

export function list({state,listStart,listLimit,searchCriteria,orderCriteria,info}) {
	return function(dispatch) {
		let requestParams = {};
		requestParams.action = "LIST";
		requestParams.service = "ROLES_SVC";
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
		if (state.parent != null) {
			requestParams.userId = state.parent.id;
		}
		let prefChange = {"page":"roles","orderCriteria":requestParams.orderCriteria,"listStart":requestParams.listStart,"listLimit":requestParams.listLimit};
		dispatch({type:"ROLE_PREF_CHANGE", prefChange});
		let params = {};
		params.requestParams = requestParams;
		params.URI = '/api/admin/callService';

		return callService(params).then( (responseJson) => {
			if (responseJson != null && responseJson.protocalError == null){
				dispatch({ type: "LOAD_LIST_ROLES", responseJson });
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
		 dispatch({ type:"ROLES_LISTLIMIT",listLimit});
		 dispatch(list({state,listLimit}));
	 };
}

export function search({state,searchCriteria}) {
	return function(dispatch) {
		 dispatch({ type:"ROLES_SEARCH",searchCriteria});
		 dispatch(list({state,searchCriteria,listStart:0}));
	 };
}

export function saveRole({state}) {
	return function(dispatch) {
		let requestParams = {};
	    requestParams.action = "SAVE";
	    requestParams.service = "ROLES_SVC";
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


export function deleteRole({state,id}) {
	return function(dispatch) {
	    let requestParams = {};
	    requestParams.action = "DELETE";
	    requestParams.service = "ROLES_SVC";
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

export function rolesPage() {
	return function(dispatch) {
	    let requestParams = {};
	    requestParams.action = "ROLES_PAGE";
	   
	    let params = {};
	    params.requestParams = requestParams;
	    params.URI = '/api/admin/callService';

	    return callService(params).then( (responseJson) => {
	    	if (responseJson != null && responseJson.protocalError == null){
	    		dispatch({ type: 'ROLES_PAGE',responseJson});
	    	} else {
	    		actionUtils.checkConnectivity(responseJson,dispatch);
	    	}
	    }).catch(error => {
	    	throw(error);
	    });
	};
}

export function role(id) {
	return function(dispatch) {
	    let requestParams = {};
	    requestParams.action = "ITEM";
	    requestParams.service = "ROLES_SVC";
	    requestParams.appForms = new Array("ADMIN_ROLE_FORM");
	    if (id != null) {
	    	requestParams.itemId = id;
	    }
	    let params = {};
	    params.requestParams = requestParams;
	    params.URI = '/api/admin/callService';

	    return callService(params).then( (responseJson) => {
	    	if (responseJson != null && responseJson.protocalError == null){
	    		dispatch({ type: 'ROLES_ROLE',responseJson});
	    	} else {
	    		actionUtils.checkConnectivity(responseJson,dispatch);
	    	}
	    }).catch(error => {
	    	throw(error);
	    });
	};
}

export function userRole({userRoleId, roleId}) {
	return function(dispatch) {
	    let requestParams = {};
	    requestParams.action = "USER_ROLE_ITEM";
	    requestParams.service = "ROLES_SVC";
	    requestParams.appForms = new Array("ADMIN_USER_ROLE_FORM");
	    if (userRoleId != null) {
	    	requestParams.itemId = userRoleId;
	    }
	    requestParams.roleId = roleId;
	    let params = {};
	    params.requestParams = requestParams;
	    params.URI = '/api/admin/callService';

	    return callService(params).then( (responseJson) => {
	    	if (responseJson != null && responseJson.protocalError == null){
	    		dispatch({ type: 'ROLES_USER_ROLE',responseJson});
	    	} else {
	    		actionUtils.checkConnectivity(responseJson,dispatch);
	    	}
	    }).catch(error => {
	    	throw(error);
	    });
	};
}

export function saveRolePermission({state}) {
	return function(dispatch) {
		let requestParams = {};
	    requestParams.action = "USER_ROLE_SAVE";
	    requestParams.service = "ROLES_SVC";
	    requestParams.inputFields = state.inputFields;
	    requestParams.userId = state.parent.id;
	    requestParams.roleId = state.selected.roleId

	    let params = {};
	    params.requestParams = requestParams;
	    params.URI = '/api/admin/callService';

	    return callService(params).then( (responseJson) => {
	    	if (responseJson != null && responseJson.protocalError == null){
	    		if(responseJson != null && responseJson.status != null && responseJson.status == "SUCCESS"){  
	    			dispatch(list({state,info:["Save Successful"]}));
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

export function inputChange(field,value) {
	 return function(dispatch) {
		 let params = {};
		 params.field = field;
		 params.value = value;
		 dispatch({ type:"ROLES_INPUT_CHANGE",params});
	 };
}

export function orderBy({state,orderCriteria}) {
	 return function(dispatch) {
		 dispatch({ type:"ROLES_ORDERBY",orderCriteria});
		 dispatch(list({state,orderCriteria}));
	 };
}

export function clearRole() {
	return function(dispatch) {
		dispatch({ type:"ROLES_CLEAR_ROLE"});
	};
}