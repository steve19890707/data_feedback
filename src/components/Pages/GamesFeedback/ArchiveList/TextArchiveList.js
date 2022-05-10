import React, { useState, useEffect } from "react";
import styled from "styled-components";
import noop from "lodash/noop";
import { List, Map, fromJS } from "immutable";
// components
import Pagination from "src/components/Layout/Pagination";
import ContentArea from "feedbackContentComponents/ContentArea.js";
import DetailPopup from "feedbackContentComponents/DetailPopup";
import RemoveDataPopup from "feedbackContentComponents/RemoveDataPopup";
// api
// import { apiArchiveList, apiRateList } from "src/api";
import { rate } from "src/demoData";
const StyleTextFeedbackList = styled.div`
  max-width: 1450px;
  margin: 50px auto 0 auto;
`;
export default ({
  gameId = String(),
  levelNum = Number(),
  tagList = List(),
  totalListNum = Number(),
  setTotalListNum = noop,
  loadingGetFilterGameList = true,
  apiGetFilterGameListData = List(),
}) => {
  const [getFeedbackList, setGetFeedbackList] = useState(List());
  const [popupNo, setPopupNo] = useState({
    key: 0,
    status: false,
    currentList: Map({}),
  });
  const [FBCPopup, setFBCPopup] = useState(false);
  const [orderStatus, setOrderStatus] = useState({
    user_id: { up: false, down: false },
    rate: { up: false, down: false },
    time: { up: false, down: false },
  });
  // const [orderBy, setOrderBy] = useState({ order: "", by: "" });
  // Pagination
  const [showItemNum, setShowItemNum] = useState(100);
  const totalPages = Math.ceil(totalListNum / showItemNum);
  const [numberOfPages, setNumberOfPages] = useState(totalPages);
  // const [currentPage, setCurrentPage] = useState({
  //   start: 1,
  //   end: showItemNum,
  // });
  const [showDataList, setShowDataList] = useState(List());
  // const ArchiveDataMemo = useMemo(
  //   () => ({
  //     page: Math.ceil(currentPage.start / showItemNum),
  //     limit: showItemNum,
  //     game_id: gameId,
  //     order: orderBy.order,
  //     by: orderBy.by,
  //   }),
  //   [currentPage.start, showItemNum, gameId, orderBy]
  // );
  // api
  // const {
  //   fetchApiFunc: fetchArchiveList,
  //   isLoading: loadingArchiveList,
  //   fetchData: apiArchiveListData,
  // } = apiArchiveList(ArchiveDataMemo);
  const fetchArchiveList = () => alert("update!");
  const loadingArchiveList = false;

  const apiArchiveListData = fromJS([]);
  // const { isLoading: loadingRateListData, fetchData: apiRateListData } =
  //   apiRateList();
  const loadingRateListData = false;
  const apiRateListData = rate;
  useEffect(() => {
    let list = [];
    !loadingArchiveList &&
      apiArchiveListData.size > 0 &&
      apiArchiveListData.get("data").map((v) => {
        const value = v.toJS();
        return list.push({
          ...value,
          isFeedback: false,
          tagListOpen: false,
        });
      });
    setShowDataList(fromJS(list));
    setTotalListNum(apiArchiveListData.get("total"));
  }, [loadingArchiveList, apiArchiveListData, setTotalListNum]);
  useEffect(() => {
    setNumberOfPages(totalPages);
  }, [totalPages]);
  return (
    <StyleTextFeedbackList>
      <div className="content-list">
        <ContentArea
          dataList={showDataList}
          originalData={apiArchiveListData.get("data")}
          tagList={tagList}
          apiRateListData={apiRateListData}
          getFADataList={getFeedbackList}
          currentPageSize={showDataList.size}
          showItemNum={showItemNum}
          isAechiveList={true}
          loadingDataList={loadingArchiveList}
          loadingRateListData={loadingRateListData}
          orderStatus={orderStatus}
          setPagePopup={setFBCPopup}
          setOrderStatus={setOrderStatus}
          setOrderBy={noop}
          setShowDataList={setShowDataList}
          setGetFADataList={setGetFeedbackList}
          setPopupNo={setPopupNo}
        />
      </div>
      <Pagination
        secondValue={true}
        setCurrentPage={noop}
        setShowItemNum={setShowItemNum}
        numberOfPages={numberOfPages}
        showItemNum={showItemNum}
      />
      {FBCPopup && (
        <RemoveDataPopup
          levelNum={levelNum}
          type={"archive"}
          setPagePopup={setFBCPopup}
          getdataList={getFeedbackList}
          fetchDataFun={fetchArchiveList}
        />
      )}
      {popupNo.status && (
        <DetailPopup
          isDeleted={true}
          gameId={gameId}
          popupNo={popupNo}
          dataList={apiArchiveListData.get("data")}
          tagList={tagList}
          setPopupNo={setPopupNo}
          loadingGetFilterGameList={loadingGetFilterGameList}
          apiGetFilterGameListData={apiGetFilterGameListData}
          loadingRateListData={loadingRateListData}
          apiRateListData={apiRateListData}
        />
      )}
    </StyleTextFeedbackList>
  );
};
