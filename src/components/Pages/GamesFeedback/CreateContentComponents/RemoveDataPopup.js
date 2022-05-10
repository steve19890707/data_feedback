import React from "react";
import styled from "styled-components";
import noop from "lodash/noop";
import { List } from "immutable";
// colors
import colors from "src/constants/colors";
// api
// import { apiFeedbackDelete, apiFeedbackRecover } from "src/api";
// components
import { ConfirmButton, CancelButton } from "src/components/Common/CommonPart";

const StylePopup = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1002;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  .infor-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .content {
      position: relative;
      padding: 40px 0;
    }
    .ul {
      width: 480px;
      box-sizing: border-box;
      border-radius: 10px;
      padding: 40px;
      background-color: ${colors.getIn(["backgroundColor"])};
      .title {
        color: ${colors.getIn(["mainColorA", "original"])};
        font-size: 22px;
        font-weight: bold;
        margin-bottom: 25px;
      }
      .subtitle {
        color: ${colors.getIn(["mainColorA", "original"])};
        font-size: 18px;
        margin-bottom: 125px;
      }
      .btn-area {
        display: flex;
        button {
          &:last-child {
            margin-left: 10px;
          }
        }
      }
    }
  }
`;
export default ({
  levelNum = Number(),
  type = "",
  setPagePopup = noop,
  getdataList = List(),
  fetchDataFunAnlysis = noop,
  fetchDataFun = noop,
}) => {
  const reducerType = (type) => {
    switch (type) {
      case "feedback":
        return "確定要封存所勾選的反饋資料?";
      case "archive":
        return "確定要還原所勾選的反饋資料?";
      default:
        return "";
    }
  };
  // const apiUpdateFun = (
  //   res,
  //   fetchDataFun = noop,
  //   fetchDataFunAnlysis = noop
  // ) => {
  //   const preview = res.data;
  //   const SUCCESS = preview.error_msg === "SUCCESS";
  //   if (SUCCESS) {
  //     fetchDataFunAnlysis();
  //     fetchDataFun();
  //     setPagePopup(false);
  //   } else {
  //     console.error(preview.error_msg);
  //   }
  // };
  return (
    <StylePopup>
      <div className="infor-content">
        <div className="content">
          <ul className="ul">
            <li className="title">提示</li>
            <li className="subtitle">{reducerType(type)}</li>
            <li className="btn-area">
              <ConfirmButton
                onClick={() => {
                  if (!(levelNum > 0)) return alert("您的帳號權限不足!");
                  // let data = { id: getdataList.toArray() };
                  if (type === "feedback") {
                    alert("archive!");
                    // apiFeedbackDelete(data)
                    //   .then((res) =>
                    //     apiUpdateFun(res, fetchDataFun, fetchDataFunAnlysis)
                    //   )
                    //   .catch((error) => {
                    //     console.error(error);
                    //   });
                  } else if (type === "archive") {
                    alert("restore!");
                    // apiFeedbackRecover(data)
                    //   .then((res) =>
                    //     apiUpdateFun(res, fetchDataFun, fetchDataFunAnlysis)
                    //   )
                    //   .catch((error) => {
                    //     console.error(error);
                    //   });
                  }
                }}
              >
                確定
              </ConfirmButton>
              <CancelButton
                onClick={() => {
                  setPagePopup(false);
                }}
              >
                取消
              </CancelButton>
            </li>
          </ul>
        </div>
      </div>
    </StylePopup>
  );
};
