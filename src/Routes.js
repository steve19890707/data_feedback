import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
// import { ContextStore } from "./Reducer/RouteAuth";
import { withRouter } from "react-router";
// components
import Layout from "./components/Layout/Index";
import GamesFeedback from "./components/Pages/GamesFeedback/Index";
import FeedbackList from "./components/Pages/GamesFeedback/FeedbackList/Index";
import ArchiveList from "./components/Pages/GamesFeedback/ArchiveList/Index";
import RateManagement from "./components/Pages/RateManagement/Index";
import AccountManagement from "./components/Pages/AccountManagement/Index";
import Whitelisting from "./components/Pages/Whitelisting/Index";
import FrontPageSetting from "./components/Pages/FrontPageSetting/Index";

const PrivateRoute = withRouter(
  ({ location: { pathname }, component: Component }) => {
    return <Route exact render={(props) => <Component {...props} />} />;
  }
);

const Routes = () => {
  return (
    <Switch>
      <PrivateRoute exact path="/game-feedback" component={GamesFeedback} />
      <PrivateRoute
        exact
        path="/game-feedback/details/feedback-list/:id"
        component={FeedbackList}
      />
      <PrivateRoute
        exact
        path="/game-feedback/details/archive-list/:id"
        component={ArchiveList}
      />
      <PrivateRoute exact path="/rate" component={RateManagement} />
      <PrivateRoute exact path="/admin" component={AccountManagement} />
      <PrivateRoute exact path="/white-list" component={Whitelisting} />
      <PrivateRoute exact path="/setting" component={FrontPageSetting} />
      {/* Redirect */}
      <Redirect from="/" to={"/game-feedback"} component={GamesFeedback} />
    </Switch>
  );
};
export default () => (
  <Layout>
    <Routes />
  </Layout>
);
