import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import cx from "classnames";
import { List } from "immutable";
// colors
import colors from "src/constants/colors";
// swip
import  { Swipe } from "react-swipe-component";
// fadeIn
import FadeInList from "src/components/Common/FadeInList";
const StyledContentCenterSide = styled.div(({ widthSize, currentPageNum })=>`
  width:425px;
  overflow:auto;
  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-track {
    background:transparent;
  }
  &::-webkit-scrollbar-thumb {
    background:transparent; 
    border-radius: 10px;
  }
  &.isDone {
    &::-webkit-scrollbar-track {
      background:${(currentPageNum%2 !== 0) ? colors.getIn(['mainColorC', 'five']) : `#fff`};
    }
    &::-webkit-scrollbar-thumb {
      background:${colors.getIn(['mainColorC','half'])}; 
    }
  }
  .caption-list {
    min-width:426px;
    width:${widthSize*100}px;
    display:flex;
    align-items:center;
    height:60px;
    background-color:#ffffff;
    li {
      width:100px;
      text-align:center;
      font-size:16px;
      color:${colors.getIn(['mainColorA', 'half'])};
    }
  }
`);
export const ContentCenterSide = ({
  currentPageNum=Number(),
  caption=[],
  content=[]
})=> {
  const boxPositionRef = useRef(null);
  const [ listIsDone, setListIsDone ] = useState(false);
  useEffect(()=>{
    if(!(currentPageNum > 0)) { return }
    const second = (1000 * currentPageNum) *0.05;
    const timer = setTimeout(v=>setListIsDone(true),second);
    return ()=>{ clearTimeout(timer)};
  },[currentPageNum])
  return (
    <Swipe
      stopPropagation={false}
      onSwipe={(p)=>{boxPositionRef.current.scrollLeft+=(p.x*0.5)}}
    >
      <StyledContentCenterSide
        className={cx({isDone : listIsDone})}
        widthSize={caption.length}
        currentPageNum={currentPageNum}
        ref={boxPositionRef}
      >
        <ul className="caption-list">{caption}</ul>
        <ul>{content}</ul>
      </StyledContentCenterSide>
    </Swipe>
  )
};
const StyledCenterCaption = styled.li`
  position: relative;
  height: 100%;
  display:flex;
  align-items:center;
  justify-content:center;
`
export const CCSContentCaption = ({
  datavalue=List(),
})=> {
  return <StyledCenterCaption>{datavalue.get("name")}</StyledCenterCaption>
};
const StyledCCSContent = styled.ul(({ widthSize })=>`
  opacity:0;
  min-width:426px;
  width:${widthSize*100}px;
  display:flex;
  align-items:center;
  height:60px;
  background-color:#fff;
  margin-top:2px;
  &:nth-child(2n+1){
    background-color:${colors.getIn(['mainColorC', 'five'])};
  }
  li {
    text-align:center;
    font-size:16px;
    color:${colors.getIn(['mainColorA', 'half'])};
    width:100px;
  }
`);
export const CCSContent = ({
  dataobj={},
  datavalue=List(),
  datakey=Number(),
  showItemNum=Number()
})=> {
  return (
    <FadeInList
      showItemNum={showItemNum}
      index={datakey}
    >
      <StyledCCSContent widthSize={dataobj.caption.length}>
        {
          dataobj.idList.map((v,k)=>{
            let data = '-';
            datavalue.get("rate").map((rateV)=>{
              if(v === rateV.get("id")){
                return data = rateV.get("rate");
              }else return null
            });  
            return <li key={k}>{data}</li>
          })
        }
      </StyledCCSContent>
    </FadeInList>
  )
};