import callService from '../../core/api/api-call';

// action helpers



// thunks
export function initBugs() {
  return function(dispatch) {
    let requestParams = {};
    requestParams.action = "INIT";
    requestParams.service = "BUGS_SVC";
    requestParams.prefFormKeys = new Array("ADMIN_BUGS_PAGE");
    requestParams.prefTextKeys = new Array("ADMIN_BUGS_PAGE");
    requestParams.prefLabelKeys = new Array("ADMIN_BUGS_PAGE");
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
