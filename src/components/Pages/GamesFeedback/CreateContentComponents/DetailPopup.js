import React from "react";
import styled from "styled-components";
import noop from "lodash/noop";
import { List } from "immutable";
import cx from "classnames";
import moment from "moment";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import colors from "src/constants/colors";
// icons
import { IoIosAdd } from "react-icons/io";
import { FiCheck } from "react-icons/fi";

const StylePopup = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1002;
  .modal {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
  }
  .infor-content {
    z-index: 1;
    width: 950px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: ${colors.get("backgroundColor")};
    border-radius: 10px;
    padding: 50px 60px;
    box-sizing: border-box;
  }
`;
const StyleCreateContent = styled.ul`
  position: relative;
  .popup-closeBtn {
    position: absolute;
    top: 0;
    right: 80px;
    width: 30px;
    height: 30px;
    fill: #fff;
    transition: 0.2s;
    cursor: pointer;
    &:hover {
      opacity: 0.6;
    }
  }
  .arrow {
    position: absolute;
    width: 40px;
    height: 40px;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 50px;
    background: ${colors.getIn(["mainColorC", "original"])};
    transition: 0.2s;
    cursor: pointer;
    &:hover {
      opacity: 0.6;
    }
    &.left {
      left: -135px;
    }
    &.right {
      right: -135px;
    }
    svg {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      fill: #fff;
      width: 80%;
      height: 80%;
    }
  }
  .feedback-id {
    font-size: 24px;
    font-weight: 600;
    color: ${colors.getIn(["mainColorA", "original"])};
    margin-bottom: 20px;
  }
  .user-id {
    font-size: 18px;
    color: ${colors.getIn(["mainColorA", "original"])};
    margin-bottom: 20px;
  }
  .list-style {
    display: flex;
    font-weight: 350;
    align-items: stretch;
    margin-bottom: 1px;
    font-size: 16px;
    box-sizing: border-box;
    &:last-child {
      .caption,
      .info {
        border-bottom: 0;
      }
    }
    &.space {
      margin-bottom: 12px;
    }
    .caption {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #bfc2eb;
      width: 120px;
      font-size: 16px;
      padding: 20px 0;
      box-sizing: border-box;
      background-color: ${colors.getIn(["mainColorA", "original"])};
    }
    .info {
      background-color: #fff;
      color: ${colors.getIn(["mainColorB", "original"])};
      width: 710px;
      font-size: 16px;
      padding: 20px 25px;
      box-sizing: border-box;
      font-family: arial;
      &.content {
        padding: 0 25px;
        display: flex;
        align-items: center;
        .info-text {
          width: 100%;
        }
      }
      &.tags {
        display: flex;
        align-items: center;
        padding: 12px 25px;
        .list-button {
          position: relative;
          display: flex;
          align-items: center;
          background-color: ${colors.getIn(["backgroundColor"])};
          padding: 8px 26px 8px 8px;
          border-radius: 5px;
          margin-right: 10px;
          span {
            display: inline-block;
            white-space: nowrap;
            margin-right: 8px;
            color: ${colors.getIn(["mainColorA", "half"])};
          }
          svg {
            position: absolute;
            top: 50%;
            right: 8px;
            transform: translateY(-50%);
            width: 23px;
            height: 23px;
          }
          &:last-child {
            margin-right: 0;
          }
          .checksvg {
            color: #fff;
          }
          .addsvg {
            fill: ${colors.getIn(["mainColorA", "half"])};
          }
          &.check {
            background-color: ${colors.getIn(["mainColorG", "original"])};
            span {
              color: #fff;
            }
          }
        }
      }
      &.rate {
        display: flex;
        align-items: center;
        padding: 10px 30px;
        .list-rate {
          padding: 0 10px 0 30px;
          .rate-name {
            position: relative;
            margin-bottom: 10px;
            span {
              font-size: 14px;
              text-decoration: underline;
            }
          }
          .rate {
            font-size: 26px;
          }
          &.total {
            padding: 0 25px 0 0;
            border-right: 1px solid #dddffd;
            .rate {
              font-weight: 800;
              color: ${colors.getIn(["mainColorC", "original"])};
            }
          }
        }
      }
    }
  }
