import callService from '../../core/api/api-call';
import actionUtils from '../../core/common/action-utils';

// action helpers



// thunks
export function init() {
	return function(dispatch) {
		let requestParams = {};
		requestParams.action = "INIT";
		requestParams.service = "ROLES_SVC";
		requestParams.appForms = new Array("ADMIN_ROLE_FORM");
		requestParams.appTexts = new Array("ADMIN_ROLE_PAGE");
		requestParams.appLabels = new Array("ADMIN_ROLE_TABLE");
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

export function list(listStart,listLimit,searchCriteria,orderCriteria,info) {
	return function(dispatch) {
		let requestParams = {};
		requestParams.action = "LIST";
		requestParams.service = "ROLE_SVC";
		requestParams.listStart = listStart;
		requestParams.listLimit = listLimit;
		requestParams.searchCriteria = searchCriteria;
		requestParams.orderCriteria = orderCriteria;
		let prefChange = {"page":"roles","orderCriteria":orderCriteria,"listStart":listStart,"listLimit":listLimit};
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

export function saveRole(role,listStart,listLimit,searchCriteria,orderCriteria) {
	return function(dispatch) {
		let requestParams = {};
	    requestParams.action = "ROLE_SAVE";
	    requestParams.params = {"ROLE" : role};

	    let params = {};
	    params.requestParams = requestParams;
	    params.URI = '/api/admin/callService';

	    return callService(params).then( (responseJson) => {
	    	if (responseJson != null && responseJson.protocalError == null){
	    		if(responseJson != null && responseJson.status != null && responseJson.status == "SUCCESSFUL"){  
	    			dispatch(list(listStart,listLimit,searchCriteria,orderCriteria,["Role save Successful"]));
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


export function deleteRole(id,listStart,listLimit,searchCriteria,orderCriteria) {
	return function(dispatch) {
	    let requestParams = {};
	    requestParams.action = "ROLE_DELETE";
	    requestParams.params = {"ROLE_ID":id};
	    
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
	    requestParams.action = "ROLES_ROLE";
	    if (id != null) {
	    	requestParams.params = {};
	    	requestParams.params.ROLE_ID = id;
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

export function inputChange(field,value) {
	 return function(dispatch) {
		 let params = {};
		 params.field = field;
		 params.value = value;
		 dispatch({ type:"ROLES_INPUT_CHANGE",params});
	 };
}

export function clearRole() {
	return function(dispatch) {
		dispatch({ type:"ROLES_CLEAR_ROLE"});
	};
}