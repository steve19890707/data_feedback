import React, { useState, useEffect } from "react";
import styled from "styled-components";
import noop from "lodash/noop";
import cx from "classnames";
import { List } from "immutable";
// colors
import colors from "src/constants/colors";
// icons
import { FiTrash2 } from "react-icons/fi";
import { MdSubdirectoryArrowRight } from "react-icons/md"
// common
import { CheckBox, ArrowIcons } from "src/components/Common/CommonPart";
// fadeIn
import FadeInList from "src/components/Common/FadeInList";
const StyledContentLeftSide = styled.div`
  .caption-list {
    display:flex;
    align-items:center;
    padding-left:30px;
    height:60px;
    background-color:#ffffff;
    border-radius:10px 0 0 0;
    li {
      font-size:16px;
      color:${colors.getIn(['mainColorA', 'half'])};
      width:80px;
      .svgIcon {
        width:23px;
        height:23px;
        color:${colors.getIn(['mainColorC', 'original'])};
        cursor: pointer;
        &.arrow {transform:rotate(180deg);}
      }
      &:nth-child(3) {
        width:120px;
        display:flex;
        align-items:center;
        cursor: pointer;
      }
      &:nth-child(4) {
        width:100px;
        text-align:center;
      }
    }
  }
`
export const ContentLeftSide = ({
  isAechiveList=false,
  data=[],
  setPagePopup=noop,
  orderStatus={},
  setOrderStatus=noop,
  setOrderBy=noop
})=> {
  return (
    <StyledContentLeftSide>
      <ul className="caption-list">
        <li>
          {!isAechiveList ? 
          <FiTrash2 className="svgIcon" onClick={()=>{setPagePopup(true)}}/> :
          <MdSubdirectoryArrowRight className="svgIcon arrow" onClick={()=>{setPagePopup(true)}}/> }  
        </li>
        <li>No</li>
        <li onClick={()=>{
          const status = orderStatus.user_id
          if((!status.up && !status.down) || 
            (status.up && !status.down)){
            setOrderStatus({
              user_id:{up:false,down:true},
              rate:{up:false,down:false},
              time:{up:false,down:false}
            });
            setOrderBy({order:"user_id",by:"2"})
          }else{
            setOrderStatus({
              user_id:{up:true,down:false},
              rate:{up:false,down:false},
              time:{up:false,down:false}
            });
            setOrderBy({order:"user_id",by:"1"})
          };  
        }}>
          <span>用戶ID</span>
          <ArrowIcons 
            typeup={"active-up"}
            typedown={"active-down"}
            up={orderStatus.user_id.up}
            down={orderStatus.user_id.down}
          />
        </li>
        <li>總評分</li>
      </ul>
      {data}
    </StyledContentLeftSide>
  );
};
const StyledCLSContent = styled.ul`
  opacity:0;
  display:flex;
  align-items:center;
  padding-left:30px;
  height:60px;
  background-color:#fff;
  margin-top:2px;
  &:nth-child(even){
    background-color:${colors.getIn(['mainColorC', 'five'])};
  }
  &:last-child {
    border-radius:0 0 0 10px;
    padding-bottom:8px;
  }
  .list-style {
    font-size:16px;
    color:${colors.getIn(['mainColorB', 'original'])};
    width:80px;
    .checkbox {
      width:20px;
    }
    &:nth-child(2) {
      height:100%;
      line-height:60px;
      overflow:hidden;
      text-overflow:ellipsis;
    }
    &:nth-child(3) {
      width:120px;
      height:100%;
      line-height:60px;
      overflow:hidden;
      text-overflow:ellipsis;
    }
    &:nth-child(4) {
      width:100px;
      text-align:center;
    }
  }
`
export const CLSContent = ({
  datavalue=List(),
  getFADataList=List(),
  datakey=Number,
  showItemNum=Number(),
  setGetFADataList=noop
})=>{
  const [ isCheck, setIsCheck ] = useState(false);
  useEffect(()=>{
    const checkStatus = !!~getFADataList.indexOf(datavalue.get("id"));
    setIsCheck(checkStatus);
  },[setIsCheck, getFADataList, datavalue])
  return (
    <FadeInList
      showItemNum={showItemNum}
      index={datakey}
    >
      <StyledCLSContent>
        <li className="list-style">
          <CheckBox className={cx('checkbox',{ active: isCheck })}
            onClick={() => {
              if(!isCheck) {
                setGetFADataList(prev => prev.update(prev => prev.push(datavalue.get("id"))));
              } else {
                setGetFADataList(prev => prev.filter(prev => prev !== datavalue.get("id")));
              }
            }}
          />
        </li>
        <li className="list-style">{datavalue.get("id")}</li>
        <li className="list-style">{datavalue.get("user_id")}</li>
        <li className="list-style">{datavalue.get("rate_avg")}</li>
      </StyledCLSContent>
    </FadeInList>
  )
}