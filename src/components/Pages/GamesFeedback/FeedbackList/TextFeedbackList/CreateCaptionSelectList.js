import React from "react";
import styled from "styled-components";
import noop from "lodash/noop";
import { List } from "immutable";
import { CheckBox } from "src/components/Common/CommonPart"
import colors from "src/constants/colors"
const StyleCreateCaptionSelectList = styled.li`
  margin-right:16px;
  display: flex;
  align-items:center;
  &:last-child {
    margin-right:0;
  }
  .checkBox{
    margin-right:12px;
  }
  >span {
    font-size:16px;
    color:${colors.getIn(['mainColorB','original'])};
  }
`
export default ({
  loadingFeedbackList=true,
  loadingAnalysis=true,
  dataList=List(),
  setData=noop,
  setTagListIdArr=noop
}) => {
  const dataStatus = !loadingFeedbackList && !loadingAnalysis;
  return dataList.map((value, key) => {
    return (
      <StyleCreateCaptionSelectList key={key}>
        <CheckBox onClick={() => {
          if(!dataStatus) { return }
          if (value.get("status")) {
            setTagListIdArr(prev => {
              let list = JSON.parse(prev).filter(prev => prev !== value.get("id"));
              return JSON.stringify(list);
            });
          } else {
            setTagListIdArr(prev => {
              let list = JSON.parse(prev);
              list.push(value.get("id"));
              return JSON.stringify(list);
            });
          }
          setData(prev => prev.setIn([key, "status"], !value.get("status")));
        }}
          active={value.get("status")}
          className="checkBox"
        />
        <span>{value.get("name")}</span>
      </StyleCreateCaptionSelectList>
    );
  });
};