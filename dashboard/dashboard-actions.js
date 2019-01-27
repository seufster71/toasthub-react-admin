import callService from '../../core/api/api-call';

// action helpers



// thunks
export function initStats(statCriteria) {
  return function(dispatch) {
    let requestParams = {};
    requestParams.action = "STAT";
    requestParams.service = "USERS_SVC";
    requestParams.statCriteria = statCriteria;
    let params = {};
    params.requestParams = requestParams;
    params.URI = '/api/admin/callService';

    return callService(params).then( (responseJson) => {
      dispatch({ type: "LOAD_INIT_STATS", responseJson });
    }).catch(error => {
      throw(error);
    });

  };
}
