import React, { useState, useEffect, useMemo, useContext } from "react";
import styled from "styled-components";
import { withRouter } from "react-router";
import last from "lodash/last";
import moment from "moment";
import { fromJS, List } from "immutable";
import { addDays } from "date-fns";
// nav
import Nav from "./Nav";
// charts
import CreateTotalAmountDom from "./TotalAmountChart";
import CreateDeviceUsedDom from "./DeviceUsedPieChart";
import CreateScoringStatisticsDom from "./ScoringStatistics";
// text feedback list
import TextFeedbackList from "./TextFeedbackList/Index";
// colors
import colors from "src/constants/colors";
// common
import { VariationsContext } from "src/components/Layout/Index";
// api
// import {
//   apiAnalysis,
//   apiTagList,
//   apiGetFilterGameList,
//   apiGetExport_csv,
// } from "src/api";
import { gameListData, analysis, tag } from "src/demoData";
// import FileDownload from "js-file-download";
const StyleFeedbackList = styled.div`
  margin: 0 auto;
  box-sizing: border-box;
  padding: 50px 75px 350px 75px;
  min-width: 1600px;
  min-height: 100vh;
  background-color: ${colors.getIn(["backgroundColor"])};
  .chart-area {
    max-width: 1450px;
    margin: 0 auto;
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
  }
`;
export default withRouter(({ history, location: { pathname } }) => {
  const contextValue = useContext(VariationsContext);
  const levelNum = contextValue.level;
  const gameId = last(pathname.split("/"));
  const [feedbackData, setFeedbackData] = useState({
    start_time: moment(addDays(new Date(), -364)).format("YYYY-MM-DD 00:00:00"),
    end_time: moment(new Date()).format("YYYY-MM-DD 23:59:59"),
  });
  const [tagListIdArr, setTagListIdArr] = useState(JSON.stringify([]));
  // const feedbackDataMemo = useMemo(() => {
  //   return {
  //     game_id: gameId,
  //     tag_id: tagListIdArr,
  //     start_time: feedbackData.start_time,
  //     end_time: feedbackData.end_time,
  //   };
  // }, [feedbackData, gameId, tagListIdArr]);
  const [tagStatusList, setTagStatusList] = useState(List());
  const [totalchartData, setTotalChartData] = useState(List());
  // api
  // const {
  //   fetchApiFunc: fetchAnalysis,
  //   isLoading: loadingAnalysis,
  //   fetchData: apiAnalysisData,
  // } = apiAnalysis(feedbackDataMemo);
  const fetchAnalysis = () => alert("update!");
  const loadingAnalysis = false;
  const apiAnalysisData = analysis;
  // const {
  //   isLoading: loadingGetFilterGameList,
  //   fetchData: apiGetFilterGameListData,
  // } = apiGetFilterGameList();
  const loadingGetFilterGameList = false;
  const apiGetFilterGameListData = gameListData;
  const analysitTagList = useMemo(
    () => apiAnalysisData.get("tag"),
    [apiAnalysisData]
  );
  const analysitRateList = useMemo(
    () => apiAnalysisData.get("rate"),
    [apiAnalysisData]
  );
  const analysitDeviceList = useMemo(
    () => apiAnalysisData.get("device"),
    [apiAnalysisData]
  );
  const analysitDataTotal = useMemo(
    () => apiAnalysisData.get("total"),
    [apiAnalysisData]
  );
  // const { isLoading: loadingTagListData, fetchData: apiTagListData } =
  //   apiTagList();
  const loadingTagListData = false;
  const apiTagListData = tag;
  useEffect(() => {
    const list = [];
    !loadingTagListData &&
      apiTagListData.map((value) => {
        return list.push({
          id: value.get("id"),
          name: value.get("name"),
          status: true,
        });
      });
    list.length > 0 && setTagStatusList(fromJS(list));
  }, [apiTagListData, loadingTagListData]);
  useEffect(() => {
    !loadingAnalysis && setTotalChartData(analysitTagList);
  }, [analysitTagList, loadingAnalysis]);
  const handleDownloadClick = () => {
    alert("尚無資料可供匯出");
    // apiGetExport_csv(feedbackDataMemo).then((res) => {
    //   const { filename, content } = res.data.result;
    //   if (content.length > 1) {
    //     FileDownload(content, filename);
    //   } else {
    //     alert("尚無資料可供匯出");
    //   }
    // });
  };
  return (
    <StyleFeedbackList>
      <Nav
        setFeedbackData={setFeedbackData}
        gameId={gameId}
        handleDownloadClick={handleDownloadClick}
        loadingGetFilterGameList={loadingGetFilterGameList}
        apiGetFilterGameListData={apiGetFilterGameListData}
      />
      <div className="chart-area">
        <CreateTotalAmountDom
          chartData={totalchartData}
          DataTotal={analysitDataTotal}
          tagStatusList={tagStatusList}
        />
        <CreateDeviceUsedDom dataList={analysitDeviceList} />
        <CreateScoringStatisticsDom dataList={analysitRateList} />
      </div>
      <TextFeedbackList
        gameId={gameId}
        levelNum={levelNum}
        tagStatusList={tagStatusList}
        setTagStatusList={setTagStatusList}
        feedbackData={feedbackData}
        analysisData={apiAnalysisData}
        tagListIdArr={tagListIdArr}
        setTagListIdArr={setTagListIdArr}
        fetchDataFunAnlysis={fetchAnalysis}
        loadingGetFilterGameList={loadingGetFilterGameList}
        apiGetFilterGameListData={apiGetFilterGameListData}
        loadingAnalysis={loadingAnalysis}
      />
    </StyleFeedbackList>
  );
});
