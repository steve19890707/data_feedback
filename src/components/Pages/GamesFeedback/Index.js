import React, { useState, useRef, useEffect, useContext } from "react";
import { withRouter } from "react-router";
import styled from "styled-components";
import { List, Map } from "immutable";
import cx from "classnames";
import colors from "src/constants/colors";
// components
import Pagination from "src/components/Layout/Pagination";
import CreateGameList from "./CreateGameList";
import RateEditPopup from "./RateEditPopup";
import GameEditPopup from "./GameEditPopup";
import BatchUpdatePopup from "./BatchUpdatePopup";
// icons
import { FiSearch } from "react-icons/fi";
// // api
// import { apiGetFilterGameList } from "src/api";
import { gameListData } from "src/demoData";
// common
import {
  LiLoader,
  ArrowIcons,
  AddOtherTagButton,
} from "src/components/Common/CommonPart";
import { VariationsContext } from "src/components/Layout/Index";
// style
const StyleGameFeedBack = styled.div`
  max-width: 1450px;
  margin: 0 auto;
  box-sizing: border-box;
  padding: 50px 75px 350px 75px;
  min-height: 100vh;
  .title-area {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 45px;
    .gameList-title {
      display: flex;
      flex-direction: column;
      .main {
        font-size: 24px;
        font-weight: bold;
        color: ${colors.getIn(["mainColorA", "original"])};
        margin-bottom: 8px;
      }
      .subtitle {
        font-size: 14px;
        color: ${colors.getIn(["mainColorB", "half"])};
      }
    }
    .gameList-search {
      display: flex;
      align-items: center;
      label {
        position: relative;
      }
      input {
        width: 300px;
        border: 1px solid transparent;
        box-sizing: border-box;
        border-radius: 5px;
        padding: 12px 18px;
        font-size: 14px;
        outline: none;
        color: ${colors.getIn(["mainColorA", "original"])};
        box-shadow: 0 5px 10px rgb(4, 8, 73, 0.1);
        transition: 0.2s;
        border: 2px solid transparent;
        &::placeholder {
          color: ${colors.getIn(["mainColorA", "half"])};
        }
        &:hover,
        &:focus {
          border: 2px solid ${colors.getIn(["mainColorE", "half"])};
        }
      }
      svg {
        position: absolute;
        top: 50%;
        right: 12px;
        transform: translateY(-50%);
        width: 20px;
        height: 20px;
        color: ${colors.getIn(["mainColorA", "twenty"])};
        cursor: pointer;
      }
      .batchUD-btn {
        margin-left: 15px;
        border-radius: 5px;
        span {
          margin-right: 0;
        }
      }
    }
  }
`;
const StyleGameList = styled.ul`
  width: 100%;
  box-shadow: 0 10px 20px 0 rgba(4, 8, 73, 0.1);
  border-radius: 10px;
  .gameList-caption {
    display: flex;
    align-items: center;
    background-color: #fff;
    border-radius: 10px 10px 0 0;
    padding: 28px 0;
    margin-bottom: 2px;
    .text {
      font-size: 14px;
      color: ${colors.getIn(["mainColorA", "half"])};
      width: 15%;
      text-align: center;
      box-sizing: border-box;
      &:nth-child(2) {
        width: calc(50% - 160px);
        text-align: left;
        padding-left: 105px;
        label {
          display: flex;
          align-items: center;
          cursor: pointer;
        }
      }
      &:nth-child(3),
      &:nth-child(4) {
        min-width: 110px;
        width: 12.5%;
        text-align: left;
      }
      &:last-child {
        min-width: unset;
        width: 10%;
        text-align: center;
      }
      &.viewOnly {
        width: calc(75% - 160px);
      }
      &.statistics {
        min-width: 160px;
        width: unset;
        display: flex;
        align-items: center;
        justify-content: center;
        label {
          display: flex;
          align-items: center;
          cursor: pointer;
        }
      }
    }
  }
`;
// searchGames
const renderNewList = (
  setDataList,
  refValue,
  showItemNum,
  setNumberOfPages,
  compareList,
  filterList
) => {
  if (refValue === "") {
    const totalPages = Math.ceil(compareList.size / showItemNum);
    setDataList(compareList);
    setNumberOfPages(totalPages);
    return;
  } else {
    const totalPages =
      Math.ceil(filterList.length / showItemNum) > 0
        ? Math.ceil(filterList.length / showItemNum)
        : 1;
    setDataList(
      List(filterList)
        .sort((a, b) => isNaN(a.get("game_id")) - isNaN(b.get("game_id")))
        .sort((a, b) => a.get("game_id") - b.get("game_id"))
        .sort((a, b) => b.get("feedback") - a.get("feedback"))
    );
    setNumberOfPages(totalPages);
  }
};
const searchGames = (
  setDataList,
  refValue,
  showItemNum,
  setNumberOfPages,
  originList
) => {
  const filterList = [];
  const compareList =
    originList
      .sort((a, b) => isNaN(a.get("game_id")) - isNaN(b.get("game_id")))
      .sort((a, b) => a.get("game_id") - b.get("game_id"))
      .sort((a, b) => b.get("feedback") - a.get("feedback")) || List();
  compareList.map((value) => {
    const gameName = !value.getIn(["name", "cn"])
      ? ""
      : value.getIn(["name", "cn"]);
    const gameId = !value.get("game_id") ? 0 : String(value.get("game_id"));
    const compareGameInfo = `${gameId}.${gameName}`;
    if (!!~compareGameInfo.indexOf(refValue)) {
      return filterList.push(value);
    } else {
      return null;
    }
  });
  renderNewList(
    setDataList,
    refValue,
    showItemNum,
    setNumberOfPages,
    compareList,
    filterList
  );
};
export default withRouter(({ history, location: { pathname } }) => {
  const contextValue = useContext(VariationsContext);
  const levelNum = contextValue.level;
  const [orderBy, setOrderBy] = useState({ order: "", by: "" });
  const [gamesList, setGamesList] = useState(List());
  const [listSortStatus, setListSortStatus] = useState({
    game_id: { up: false, down: false },
    today: { up: false, down: false },
    total: { up: false, down: true },
  });
  const gamesInputRef = useRef(null);
  // for pagination
  const [showItemNum, setShowItemNum] = useState(12);
  const totalPages = gamesList ? Math.ceil(gamesList.size / showItemNum) : 0;
  const [numberOfPages, setNumberOfPages] = useState(totalPages);
  const [currentPage, setCurrentPage] = useState({
    start: 1,
    end: showItemNum,
  });
  // for popup
  const [popupState, setPopupState] = useState(
    Map({
      listKey: 0,
      title: "",
      code: 0,
      versionStatus: false,
      timeZoneIsOpen: false,
      gameEditIsOpen: false,
      batchUpdatePopup: false,
      version: List(),
      filterRate: List(),
    })
  );
  // const {
  //   fetchApiFunc: fetchFilterGameListData,
  //   isLoading: loadingGetFilterGameList,
  //   fetchData: apiGetFilterGameListData,
  // } = apiGetFilterGameList();

  const fetchFilterGameListData = () => alert("update!");
  const loadingGetFilterGameList = false;
  const apiGetFilterGameListData = gameListData;
  const fetchTypeDilterGameList = (type, by, dataList) => {
    switch (type) {
      case "game_id":
        const idListDown = dataList
          .sort((a, b) => isNaN(a.get("game_id")) - isNaN(b.get("game_id")))
          .sort((a, b) => a.get("game_id") - b.get("game_id"))
          .sort((a, b) => b.get("feedback") - a.get("feedback"));
        const idListUp = dataList
          .sort((a, b) => isNaN(a.get("game_id")) - isNaN(b.get("game_id")))
          .sort((a, b) => b.get("game_id") - a.get("game_id"))
          .sort((a, b) => b.get("feedback") - a.get("feedback"));
        return by === "1" ? setGamesList(idListUp) : setGamesList(idListDown);
      case "today":
        const todayListDown = dataList.sort(
          (a, b) =>
            a.getIn(["feedback_count", "today"]) -
            b.getIn(["feedback_count", "today"])
        );
        const todayListUp = dataList.sort(
          (a, b) =>
            b.getIn(["feedback_count", "today"]) -
            a.getIn(["feedback_count", "today"])
        );
        return by === "1"
          ? setGamesList(todayListUp)
          : setGamesList(todayListDown);
      case "total":
        const totalListDown = dataList.sort(
          (a, b) =>
            a.getIn(["feedback_count", "total"]) -
            b.getIn(["feedback_count", "total"])
        );
        const totalListUp = dataList.sort(
          (a, b) =>
            b.getIn(["feedback_count", "total"]) -
            a.getIn(["feedback_count", "total"])
        );
        return by === "1"
          ? setGamesList(totalListUp)
          : setGamesList(totalListDown);
      default:
        const defaultListSort = dataList.sort(
          (a, b) =>
            b.getIn(["feedback_count", "total"]) -
            a.getIn(["feedback_count", "total"])
        );
        return setGamesList(defaultListSort);
    }
  };
  useEffect(() => {
    fetchTypeDilterGameList(
      orderBy.order,
      orderBy.by,
      apiGetFilterGameListData
    );
  }, [apiGetFilterGameListData, orderBy]);
  useEffect(() => {
    setNumberOfPages(totalPages);
  }, [totalPages]);
  return (
    <>
      <StyleGameFeedBack>
        <div className="title-area">
          <div className="gameList-title">
            <div className="main">遊戲列表</div>
            <div className="subtitle">遊戲反饋 / 遊戲列表</div>
          </div>
          <div className="gameList-search">
            <label>
              <input
                placeholder="搜尋遊戲"
                ref={gamesInputRef}
                onChange={(event) => {
                  event.target.value = event.target.value.replace(
                    /^ +| +$/g,
                    ""
                  );
                  searchGames(
                    setGamesList,
                    gamesInputRef.current.value,
                    showItemNum,
                    setNumberOfPages,
                    apiGetFilterGameListData
                  );
                }}
              />
              <FiSearch />
            </label>
            {levelNum !== 0 && (
              <AddOtherTagButton
                className={`batchUD-btn`}
                title={`批次更新啟用區間`}
                onClick={() =>
                  setPopupState((prev) => prev.set("batchUpdatePopup", true))
                }
              />
            )}
          </div>
        </div>
        <StyleGameList>
          <li className="gameList-caption">
            <div className="text">啟用狀態</div>
            <div className={cx("text", { viewOnly: levelNum === 0 })}>
              <label
                onClick={() => {
                  const status = listSortStatus.game_id;
                  if (
                    (!status.up && !status.down) ||
                    (status.up && !status.down)
                  ) {
                    setListSortStatus({
                      game_id: { up: false, down: true },
                      today: { up: false, down: false },
                      total: { up: false, down: false },
                    });
                    setOrderBy({ order: "game_id", by: "2" });
                  } else {
                    setListSortStatus({
                      game_id: { up: true, down: false },
                      today: { up: false, down: false },
                      total: { up: false, down: false },
                    });
                    setOrderBy({ order: "game_id", by: "1" });
                  }
                  fetchFilterGameListData();
                }}
              >
                <span>ID遊戲名稱</span>
                <ArrowIcons
                  typeup={"active-up"}
                  typedown={"active-down"}
                  up={listSortStatus.game_id.up}
                  down={listSortStatus.game_id.down}
                />
              </label>
            </div>
            {levelNum !== 0 && <div className="text">遊戲編輯</div>}
            {levelNum !== 0 && <div className="text">評分編輯</div>}
            <div className="text statistics">
              <label
                onClick={() => {
                  const status = listSortStatus.today;
                  if (
                    (!status.up && !status.down) ||
                    (status.up && !status.down)
                  ) {
                    setListSortStatus({
                      game_id: { up: false, down: false },
                      today: { up: false, down: true },
                      total: { up: false, down: false },
                    });
                    setOrderBy({ order: "today", by: "1" });
                  } else {
                    setListSortStatus({
                      game_id: { up: false, down: false },
                      today: { up: true, down: false },
                      total: { up: false, down: false },
                    });
                    setOrderBy({ order: "today", by: "2" });
                  }
                  fetchFilterGameListData();
                }}
              >
                <span>今日回應</span>
                <ArrowIcons
                  typeup={"active-up"}
                  typedown={"active-down"}
                  up={listSortStatus.today.up}
                  down={listSortStatus.today.down}
                />
              </label>
              <label
                onClick={() => {
                  const status = listSortStatus.total;
                  if (
                    (!status.up && !status.down) ||
                    (status.up && !status.down)
                  ) {
                    setListSortStatus({
                      game_id: { up: false, down: false },
                      today: { up: false, down: false },
                      total: { up: false, down: true },
                    });
                    setOrderBy({ order: "total", by: "1" });
                  } else {
                    setListSortStatus({
                      game_id: { up: false, down: false },
                      today: { up: false, down: false },
                      total: { up: true, down: false },
                    });
                    setOrderBy({ order: "total", by: "2" });
                  }
                  fetchFilterGameListData();
                }}
              >
                <span>/週回應</span>
                <ArrowIcons
                  typeup={"active-up"}
                  typedown={"active-down"}
                  up={listSortStatus.total.up}
                  down={listSortStatus.total.down}
                />
              </label>
            </div>
            <div className="text">查看</div>
          </li>
          {loadingGetFilterGameList ? (
            <LiLoader status={true} />
          ) : (
            <CreateGameList
              levelNum={levelNum}
              dataList={gamesList}
              showItemNum={showItemNum}
              currentPage={currentPage}
              setPopupState={setPopupState}
            />
          )}
          {!loadingGetFilterGameList && !gamesList.size > 0 && (
            <LiLoader status={false} text={`無遊戲資訊`} />
          )}
        </StyleGameList>
        <Pagination
          setCurrentPage={setCurrentPage}
          setShowItemNum={setShowItemNum}
          // fetchFun={fetchFilterGameListData}
          numberOfPages={numberOfPages}
          showItemNum={showItemNum}
        />
      </StyleGameFeedBack>
      {popupState.get("timeZoneIsOpen") && (
        <GameEditPopup
          popupState={popupState}
          setPopupState={setPopupState}
          fetchDataFun={fetchFilterGameListData}
        />
      )}
      {popupState.get("gameEditIsOpen") && (
        <RateEditPopup
          levelNum={levelNum}
          popupState={popupState}
          setPopupState={setPopupState}
          fetchDataFun={fetchFilterGameListData}
        />
      )}
      {popupState.get("batchUpdatePopup") && (
        <BatchUpdatePopup
          gamesList={gamesList}
          setPopupState={setPopupState}
          fetchDataFun={fetchFilterGameListData}
        />
      )}
    </>
  );
});
