import React, { useState } from "react";
import styled from "styled-components";
import noop from "lodash/noop";
import { List } from "immutable";
import colors from "src/constants/colors";
import { FiEdit3 } from "react-icons/fi";
// common
import {
  EditButton,
  ConfirmButton,
  CancelButton,
  LiLoader,
} from "src/components/Common/CommonPart";
// api
// import { apiRateUpdate, resolveFunc } from "src/api";
// style
const TagsSetting = styled.div`
  padding-bottom: 50px;
  .caption {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    span {
      font-size: 24px;
      font-weight: bold;
      color: #181f3a;
    }
  }
  .tags-list {
    border-radius: 10px;
    box-shadow: 0 5px 10px ${colors.getIn(["mainColorA", "twenty"])};
    .list-caption {
      width: 100%;
      display: flex;
      align-items: center;
      background-color: #fff;
      border-radius: 10px 10px 0 0;
      box-sizing: border-box;
      padding: 20px 50px;
      margin-bottom: 2px;
      .content {
        min-width: 162px;
        font-size: 16px;
        color: ${colors.getIn(["mainColorA", "half"])};
        &:nth-child(1) {
          width: 20%;
        }
        &:nth-child(2) {
          width: 40%;
        }
        svg {
          fill: #000;
          width: 18px;
          height: 18px;
          cursor: pointer;
        }
      }
    }
  }
`;
const StyleLi = styled.li(
  ({ delay }) => `
  @keyframes fadeIn {
    0% { opacity:0.2; }
    100% { opacity:1; }
  }
  opacity:0;
  animation: fadeIn 0.3s ${delay}s forwards;
  width:100%;
  display:flex;
  align-items:center;
  box-sizing:border-box;
  background-color:${colors.getIn(["mainColorC", "five"])};
  padding:20px 50px;
  margin-bottom:2px;
  &:nth-child(2n+1){
    background-color:#fff;
  }
  &:last-child {
    border-radius:0 0 10px 10px;
  }
  .content {
    display:flex;
    align-items:center;
    min-width:162px;
    font-size:16px;
    color:${colors.getIn(["mainColorB", "original"])};
    &:nth-child(1){ width:20%; }
    .info-input {
      width:calc(100% - 10px);
      max-width:170px;
      box-sizing:border-box;
      padding:8px;
      font-size:14px;
      border-radius:5px;
      border:1px solid #bfc2eb;
      color:#808697;
      outline:none;
      transition:.2s;
      &:hover, &:focus {
        border:1px solid ${colors.getIn(["mainColorE", "half"])};
      }
    }
    .btn-left { margin-right:10px; }
  }
`
);
const StyleTipLi = styled.li`
  width: 100%;
  font-size: 16px;
  color: ${colors.getIn(["mainColorB", "original"])};
  text-align: center;
  box-sizing: border-box;
  background-color: ${colors.getIn(["mainColorC", "five"])};
  padding: 20px 0;
  margin-bottom: 2px;
  border-radius: 0 0 10px 10px;
`;
export default ({
  title = "",
  type = "",
  dataList = List(),
  setDataList = noop,
  setAddId = noop,
  loading = true,
  fetchDataFun = noop,
  originalSize = Number,
}) => {
  // const [newRateName, setNewRateName] = useState("");
  const [openId, setOpenId] = useState(Number);
  const handleEditClick = (key) => {
    if (openId >= 0)
      setDataList((prev) => prev.setIn([openId, "status"], false));
    setDataList((prev) => prev.setIn([key, "status"], true));
    setOpenId(key);
  };
  const handleCancel = (tagId, key, value) => {
    if (!tagId) {
      setDataList((prev) => prev.delete(-1));
      setAddId(false);
      return;
    }
    setDataList((prev) => prev.setIn([key, "status"], !value.get("status")));
  };
  return (
    <TagsSetting>
      <div className="caption">
        <span>{title}</span>
      </div>
      <ul className="tags-list">
        <li className="list-caption">
          <div className="content">名稱</div>
          <div className="content">編輯</div>
        </li>
        {loading ? (
          <LiLoader status={true} />
        ) : dataList.size > 0 ? (
          dataList.map((value, key) => {
            const tagId = value.get("id");
            const indexSecond = key > originalSize - 1 ? 0 : key * 0.1;
            return (
              <StyleLi delay={indexSecond} key={key}>
                <div className="content">
                  {!value.get("status") ? (
                    <span>{value.get("name")}</span>
                  ) : (
                    <input
                      className={`info-input`}
                      defaultValue={value.get("name")}
                      onChange={(e) => {
                        // setNewRateName(e.target.value);
                      }}
                    />
                  )}
                </div>
                <div className="content">
                  {!value.get("status") ? (
                    <EditButton
                      onClick={() => {
                        handleEditClick(key, value);
                      }}
                      title={`評分編輯`}
                      svg={<FiEdit3 />}
                    />
                  ) : (
                    <>
                      <ConfirmButton
                        className="btn-left"
                        onClick={() => {
                          handleCancel(tagId, key, value);
                          // const changeRateName = newRateName !== "" ? newRateName : value.get("tagName");
                          // const newData = {
                          //   class: "game",
                          //   id: value.get("id"),
                          //   name: changeRateName,
                          //   type: type
                          // };
                          // apiRateUpdate(newData).then(res => resolveFunc({res,
                          //   resolve(){
                          //     setAddId(false);
                          //     fetchDataFun();
                          //   },
                          //   reject(){handleCancel(tagId, key, value)}
                          // }))
                        }}
                      />
                      <CancelButton
                        onClick={() => {
                          handleCancel(tagId, key, value);
                        }}
                      />
                    </>
                  )}
                </div>
              </StyleLi>
            );
          })
        ) : (
          <StyleTipLi>暫無新增評分</StyleTipLi>
        )}
      </ul>
    </TagsSetting>
  );
};
