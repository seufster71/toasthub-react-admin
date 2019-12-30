import callService from '../../core/api/api-call';

// action helpers



// thunks
export function init(orderCriteria, category) {
  return function(dispatch) {
    let requestParams = {};
    requestParams.action = "INIT";
    requestParams.service = "APPPAGE_SVC";
    requestParams.orderCriteria = orderCriteria;
    requestParams.appForms = new Array("ADMIN_PREFERENCE_FORM");
    requestParams.appTexts = new Array("ADMIN_PREFERENCE_PAGE");
    requestParams.appLabels = new Array("ADMIN_PREFERENCE_TABLE");
    requestParams.category = category;
    let params = {};
    params.requestParams = requestParams;
    params.URI = '/api/admin/callService';

    return callService(params).then( (responseJson) => {
      dispatch({ type: "LOAD_INIT_PREFERENCE", responseJson });
    }).catch(error => {
      throw(error);
    });

  };
}

export function list(listStart,listLimit,searchCriteria,orderCriteria) {
  return function(dispatch) {
    let requestParams = {};
    requestParams.action = "LIST";
    requestParams.service = "APPPAGE_SVC";
    requestParams.listStart = listStart;
    requestParams.listLimit = listLimit;
    requestParams.searchCriteria = searchCriteria;
    requestParams.orderCriteria = orderCriteria;
    let userPrefChange = {"page":"preferences","orderCriteria":orderCriteria,"listStart":listStart,"listLimit":listLimit};
    dispatch({type:"USER_PREF_CHANGE", userPrefChange});
    let params = {};
    params.requestParams = requestParams;
    params.URI = '/api/admin/callService';

    return callService(params).then( (responseJson) => {
      if (responseJson != null && responseJson.error == null){
    	  dispatch({ type: "LOAD_LIST_PREFERENCE", responseJson });
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
