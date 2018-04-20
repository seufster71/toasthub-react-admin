import callService from '../../core/api/api-call';

// action helpers



// thunks
export function initLanguages() {
  return function(dispatch) {
    let requestParams = {};
    requestParams.action = "INIT";
    requestParams.service = "LANGUAGE_SVC";
    requestParams.appForms = new Array("ADMIN_LANGUAGE_FORM");
    requestParams.appTexts = new Array("ADMIN_LANGUAGE_PAGE");
    requestParams.appLabels = new Array("ADMIN_LANGUAGE_TABLE");
    let params = {};
    params.requestParams = requestParams;
    params.URI = '/api/admin/callService';

    return callService(params).then( (responseJson) => {
      dispatch({ type: "LOAD_INIT_LANGUAGES", responseJson });
    }).catch(error => {
      throw(error);
    });

  };
}
