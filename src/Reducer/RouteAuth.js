import React from "react";
import { fromJS, Map } from "immutable";

const INIT_PERMISSION_ROUTE = "INIT_PERMISSION_ROUTE";
// const INIT_GROUP_ID = "INIT_GROUP_ID"
const initialState = fromJS({
  permission_routeArray: [],
  isLoading: true,
  changePwd: false,
});
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case INIT_PERMISSION_ROUTE:
      return state
        .set("permission_routeArray", fromJS(getMenulistArray(action.list)))
        .set("isLoading", action.isLoading);
    case "changePwd":
      return state.set("changePwd", !state.get("changePwd"));
    default:
      return state;
  }
};
const ContextStore = React.createContext(initialState);
const getMenulistArray = (menu = Map()) => {
  let newList = [];
  menu.mapKeys((key, value) => {
    value.map((v) => {
      return newList.push(v.get("route"));
    });
  });
  return newList;
};
export { initialState, reducer, ContextStore };
