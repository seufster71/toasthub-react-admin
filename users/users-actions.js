import callService from '../../core/api/api-call';
import actionUtils from '../../core/common/action-utils';

// action helpers



// thunks
export function init() {
  return function(dispatch) {
    let requestParams = {};
    requestParams.action = "INIT";
    requestParams.service = "USERS_SVC";
    requestParams.appForms = new Array("ADMIN_USER_FORM");
    requestParams.appTexts = new Array("ADMIN_USER_PAGE");
    requestParams.appLabels = new Array("ADMIN_USER_TABLE");
    let params = {};
    params.requestParams = requestParams;
    params.URI = '/api/admin/callService';

    return callService(params).then( (responseJson) => {
    	if (responseJson != null && responseJson.protocalError == null){
    		dispatch({ type: "LOAD_INIT_USERS", responseJson });
    		//if (info != null) {
	        //	  dispatch({type:'SHOW_STATUS',info:info});  
	        //}
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
		requestParams.service = "USERS_SVC";
		requestParams.listStart = listStart;
		requestParams.listLimit = listLimit;
		requestParams.searchCriteria = searchCriteria;
		requestParams.orderCriteria = orderCriteria;
		let userPrefChange = {"page":"users","orderCriteria":orderCriteria,"listStart":listStart,"listLimit":listLimit};
		dispatch({type:"USER_PREF_CHANGE", userPrefChange});
		let params = {};
		params.requestParams = requestParams;
		params.URI = '/api/admin/callService';

		return callService(params).then( (responseJson) => {
			if (responseJson != null && responseJson.protocalError == null){
				dispatch({ type: "LOAD_LIST_USERS", responseJson });
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

export function saveUser(user,listStart,listLimit,searchCriteria,orderCriteria) {
	return function(dispatch) {
		let requestParams = {};
	    requestParams.action = "USER_SAVE";
	    requestParams.params = {"USER" : user};

	    let params = {};
	    params.requestParams = requestParams;
	    params.URI = '/api/admin/callService';

	    return callService(params).then( (responseJson) => {
	    	if (responseJson != null && responseJson.protocalError == null){
	    		if(responseJson != null && responseJson.status != null && responseJson.status == "SUCCESSFUL"){  
	    			dispatch(list(listStart,listLimit,searchCriteria,orderCriteria,["User save Successful"]));
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


export function deleteUser(id,listStart,listLimit,searchCriteria,orderCriteria) {
	return function(dispatch) {
	    let requestParams = {};
	    requestParams.action = "USER_DELETE";
	    requestParams.params = {"USER_ID":id};
	    
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

export function usersPage() {
	return function(dispatch) {
	    let requestParams = {};
	    requestParams.action = "USERS_PAGE";
	   
	    let params = {};
	    params.requestParams = requestParams;
	    params.URI = '/api/admin/callService';

	    return callService(params).then( (responseJson) => {
	    	if (responseJson != null && responseJson.protocalError == null){
	    		dispatch({ type: 'USERS_PAGE',responseJson});
	    	} else {
	    		actionUtils.checkConnectivity(responseJson,dispatch);
	    	}
	    }).catch(error => {
	    	throw(error);
	    });
	};
}

export function user(id) {
	return function(dispatch) {
	    let requestParams = {};
	    requestParams.action = "USERS_USER";
	    if (id != null) {
	    	requestParams.params = {};
	    	requestParams.params.USER_ID = id;
	    }
	    let params = {};
	    params.requestParams = requestParams;
	    params.URI = '/api/admin/callService';

	    return callService(params).then( (responseJson) => {
	    	if (responseJson != null && responseJson.protocalError == null){
	    		dispatch({ type: 'USERS_USER',responseJson});
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

export function permissionsChange(permissions) {
	return function(dispatch) {
		dispatch({ type:"USERS_PERMISSION_CHANGE",permissions});
	};
}

export function clearUser() {
	return function(dispatch) {
		dispatch({ type:"USERS_CLEAR_USER"});
	};
}
