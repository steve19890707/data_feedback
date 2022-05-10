import React from "react";
import cx from "classnames";
import styled from "styled-components";
import noop from "lodash";
import { List } from "immutable";
import colors from "src/constants/colors";
// fadein
import FadeInList from "src/components/Common/FadeInList";
// components
import {
  CheckBox,
  ConfirmButton,
  CancelButton,
} from "src/components/Common/CommonPart";
// // api
// import { apiCreateWhitelist } from "src/api";
// style
const StyleAccountList = styled.li`
  display: flex;
  align-items: center;
  background-color: ${colors.getIn(["mainColorC", "five"])};
  margin-bottom: 2px;
  padding: 20px 0;
  &:nth-child(2n + 1) {
    background-color: #fff;
  }
  &:last-child {
    border-radius: 0 0 10px 10px;
  }
  .check {
    padding: 0 40px 0 30px;
  }
  .text {
    font-size: 16px;
    color: ${colors.getIn(["mainColorB", "original"])};
    text-align: center;
    box-sizing: border-box;
  }
`;
const StyleEditAccount = styled.div`
  display: flex;
  align-items: center;
  .info-input {
    width: calc(100% - 10px);
    width: 250px;
    box-sizing: border-box;
    padding: 8px;
    margin-right: 50px;
    font-size: 14px;
    border-radius: 5px;
    border: 1px solid #bfc2eb;
    color: #808697;
    outline: none;
    transition: 0.2s;
    &:hover,
    &:focus {
      border: 1px solid ${colors.getIn(["mainColorE", "half"])};
    }
  }
  .btn-left {
    margin-right: 10px;
  }
`;
export default ({
  dataList = List(),
  fetchDataFun = noop,
  setDataList = noop,
  setAddId = noop,
}) => {
  // const [newAccountName, setNewAccountName] = useState("");
  const handleCancel = () => {
    setDataList((prev) => prev.delete(-1));
    setAddId(false);
  };
  return dataList.map((value, key) => {
    return (
      <FadeInList showItemNum={dataList.size} index={key} key={key}>
        <StyleAccountList>
          <div className="check">
            <CheckBox
              className={cx({ active: value.get("isCheck") })}
              onClick={() => {
                setDataList((prev) =>
                  prev.setIn([key, "isCheck"], !value.get("isCheck"))
                );
              }}
            />
          </div>
          {value.get("status") ? (
            <div className="text">{value.get("name")}</div>
          ) : (
            <StyleEditAccount>
              <input
                className={`info-input`}
                defaultValue={value.get("name")}
                // onChange={(e) => {
                //   setNewAccountName(e.target.value);
                // }}
              />
              <ConfirmButton
                className="btn-left"
                onClick={() => {
                  alert("create!");
                  // const newData = { username: newAccountName };
                  // apiCreateWhitelist(newData)
                  //   .then((res) => {
                  //     const preview = res.data;
                  //     const SUCCESS = preview.error_msg === "SUCCESS";
                  //     if (SUCCESS) {
                  //       setAddId(false);
                  //       fetchDataFun();
                  //     } else {
                  //       console.error(preview.error_msg);
                  //     }
                  //   })
                  //   .catch((error) => {
                  //     console.error(error);
                  //   });
                }}
              />
              <CancelButton
                onClick={() => {
                  handleCancel();
                }}
              />
            </StyleEditAccount>
          )}
        </StyleAccountList>
      </FadeInList>
    );
  });
};
