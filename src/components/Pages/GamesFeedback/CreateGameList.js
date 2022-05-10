import React from "react";
import cx from "classnames";
import styled from "styled-components";
import moment from "moment";
import Switch from "react-switch";
import { List, fromJS } from "immutable";
import colors from "src/constants/colors";
// common
import { EditButton } from "src/components/Common/CommonPart";
// fadein
import FadeInList from "src/components/Common/FadeInList";
// icons
import { MdKeyboardArrowRight } from "react-icons/md";
import { AiFillExclamationCircle } from "react-icons/ai";
import { FiEdit3 } from "react-icons/fi";
import { Link } from "react-router-dom";
// style
const StyleGameList = styled.li`
  display: flex;
  align-items: center;
  background-color: ${colors.getIn(["mainColorC", "five"])};
  margin-bottom: 2px;
  padding: 8px 0;
  &:nth-child(2n + 1) {
    background-color: #fff;
  }
  &:last-child {
    border-radius: 0 0 10px 10px;
  }
  .insideSet {
    font-size: 14px;
    width: 15%;
    text-align: center;
    box-sizing: border-box;
    &.disable {
      pointer-events: none;
    }
    &:nth-child(2) {
      width: calc(50% - 160px);
      box-sizing: border-box;
      padding-left: 30px;
      text-align: left;
    }
    &:nth-child(3),
    &:nth-child(4) {
      min-width: 110px;
      width: 12.5%;
      text-align: left;
    }
    &.statistics {
      min-width: 160px;
      width: unset;
      display: flex;
      align-items: center;
      justify-content: center;
      span {
        font-size: 14px;
        color: ${colors.getIn(["mainColorB", "original"])};
      }
    }
    &:last-child {
      min-width: unset;
      width: 10%;
      text-align: center;
    }
    .check {
      font-size: 0;
      background: ${colors.getIn(["mainColorC", "twenty"])};
      border-radius: 50%;
      cursor: pointer;
      a {
        display: block;
        padding: 4px;
      }
      svg {
        width: 24px;
        height: 24px;
        fill: ${colors.getIn(["mainColorC", "original"])};
        transition: 0.2s;
      }
      &.disabled {
        pointer-events: none;
        background: ${colors.getIn(["mainColorC", "ten"])};
        svg {
          fill: rgb(0, 0, 0, 0.1);
        }
      }
    }
    &.img {
      display: flex;
      align-items: center;
      .data-img {
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        text-align: center;
        margin-right: 25px;
        background-color: #e0dffc;
        border-radius: 5px;
        color: #fff;
      }
      span {
        font-size: 14px;
        color: ${colors.getIn(["mainColorB", "original"])};
      }
    }
    &.viewOnly {
      width: calc(75% - 160px);
    }
    &.edit {
      position: relative;
      .svg-exclamation {
        position: absolute;
        fill: #fe4455;
        top: -8px;
        left: -8px;
        width: 22px;
        height: 22px;
        z-index: 2;
        cursor: pointer;
        &:hover {
          ~ .tip {
            display: block;
          }
        }
      }
      .tip {
        pointer-events: none;
        display: none;
        position: absolute;
        top: -12px;
        left: -18px;
        transform: translateX(-100%);
        font-size: 14px;
        color: #ff5722;
        background-color: #ffe9cf;
        padding: 8px;
        border-radius: 5px;
        box-shadow: 3px 3px 10px 0 rgba(4, 8, 73, 0.15);
        z-index: 3;
        &:before {
          content: "";
          position: absolute;
          right: 0;
          top: 50%;
          transform: translate(100%, -50%);
          border-top: 4px solid transparent;
          border-bottom: 4px solid transparent;
          border-right: 6px solid transparent;
          border-left: 6px solid #ffe9cf;
        }
      }
    }
  }
`;
export default ({
  levelNum = 0,
  dataList = List(),
  showItemNum,
  currentPage,
  setPopupState,
}) => {
  return dataList.map((value, key) => {
    const versionSize =
      value.get("version").size > 0 ? value.get("version").size - 1 : 0;
    const versionSort = value.get("status")
      ? value
          .getIn(["version"])
          .sort(
            (a, b) =>
              Number(a.get("name").split("v")[1]) -
              Number(b.get("name").split("v")[1])
          )
      : value.getIn(["version"]);
    const enableTimeSize = value.getIn(["version", versionSize, "enable_time"])
      ? versionSort.getIn([versionSize, "enable_time"]).size - 1
      : 0;
    const lastPeriodTime = value.get("status")
      ? new Date(
          versionSort.getIn([
            versionSize,
            "enable_time",
            enableTimeSize,
            "end_time",
          ])
        )
      : new Date();
    const beExpired = moment(new Date()).isSameOrAfter(
      moment(lastPeriodTime).add(-3, "day")
    );
    const versionData =
      value.get("version").size > 0
        ? value.get("version")
        : fromJS([
            {
              enable_time: [
                {
                  start_time: moment(new Date()).format("YYYY-MM-DD 00:00:00"),
                  end_time: moment(new Date()).format("YYYY-MM-DD 23:59:59"),
                },
              ],
              init_time: moment(new Date()).format("YYYY-MM-DD 00:00:00"),
              name: "v1",
            },
          ]);
    return (
      key >= currentPage.start - 1 &&
      key <= currentPage.end - 1 && (
        <FadeInList showItemNum={showItemNum} index={key} key={key}>
          <StyleGameList>
            <div className="insideSet disable">
              <Switch
                className="switch"
                checked={value.get("status") || false}
                checkedIcon={false}
                uncheckedIcon={false}
                offColor={colors.getIn(["mainColorC", "twenty"])}
                onColor={colors.getIn(["mainColorC", "original"])}
                handleDiameter={18}
                height={22}
                width={38}
                boxShadow={
                  value.get("status") === true
                    ? "0 0 2px rgb(0,0,0,0.5)"
                    : "0 0 0 #000"
                }
                onChange={(e) => {
                  console.log(e);
                }}
              />
            </div>
            <div className={cx("insideSet img", { viewOnly: levelNum === 0 })}>
              <div className="data-img">DATA IMG</div>
              <span>
                {value.get("game_id")}.{value.getIn(["name", "cn"])}
              </span>
            </div>
            {levelNum !== 0 && (
              <div className="insideSet edit">
                <EditButton
                  onClick={() => {
                    setPopupState((prev) =>
                      prev
                        .set("listKey", key)
                        .set("title", value.getIn(["name", "cn"]))
                        .set("code", value.get("game_id"))
                        .set("version", versionData)
                        .set("filterRate", value.get("rate"))
                        .set("timeZoneIsOpen", true)
                        .set("versionStatus", value.get("feedback"))
                    );
                  }}
                  svg={<FiEdit3 />}
                  title={`遊戲編輯`}
                />
                {value.get("status") && beExpired && (
                  <>
                    <AiFillExclamationCircle className="svg-exclamation" />
                    <div className="tip">啟用即將結束</div>
                  </>
                )}
              </div>
            )}
            {levelNum !== 0 && (
              <div className="insideSet">
                <EditButton
                  onClick={() => {
                    setPopupState((prev) =>
                      prev
                        .set("listKey", key)
                        .set("title", value.getIn(["name", "cn"]))
                        .set("code", value.get("game_id"))
                        .set("version", versionData)
                        .set("filterRate", value.get("rate"))
                        .set("gameEditIsOpen", true)
                        .set("versionStatus", value.get("feedback"))
                    );
                  }}
                  svg={<FiEdit3 />}
                  title={`評分編輯`}
                />
              </div>
            )}
            <div className="insideSet statistics">
              <span>{value.getIn(["feedback_count", "today"])}</span>
              <span>/</span>
              <span>{value.getIn(["feedback_count", "total"])}</span>
            </div>
            <div className="insideSet">
              <button
                className={cx("check", { disabled: !value.get("feedback") })}
                disabled={!value.get("feedback") && "disabled"}
              >
                <Link
                  to={`/game-feedback/details/feedback-list/${value.get(
                    "game_id"
                  )}`}
                >
                  <MdKeyboardArrowRight />
                </Link>
              </button>
            </div>
          </StyleGameList>
        </FadeInList>
      )
    );
  });
};
