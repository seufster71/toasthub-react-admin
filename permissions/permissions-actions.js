import callService from '../../core/api/api-call';
import actionUtils from '../../core/common/action-utils';

// action helpers



// thunks
export function init() {
	return function(dispatch) {
		let requestParams = {};
		requestParams.action = "INIT";
		requestParams.service = "PERMISSIONS_SVC";
		requestParams.appForms = new Array("ADMIN_PERMISSION_FORM");
		requestParams.appTexts = new Array("ADMIN_PERMISSION_PAGE");
		requestParams.appLabels = new Array("ADMIN_PERMISSION_TABLE");
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

export function list(listStart,listLimit,searchCriteria,orderCriteria,info) {
	return function(dispatch) {
		let requestParams = {};
		requestParams.action = "LIST";
		requestParams.service = "PERMISSIONS_SVC";
		requestParams.listStart = listStart;
		requestParams.listLimit = listLimit;
		requestParams.searchCriteria = searchCriteria;
		requestParams.orderCriteria = orderCriteria;
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

export function savePermission(permission,listStart,listLimit,searchCriteria,orderCriteria) {
	return function(dispatch) {
		let requestParams = {};
	    requestParams.action = "PERMISSION_SAVE";
	    requestParams.params = {"PERMISSION" : permission};

	    let params = {};
	    params.requestParams = requestParams;
	    params.URI = '/api/admin/callService';

	    return callService(params).then( (responseJson) => {
	    	if (responseJson != null && responseJson.protocalError == null){
	    		if(responseJson != null && responseJson.status != null && responseJson.status == "SUCCESSFUL"){  
	    			dispatch(list(listStart,listLimit,searchCriteria,orderCriteria,["Permission save Successful"]));
	    		} else if (responseJson != null && responseJson.status != null && responseJson.status == "error") {
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
	    requestParams.action = "PERMISSION_DELETE";
	    requestParams.params = {"PERMISSION_ID":id};
	    
	    let params = {};
	    params.requestParams = requestParams;
	    params.URI = '/api/admin/callService';

	    return callService(params).then( (responseJson) => {
	    	if (responseJson != null && responseJson.protocalError == null){
	    		dispatch(list(listStart,listLimit,searchCriteria,orderCriteria));
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
	    requestParams.action = "PERMISSIONS_PERMISSION";
	    if (id != null) {
	    	requestParams.params = {};
	    	requestParams.params.PERMISSION_ID = id;
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
