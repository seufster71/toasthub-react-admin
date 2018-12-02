import callService from '../../core/api/api-call';

// action helpers



// thunks
export function initPreferences(orderCriteria) {
  return function(dispatch) {
    let requestParams = {};
    requestParams.action = "INIT";
    requestParams.service = "APPPAGE_SVC";
    requestParams.orderCriteria = orderCriteria;
    requestParams.appForms = new Array("ADMIN_PREFERENCE_FORM");
    requestParams.appTexts = new Array("ADMIN_PREFERENCE_PAGE");
    requestParams.appLabels = new Array("ADMIN_PREFERENCE_TABLE");
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

export function list(pageStart,pageLimit,searchCriteria,orderCriteria) {
  return function(dispatch) {
    let requestParams = {};
    requestParams.action = "LIST";
    requestParams.service = "APPPAGE_SVC";
    requestParams.pageStart = pageStart;
    requestParams.pageLimit = pageLimit;
    requestParams.searchCriteria = searchCriteria;
    requestParams.orderCriteria = orderCriteria;
    let userPrefChange = {"page":"preferences","orderCriteria":orderCriteria,"pageStart":pageStart,"pageLimit":pageLimit};
    dispatch({type:"USER_PREF_CHANGE", userPrefChange});
    let params = {};
    params.requestParams = requestParams;
    params.URI = '/api/admin/callService';

    return callService(params).then( (responseJson) => {
      dispatch({ type: "LOAD_LIST_PREFERENCE", responseJson });
    }).catch(error => {
      throw(error);
    });

  };
}
