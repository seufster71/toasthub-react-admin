import callService from '../../core/api/api-call';

// action helpers



// thunks
export function initBugs() {
  return function(dispatch) {
    let requestParams = {};
    requestParams.action = "INIT";
    requestParams.service = "BUGS_SVC";
    requestParams.prefForms = new Array("ADMIN_BUGS_PAGE");
    requestParams.prefTexts = new Array("ADMIN_BUGS_PAGE");
    requestParams.prefLabels = new Array("ADMIN_BUGS_PAGE");
    let params = {};
    params.requestParams = requestParams;
    params.URI = '/api/admin/callService';

    return callService(params).then( (responseJson) => {
      dispatch({ type: "LOAD_INIT_BUGS", responseJson });
    }).catch(error => {
      throw(error);
    });

  };
}
