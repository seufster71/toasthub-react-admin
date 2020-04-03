import callService from '../core/api/api-call';

// action

// thunk
export function initAdmin() {
    return function(dispatch) {
      let requestParams = {};
      requestParams.action = "INIT";
      requestParams.service = "ADMIN_SVC";
      requestParams.prefTexts = new Array("ADMIN_PAGE");
      requestParams.menuNames = new Array("ADMIN_MENU_TOP");
      let params = {};
      params.requestParams = requestParams;
      params.URI = '/api/admin/callService';

      return callService(params).then( (responseJson) => {
        dispatch({ type: "LOAD_INIT", responseJson });
      }).catch(error => {
        throw(error);
      });

    };
}
