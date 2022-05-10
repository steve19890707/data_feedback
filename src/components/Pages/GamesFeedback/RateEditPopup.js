import React, { useState, useEffect } from "react";
import styled from "styled-components";
import noop from "lodash/noop";
import { List } from "immutable";
// components
import ReactWidgetsMultiselect from "src/components/Layout/ReactWidgetsMultiselect";
import { ConfirmButton, CancelButton } from "src/components/Common/CommonPart";
// api
// import { apiRateList, apiGameUpdate } from "src/api";
import { rate } from "src/demoData";
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
  .container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 480px;
    background-color: ${colors.get("backgroundColor")};
    border-radius: 10px;
    .infoList {
      position: relative;
      width: 100%;
      box-sizing: border-box;
      padding: 45px 30px;
      border-radius: 5px;
      .infoList-title {
        font-size: 22px;
        font-weight: 600;
        color: #383f53;
        margin-bottom: 25px;
      }
      .other-tags {
        height: 200px;
        .top-area {
          color: ${colors.getIn(["mainColorA", "original"])};
          font-size: 18px;
          margin-bottom: 15px;
          span {
            color: ${colors.getIn(["mainColorA", "half"])};
            font-size: 16px;
          }
        }
        .multiselect {
          width: 366px;
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
// const filterRateListData = (apiRateListData = List(), array = []) => {
//   const list = [];
//   apiRateListData.map((value) => {
//     array.map((v) => {
//       if (v === value.get("name")) {
//         return list.push(value.get("id"));
//       } else {
//         return null;
//       }
//     });
//     return null;
//   });
//   return list;
// };
export default ({
  levelNum = 1,
  popupState = List(),
  setPopupState = noop,
  fetchDataFun = noop,
}) => {
  // api
  // const { isLoading: loadingRateList, fetchData: apiRateListData } =
  //   apiRateList();
  const loadingRateList = false;
  const apiRateListData = rate;
  const [rateList, setRateList] = useState(List());
  const [filterRateList, setFilterRateList] = useState(List());
  useEffect(() => {
    let newList = [];
    let newDataList = [];
    const dataFilterList = popupState.get("filterRate");
    apiRateListData.map((value) => {
      dataFilterList.map((v) => {
        if (v === value.get("id") && value.get("type") === "special") {
          return newDataList.push(value.get("name"));
        } else return null;
      });
      if (value.get("type") !== "special") {
        return null;
      } else return newList.push(value.get("name"));
    });
    setFilterRateList(List(newDataList));
    setRateList(List(newList));
  }, [apiRateListData, popupState]);
  return (
    <StylePopup>
      <div className="container">
        <ul className="infoList">
          <li className="infoList-title">{`${popupState.get(
            "code"
          )}.${popupState.get("title")}`}</li>
          {levelNum > 0 && (
            <li className="other-tags">
              <div className="top-area">
                例外評分 <span>(最多選擇兩個)</span>
              </div>
              <ReactWidgetsMultiselect
                type="game-edit"
                className="multiselect"
                data={rateList}
                value={filterRateList}
                busy={loadingRateList}
                onChange={setFilterRateList}
              />
            </li>
          )}
          <li className="btns">
            <ConfirmButton
              className="confirm"
              onClick={() => {
                fetchDataFun();
                // const sendFilterList = filterRateListData(
                //   apiRateListData,
                //   filterRateList
                // );
                // const newData = {
                //   game_id: popupState.get("code"),
                //   rate: sendFilterList,
                // };
                // apiGameUpdate(newData)
                //   .then((res) => {
                //     const preview = res.data;
                //     const SUCCESS = preview.error_msg === "SUCCESS";
                //     if (SUCCESS) {
                //       fetchDataFun();
                //       setPopupState((prev) =>
                //         prev.set("gameEditIsOpen", false)
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
                setPopupState((prev) => prev.set("gameEditIsOpen", false));
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
