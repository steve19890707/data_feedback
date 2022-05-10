import React, { useState, useEffect } from "react";
import styled from "styled-components";
import noop from "lodash/noop";
import { List, Map, fromJS } from "immutable";
// components
import Pagination from "src/components/Layout/Pagination";
import CreateCaptionSelectList from "./CreateCaptionSelectList";
import ContentArea from "feedbackContentComponents/ContentArea.js";
import DetailPopup from "feedbackContentComponents/DetailPopup";
import RemoveDataPopup from "feedbackContentComponents/RemoveDataPopup";
// api
// import { apiFeedbackList, apiRateList } from "src/api";
import { feedback, rate } from "src/demoData";
// colors
import colors from "src/constants/colors";
const StyleTextFeedbackList = styled.div`
  max-width: 1450px;
  margin: 50px auto 0 auto;
  .caption-selectList {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
    .title {
      font-size: 22px;
      color: ${colors.getIn(["mainColorA", "original"])};
      font-weight: 600;
    }
    .select-tags {
      display: flex;
      flex-wrap: nowrap;
    }
  }
`;
export default ({
  gameId = String(),
  levelNum = Number(),
  tagStatusList = List(),
  setTagStatusList = noop,
  feedbackData = {},
  analysisData = List(),
  tagListIdArr = String(),
  setTagListIdArr = noop,
  fetchDataFunAnlysis = noop,
  loadingGetFilterGameList = true,
  apiGetFilterGameListData = List(),
  loadingAnalysis = true,
}) => {
  const [getArchiveList, setGetArchiveList] = useState(List());
  const [popupNo, setPopupNo] = useState({
    key: 0,
    status: false,
    currentList: Map({}),
  });
  const [ACPopup, setACPopup] = useState(false);
  const [orderStatus, setOrderStatus] = useState({
    user_id: { up: false, down: false },
    rate: { up: false, down: false },
    time: { up: false, down: false },
  });
  // const [orderBy, setOrderBy] = useState({ order: "", by: "" });
  // Pagination
  const [showItemNum, setShowItemNum] = useState(100);
  const totalPages = !analysisData
    ? 0
    : Math.ceil(analysisData.get("total") / showItemNum);
  const [numberOfPages, setNumberOfPages] = useState(totalPages);
  // const [currentPage, setCurrentPage] = useState({
  //   start: 1,
  //   end: showItemNum,
  // });
  const [showDataList, setShowDataList] = useState(List());
  // const feedbackDataMemo = useMemo(
  //   () => ({
  //     page: Math.ceil(currentPage.start / showItemNum),
  //     limit: showItemNum,
  //     tag_id: tagListIdArr,
  //     game_id: gameId,
  //     start_time: feedbackData.start_time,
  //     end_time: feedbackData.end_time,
  //     order: orderBy.order,
  //     by: orderBy.by,
  //   }),
  //   [
  //     currentPage.start,
  //     showItemNum,
  //     gameId,
  //     feedbackData,
  //     tagListIdArr,
  //     orderBy,
  //   ]
  // );
  // api
  // const {
  //   fetchApiFunc: fetchFeedbackList,
  //   isLoading: loadingFeedbackList,
  //   fetchData: apiFeedbackListData,
  // } = apiFeedbackList(feedbackDataMemo);
  const fetchFeedbackList = () => alert("update!");
  const loadingFeedbackList = false;
  const apiFeedbackListData = feedback;
  // const { isLoading: loadingRateListData, fetchData: apiRateListData } =
  //   apiRateList();
  const loadingRateListData = false;
  const apiRateListData = rate;
  useEffect(() => {
    let list = [];
    apiFeedbackListData.size > 0 &&
      apiFeedbackListData.map((v) => {
        const value = v.toJS();
        return list.push({
          ...value,
          tagListOpen: false,
        });
      });
    setShowDataList(fromJS(list));
  }, [apiFeedbackListData]);
  useEffect(() => {
    setNumberOfPages(totalPages);
  }, [totalPages]);
  return (
    <StyleTextFeedbackList>
      <div className="caption-selectList">
        <div className="title">{`反饋列表(${
          !analysisData.get("total") ? 0 : analysisData.get("total")
        })`}</div>
        <ul className="select-tags">
          <CreateCaptionSelectList
            loadingFeedbackList={loadingFeedbackList}
            loadingAnalysis={loadingAnalysis}
            dataList={tagStatusList}
            setData={setTagStatusList}
            setTagListIdArr={setTagListIdArr}
          />
        </ul>
      </div>
      <ContentArea
        levelNum={levelNum}
        dataList={showDataList}
        originalData={apiFeedbackListData}
        tagList={tagStatusList}
        apiRateListData={apiRateListData}
        getFADataList={getArchiveList}
        currentPageSize={showDataList.size}
        showItemNum={showItemNum}
        loadingDataList={loadingFeedbackList}
        loadingRateListData={loadingRateListData}
        orderStatus={orderStatus}
        setPagePopup={setACPopup}
        setOrderStatus={setOrderStatus}
        setOrderBy={noop}
        setShowDataList={setShowDataList}
        setGetFADataList={setGetArchiveList}
        setPopupNo={setPopupNo}
        fetchDataListFun={fetchFeedbackList}
        fetchDataFunAnlysis={fetchDataFunAnlysis}
      />
      <Pagination
        secondValue={true}
        setCurrentPage={noop}
        setShowItemNum={setShowItemNum}
        numberOfPages={numberOfPages}
        showItemNum={showItemNum}
      />
      {ACPopup && (
        <RemoveDataPopup
          levelNum={levelNum}
          type={"feedback"}
          setPagePopup={setACPopup}
          getdataList={getArchiveList}
          fetchDataFun={fetchFeedbackList}
          fetchDataFunAnlysis={fetchDataFunAnlysis}
        />
      )}
      {popupNo.status && (
        <DetailPopup
          gameId={gameId}
          popupNo={popupNo}
          dataList={apiFeedbackListData}
          tagList={tagStatusList}
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
