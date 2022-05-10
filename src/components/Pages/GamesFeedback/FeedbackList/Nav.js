import React, { useState, useEffect } from "react";
import styled from "styled-components";
import noop from "lodash/noop";
import moment from "moment";
import colors from "src/constants/colors";
import cx from "classnames";
import { addDays } from "date-fns";
import { List } from "immutable";
import DateRangePicker from "src/components/Layout/DateRangePicker";
// icons
import { IoMdClose } from "react-icons/io";
import { MdKeyboardArrowDown } from "react-icons/md";
import { TiInfoLarge } from "react-icons/ti";
import { FiCalendar, FiDownloadCloud } from "react-icons/fi";

const StyleNav = styled.div`
  max-width: 1450px;
  margin: 0 auto;
  .title-select-area {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30px;
  }
  .main {
    .main-title {
      position: relative;
      display: inline-block;
      span {
        display: inline-block;
        vertical-align: middle;
        font-size: 26px;
        font-weight: bold;
        color: ${colors.getIn(["mainColorA", "original"])};
      }
      .infoSvg {
        display: inline-block;
        vertical-align: middle;
        position: relative;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: ${colors.get("gradientB")};
        box-shadow: 0 5px 20px 0 rgba(4, 8, 73, 0.2);
        margin-left: 12px;
        transition: 0.2s;
        cursor: pointer;
        svg {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 20px;
          height: 20px;
          fill: ${colors.get("backgroundColor")};
        }
        &:hover {
          opacity: 0.8;
        }
      }
    }
    .subtitle {
      font-size: 14px;
      color: ${colors.getIn(["mainColorB", "half"])};
      margin-top: 15px;
      span {
        display: inline-block;
        margin: 0 10px;
      }
    }
    .inside-popup {
      @keyframes popupShow {
        0% {
          opacity: 0;
        }
        100% {
          opacity: 1;
        }
      }
      position: absolute;
      left: calc(100% - 40px);
      top: calc(100% + 15px);
      background-color: ${colors.getIn(["mainColorA", "original"])};
      z-index: 100;
      border-radius: 5px;
      box-shadow: 0 0 5px rgb(0, 0, 0, 0.6);
      animation: popupShow 0.3s;
      &:before {
        content: "";
        position: absolute;
        top: 0;
        left: 20px;
        border-top: 10px solid transparent;
        border-left: 10px solid transparent;
        border-bottom: 10px solid #1c2231;
        border-right: 10px solid transparent;
        transform: translateY(-100%);
      }
      .content {
        position: relative;
        padding: 40px;
        .close {
          position: absolute;
          top: 15px;
          right: 15px;
          width: 25px;
          height: 25px;
          fill: ${colors.getIn(["mainColorD", "original"])};
          transition: 0.2s;
          cursor: pointer;
          &:hover {
            fill: #83acff;
          }
        }
        .listStyle {
          min-width: 300px;
          max-height: 300px;
          margin-bottom: 20px;
          overflow: auto;
          &::-webkit-scrollbar {
            width: 6px;
          }
          &::-webkit-scrollbar-track {
            background: transparent;
          }
          &::-webkit-scrollbar-thumb {
            background: #9597ba;
            border-radius: 3px;
          }
          &:last-child {
            margin-bottom: 0%;
          }
          .caption {
            text-transform: uppercase;
            font-size: 16px;
            color: #fff;
            padding-bottom: 20px;
            letter-spacing: 0.5px;
          }
          .list {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            &:last-child {
              margin-bottom: 4px;
            }
            span {
              font-size: 16px;
              color: #9597ba;
              letter-spacing: 0.5px;
            }
            .spacing {
              color: #9597ba;
              margin: 0 5px;
            }
          }
        }
      }
    }
  }
  .dateAndButtons {
    display: flex;
    align-items: center;
    .select-version {
      position: relative;
      margin-right: 10px;
      z-index: 99;
      .sv {
        background-color: #fff;
        padding: 17px 10px 17px 15px;
        border-radius: 5px;
        border: 1px solid #fff;
        box-shadow: 0 5px 10px 0 rgba(4, 8, 73, 0.1);
        display: flex;
        align-items: center;
        transition: 0.3s;
        cursor: pointer;
        &.isSelect {
          border: 1px solid ${colors.getIn(["mainColorE", "original"])};
        }
        .sv-title {
          text-transform: uppercase;
          font-size: 16px;
          color: ${colors.getIn(["mainColorB", "original"])};
          margin-right: 15px;
        }
        .keyboardArrowDown-SVG {
          width: 18px;
          height: 18px;
          fill: ${colors.getIn(["mainColorA", "twenty"])};
        }
      }
      .sv-drop-down {
        position: absolute;
        top: calc(100% + 5px);
        left: 0;
        background-color: #fff;
        padding: 5px 0 15px 0;
        border-radius: 5px;
        box-shadow: 0 0 10px 0 rgba(4, 8, 73, 0.2);
        min-width: 250px;
        max-height: 300px;
        overflow: auto;
        .sv-loading {
          font-size: 14px;
          color: #000;
          text-align: center;
          margin-top: 10px;
        }
        .version-time {
          padding: 10px 15px;
          color: ${colors.getIn(["mainColorB", "half"])};
          font-size: 14px;
          text-transform: uppercase;
        }
        .sv-list-style {
          display: flex;
          align-items: center;
          padding: 8px 0 8px 15px;
          font-size: 14px;
          color: #000;
          background-color: #fff;
          transition: 0.2s;
          cursor: pointer;
          span {
            letter-spacing: 0.5px;
            transition: 0.2s;
          }
          .spacing {
            margin: 0 3px;
          }
          &:hover {
            background-color: #e6e6e6;
          }
        }
      }
    }
    .showDate {
      position: relative;
      background-color: #fff;
      padding: 5px 5px 5px 10px;
      border-radius: 5px;
      box-shadow: 0 5px 10px 0 rgba(4, 8, 73, 0.1);
      display: flex;
      align-items: center;
      .date-label {
        display: flex;
        align-items: center;
        cursor: pointer;
      }
      .startDate {
        font-size: 14px;
        color: ${colors.getIn(["mainColorB", "original"])};
        margin-left: 8px;
      }
      .separate {
        font-size: 14px;
        color: #898990;
        margin: 0 8px;
      }
      .endDate {
        font-size: 14px;
        color: ${colors.getIn(["mainColorB", "original"])};
        margin-right: 16px;
      }
      .dateRange-SVG {
        width: 20px;
        height: 20px;
        stroke-width: 1px;
        stroke: ${colors.getIn(["mainColorB", "original"])};
      }
      .keyboardArrowDown-SVG {
        width: 18px;
        height: 18px;
        fill: ${colors.getIn(["mainColorA", "twenty"])};
      }
      .submit-btn {
        margin-left: 12px;
        border-radius: 5px;
        color: #fff;
        font-size: 14px;
        padding: 12px 24px;
        background: ${colors.get("gradientB")};
        box-shadow: 0 0 3px rgb(0, 0, 0, 0.2);
        transition: 0.2s;
        cursor: pointer;
        &:hover {
          opacity: 0.8;
        }
      }
      .DateRangePicker-layout {
        position: absolute;
        top: calc(100% + 5px);
        right: 0;
        box-shadow: 0 0 10px 0 rgba(4, 8, 73, 0.2);
        border-radius: 10px;
        overflow: hidden;
        z-index: 99;
      }
    }
    .output-btn {
      display: flex;
      align-items: center;
      background: ${colors.get("gradientC")};
      margin-left: 10px;
      padding: 12px;
      border-radius: 5px;
      color: #fff;
      font-size: 14px;
      box-shadow: 0 5px 20px 0 rgba(4, 8, 73, 0.2);
      transition: 0.2s;
      cursor: pointer;
      svg {
        margin-left: 6px;
        stroke: #fff;
        stroke-width: 1px;
        width: 20px;
        height: 20px;
        transition: 0.2s;
      }
      &:hover {
        opacity: 0.8;
      }
    }
  }
`;
export default ({
  setFeedbackData = noop,
  gameId = String(),
  handleDownloadClick = noop,
  loadingGetFilterGameList = true,
  apiGetFilterGameListData = List(),
}) => {
  const [showGameDetail, setShowGameDetail] = useState({
    name: "loading...",
    version: List(),
  });
  const [versionTitle, setVersionTitle] = useState("版本/反饋選擇");
  const [openTitlePopup, setOpenTitlePopup] = useState(false);
  const [openSelectVersion, setOpenSelectVersion] = useState(false);
  const [isShowDateRange, setIsShowDateRange] = useState(false);
  const [selectionRange, setSelectionRange] = useState({
    startDate: addDays(new Date(), -364),
    endDate: new Date(),
    key: "selection",
  });
  const [showDateRange, setShowDateRange] = useState({
    startDate: addDays(new Date(), -364),
    endDate: new Date(),
  });
  useEffect(() => {
    apiGetFilterGameListData.map((value) => {
      if (value.get("game_id") === gameId) {
        return setShowGameDetail({
          name: `${value.get("game_id")}.${value.getIn(["name", "cn"])}`,
          version: value.get("version"),
        });
      } else {
        return null;
      }
    });
  }, [apiGetFilterGameListData, gameId]);
  return (
    <StyleNav>
      <div className="title-select-area">
        <div className="main">
          <div className="main-title">
            <span>{showGameDetail.name}</span>
            <div
              className="infoSvg"
              onClick={() => {
                setOpenTitlePopup(!openTitlePopup);
              }}
            >
              <TiInfoLarge />
            </div>
            {openTitlePopup && (
              <div className="inside-popup">
                <div className="content">
                  <IoMdClose
                    className="close"
                    onClick={() => {
                      setOpenTitlePopup(false);
                    }}
                  />
                  <ul className="listStyle">
                    {loadingGetFilterGameList ? (
                      <li className="list">loading...</li>
                    ) : (
                      showGameDetail.version
                        .sort(
                          (a, b) =>
                            a.get("name").split("v")[1] -
                            b.get("name").split("v")[1]
                        )
                        .map((value, key) => {
                          return (
                            <React.Fragment key={key}>
                              <li className="caption">
                                {value.get("name")} 版本上線:{" "}
                                {moment(value.get("init_time")).format(
                                  "YYYY.MM.DD"
                                )}
                              </li>
                              {value.get("enable_time").map((v, k) => {
                                return (
                                  <li key={k} className="list">
                                    <span>反饋</span>
                                    <span className="spacing">{k + 1}:</span>
                                    <span>
                                      {moment(v.get("start_time")).format(
                                        "YYYY.MM.DD"
                                      )}
                                    </span>
                                    <span className="spacing">-</span>
                                    <span>
                                      {moment(v.get("end_time")).format(
                                        "YYYY.MM.DD"
                                      )}
                                    </span>
                                  </li>
                                );
                              })}
                            </React.Fragment>
                          );
                        })
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>
          <p className="subtitle">
            遊戲反饋<span>/</span>
            {showGameDetail.name}
            <span>/</span>反饋列表
          </p>
        </div>
        <div className="dateAndButtons">
          <div className="select-version">
            <div
              className={cx("sv", { isSelect: openSelectVersion })}
              onClick={() => {
                setOpenSelectVersion((prev) => !prev);
                setIsShowDateRange(false);
              }}
            >
              <div className="sv-title">{versionTitle}</div>
              <MdKeyboardArrowDown className="keyboardArrowDown-SVG" />
            </div>
            {openSelectVersion && (
              <div className="sv-drop-down">
                {loadingGetFilterGameList ? (
                  <div className="sv-loading">loading...</div>
                ) : (
                  showGameDetail.version
                    .sort(
                      (a, b) =>
                        a.get("name").split("v")[1] -
                        b.get("name").split("v")[1]
                    )
                    .map((value, key) => {
                      return (
                        <React.Fragment key={key}>
                          <div className="version-time">
                            {value.get("name")}版本
                          </div>
                          {value.get("enable_time") &&
                            value.get("enable_time").map((v, k) => {
                              const currentVersion = `${value.get(
                                "name"
                              )}版本/反饋 ${k + 1}`;
                              return (
                                <div
                                  key={k}
                                  className="sv-list-style"
                                  onClick={() => {
                                    setVersionTitle(currentVersion);
                                    setOpenSelectVersion(false);
                                    setShowDateRange({
                                      startDate: moment(v.get("start_time"))._d,
                                      endDate: moment(v.get("end_time"))._d,
                                    });
                                    setSelectionRange({
                                      startDate: moment(v.get("start_time"))._d,
                                      endDate: moment(v.get("end_time"))._d,
                                      key: "selection",
                                    });
                                    setFeedbackData({
                                      game_id: gameId,
                                      start_time: moment(
                                        v.get("start_time")
                                      ).format("YYYY-MM-DD 00:00:00"),
                                      end_time: moment(
                                        v.get("end_time")
                                      ).format("YYYY-MM-DD 23:59:59"),
                                    });
                                  }}
                                >
                                  <span>反饋</span>
                                  <span className="spacing">{k + 1}</span>
                                  <span>
                                    (
                                    {moment(v.get("start_time")).format(
                                      "YYYY.MM.DD"
                                    )}
                                  </span>
                                  <span className="spacing">-</span>
                                  <span>
                                    {moment(v.get("end_time")).format(
                                      "YYYY.MM.DD"
                                    )}
                                    )
                                  </span>
                                </div>
                              );
                            })}
                        </React.Fragment>
                      );
                    })
                )}
              </div>
            )}
          </div>
          <div className="showDate">
            <label
              className="date-label"
              onClick={() => {
                setSelectionRange({
                  startDate: showDateRange.startDate,
                  endDate: showDateRange.endDate,
                  key: "selection",
                });
                setIsShowDateRange(!isShowDateRange);
                setOpenSelectVersion(false);
              }}
            >
              <FiCalendar className="dateRange-SVG" />
              <div className="startDate">
                {moment(showDateRange.startDate).format("YYYY.MM.D")}
              </div>
              <div className="separate">-</div>
              <div className="endDate">
                {moment(showDateRange.endDate).format("YYYY.MM.D")}
              </div>
              <MdKeyboardArrowDown className="keyboardArrowDown-SVG" />
            </label>
            <button
              className="submit-btn"
              onClick={() => {
                setVersionTitle("版本/反饋選擇");
                setIsShowDateRange(false);
                setShowDateRange({
                  startDate: selectionRange.startDate,
                  endDate: selectionRange.endDate,
                });
                setFeedbackData({
                  game_id: gameId,
                  start_time: moment(selectionRange.startDate).format(
                    "YYYY-MM-DD 00:00:00"
                  ),
                  end_time: moment(selectionRange.endDate).format(
                    "YYYY-MM-DD 23:59:59"
                  ),
                });
              }}
            >
              確定
            </button>
            {isShowDateRange && (
              <div className="DateRangePicker-layout">
                <DateRangePicker
                  selectionRange={selectionRange}
                  setSelectionRange={setSelectionRange}
                />
              </div>
            )}
          </div>
          <button className="output-btn" onClick={handleDownloadClick}>
            <span>匯出</span>
            <FiDownloadCloud className="arrowRoundDown-SVG" />
          </button>
        </div>
      </div>
    </StyleNav>
  );
};
