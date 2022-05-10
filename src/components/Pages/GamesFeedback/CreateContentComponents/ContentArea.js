import React from "react";
import styled from "styled-components";
import noop from "lodash/noop";
import { List } from "immutable";
// common
import { LiLoader } from "src/components/Common/CommonPart";
// components
import { ContentLeftSide, CLSContent } from "feedbackContentComponents/ContentLeft";
import { ContentCenterSide, CCSContent, CCSContentCaption } from "feedbackContentComponents/ContentCenter";
import { ContentRightSide, CRSContent } from "feedbackContentComponents/ContentRight";

const StyledContent = styled.div`
  box-shadow: 0 10px 20px 0 rgba(4, 8, 73, 0.1);
  border-radius:10px;
  display:flex;
  align-items:center;
`
export default ({
  levelNum=Number(),
  dataList=List(),
  originalData=List(),
  tagList=List(),
  apiRateListData=List(),
  getFADataList=List(),
  currentPageSize=Number(),
  showItemNum=Number(),
  isAechiveList=false,
  loadingDataList=true,
  loadingRateListData=true,
  orderStatus={},
  setPagePopup=noop,
  setOrderStatus=noop,
  setOrderBy=noop,
  setShowDataList=noop,
  setGetFADataList=noop,
  setPopupNo=noop,
  fetchDataListFun=noop,
  fetchDataFunAnlysis=noop,
}) => {
  const leftSideData = [];
  const rightSideData = [];
  const centerSideData = { caption:[], content:[], idList:[] };
  apiRateListData.map((value, key)=>{
    return (
      centerSideData.caption.push(
        <React.Fragment key={key}>
          <CCSContentCaption datavalue={value}/>
        </React.Fragment>
      ),
      centerSideData.idList.push(value.get("id"))
    );
  });
  dataList.map((value,key)=>{
    return (
      leftSideData.push(
        <React.Fragment key={key}>
          <CLSContent
            datavalue={value}
            getFADataList={getFADataList}
            datakey={key}
            showItemNum={showItemNum}
            setGetFADataList={setGetFADataList}
          />
        </React.Fragment>
      ),
      centerSideData.content.push(
        <React.Fragment key={key}>
          <CCSContent
            dataobj={centerSideData}
            datavalue={value}
            datakey={key}
            showItemNum={showItemNum}
          />
        </React.Fragment>
      ),
      rightSideData.push(
        <React.Fragment key={key}>
          <CRSContent
            levelNum={levelNum}
            isAechiveList={isAechiveList}
            tagStatusList={tagList}
            datavalue={value}
            datakey={key}
            showItemNum={showItemNum}
            setShowDataList={setShowDataList}
            setPopupNo={setPopupNo}
            fetchDataListFun={fetchDataListFun}
            fetchDataFunAnlysis={fetchDataFunAnlysis}
          />
        </React.Fragment>
      )
  )});
  const loadingFinish = !loadingDataList && !loadingRateListData;
  const infoDone = loadingFinish && (leftSideData.length > 0) && (rightSideData.length > 0) && (centerSideData.content.length > 0);
  const noInfo = loadingFinish && !(originalData.size > 0);
  if(infoDone){
    return (
      <StyledContent>
        <ContentLeftSide
          isAechiveList={isAechiveList}
          data={leftSideData}
          setPagePopup={setPagePopup}
          orderStatus={orderStatus}
          setOrderStatus={setOrderStatus}
          setOrderBy={setOrderBy}
        />
        <ContentCenterSide
          currentPageNum={currentPageSize}
          caption={centerSideData.caption}
          content={centerSideData.content}
        />
        <ContentRightSide
          isAechiveList={isAechiveList}
          data={rightSideData}
          orderStatus={orderStatus}
          setOrderStatus={setOrderStatus}
          setOrderBy={setOrderBy}
        />
      </StyledContent>
    );
  } else if (noInfo) {
    return (
      <LiLoader
        status={false}
        text={`暫無訊息`}
      />
    );
  } else return <LiLoader status={true} />
};