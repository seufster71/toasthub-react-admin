import callService from '../../core/api/api-call';

// action helpers



// thunks
export function initCategory() {
  return function(dispatch) {
    let requestParams = {};
    requestParams.action = "INIT";
    requestParams.service = "CATEGORY_SVC";
    requestParams.appForms = new Array("ADMIN_CATEGORY_FORM");
    requestParams.appTexts = new Array("ADMIN_CATEGORY_PAGE");
    requestParams.appLabels = new Array("ADMIN_CATEGORY_TABLE");
    let params = {};
    params.requestParams = requestParams;
    params.URI = '/api/admin/callService';

    return callService(params).then( (responseJson) => {
      dispatch({ type: "LOAD_INIT_CATEGORY", responseJson });
    }).catch(error => {
      throw(error);
    });

  };
}
