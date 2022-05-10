import React, { useReducer } from "react";
import { HashRouter } from "react-router-dom";
import Routes from "src/Routes";
import { initialState, reducer, ContextStore } from "src/Reducer/RouteAuth";
// Authorization
localStorage.setItem(
  "authorization",
  localStorage.getItem("authorization")
    ? localStorage.getItem("authorization")
    : ""
);
localStorage.setItem(
  "isLogin",
  localStorage.getItem("isLogin") ? localStorage.getItem("isLogin") : "true"
);
function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <ContextStore.Provider value={{ state, dispatch }}>
      <HashRouter>
        <Routes />
      </HashRouter>
    </ContextStore.Provider>
  );
}
export default App;
