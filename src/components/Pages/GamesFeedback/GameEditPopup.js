import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import moment from "moment";
import noop from "lodash/noop";
import { List, Map, fromJS } from "immutable";
// components
import DateRangePicker from "src/components/Layout/DateRangePicker";
import DatePicker from "src/components/Layout/DatePicker";
import {
  ConfirmButton,
  CancelButton,
  AddOtherTagButton,
} from "src/components/Common/CommonPart";
// api
// import { apiGameSwtich } from "src/api";

// icons
import { IoIosArrowDown } from "react-icons/io";
import { MdAddCircle } from "react-icons/md";
import { FiCalendar } from "react-icons/fi";
// colors
import colors from "src/constants/colors";

const StylePopup = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1002;
  overflow-y: auto;
  .container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 500px;
    background-color: ${colors.get("backgroundColor")};
    border-radius: 10px;
    .infoList {
      position: relative;
      width: 100%;
      box-sizing: border-box;
      padding: 45px 10px 45px 45px;
      border-radius: 5px;
      .add-other-btn {
        position: absolute;
        top: 5%;
        right: 5%;
        .other-style {
          border-radius: 5px;
          padding: 10px 20px;
          background: ${colors.get("gradientC")};
        }
      }
      .title {
        font-size: 22px;
        font-weight: bold;
        color: ${colors.getIn(["mainColorA", "original"])};
        margin-bottom: 30px;
      }
      .versionZone {
        position: relative;
        height: 350px;
        overflow: auto;
        padding-right: 35px;
      }
    }
    .btns {
      margin-top: 20px;
      .confirm {
        margin-right: 10px;
      }
    }
  }
`;
const StyleCreateVersion = styled.div`
  .version-title {
    text-transform: uppercase;
    font-size: 18px;
    color: ${colors.getIn(["mainColorA", "original"])};
    margin-bottom: 10px;
  }
  .list-style {
    width: 100%;
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 30px;
    }
    .list-content {
      position: relative;
      display: flex;
      align-items: center;
      padding: 15px;
      background-color: rgba(255, 255, 255, 0.5);
      width: 90%;
      box-sizing: border-box;
      border-radius: 5px;
      border: 1px solid ${colors.getIn(["mainColorC", "twenty"])};
      span {
        font-size: 16px;
        color: ${colors.getIn(["mainColorB", "half"])};
        letter-spacing: 0.5px;
      }
      .Ficalendar-svg {
        width: 20px;
        height: 20px;
        margin-right: 10px;
        stroke-width: 1;
        color: ${colors.getIn(["mainColorB", "half"])};
      }
      .middle {
        padding: 0 6px;
      }
    }
    &.select {
      position: relative;
      .add-svg {
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        width: 35px;
        height: 35px;
        fill: ${colors.getIn(["mainColorC", "original"])};
        filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.2));
        cursor: pointer;
        &:hover {
          fill: #9d96fb;
          filter: drop-shadow(2px 2px 3px rgba(0, 0, 0, 0.2));
        }
      }
      .list-content {
        background-color: rgba(255, 255, 255, 1);
        transition: 0.2s;
        cursor: pointer;
        .Ficalendar-svg,
        span {
          color: ${colors.getIn(["mainColorB", "original"])};
        }
        .arrow-down {
          position: absolute;
          top: 50%;
          right: 15px;
          transform: translateY(-50%);
          width: 16px;
          height: 16px;
          color: ${colors.getIn(["mainColorB", "half"])};
        }
        &:hover {
          border: 1px solid ${colors.getIn(["mainColorE", "original"])};
        }
      }
    }
  }
  .DatePicker-layout-layoutCover {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 10px;
    z-index: 1;
  }
  .DatePicker-layout {
    position: fixed;
    top: 50%;
    left: 50%;
    box-shadow: 0 0 10px 0 rgba(4, 8, 73, 0.2);
    border-radius: 10px;
    overflow: hidden;
    z-index: 99;
    transform: translate(-50%, -50%);
    .select-cpation {
      display: flex;
      align-items: center;
      background: ${colors.getIn(["gradientB"])};
      padding: 20px;
      .Ficalendar-svg {
        width: 20px;
        height: 20px;
        margin-right: 10px;
        stroke-width: 1;
        color: #fff;
      }
      span {
        font-size: 16px;
        color: #fff;
        letter-spacing: 0.5px;
      }
      .middle {
        padding: 0 6px;
      }
    }
    .confirm-btns {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      background-color: #fff;
      padding: 15px;
      box-sizing: border-box;
      button {
        padding: 8px 12px;
        &.cancel {
          margin-left: 10px;
        }
      }
    }
  }
