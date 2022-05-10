import React, { useState } from "react";
import styled from "styled-components";
import moment from "moment";
import noop from "lodash/noop";
import { List } from "immutable";
// components
import DateRangePicker from "src/components/Layout/DateRangePicker";
import { ConfirmButton, CancelButton } from "src/components/Common/CommonPart";
// api
// import { apiGameSwtich } from "src/api";
// spinners
import { MoonLoader } from "react-spinners";
// icons
import { IoIosArrowDown } from "react-icons/io";
import { FiCalendar } from "react-icons/fi";
// colors
import colors from "src/constants/colors";

const StyledBatchUpdatePopup = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1002;
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
      padding: 45px;
      border-radius: 5px;
    }
    .title {
      font-size: 22px;
      font-weight: bold;
      color: ${colors.getIn(["mainColorA", "original"])};
      margin-bottom: 30px;
    }
    .list-content {
      width: 100%;
      position: relative;
      display: flex;
      align-items: center;
      padding: 15px;
      background-color: rgba(255, 255, 255);
      box-sizing: border-box;
      border-radius: 5px;
      border: 1px solid ${colors.getIn(["mainColorC", "twenty"])};
      margin-bottom: 50px;
      transition: 0.2s;
      cursor: pointer;
      span {
        font-size: 16px;
        color: ${colors.getIn(["mainColorB", "original"])};
        letter-spacing: 0.5px;
      }
      .Ficalendar-svg {
        width: 20px;
        height: 20px;
        margin-right: 10px;
        stroke-width: 1;
        color: ${colors.getIn(["mainColorB", "original"])};
      }
      .arrow-down {
        position: absolute;
        top: 50%;
        right: 15px;
        transform: translateY(-50%);
        width: 16px;
        height: 16px;
        color: ${colors.getIn(["mainColorB", "original"])};
      }
      &:hover {
        border: 1px solid ${colors.getIn(["mainColorE", "original"])};
      }
    }
    .loader {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      .text {
        margin: 12px 0;
        width: 100%;
        text-align: center;
        font-size: 16px;
        color: ${colors.getIn(["mainColorB", "original"])};
        letter-spacing: 0.5px;
      }
    }
  }
  .btns {
    margin-top: 20px;
    .confirm {
      margin-right: 10px;
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
export default ({
  gamesList = List(),
  setPopupState = noop,
  fetchDataFun = noop,
}) => {
  // const [gameTimeZoneList, setGameTimeZoneList] = useState(List());
  const [valueIsSet, setValueIsSet] = useState(false);
  const [dataUpdate, setDataUpdate] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });
  const [showSelectionRange, setShowSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const isOverRange = moment(selectionRange.endDate).isAfter(
    moment(selectionRange.startDate).add(365, "day")
  );
  // const multipleApiGameSwtich = (list = List(), timeProps) => {
  //   return list.map((v, k) => {
  //     const timeUpdate = v.setIn(
  //       [
  //         "version",
  //         "enable_time",
  //         v.getIn(["version", "enable_time"]).size - 1,
  //       ],
  //       {
  //         start_time: moment(timeProps.startDate).format("YYYY-MM-DD 00:00:00"),
  //         end_time: moment(timeProps.endDate).format("YYYY-MM-DD 23:59:59"),
  //       }
  //     );
  //     const refreshData = () => {
  //       const timeoutInterval = setTimeout(() => {
  //         fetchDataFun();
  //         setDataUpdate(false);
  //         setPopupState((prev) => prev.set("batchUpdatePopup", false));
  //         clearTimeout(timeoutInterval);
  //       }, 1000);
  //     };
  //     const lastKey = k === list.size - 1;
  //     const updataParams = timeUpdate.toJS();
  //     return apiGameSwtich(updataParams)
  //       .then((res) => {
  //         const preview = res.data;
  //         const SUCCESS = preview.error_msg === "SUCCESS";
  //         !SUCCESS && alert(`id:${v.get("game_id")}:更新失敗!`);
  //         lastKey && refreshData();
  //       })
  //       .catch((error) => {
  //         alert(`id:${v.get("game_id")}:更新失敗!`);
  //         lastKey && refreshData();
  //       });
  //   });
  // };
  // useEffect(() => {
  //   const isFeedbackList = gamesList.filter((v) => v.get("feedback"));
  //   let updateList = [];
  //   isFeedbackList.map((v) => {
  //     const sortVersion = v
  //       .get("version")
  //       .sort(
  //         (a, b) => a.get("name").split("v")[1] - b.get("name").split("v")[1]
  //       );
  //     const currentVersion = sortVersion.get(sortVersion.size - 1);
  //     return updateList.push({
  //       game_id: v.get("game_id"),
  //       version: currentVersion.toJS(),
  //     });
  //   });
  //   updateList.length > 0 && setGameTimeZoneList(fromJS(updateList));
  // }, [gamesList]);
  return (
    <StyledBatchUpdatePopup>
      <div className="container">
        <ul className="infoList">
          <li className="title">批次更新啟用區間</li>
          <li>
            <div
              className="list-content"
              onClick={() => setDatePickerOpen(true)}
            >
              <FiCalendar className="Ficalendar-svg" />
              <span>更新區間：</span>
              {valueIsSet ? (
                <span>
                  {moment(showSelectionRange.startDate).format("YYYY.MM.DD")}
                  <span className="middle">-</span>
                  {moment(showSelectionRange.endDate).format("YYYY.MM.DD")}
                </span>
              ) : (
                <span>請輸入時間</span>
              )}
              <IoIosArrowDown className="arrow-down" />
            </div>
            {datePickerOpen && (
              <>
                <div className="DatePicker-layout-layoutCover" />
                <div className="DatePicker-layout">
                  <div className="select-cpation">
                    <FiCalendar className="Ficalendar-svg" />
                    <span>更新區間：</span>
                    <span>
                      {moment(showSelectionRange.startDate).format(
                        "YYYY.MM.DD"
                      )}
                      <span className="middle">-</span>
                      {moment(showSelectionRange.endDate).format("YYYY.MM.DD")}
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
                        setDatePickerOpen(false);
                        setValueIsSet(true);
                        setShowSelectionRange({
                          startDate: selectionRange.startDate,
                          endDate: selectionRange.endDate,
                        });
                      }}
                    >
                      確定
                    </ConfirmButton>
                    <CancelButton
                      className="cancel"
                      onClick={() => {
                        setDatePickerOpen(false);
                        setSelectionRange({
                          startDate: showSelectionRange.startDate,
                          endDate: showSelectionRange.endDate,
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
            {dataUpdate && (
              <div className="loader">
                <MoonLoader
                  size={32}
                  margin={3}
                  color={colors.getIn(["mainColorC", "original"])}
                />
                <div className="text">資料更新中</div>
              </div>
            )}
          </li>
          <li className="btns">
            <ConfirmButton
              className="confirm"
              onClick={() => {
                if (valueIsSet && !dataUpdate) {
                  if (isOverRange) {
                    return alert(`超出區間限制! 請選擇1-365日內`);
                  } else {
                    setDataUpdate(true);
                    const timeout = setTimeout(() => {
                      setDataUpdate(false);
                      alert("update done!");
                      return () => clearTimeout(timeout);
                    }, 2000);
                    // multipleApiGameSwtich(gameTimeZoneList, selectionRange);
                  }
                } else return;
              }}
            >
              確定
            </ConfirmButton>
            <CancelButton
              className="close"
              onClick={() =>
                !dataUpdate &&
                setPopupState((prev) => prev.set("batchUpdatePopup", false))
              }
            >
              取消
            </CancelButton>
          </li>
        </ul>
      </div>
    </StyledBatchUpdatePopup>
  );
};
