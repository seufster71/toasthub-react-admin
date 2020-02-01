import callService from '../../core/api/api-call';
import actionUtils from '../../core/common/action-utils';

// action helpers



// thunks
export function init(role) {
	return function(dispatch) {
		let requestParams = {};
		requestParams.action = "INIT";
		requestParams.service = "PERMISSIONS_SVC";
		requestParams.appTexts = new Array("ADMIN_PERMISSION_PAGE");
		requestParams.appLabels = new Array("ADMIN_PERMISSION_TABLE");
		if (role != null) {
			requestParams.roleId = role.id;
			dispatch({type:"PERMISSIONS_ADD_ROLE", role});
		} else {
			dispatch({type:"PERMISSIONS_CLEAR_ROLE"});
		}
		
		let params = {};
		params.requestParams = requestParams;
		params.URI = '/api/admin/callService';

		return callService(params).then( (responseJson) => {
			if (responseJson != null && responseJson.protocalError == null){
				dispatch({ type: "LOAD_INIT_PERMISSIONS", responseJson });
			} else {
				actionUtils.checkConnectivity(responseJson,dispatch);
			}
		}).catch(error => {
			throw(error);
		});

	};
}

export function list({listStart,listLimit,searchCriteria,orderCriteria,info,role}) {
	return function(dispatch) {
		let requestParams = {};
		requestParams.action = "LIST";
		requestParams.service = "PERMISSIONS_SVC";
		requestParams.listStart = listStart;
		requestParams.listLimit = listLimit;
		requestParams.searchCriteria = searchCriteria;
		requestParams.orderCriteria = orderCriteria;
		if (role != null) {
			requestParams.roleId = role.id;
		}
		let prefChange = {"page":"permissions","orderCriteria":orderCriteria,"listStart":listStart,"listLimit":listLimit};
		dispatch({type:"PERMISSION_PREF_CHANGE", prefChange});
		let params = {};
		params.requestParams = requestParams;
		params.URI = '/api/admin/callService';

		return callService(params).then( (responseJson) => {
			if (responseJson != null && responseJson.protocalError == null){
				dispatch({ type: "LOAD_LIST_PERMISSIONS", responseJson });
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

export function savePermission(inputFields,listStart,listLimit,searchCriteria,orderCriteria) {
	return function(dispatch) {
		let requestParams = {};
	    requestParams.action = "SAVE";
	    requestParams.service = "PERMISSIONS_SVC";
	    requestParams.inputFields = inputFields;

	    let params = {};
	    params.requestParams = requestParams;
	    params.URI = '/api/admin/callService';

	    return callService(params).then( (responseJson) => {
	    	if (responseJson != null && responseJson.protocalError == null){
	    		if(responseJson != null && responseJson.status != null && responseJson.status == "SUCCESS"){  
	    			dispatch(list({listStart,listLimit,searchCriteria,orderCriteria,info:["Save Successful"]}));
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


export function deletePermission(id,listStart,listLimit,searchCriteria,orderCriteria) {
	return function(dispatch) {
	    let requestParams = {};
	    requestParams.action = "DELETE";
	    requestParams.service = "PERMISSIONS_SVC";
	    requestParams.itemId = id;
	    
	    let params = {};
	    params.requestParams = requestParams;
	    params.URI = '/api/admin/callService';

	    return callService(params).then( (responseJson) => {
	    	if (responseJson != null && responseJson.protocalError == null){
	    		dispatch(list({listStart,listLimit,searchCriteria,orderCriteria}));
	    	} else {
	    		actionUtils.checkConnectivity(responseJson,dispatch);
	    	}
	    }).catch(error => {
	    	throw(error);
	    });
	};
}

export function permissionsPage() {
	return function(dispatch) {
	    let requestParams = {};
	    requestParams.action = "PERMISSIONS_PAGE";
	   
	    let params = {};
	    params.requestParams = requestParams;
	    params.URI = '/api/admin/callService';

	    return callService(params).then( (responseJson) => {
	    	if (responseJson != null && responseJson.protocalError == null){
	    		dispatch({ type: 'PERMISSIONS_PAGE',responseJson});
	    	} else {
	    		actionUtils.checkConnectivity(responseJson,dispatch);
	    	}
	    }).catch(error => {
	    	throw(error);
	    });
	};
}

export function permission(id) {
	return function(dispatch) {
	    let requestParams = {};
	    requestParams.action = "ITEM";
	    requestParams.service = "PERMISSIONS_SVC";
	    requestParams.appForms = new Array("ADMIN_PERMISSION_FORM");
	    if (id != null) {
	    	requestParams.itemId = id;
	    }
	    let params = {};
	    params.requestParams = requestParams;
	    params.URI = '/api/admin/callService';

	    return callService(params).then( (responseJson) => {
	    	if (responseJson != null && responseJson.protocalError == null){
	    		dispatch({ type: 'PERMISSIONS_PERMISSION',responseJson});
	    	} else {
	    		actionUtils.checkConnectivity(responseJson,dispatch);
	    	}
	    }).catch(error => {
	    	throw(error);
	    });
	};
}

export function rolePermission({rolePermissionId, permissionId}) {
	return function(dispatch) {
	    let requestParams = {};
	    requestParams.action = "ROLE_PERMISSION_ITEM";
	    requestParams.service = "PERMISSIONS_SVC";
	    requestParams.appForms = new Array("ADMIN_ROLE_PERMISSION_FORM");
	    if (rolePermissionId != null) {
	    	requestParams.itemId = rolePermissionId;
	    }
	    requestParams.permissionId = permissionId;
	    let params = {};
	    params.requestParams = requestParams;
	    params.URI = '/api/admin/callService';

	    return callService(params).then( (responseJson) => {
	    	if (responseJson != null && responseJson.protocalError == null){
	    		dispatch({ type: 'PERMISSIONS_ROLE_PERMISSION',responseJson});
	    	} else {
	    		actionUtils.checkConnectivity(responseJson,dispatch);
	    	}
	    }).catch(error => {
	    	throw(error);
	    });
	};
}

export function saveRolePermission({inputFields,listStart,listLimit,searchCriteria,orderCriteria,role,permissionId}) {
	return function(dispatch) {
		let requestParams = {};
	    requestParams.action = "ROLE_PERMISSION_SAVE";
	    requestParams.service = "PERMISSIONS_SVC";
	    requestParams.inputFields = inputFields;
	    requestParams.roleId = role.id;
	    requestParams.permissionId = permissionId

	    let params = {};
	    params.requestParams = requestParams;
	    params.URI = '/api/admin/callService';

	    return callService(params).then( (responseJson) => {
	    	if (responseJson != null && responseJson.protocalError == null){
	    		if(responseJson != null && responseJson.status != null && responseJson.status == "SUCCESS"){  
	    			dispatch(list({listStart,listLimit,searchCriteria,orderCriteria,info:["Save Successful"],role}));
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
		 dispatch({ type:"PERMISSIONS_INPUT_CHANGE",params});
	 };
}

export function clearPermission() {
	return function(dispatch) {
		dispatch({ type:"PERMISSIONS_CLEAR_PERMISSION"});
	};
}
