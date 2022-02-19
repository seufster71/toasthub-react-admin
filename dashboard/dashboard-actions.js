import callService from '../../core/api/api-call';

// action helpers



// thunks
export function init({parent,parentType,statCriteria}) {
	return function(dispatch) {
		let requestParams = {};
    	requestParams.action = "INIT";
		requestParams.service = "ADMIN_DASHBOARD_SVC";
		requestParams.prefTextKeys = new Array("ADMIN_DASHBOARD_PAGE");
		requestParams.prefLabelKeys = new Array("ADMIN_DASHBOARD_PAGE");
		if (statCriteria != null) {
			requestParams.statCritera = statCriteria;
		}
		if (parent != null) {
			requestParams.parentId = parent.id;
			requestParams.parentType = parentType;
			dispatch({type:"ADMIN_DASHBOARD_ADD_PARENT", parent, parentType});
		} else {
			dispatch({type:"ADMIN_DASHBOARD_CLEAR_PARENT"});
		}
    	let params = {};
    	params.requestParams = requestParams;
    	params.URI = '/api/admin/callService';

    	return callService(params).then( (responseJson) => {
      		if (responseJson != null && responseJson.protocalError == null){
				dispatch({ type: "ADMIN_DASHBOARD_INIT", responseJson });
			} else {
				actionUtils.checkConnectivity(responseJson,dispatch);
			}
    	}).catch(error => {
      		throw(error);
    	});

  	};
}
