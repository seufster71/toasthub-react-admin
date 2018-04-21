import callService from '../../core/api/api-call';

// action helpers



// thunks
export function initMenus() {
  return function(dispatch) {
    let requestParams = {};
    requestParams.action = "INIT";
    requestParams.service = "MENU_SVC";
    requestParams.appForms = new Array("ADMIN_MENU_FORM");
    requestParams.appTexts = new Array("ADMIN_MENU_PAGE");
    requestParams.appLabels = new Array("ADMIN_MENU_TABLE");
    requestParams.category = "MEMBER";
    let params = {};
    params.requestParams = requestParams;
    params.URI = '/api/admin/callService';

    return callService(params).then( (responseJson) => {
      dispatch({ type: "LOAD_INIT_MENUS", responseJson });
    }).catch(error => {
      throw(error);
    });

  };
}
