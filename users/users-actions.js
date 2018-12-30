import callService from '../../core/api/api-call';

// action helpers



// thunks
export function initUsers() {
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
      dispatch({ type: "LOAD_INIT_USERS", responseJson });
    }).catch(error => {
      throw(error);
    });

  };
}

export function list(pageStart,pageLimit,searchCriteria,orderCriteria) {
  return function(dispatch) {
    let requestParams = {};
    requestParams.action = "LIST";
    requestParams.service = "USERS_SVC";
    requestParams.pageStart = pageStart;
    requestParams.pageLimit = pageLimit;
    requestParams.searchCriteria = searchCriteria;
    requestParams.orderCriteria = orderCriteria;
    let userPrefChange = {"page":"users","orderCriteria":orderCriteria,"pageStart":pageStart,"pageLimit":pageLimit};
    dispatch({type:"USER_PREF_CHANGE", userPrefChange});
    let params = {};
    params.requestParams = requestParams;
    params.URI = '/api/admin/callService';

    return callService(params).then( (responseJson) => {
      dispatch({ type: "LOAD_LIST_USERS", responseJson });
    }).catch(error => {
      throw(error);
    });

  };
}
