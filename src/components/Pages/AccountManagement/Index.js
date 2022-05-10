import React, { useState, useRef, useEffect } from "react";
import { withRouter } from "react-router";
import styled from "styled-components";
import { List, Map, fromJS } from "immutable";
import colors from "src/constants/colors";
// components
import Pagination from "src/components/Layout/Pagination";
import CreateEditPopup from "./CreateEditPopup";
import CreateAccountList from "./CreateAccountList";
// icons
import { FiSearch } from "react-icons/fi";
// // api
// import { apiGetAdminList, apiGetLimitList } from "src/api";
import { limitList, adminlist } from "src/demoData";
// common
import { LiLoader } from "src/components/Common/CommonPart";
// style
const StyleAccountManagement = styled.div`
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
    .accountList-title {
      font-size: 26px;
      font-weight: bold;
      color: ${colors.getIn(["mainColorA", "original"])};
    }
    .accountList-search {
      display: flex;
      align-items: center;
      position: relative;
      box-sizing: border-box;
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
    }
  }
  .accountList {
    width: 100%;
    border-radius: 10px;
    box-shadow: 0 10px 20px 0 rgba(4, 8, 73, 0.1);
    .accountList-caption {
      display: flex;
      align-items: center;
      background-color: #fff;
      border-radius: 10px 10px 0 0;
      padding: 28px 0;
      margin-bottom: 2px;
      .text {
        font-size: 14px;
        color: ${colors.getIn(["mainColorA", "half"])};
        width: 12.5%;
        text-align: center;
        box-sizing: border-box;
        &:nth-child(3) {
          width: 55%;
          text-align: left;
          padding-left: 60px;
        }
        &:last-child {
          text-align: left;
        }
      }
    }
  }
`;
// searchAccount
const renderNewList = (
  setNewList,
  refValue,
  showItemNum,
  setNumberOfPages,
  compareList,
  filterList
) => {
  if (refValue === "") {
    const totalPages = Math.ceil(compareList.size / showItemNum);
    setNewList(compareList);
    setNumberOfPages(totalPages);
    return;
  } else {
    const totalPages =
      Math.ceil(filterList.length / showItemNum) > 0
        ? Math.ceil(filterList.length / showItemNum)
        : 1;
    setNewList(new List(filterList));
    setNumberOfPages(totalPages);
  }
};
const searchAccount = async (
  cloneAccountList,
  setNewList,
  refValue,
  showItemNum,
  setNumberOfPages
) => {
  const filterList = [];
  await cloneAccountList.map((value) => {
    const accountName = value.get("name");
    if (!!~accountName.indexOf(refValue)) {
      return filterList.push(value);
    } else {
      return null;
    }
  });
  await renderNewList(
    setNewList,
    refValue,
    showItemNum,
    setNumberOfPages,
    cloneAccountList,
    filterList
  );
};
const CreateList = (array = List()) => {
  let list = [];
  array.map((value) => {
    return list.push({
      title: value[1],
      key: value[0],
      status: false,
    });
  });
  return list;
};
export default withRouter(({ history, location: { pathname } }) => {
  // api
  // const {
  //   fetchApiFunc: fetchGetAdminList,
  //   isLoading: loadingGetAdminList,
  //   fetchData: apiGetAdminListData
  // } = apiGetAdminList()
  const fetchGetAdminList = () => alert("update!");
  const loadingGetAdminList = false;
  const apiGetAdminListData = adminlist;
  // const { fetchData: apiGetLimitListData } = apiGetLimitList()
  const apiGetLimitListData = limitList;
  const [accountList, setAccountList] = useState(List());
  const [cloneAccountList, setCloneAccountList] = useState(List());
  const accountInputRef = useRef("");
  // for pagination
  const [showItemNum, setShowItemNum] = useState(12);
  const totalPages = accountList
    ? Math.ceil(accountList.size / showItemNum)
    : 0;
  const [numberOfPages, setNumberOfPages] = useState(totalPages);
  const [currentPage, setCurrentPage] = useState({
    start: 1,
    end: showItemNum,
  });
  // for popup
  const [popupState, setPopupState] = useState(Map({}));
  useEffect(() => {
    let gameList = CreateList(List(apiGetLimitListData.get("game")));
    let webList = CreateList(List(apiGetLimitListData.get("site")));
    const newSate = Map({
      isOpen: false,
      key: Number(),
      id: Number(),
      name: "",
      department: "",
      permissions: 0,
      gamePermissions: fromJS(gameList),
      webPermissions: fromJS(webList),
      especially: [],
    });
    setPopupState(newSate);
  }, [apiGetLimitListData]);
  useEffect(() => {
    const newList = [];
    apiGetAdminListData.map((value) => {
      return newList.push({
        id: value.get("id"),
        name: value.get("account"),
        department: value.get("dept"),
        permissions: value.get("level"),
        gamePermissions: value.get("game"),
        webPermissions: value.get("site"),
        especially: value.get("especially"),
      });
    });
    setAccountList(fromJS(newList));
    setCloneAccountList(fromJS(newList));
  }, [apiGetAdminListData]);
  useEffect(() => {
    setNumberOfPages(totalPages);
  }, [totalPages]);
  return (
    <>
      <StyleAccountManagement>
        <div className="title-area">
          <div className="accountList-title">帳號管理</div>
          <label className="accountList-search">
            <input
              placeholder="搜尋帳號"
              ref={accountInputRef}
              onChange={(event) => {
                event.target.value = event.target.value.replace(/^ +| +$/g, "");
                searchAccount(
                  cloneAccountList,
                  setAccountList,
                  accountInputRef.current.value,
                  showItemNum,
                  setNumberOfPages
                );
              }}
            />
            <FiSearch />
          </label>
        </div>
        <ul className="accountList">
          <li className="accountList-caption">
            <div className="text">帳號名稱</div>
            <div className="text">部門名稱</div>
            <div className="text">權限等級</div>
            <div className="text">編輯</div>
          </li>
          {loadingGetAdminList ? (
            <LiLoader status={true} />
          ) : (
            <CreateAccountList
              dataList={accountList}
              showItemNum={showItemNum}
              currentPage={currentPage}
              popupState={popupState}
              setPopupState={setPopupState}
            />
          )}
          {!loadingGetAdminList && !accountList.size > 0 && (
            <LiLoader status={false} text={`無帳號名稱`} />
          )}
        </ul>
        <Pagination
          setCurrentPage={setCurrentPage}
          setShowItemNum={setShowItemNum}
          fetchFun={fetchGetAdminList}
          numberOfPages={numberOfPages}
          showItemNum={showItemNum}
        />
      </StyleAccountManagement>
      {popupState.get("isOpen") && (
        <CreateEditPopup
          popupState={popupState}
          setPopupState={setPopupState}
          fetchDataFun={fetchGetAdminList}
        />
      )}
    </>
  );
});
