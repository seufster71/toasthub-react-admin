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
    requestParams.appLabels = new Array("ADMIN_USER_PAGE");
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
