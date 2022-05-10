import React, { useState, useEffect } from "react";
import { withRouter } from "react-router";
import styled from "styled-components";
import { List, Map, fromJS } from "immutable";
// components
import CreateWhitelisting from "./CreateWhitelisting";
import DeletePopup from "./DeletePopup.js";
import { AddOtherTagButton } from "src/components/Common/CommonPart";
// icons
import { FiTrash2 } from "react-icons/fi";
// colors
import colors from "src/constants/colors";
// // api
// import { apiWhitelist } from "src/api";
// style
const StyleWhitelisting = styled.div`
  max-width: 1450px;
  margin: 0 auto;
  box-sizing: border-box;
  padding: 50px 75px;
  min-height: 100vh;
  .main-title {
    font-size: 26px;
    font-weight: bold;
    color: #181f3a;
    margin-bottom: 10px;
  }
  .sub-title {
    font-size: 14px;
    color: ${colors.getIn(["mainColorA", "half"])};
    margin-bottom: 50px;
  }
  .btn-add {
    display: flex;
    justify-content: flex-end;
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
      padding: 20px 0;
      margin-bottom: 2px;
      .btn {
        padding: 0 40px 0 30px;
        .arrowIcon {
          width: 23px;
          height: 23px;
          color: ${colors.getIn(["mainColorC", "original"])};
          cursor: pointer;
        }
      }
      .text {
        font-size: 16px;
        color: ${colors.getIn(["mainColorA", "half"])};
        text-align: center;
        box-sizing: border-box;
      }
    }
  }
  .btn-add {
    margin-top: 30px;
  }
`;
export default withRouter(({ history, location: { pathname } }) => {
  const [WLPopup, setWLPopup] = useState(false);
  const [whiteList, setWhiteList] = useState(List());
  const [addId, setAddId] = useState(false);
  // const {
  //   fetchApiFunc: fetchWhitelistData,
  //   isLoading: loadingGetWhitelistData,
  //   fetchData: apiGetWhitelistData
  //  } = apiWhitelist();
  const fetchWhitelistData = () => alert("update!");
  const loadingGetWhitelistData = false;
  const apiGetWhitelistData = fromJS([]);
  const handleAddClick = () => {
    !addId &&
      setWhiteList((prev) =>
        prev.push(
          Map({
            name: "",
            status: false,
            isCheck: false,
          })
        )
      );
    setAddId(true);
  };
  useEffect(() => {
    const list = [];
    loadingGetWhitelistData &&
      apiGetWhitelistData.map((value) => {
        return list.push({
          name: value,
          status: true,
          isCheck: false,
        });
      });
    list.length > 0 && setWhiteList(fromJS(list));
  }, [loadingGetWhitelistData, apiGetWhitelistData]);
  return (
    <StyleWhitelisting>
      <p className="main-title">白名單({whiteList.size}筆)</p>
      <p className="sub-title">
        此白名單為系統商關閉遊戲反饋的“輸入對話框”功能。
      </p>
      <ul className="accountList">
        <li className="accountList-caption">
          <div className="btn">
            <FiTrash2
              className="arrowIcon"
              onClick={() => {
                setWLPopup(true);
              }}
            />
          </div>
          <div className="text">系統商帳號</div>
        </li>
        <CreateWhitelisting
          dataList={whiteList}
          fetchDataFun={fetchWhitelistData}
          setDataList={setWhiteList}
          setAddId={setAddId}
        />
      </ul>
      <div className="btn-add">
        <AddOtherTagButton onClick={handleAddClick} title={`新增白名單`} />
      </div>
      {WLPopup && (
        <DeletePopup
          dataList={whiteList}
          setWLPopup={setWLPopup}
          fetchDataFun={fetchWhitelistData}
        />
      )}
    </StyleWhitelisting>
  );
});
