import React, { useEffect, useState } from "react";
import cx from "classnames";
import styled from "styled-components";
import noop from "lodash/noop";
import { List, fromJS } from "immutable";
import ReactWidgetsMultiselect from "src/components/Layout/ReactWidgetsMultiselect";
import ReactWidgetsDropdownList from "src/components/Layout/ReactWidgetsDropdownList";
// components
import {
  ConfirmButton,
  CancelButton,
  CheckBox,
} from "src/components/Common/CommonPart";
// api
// import { apiAccountUpdate, apiGetGameList } from "src/api";
import { gameListData } from "src/demoData";
// colors
import colors from "src/constants/colors";
// style
const StylePopup = styled.div`
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
    background-color: ${colors.get("backgroundColor")};
    min-width: 480px;
    border-radius: 10px;
    .inForList {
      position: relative;
      width: 100%;
      box-sizing: border-box;
      padding: 65px 40px;
      border-radius: 5px;
      .closeBtn {
        position: absolute;
        top: 0;
        right: 0;
        transform: translateY(-100%);
        cursor: pointer;
        svg {
          width: 35px;
          height: 35px;
          fill: #fff;
        }
      }
      .inForList-title {
        font-size: 22px;
        font-weight: bold;
        color: ${colors.getIn(["mainColorA", "original"])};
        margin-bottom: 30px;
      }
      .inForList-text {
        display: flex;
        align-items: center;
        margin-bottom: 25px;
        .caption {
          width: 64px;
          font-weight: 350;
          font-size: 16px;
          color: #9597ba;
          margin-right: 12px;
          /* opacity:0.9; */
        }
        .infor {
          font-size: 16px;
          color: ${colors.getIn(["mainColorB", "original"])};
        }
        .checkBoxWrap {
          display: flex;
          margin-right: 17px;
          align-items: center;
          .checkBox {
            margin-right: 10px;
          }
          .title {
            font-size: 16px;
            color: ${colors.getIn(["mainColorB", "original"])};
          }
        }
        .multiselect {
          width: 324px;
          .rw-widget-container {
            border: 1px solid #bfc2eb;
            border-radius: 5px;
            min-height: 55px;
            /* dropdown */
            padding: 10px;
            box-sizing: border-box;
            .rw-input,
            .rw-dropdown-list-input {
              color: ${colors.getIn(["mainColorB", "original"])};
            }
            /* multiselect */
            .rw-multiselect-taglist .rw-multiselect-tag {
              border: none;
              background-color: ${colors.getIn(["mainColorE", "twenty"])};
              padding: 5px;
              .rw-multiselect-tag-label {
                font-size: 14px;
                color: ${colors.getIn(["mainColorE", "original"])};
              }
              button svg {
                color: ${colors.getIn(["mainColorE", "original"])};
              }
            }
          }
        }
      }
      .btns {
        .confirm {
          margin-right: 10px;
        }
      }
    }
  }
`;
// const checkArray = (array = List()) => {
//   let titleList = [];
//   let list = [];
//   array.map((v) => {
//     return titleList.push(v.get("title"));
//   });
//   array.map((v) => {
//     if (!!~titleList.indexOf(v.get("title")) && v.get("status")) {
//       return list.push(v.get("key"));
//     } else {
//       return null;
//     }
//   });
//   return list;
// };
// const checkEspecially = (array = List(), especiallyList = []) => {
//   let list = [];
//   array.map((value) => {
//     if (!!~especiallyList.indexOf(value.getIn(["name", "cn"]))) {
//       return list.push(value.get("game_id"));
//     } else {
//       return null;
//     }
//   });
//   return list;
// };
const DROPDOWN_STATUS_DATA = fromJS([
  {
    label: "一般使用者",
    value: 0,
  },
  {
    label: "可編輯者",
    value: 1,
  },
  {
    label: "最高權限",
    value: 2,
  },
]);
export default ({
  popupState = List(),
  setPopupState = noop,
  fetchDataFun = noop,
}) => {
  // const { isLoading: loadingGetGameList, fetchData: apiGetGameListData } =
  //   apiGetGameList();
  const loadingGetGameList = false;
  const apiGetGameListData = gameListData;
  const [tagList, setTagList] = useState(List());
  const [filterTagList, setFilterTagList] = useState(List());
  useEffect(() => {
    const gameList = !apiGetGameListData ? List() : apiGetGameListData;
    let newTagList = [];
    let newFilterTagList = [];
    gameList.map((value) => {
      const nameValue = value.getIn(["name", "cn"]);
      popupState.get("especially").map((v) => {
        if (v === value.get("game_id")) {
          return newFilterTagList.push(nameValue);
        } else {
          return null;
        }
      });
      return newTagList.push(nameValue);
    });
    setTagList(List(newTagList));
    setFilterTagList(List(newFilterTagList));
  }, [apiGetGameListData, popupState]);
  return (
    <StylePopup>
      <div className="container">
        <ul className="inForList">
          <li className="inForList-title">{popupState.get("name")}</li>
          <li className="inForList-text">
            <div className="caption">部門名稱</div>
            <div className="infor">{popupState.get("department")}</div>
          </li>
          <li className="inForList-text">
            <div className="caption">權限等級</div>
            <div className="multiselect">
              <ReactWidgetsDropdownList
                data={DROPDOWN_STATUS_DATA}
                value={popupState.get("permissions")}
                onChange={(value) => {
                  setPopupState((prev) => prev.set("permissions", value));
                }}
              />
            </div>
          </li>
          <li className="inForList-text">
            <div className="caption">遊戲權限</div>
            {popupState.get("gamePermissions").map((value, key) => {
              return (
                <div key={key} className="checkBoxWrap">
                  <CheckBox
                    className={cx("checkBox", {
                      active: popupState.getIn([
                        "gamePermissions",
                        key,
                        "status",
                      ]),
                    })}
                    onClick={() => {
                      setPopupState((prev) =>
                        prev.setIn(
                          ["gamePermissions", key, "status"],
                          !value.get("status")
                        )
                      );
                    }}
                  />
                  <div className="title">{value.get("title")}</div>
                </div>
              );
            })}
          </li>
          <li className="inForList-text">
            <div className="caption">網站權限</div>
            {popupState.get("webPermissions").map((value, key) => {
              return (
                <div key={key} className="checkBoxWrap">
                  <CheckBox
                    className={cx("checkBox", {
                      active: popupState.getIn([
                        "webPermissions",
                        key,
                        "status",
                      ]),
                    })}
                    onClick={() => {
                      setPopupState((prev) =>
                        prev.setIn(
                          ["webPermissions", key, "status"],
                          !value.get("status")
                        )
                      );
                    }}
                  />
                  <div className="title">{value.get("title")}</div>
                </div>
              );
            })}
          </li>
          <li className="inForList-text">
            <div className="caption">過濾遊戲</div>
            <div className="multiselect">
              <ReactWidgetsMultiselect
                className=""
                data={tagList}
                value={filterTagList}
                busy={loadingGetGameList}
                onChange={setFilterTagList}
              />
            </div>
          </li>
          <li className="btns">
            <ConfirmButton
              className="confirm"
              onClick={() => {
                alert("update!");
                // let newData;
                // let gameList = checkArray(popupState.get("gamePermissions"));
                // let webList = checkArray(popupState.get("webPermissions"));
                // let especiallyList = checkEspecially(
                //   apiGetGameListData,
                //   filterTagList
                // );
                // newData = {
                //   especially: especiallyList,
                //   game: gameList,
                //   id: popupState.get("id"),
                //   level: popupState.get("permissions"),
                //   site: webList,
                // };
                // apiAccountUpdate(newData)
                //   .then((res) => {
                //     const preview = res.data;
                //     const SUCCESS = preview.error_msg === "SUCCESS";
                //     if (SUCCESS) {
                //       fetchDataFun();
                //       setPopupState((prev) => prev.set("isOpen", false));
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
                setPopupState((prev) => prev.set("isOpen", false));
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
