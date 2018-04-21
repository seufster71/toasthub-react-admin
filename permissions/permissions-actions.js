import callService from '../../core/api/api-call';

// action helpers



// thunks
export function initPermissions() {
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
      dispatch({ type: "LOAD_INIT_PERMISSIONS", responseJson });
    }).catch(error => {
      throw(error);
    });

  };
}
