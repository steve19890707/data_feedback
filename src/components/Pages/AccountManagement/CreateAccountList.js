import React from "react";
import styled from "styled-components";
import { List,fromJS } from "immutable";
import colors from "src/constants/colors";
// common
import { EditButton } from "src/components/Common/CommonPart";
// fadein
import FadeInList from "src/components/Common/FadeInList";
// icons
import { FiEdit3 } from "react-icons/fi";
// style
const StyleAccountList = styled.li`
  display:flex;
  align-items:center;
  background-color:${colors.getIn(['mainColorC','five'])};
  margin-bottom:2px;
  padding:16px 0;
  &:nth-child(2n+1){
    background-color:#fff;
  }
  &:last-child {
    border-radius:0 0 10px 10px;
  }
  .text {
    font-size:14px;
    color:${colors.getIn(['mainColorB','original'])};;
    width:12.5%;
    text-align:center;
    box-sizing:border-box;
    &:nth-child(3){
      width:55%;
      text-align:left;
      padding-left:60px;
    }
    &:last-child {
      min-width:110px;
    }
  }     
`
const getArrayData = (
  array=[],
  originArray
) =>{
  let list = [];
  originArray.map((value)=>{
    return list.push({
      ...value,
      status: !!~array.indexOf(value.key)
    })
  })
  return list
}
export default ({
  dataList = List(),
  showItemNum,
  currentPage,
  popupState = Map(),
  setPopupState
}) => {
  return (
    dataList.map((value, key) => {
      let gamePermissionsList = getArrayData(
        value.get("gamePermissions").toJS(),
        popupState.get("gamePermissions").toJS()
      );
      let webPermissions = getArrayData(
        value.get("webPermissions").toJS(),
        popupState.get("webPermissions").toJS()
      );
      return (
        (key >= currentPage.start - 1 && key <= currentPage.end - 1) &&
        <FadeInList
          showItemNum={showItemNum}
          index={key}
          key={key}
        >
          <StyleAccountList>
            <div className="text">{value.get("name")}</div>
            <div className="text">{value.get("department")}</div>
            <div className="text">
              {
                value.get("permissions") === 2 ? "最高權限" : 
                value.get("permissions") === 1 ? "可編輯者" : "一般使用者"
              }
            </div>
            <div className="text">
              <EditButton
                onClick={()=> {
                  setPopupState(prev=>prev
                    .set("key", key)
                    .set("id", value.get("id"))
                    .set("name", value.get("name"))
                    .set("department", value.get("department"))
                    .set("permissions", value.get("permissions"))
                    .set("gamePermissions", fromJS(gamePermissionsList) )
                    .set("webPermissions", fromJS(webPermissions))
                    .set("especially",value.get("especially"))
                    .set("isOpen", true)
                  );
                }}
                svg={<FiEdit3/>}
                title={`權限編輯`}
              />
            </div>
          </StyleAccountList>
        </FadeInList>
      );
    })
  )
};