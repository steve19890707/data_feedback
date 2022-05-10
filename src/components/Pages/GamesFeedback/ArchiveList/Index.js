import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { withRouter } from "react-router";
import last from "lodash/last";
import { List, fromJS } from "immutable";
// nav
import Nav from "./Nav";
// text Archive list
import TextArchiveList from "./TextArchiveList";
// colors
import colors from "src/constants/colors";
// common
import { VariationsContext } from "src/components/Layout/Index";
// api
// import { apiTagList, apiGetFilterGameList } from "src/api";
import { tag, gameListData } from "src/demoData";
const StyleArchiveList = styled.div`
  margin: 0 auto;
  box-sizing: border-box;
  padding: 50px 75px 350px 75px;
  min-width: 1600px;
  min-height: 100vh;
  background-color: ${colors.getIn(["backgroundColor"])};
`;
export default withRouter(({ history, location: { pathname } }) => {
  const contextValue = useContext(VariationsContext);
  const levelNum = contextValue.level;
  const gameId = last(pathname.split("/"));
  const [tagList, setTagList] = useState(List());
  const [totalListNum, setTotalListNum] = useState(Number());
  // api
  // const { isLoading: loadingTagListData, fetchData: apiTagListData } =
  //   apiTagList();
  const loadingTagListData = false;
  const apiTagListData = tag;
  // const {
  //   isLoading: loadingGetFilterGameList,
  //   fetchData: apiGetFilterGameListData,
  // } = apiGetFilterGameList();
  const loadingGetFilterGameList = false;
  const apiGetFilterGameListData = gameListData;
  useEffect(() => {
    const list = [];
    !loadingTagListData &&
      apiTagListData.map((value) => {
        return list.push({
          id: value.get("id"),
          name: value.get("name"),
        });
      });
    list.length > 0 && setTagList(fromJS(list));
  }, [apiTagListData, loadingTagListData]);
  return (
    <StyleArchiveList>
      <Nav
        gameId={gameId}
        totalListNum={totalListNum}
        apiGetFilterGameListData={apiGetFilterGameListData}
      />
      <TextArchiveList
        gameId={gameId}
        levelNum={levelNum}
        tagList={tagList}
        totalListNum={totalListNum}
        setTotalListNum={setTotalListNum}
        loadingGetFilterGameList={loadingGetFilterGameList}
        apiGetFilterGameListData={apiGetFilterGameListData}
      />
    </StyleArchiveList>
  );
});
