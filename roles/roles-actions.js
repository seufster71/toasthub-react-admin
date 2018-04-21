import callService from '../../core/api/api-call';

// action helpers



// thunks
export function initRoles() {
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
      dispatch({ type: "LOAD_INIT_ROLES", responseJson });
    }).catch(error => {
      throw(error);
    });

  };
}
