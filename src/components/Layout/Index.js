import React, { useEffect, useContext } from "react";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import { List } from "immutable";
import styled from "styled-components";
import cx from "classnames";
import asidList from "src/constants/asideList";
import Header from "./Header";
import colors from "src/constants/colors";
import { GapiChangePwd } from "src/common-lib/components/GapiChangePwd";
// icons
import { FaQuestionCircle } from "react-icons/fa";
import { FiFileText, FiUsers, FiEyeOff, FiSettings } from "react-icons/fi";
import { BsStar } from "react-icons/bs";
// api
// import { apiAdminUser_info, apiPutLogout, apiGetMeunList } from "src/api";
import { user_info, menu } from "src/demoData";
// url
// import { API_URL } from "src/configs/APIUrl";
import packageJson from "~/package.json";
import { ContextStore } from "src/Reducer/RouteAuth";
// style
const StyleLayout = styled.main`
  position: relative;
  top: 0;
  background-color: #fff;
  width: 100%;
  min-width: 1300px;
  min-height: 100vh;
  z-index: 1;
  .children {
    width: 100%;
    box-sizing: border-box;
    padding-left: 300px;
    background-color: ${colors.get("backgroundColor")};
  }
`;
const StyleAside = styled.aside`
  position: fixed;
  top: 0;
  left: 0;
  background: ${colors.get("gradientA")};
  width: 300px;
  height: 100%;
  z-index: 1001;
  overflow: auto;
  .aside-title {
    display: flex;
    padding: 100px 0 75px 0;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    span {
      display: block;
      margin-top: 30px;
      font-size: 24px;
      font-weight: bold;
      color: #fff;
    }
  }
  .aside-list {
    li {
      transition: 0.3s;
      cursor: pointer;
      a {
        display: flex;
        align-items: center;
        padding: 25px 0 25px 85px;
        box-sizing: border-box;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-bottom: 1px solid #ffffff20;
      }
      svg {
        width: 24px;
        height: 24px;
        margin-right: 15px;
        transition: 0.3s;
        color: #c4c4c8;
        &.default {
          fill: #c4c4c8;
        }
        &.storke {
          stroke-width: 1px;
        }
      }
      span {
        display: inline-block;
        margin-right: 15px;
        font-size: 16px;
        color: #c4c4c8;
        transition: 0.3s;
      }
      &.active {
        background-color: #ffffff20;
        a {
          border-left: 5px solid ${colors.getIn([`mainColorD`, `original`])};
        }
        svg,
        span {
          color: #fff;
        }
      }
      &:hover {
        svg {
          color: #fff;
          &.default {
            fill: #fff;
          }
        }
        span {
          color: #fff;
        }
      }
      &:nth-child(1) {
        a {
          border-top: 1px solid #ffffff20;
        }
      }
      &:last-child {
        a {
          border-bottom: none;
        }
      }
    }
  }
`;
const iconSelector = (route) => {
  switch (route) {
    case "/game-feedback":
      return <FiFileText className="storke" />;
    case "/rate":
      return <BsStar />;
    case "/admin":
      return <FiUsers className="storke" />;
    case "/white-list":
      return <FiEyeOff className="storke" />;
    case "/setting":
      return <FiSettings className="storke" />;
    default:
      return <FaQuestionCircle className="default" />;
  }
};
// function list
const CreateAsideList = ({ pages = List(), pathname }) => {
  return pages.map((v, index) => {
    const name = v.get("name");
    const route = "/" + v.get("route");
    const getFirstSplitRouteName = (route) => route.split("-")[0];
    const active = getFirstSplitRouteName(pathname).includes(
      getFirstSplitRouteName(route)
    );
    return (
      <li key={index} className={cx({ active })}>
        <Link to={route}>
          {iconSelector(route)}
          <span>{name}</span>
        </Link>
      </li>
    );
  });
};

// context
export const VariationsContext = React.createContext({
  level: {},
});
const Layout = ({ children, location: { pathname }, history, route }) => {
  const { state, dispatch } = useContext(ContextStore);
  // const { fetchData: userInfo } = apiAdminUser_info();
  const userInfo = user_info;
  // const { fetchData: menuList, isLoading } = apiGetMeunList();
  const menuList = menu;
  const isLoading = false;
  const page = menuList.get("pages");
  const management = menuList.get("management");
  const editor = menuList.get("editor");
  const userName = userInfo.get("account");
  const department = userInfo.get("department");
  const imgSrc = userInfo.get("avatar_url");
  const level = userInfo.get("level");
  useEffect(() => {
    if (menuList.size > 0) {
      dispatch({ type: "INIT_PERMISSION_ROUTE", list: menuList, isLoading });
    }
  }, [dispatch, isLoading, menuList]);

  const clickResetPassword = () => {
    dispatch({ type: "changePwd" });
  };

  const clickLogOut = () => {
    window.confirm("確認登出") && alert("logout!");
  };

  return (
    <StyleLayout data-version={packageJson.version}>
      <Header
        otherLinkList={asidList.map((value) => {
          if (
            value.get("children") &&
            !!~pathname.indexOf(value.get("route"))
          ) {
            return value.get("childrenLink");
          } else if (
            value.get("insideChildren") &&
            !!~pathname.indexOf(value.get("insideChildrenRoute"))
          ) {
            return value.get("insideChildrenLink");
          } else {
            return new List();
          }
        })}
        pathname={pathname}
        userName={userName}
        department={department}
        imgSrc={imgSrc}
        clickLogOut={clickLogOut}
        clickResetPassword={clickResetPassword}
      />
      <VariationsContext.Provider value={{ level: level }}>
        <div className="children">{children}</div>
      </VariationsContext.Provider>
      <StyleAside>
        <div className="aside-title">
          <span>FeedBack</span>
        </div>
        <ul className="aside-list">
          <CreateAsideList pages={page} pathname={pathname} />
          <CreateAsideList pages={editor} pathname={pathname} />
          <CreateAsideList pages={management} pathname={pathname} />
        </ul>
      </StyleAside>
      {state.get("changePwd") && (
        <GapiChangePwd
          apiUrl={""}
          closehandler={() => dispatch({ type: "changePwd" })}
        />
      )}
    </StyleLayout>
  );
};
export default withRouter(Layout);
