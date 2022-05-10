import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { List } from "immutable";
import cx from "classnames";
import last from "lodash/last";
// icons
import { IoIosArrowDown } from "react-icons/io";
import noop from "lodash/noop";
import { TiKey } from "react-icons/ti";
import { FiLogOut } from "react-icons/fi";
// colors
import colors from "src/constants/colors";
const StyleHeader = styled.header`
  background-color: #fff;
  width: 100%;
  box-sizing: border-box;
  padding-left: 300px;
  border-bottom: 1px solid #dedfe5;
  background: #f5f8ff;
  &.feedback-list {
    min-width: 1900px;
    .wrap {
      max-width: 1600px;
    }
  }
  .wrap {
    position: relative;
    margin: 0 auto;
    box-sizing: border-box;
    padding: 0 75px;
    max-width: 1450px;
    height: 75px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .userSetting {
    position: relative;
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 20px;
    min-width: 180px;
    box-sizing: border-box;
    .info {
      transition: 0.2s;
      min-width: 40px;
      div:nth-child(1) {
        font-size: 18px;
        color: ${colors.getIn(["mainColorA", "original"])};
        margin-bottom: 5px;
        font-weight: 700;
      }
      div:nth-child(2) {
        font-size: 16px;
        color: ${colors.getIn(["mainColorA", "half"])};
      }
    }
    .svgArrow {
      fill: ${colors.getIn(["mainColorB", "original"])};
      width: 18px;
      height: 18px;
      margin-left: 24px;
      transition: 0.2s;
    }
    &:hover {
      > img,
      .info,
      svg {
        opacity: 0.8;
      }
      .userSetting-action {
        display: block;
      }
    }
    .avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      margin-right: 15px;
      transition: 0.2s;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.2);
      background-color: #6f69f6;
    }
    &-action {
      display: none;
      box-sizing: border-box;
      position: absolute;
      width: 100%;
      z-index: 3;
      top: 90px;
      left: 0px;
      padding-top: 10px;
      background: #fff;
      border: solid 1px #dddffd;
      border-radius: 7px;
      box-shadow: 0 5px 10px 0 rgba(4, 8, 73, 0.1);
      ul {
        display: flex;
        flex-direction: column;
        font-size: 13px;
        color: #959aa3;
        .line {
          width: 100%;
          height: 2px;
          background: linear-gradient(to right, #ffffff, #dddffd, #ffffff);
        }
        > li {
          font-size: 15px;
          display: flex;
          align-items: center;
          padding: 12px 32px;
          color: ${colors.getIn(["mainColorC", "original"])};
          opacity: 0.5;
          > p {
            margin-left: 25px;
          }
          &:hover {
            opacity: 1;
          }
        }
        &:before {
          content: "";
          position: absolute;
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-bottom: 6px solid #fff;
          box-shadow: 1px #dddffd;
          top: -6px;
          left: 15%;
        }
      }
    }
  }
  .otherLink {
    position: absolute;
    top: 50%;
    left: 75px;
    transform: translateY(-50%);
    height: 100%;
    display: flex;
    a {
      position: relative;
      display: flex;
      color: #959aa3;
      align-items: center;
      margin-right: 50px;
      font-size: 16px;
      height: 100%;
      transition: 0.2s;
      &:last-child {
        margin-right: 0;
      }
      .bottom-line {
        position: absolute;
        left: 50%;
        bottom: 0;
        transform: translateX(-50%);
        width: 0;
        height: 4px;
        border-radius: 5px;
        background-color: #366cfd;
        transition: 0.2s;
      }
      &:hover,
      &.active {
        color: #1c2231;
        .bottom-line {
          width: 100%;
        }
      }
    }
  }
`;
const IconWrap = styled.div`
  width: 32px;
  height: 32px;
  background: ${colors.getIn(["mainColorC", "original"])};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  > svg {
    width: 20px;
    height: 20px;
    color: #ffffff;
  }
`;
const createPagesLink = (LinkList = List(), pathname) => {
  return LinkList.map((value) => {
    if (value.size > 0) {
      return value.map((v, k) => {
        const isInsideChildren = !!~pathname.indexOf("/details/");
        const id = last(pathname.split("/"));
        const route = v.get("route");
        const active = pathname.includes(route);
        return (
          <Link
            className={cx({ active })}
            key={k}
            to={isInsideChildren ? `${route}${id}` : route}
          >
            <span>{v.get("routeName")}</span>
            <div className="bottom-line"></div>
          </Link>
        );
      });
    } else {
      return null;
    }
  });
};
export default ({
  otherLinkList = List(),
  pathname = "",
  userName,
  department,
  clickLogOut = noop,
  clickResetPassword = noop,
  imgSrc = "",
}) => {
  const feedbackHeader = !!~pathname.indexOf(
    "game-feedback/details/feedback-list/"
  );
  const archiveHeader = !!~pathname.indexOf(
    "game-feedback/details/archive-list/"
  );
  return (
    <StyleHeader
      className={cx({ "feedback-list": feedbackHeader || archiveHeader })}
    >
      <div className="wrap">
        <div className="userSetting">
          <div className="avatar">user</div>
          <div className="info">
            <div>{department}</div>
            <div>{userName}</div>
          </div>
          <IoIosArrowDown className="svgArrow" />
          <div className="userSetting-action">
            <ul>
              <li onClick={clickResetPassword}>
                <IconWrap>
                  <TiKey />
                </IconWrap>
                <p>密碼修改</p>
              </li>
              <div className="line" />
              <li onClick={clickLogOut}>
                <IconWrap>
                  <FiLogOut />
                </IconWrap>
                <p> 登出</p>
              </li>
            </ul>
          </div>
        </div>
        <div className="otherLink">
          {createPagesLink(otherLinkList, pathname)}
        </div>
      </div>
    </StyleHeader>
  );
};