`;
const CreateContent = ({
  isDeleted = false,
  gameId = Number(),
  data = Map({}),
  dataList = List(),
  tagList = List(),
  popupNo = {},
  setPopupNo = noop,
  apiGetFilterGameListData = List(),
  apiRateListData = List(),
}) => {
  const filterGameData = apiGetFilterGameListData
    .filter((v) => v.get("game_id") === gameId)
    .getIn([0, "rate"])
    .push(1, 2, 3)
    .sort();
  const rateUsingList = apiRateListData.filter(
    (v) => !!~filterGameData.indexOf(v.get("id"))
  );
  const CreateRateList = () => {
    return rateUsingList.map((value, key) => {
      const filterData = data
        .get("rate")
        .find((v) => v.get("id") === value.get("id"));
      return (
        <div key={key} className="list-rate">
          <div className="rate-name">
            <span>{value.get("name")}</span>
          </div>
          <div className="rate">
            {filterData ? filterData.get("rate") : "-"}
          </div>
        </div>
      );
    });
  };
  const CreateTagList = () => {
    return tagList.map((value, key) => {
      const isTag = !!~data.get("tag_id").indexOf(value.get("id"));
      return (
        <div key={key} className={cx("list-button", { check: isTag })}>
          <span>{value.get("name")}</span>
          {isTag ? (
            <FiCheck className="checksvg" />
          ) : (
            <IoIosAdd className="addsvg" />
          )}
        </div>
      );
    });
  };
  return (
    <StyleCreateContent>
      {!(popupNo.key === 0) && (
        <button
          className="arrow left"
          onClick={() => {
            setPopupNo((prev) => {
              return {
                ...prev,
                key: prev.key - 1,
                currentList: dataList.get((prev.key -= 1)),
              };
            });
          }}
        >
          <MdKeyboardArrowLeft />
        </button>
      )}
      {!(popupNo.key + 1 === dataList.size) && (
        <button
          className="arrow right"
          onClick={() => {
            setPopupNo((prev) => {
              return {
                ...prev,
                key: prev.key + 1,
                currentList: dataList.get((prev.key += 1)),
              };
            });
          }}
        >
          <MdKeyboardArrowRight />
        </button>
      )}
      <li className="feedback-id">#{data.get("id")}</li>
      <li className="user-id">{data.get("user_id")}</li>
      <li className="list-style space">
        <div className="caption">評分</div>
        <div className="info rate">
          <div className="list-rate total">
            <div className="rate-name">
              <span style={{ cursor: "unset" }}>總評分</span>
            </div>
            <div className="rate">{data.get("rate_avg")}</div>
          </div>
          <CreateRateList />
        </div>
      </li>
      <li className="list-style space">
        <div className="caption">反饋內容</div>
        <div className="info content">
          <div className="info-text">{data.get("content")}</div>
        </div>
      </li>
      <li className="list-style space">
        <div className="caption">標籤</div>
        <div className="info tags">
          <CreateTagList />
        </div>
      </li>
      <li className="list-style">
        <div className="caption">裝置</div>
        <div className="info">{data.get("device")}</div>
      </li>
      <li className="list-style">
        <div className="caption">瀏覽器</div>
        <div className="info">{data.get("browser")}</div>
      </li>
      <li className="list-style">
        <div className="caption">系統</div>
        <div className="info">{data.get("system")}</div>
      </li>
      <li className="list-style">
        <div className="caption">IP</div>
        <div className="info">{data.get("ip")}</div>
      </li>
      <li className="list-style">
        <div className="caption">地區</div>
        <div className="info">{data.get("area")}</div>
      </li>
      <li className="list-style">
        <div className="caption">時間</div>
        <div className="info">
          {isDeleted
            ? moment(
                `${data.get("deleted_at").split("T")[0]} ${
                  data.get("deleted_at").split("T")[1].split("-04:00")[0]
                }`
              ).format("YYYY.MM.DD HH:mm:ss")
            : moment(
                `${data.get("create_at").split("T")[0]} ${
                  data.get("create_at").split("T")[1].split("-04:00")[0]
                }`
              ).format("YYYY.MM.DD HH:mm:ss")}
        </div>
      </li>
    </StyleCreateContent>
  );
};
export default ({
  isDeleted = false,
  gameId = Number(),
  popupNo = {},
  dataList = List(),
  tagList = List(),
  setPopupNo = noop,
  loadingGetFilterGameList = true,
  apiGetFilterGameListData = List(),
  loadingRateListData = true,
  apiRateListData = List(),
}) => {
  const closePop = (e) => {
    e.stopPropagation();
    setPopupNo((prev) => {
      return { ...prev, status: false };
    });
  };
  return (
    <StylePopup>
      <div className="modal" onClick={closePop} />
      <div className="infor-content">
        {!loadingGetFilterGameList && !loadingRateListData && (
          <CreateContent
            closePop={closePop}
            isDeleted={isDeleted}
            gameId={gameId}
            data={popupNo.currentList}
            dataList={dataList}
            tagList={tagList}
            popupNo={popupNo}
            setPopupNo={setPopupNo}
            apiGetFilterGameListData={apiGetFilterGameListData}
            apiRateListData={apiRateListData}
          />
        )}
      </div>
    </StylePopup>
  );
};
