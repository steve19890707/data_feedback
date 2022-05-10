import React from "react";
import styled from "styled-components";
import noop from "lodash/noop";
import { List } from "immutable";
// colors
import colors from "src/constants/colors";
// api
// import { apiWhitelistDelete } from "src/api";
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
  dataList = List(),
  setWLPopup = noop,
  fetchDataFun = noop,
}) => {
  return (
    <StylePopup>
      <div className="infor-content">
        <div className="content">
          <ul className="ul">
            <li className="title">提示</li>
            <li className="subtitle">確定要刪除所勾選的名單?</li>
            <li className="btn-area">
              <ConfirmButton
                onClick={() => {
                  alert("delete!");
                  // const newData = { username: [] };
                  // dataList.map((v) => {
                  //   if (v.get("isCheck")) {
                  //     return newData.username.push(v.get("name"));
                  //   } else return null;
                  // });
                  // apiWhitelistDelete(newData)
                  //   .then((res) => {
                  //     const preview = res.data;
                  //     const SUCCESS = preview.error_msg === "SUCCESS";
                  //     if (SUCCESS) {
                  //       fetchDataFun();
                  //       setWLPopup(false);
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
                onClick={() => {
                  setWLPopup(false);
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