`;
const StyleCreateVersionDisable = styled.div`
  .version-title {
    text-transform: uppercase;
    font-size: 18px;
    color: ${colors.getIn(["mainColorA", "original"])};
    margin-bottom: 10px;
  }
  .list-style {
    display: flex;
    align-items: center;
    padding: 15px;
    margin-bottom: 10px;
    background-color: rgba(255, 255, 255, 0.5);
    width: 90%;
    box-sizing: border-box;
    border-radius: 5px;
    border: 1px solid ${colors.getIn(["mainColorC", "twenty"])};
    &:last-child {
      margin-bottom: 30px;
    }
    span {
      font-size: 16px;
      color: ${colors.getIn(["mainColorB", "half"])};
      letter-spacing: 0.5px;
    }
    svg {
      width: 20px;
      height: 20px;
      margin-right: 10px;
      stroke-width: 1;
      color: ${colors.getIn(["mainColorB", "half"])};
    }
    .middle {
      padding: 0 6px;
    }
  }
`;
const CreateVersionList = ({
  unset,
  dataList = List(),
  isAdd = false,
  datePickerOpen,
  pickDate,
  selectionRange,
  scrollContent = null,
  setPopupState = noop,
  setIsAdd = noop,
  setDatePickerOpen = noop,
  setPickDate = noop,
  setSelectionRange = noop,
  setUnset = noop,
}) => {
  const mapData = dataList.sort(
    (a, b) => a.get("name").split("v")[1] - b.get("name").split("v")[1]
  );
  return mapData.map((value, key) => {
    if (key === mapData.size - 1) {
      return (
        <StyleCreateVersion key={key}>
          <div className="version-title">{value.get("name")}版本</div>
          <div className="list-style select">
            <div
              className="list-content"
              onClick={() => {
                setPickDate(moment(value.get("init_time"))._d);
                setDatePickerOpen((prev) => {
                  return { ...prev, single: !prev.single };
                });
              }}
            >
              <FiCalendar className="Ficalendar-svg" />
              <span>版本發佈：</span>
              {unset.version ? (
                <span>請輸入時間</span>
              ) : (
                <span>
                  {moment(value.get("init_time")).format("YYYY.MM.DD")}
                </span>
              )}
              <IoIosArrowDown className="arrow-down" />
            </div>
          </div>
          {datePickerOpen.single && (
            <>
              <div className="DatePicker-layout-layoutCover" />
              <div className="DatePicker-layout">
                <div className="select-cpation">
                  <FiCalendar className="Ficalendar-svg" />
                  <span>版本發佈：</span>
                  <span>
                    {moment(value.get("init_time")).format("YYYY.MM.DD")}
                  </span>
                </div>
                <DatePicker PickDate={pickDate} setPickDate={setPickDate} />
                <div className="confirm-btns">
                  <ConfirmButton
                    className="confirm"
                    onClick={() => {
                      setUnset((prev) => {
                        return { ...prev, version: false };
                      });
                      setDatePickerOpen((prev) => {
                        return { ...prev, single: !prev.single };
                      });
                      setPopupState((prev) =>
                        prev
                          .set("version", mapData)
                          .setIn(
                            ["version", key, "init_time"],
                            moment(pickDate).format("YYYY-MM-DD 00:00:00")
                          )
                      );
                    }}
                  >
                    確定
                  </ConfirmButton>
                  <CancelButton
                    className="cancel"
                    onClick={() => {
                      setDatePickerOpen((prev) => {
                        return { ...prev, single: !prev.single };
                      });
                      setPickDate(moment(value.get("init_time"))._d);
                    }}
                  >
                    取消
                  </CancelButton>
                </div>
              </div>
            </>
          )}
          {value.get("enable_time") &&
            value.get("enable_time").map((v, k) => {
              if (k === value.get("enable_time").size - 1) {
                return (
                  <React.Fragment key={k}>
                    <div className="list-style select">
                      <div
                        className="list-content"
                        onClick={() => {
                          setSelectionRange({
                            startDate: moment(v.get("start_time"))._d,
                            endDate: moment(v.get("end_time"))._d,
                            key: "selection",
                          });
                          setDatePickerOpen((prev) => {
                            return { ...prev, range: !prev.range };
                          });
                        }}
                      >
                        <FiCalendar className="Ficalendar-svg" />
                        <span>反饋啟用{k + 1}：</span>
                        {unset.feedback ? (
                          <span>請輸入時間</span>
                        ) : (
                          <span>
                            {moment(v.get("start_time")).format("YYYY.MM.DD")}
                            <span className="middle">-</span>
                            {moment(v.get("end_time")).format("YYYY.MM.DD")}
                          </span>
                        )}
                        <IoIosArrowDown className="arrow-down" />
                      </div>
                      {!isAdd && (
                        <MdAddCircle
                          className="add-svg"
                          onClick={() => {
                            setIsAdd(true);
                            setPopupState((prev) =>
                              prev
                                .set("version", mapData)
                                .updateIn(
                                  ["version", key, "enable_time"],
                                  (v) =>
                                    v.push(
                                      Map({
                                        start_time: moment(new Date()).format(
                                          "YYYY-MM-DD 00:00:00"
                                        ),
                                        end_time: moment(new Date()).format(
                                          "YYYY-MM-DD 23:59:59"
                                        ),
                                      })
                                    )
                                )
                            );
                            const updateSrcoll = setTimeout(() => {
                              scrollContent.current.scrollTop =
                                scrollContent.current.scrollHeight;
                            }, 10);
                            return () => {
                              clearTimeout(updateSrcoll);
                            };
                          }}
                        />
                      )}
                    </div>
                    {datePickerOpen.range && (
                      <>
                        <div className="DatePicker-layout-layoutCover" />
                        <div className="DatePicker-layout">
                          <div className="select-cpation">
                            <FiCalendar className="Ficalendar-svg" />
                            <span>反饋啟用{k + 1}：</span>
                            <span>
                              {moment(v.get("start_time")).format("YYYY.MM.DD")}
                              <span className="middle">-</span>
                              {moment(v.get("end_time")).format("YYYY.MM.DD")}
                            </span>
                          </div>
                          <DateRangePicker
                            selectionRange={selectionRange}
                            setSelectionRange={setSelectionRange}
                          />
                          <div className="confirm-btns">
                            <ConfirmButton
                              className="confirm"
                              onClick={() => {
                                setUnset((prev) => {
                                  return { ...prev, feedback: false };
                                });
                                setDatePickerOpen((prev) => {
                                  return { ...prev, range: !prev.range };
                                });
                                setPopupState((prev) =>
                                  prev.set("version", mapData).setIn(
                                    ["version", key, "enable_time", k],
                                    Map({
                                      start_time: moment(
                                        selectionRange.startDate
                                      ).format("YYYY-MM-DD 00:00:00"),
                                      end_time: moment(
                                        selectionRange.endDate
                                      ).format("YYYY-MM-DD 23:59:59"),
                                    })
                                  )
                                );
                              }}
                            >
                              確定
                            </ConfirmButton>
                            <CancelButton
                              className="cancel"
                              onClick={() => {
                                setDatePickerOpen((prev) => {
                                  return { ...prev, range: !prev.range };
                                });
                                setSelectionRange({
                                  startDate: moment(v.get("start_time"))._d,
                                  endDate: moment(v.get("end_time"))._d,
                                  key: "selection",
                                });
                              }}
                            >
                              取消
                            </CancelButton>
                          </div>
                        </div>
                      </>
                    )}
                  </React.Fragment>
                );
              } else
                return (
                  <div className="list-style" key={k}>
                    <div className="list-content">
                      <FiCalendar className="Ficalendar-svg" />
                      <span>反饋啟用{k + 1}：</span>
                      <span>
                        {moment(v.get("start_time")).format("YYYY.MM.DD")}
                        <span className="middle">-</span>
                        {moment(v.get("end_time")).format("YYYY.MM.DD")}
                      </span>
                    </div>
                  </div>
                );
            })}
        </StyleCreateVersion>
      );
    } else {
      return (
        <StyleCreateVersionDisable key={key}>
          <div className="version-title">{value.get("name")}版本</div>
          <div className="list-style">
            <FiCalendar />
            <span>版本發佈：</span>
            <span>{moment(value.get("init_time")).format("YYYY.MM.DD")}</span>
          </div>
          {value.get("enable_time").map((v, k) => {
            return (
              <div className="list-style" key={k}>
                <FiCalendar />
                <span>反饋啟用{k + 1}：</span>
                <span>
                  {moment(v.get("start_time")).format("YYYY.MM.DD")}
                  <span className="middle">-</span>
                  {moment(v.get("end_time")).format("YYYY.MM.DD")}
                </span>
              </div>
            );
          })}
        </StyleCreateVersionDisable>
      );
    }
  });
};
export default ({
  popupState = List(),
  setPopupState = noop,
  fetchDataFun = noop,
}) => {
  const scrollContent = useRef(null);
  const [isAdd, setIsAdd] = useState(false);
  const [unset, setUnset] = useState({
    version: !popupState.get("versionStatus"),
    feedback: !popupState.get("versionStatus"),
  });
  const [datePickerOpen, setDatePickerOpen] = useState({
    single: false,
    range: false,
  });
  const [pickDate, setPickDate] = useState(new Date());
  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });
  const confirmDisabled = unset.version === false && unset.feedback === false;
  useEffect(() => {
    !popupState.get("versionStatus") && setIsAdd(true);
  }, [popupState]);
  return (
    <StylePopup>
      <div className="container">
        <ul className="infoList">
          {!isAdd && (
            <li className="add-other-btn">
              <AddOtherTagButton
                className="other-style"
                title={`新增版本`}
                onClick={() => {
                  setIsAdd(true);
                  setUnset({ version: true, feedback: true });
                  setPopupState((prev) =>
                    prev.updateIn(["version"], (v) =>
                      v.push(
                        fromJS({
                          name: `v${prev.get("version").size + 1}`,
                          init_time: moment(new Date()).format(
                            "YYYY-MM-DD 00:00:00"
                          ),
                          enable_time: [
                            {
                              start_time: moment(new Date()).format(
                                "YYYY-MM-DD 00:00:00"
                              ),
                              end_time: moment(new Date()).format(
                                "YYYY-MM-DD 23:59:59"
                              ),
                            },
                          ],
                        })
                      )
                    )
                  );
                  const updateSrcoll = setTimeout(() => {
                    scrollContent.current.scrollTop =
                      scrollContent.current.scrollHeight;
                  }, 10);
                  return () => {
                    clearTimeout(updateSrcoll);
                  };
                }}
              />
            </li>
          )}
          <li className="title">
            {popupState.get("code")}.{popupState.get("title")}
          </li>
          <li className="versionZone" ref={scrollContent}>
            <CreateVersionList
              unset={unset}
              dataList={popupState.get("version")}
              isAdd={isAdd}
              datePickerOpen={datePickerOpen}
              pickDate={pickDate}
              selectionRange={selectionRange}
              scrollContent={scrollContent}
              setPopupState={setPopupState}
              setIsAdd={setIsAdd}
              setDatePickerOpen={setDatePickerOpen}
              setPickDate={setPickDate}
              setSelectionRange={setSelectionRange}
              setUnset={setUnset}
            />
          </li>
          <li className="btns">
            <ConfirmButton
              className="confirm"
              disabled={!confirmDisabled}
              onClick={() => {
                fetchDataFun();
                // const updateVersion = popupState.getIn([
                //   "version",
                //   popupState.get("version").size - 1,
                // ]);
                // const newData = {
                //   game_id: popupState.get("code"),
                //   version: {
                //     enable_time: updateVersion.get("enable_time").toJS(),
                //     init_time: updateVersion.get("init_time"),
                //     name: updateVersion.get("name"),
                //   },
                // };
                // apiGameSwtich(newData)
                //   .then((res) => {
                //     const preview = res.data;
                //     const SUCCESS = preview.error_msg === "SUCCESS";
                //     if (SUCCESS) {
                //       fetchDataFun();
                //       setPopupState((prev) =>
                //         prev.set("timeZoneIsOpen", false)
                //       );
                //     } else {
                //       console.error(preview.error_msg);
                //     }
                //   })
                //   .catch((error) => {
                //     console.error(error);
                //   });
              }}
            >
              確定
            </ConfirmButton>
            <CancelButton
              className="close"
              onClick={() => {
                setPopupState((prev) => prev.set("timeZoneIsOpen", false));
              }}
            >
              取消
            </CancelButton>
          </li>
        </ul>
      </div>
    </StylePopup>
  );
};
