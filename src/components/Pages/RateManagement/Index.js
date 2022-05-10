import React, { useState, useEffect } from "react";
import { withRouter } from "react-router";
import styled from "styled-components";
import { List, Map, fromJS } from "immutable";
// components
import CreateRateSetting from "./CreateRateSetting";
import { AddOtherTagButton } from "src/components/Common/CommonPart";
// api
// import { apiRateList } from "src/api";
import { rate } from "src/demoData";
// style
const StyleGameTagsManagement = styled.div`
  max-width: 1450px;
  margin: 0 auto;
  box-sizing: border-box;
  padding: 50px 75px;
  min-height: 100vh;
  .main-title {
    font-size: 32px;
    font-weight: bold;
    color: #181f3a;
    margin-bottom: 50px;
  }
  .btn-add {
    display: flex;
    justify-content: flex-end;
  }
`;
export default withRouter(({ history, location: { pathname } }) => {
  // api
  // const {
  //   fetchApiFunc: fetchRateListData,
  //   isLoading: loadingRateListData,
  //   fetchData: apiRateListData
  // } = apiRateList();
  const fetchRateListData = () => alert("update!");
  const loadingRateListData = false;
  const apiRateListData = rate;
  // regular
  const [GTEditList, setGTEditList] = useState(List());
  // other
  const [GOTEditList, setGOTEditList] = useState(List());
  const [GOTEditListSize, setGOTEditListSize] = useState(Number());
  const [addId, setAddId] = useState(false);
  useEffect(() => {
    const commonList = [];
    const specialList = [];
    apiRateListData.map((value) => {
      if (value.get("type") === "common") {
        return commonList.push(Map({ ...value.toJS(), status: false }));
      } else if (value.get("type") === "special") {
        return specialList.push(Map({ ...value.toJS(), status: false }));
      } else return null;
    });
    setGTEditList(fromJS(commonList));
    setGOTEditList(fromJS(specialList));
    setGOTEditListSize(fromJS(specialList).size);
  }, [apiRateListData]);
  const handleAddClick = () => {
    !addId &&
      setGOTEditList((pre) =>
        pre.push(
          Map({
            name: "",
            type: "special",
            class: "game",
            status: true,
          })
        )
      );
    setAddId(true);
  };
  return (
    <StyleGameTagsManagement>
      <p className="main-title">評分管理</p>
      <CreateRateSetting
        title={"通用評分"}
        type={"common"}
        dataList={GTEditList}
        setDataList={setGTEditList}
        loading={loadingRateListData}
        fetchDataFun={fetchRateListData}
        originalSize={GTEditList.size}
      />
      <CreateRateSetting
        title={"例外評分"}
        type={"special"}
        dataList={GOTEditList}
        setDataList={setGOTEditList}
        setAddId={setAddId}
        loading={loadingRateListData}
        fetchDataFun={fetchRateListData}
        originalSize={GOTEditListSize}
      />
      <div className="btn-add">
        <AddOtherTagButton onClick={handleAddClick} title={`新增額外評分`} />
      </div>
    </StyleGameTagsManagement>
  );
});
