import callService from '../../core/api/api-call';

// action helpers



// thunks
export function initServices() {
  return function(dispatch) {
    let requestParams = {};
    requestParams.action = "INIT";
    requestParams.service = "SERVICE_CRAWLER_SVC";
    requestParams.appForms = new Array("ADMIN_SERVICE_CRAWLER_FORM");
    requestParams.appTexts = new Array("ADMIN_SERVICE_CRAWLER_PAGE");
    requestParams.appLabels = new Array("ADMIN_SERVICE_CRAWLER_TABLE");
    let params = {};
    params.requestParams = requestParams;
    params.URI = '/api/admin/callService';

    return callService(params).then( (responseJson) => {
      dispatch({ type: "LOAD_INIT_SERVICES", responseJson });
    }).catch(error => {
      throw(error);
    });

  };
}
