import React, { useState, useEffect } from "react";
import styled from "styled-components";
import noop from "lodash/noop";
import cx from "classnames";
import moment from "moment";
import { List, fromJS } from "immutable";
// colors
import colors from "src/constants/colors";
// common
import { ArrowIcons } from "src/components/Common/CommonPart";
// icons
import { IoIosAdd } from "react-icons/io";
import { FiChevronRight, FiCheck } from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs";
// fadeIn
import FadeInList from "src/components/Common/FadeInList";
// api
// import { apiTagUpdate } from "src/api";
const StyledContentRightSide = styled.div`
  .caption-list {
    display: flex;
    align-items: center;
    padding-left: 30px;
    height: 60px;
    background-color: #ffffff;
    border-radius: 0 10px 0 0;
    li {
      font-size: 16px;
      color: ${colors.getIn(["mainColorA", "half"])};
      width: 80px;
      &:nth-child(1) {
        width: 305px;
      }
      &:nth-child(2) {
        width: 120px;
        display: flex;
        align-items: center;
        cursor: pointer;
      }
    }
  }
`;
export const ContentRightSide = ({
  isAechiveList = false,
  data = [],
  orderStatus = {},
  setOrderStatus = noop,
  setOrderBy = noop,
}) => {
  const create = isAechiveList ? `deleted_at` : `created_at`;
  return (
    <StyledContentRightSide>
      <ul className="caption-list">
        <li>反饋內容</li>
        <li
          onClick={() => {
            const status = orderStatus.time;
            if ((!status.up && !status.down) || (status.up && !status.down)) {
              setOrderStatus({
                user_id: { up: false, down: false },
                rate: { up: false, down: false },
                time: { up: false, down: true },
              });
              setOrderBy({ order: create, by: "2" });
            } else {
              setOrderStatus({
                user_id: { up: false, down: false },
                rate: { up: false, down: false },
                time: { up: true, down: false },
              });
              setOrderBy({ order: create, by: "1" });
            }
          }}
        >
          <span>時間(美東)</span>
          <ArrowIcons
            typeup={"active-up"}
            typedown={"active-down"}
            up={orderStatus.time.up}
            down={orderStatus.time.down}
          />
        </li>
        <li>標籤</li>
        <li>查看</li>
      </ul>
      {data}
    </StyledContentRightSide>
  );
};
const StyledCRSContent = styled.ul`
  opacity: 0;
  display: flex;
  align-items: center;
  padding-left: 30px;
  height: 60px;
  background-color: #fff;
  margin-top: 2px;
  &:nth-child(even) {
    background-color: ${colors.getIn(["mainColorC", "five"])};
  }
  &:last-child {
    border-radius: 0 0 10px 0;
    padding-bottom: 8px;
  }
  .list-style {
    font-size: 16px;
    color: ${colors.getIn(["mainColorB", "original"])};
    width: 80px;
    &:nth-child(1) {
      width: 295px;
      height: 100%;
      margin-right: 10px;
      box-sizing: border-box;
      overflow: auto;
      padding: 5px 0;
      .content {
        display: flex;
        align-items: center;
        box-sizing: border-box;
        width: 100%;
        min-height: 100%;
      }
    }
    &:nth-child(2) {
      width: 120px;
    }
    &:nth-child(3) {
      position: relative;
      height: 100%;
      display: flex;
      align-items: center;
      .threedotsvg {
        margin-left: 8px;
        width: 20px;
        height: 20px;
        fill: ${colors.getIn(["mainColorA", "half"])};
        cursor: pointer;
        &.active {
          fill: ${colors.getIn(["mainColorA", "original"])};
        }
        &.whiteList {
          opacity: 0.2;
          cursor: unset;
        }
      }
      .tags-list {
        position: absolute;
        left: 0;
        bottom: calc(0% + 5px);
        transform: translate(calc(-100% + 36px), 100%);
        padding: 10px;
        border-radius: 5px;
        box-shadow: 0 2px 10px 0 rgba(4, 8, 73, 0.2);
        background-color: #fff;
        z-index: 99;
        &:before {
          content: "";
          position: absolute;
          top: 0;
          right: 10px;
          transform: translateY(-100%);
          border: 10px solid transparent;
          border-bottom-color: #fff;
          border-left-width: 8px;
          border-right-width: 8px;
        }
        li {
          position: relative;
          display: flex;
          align-items: center;
          background-color: ${colors.getIn(["backgroundColor"])};
          box-sizing: border-box;
          padding: 8px 31px 8px 8px;
          margin-bottom: 8px;
          border-radius: 5px;
          transition: 0.2s;
          cursor: pointer;
          &:last-child {
            margin-bottom: 0;
          }
          svg {
            position: absolute;
            top: 50%;
            right: 8px;
            transform: translateY(-50%);
            width: 23px;
            height: 23px;
          }
          span {
            display: inline-block;
            white-space: nowrap;
            margin-right: 8px;
            color: ${colors.getIn(["mainColorA", "half"])};
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
          &.update-btn {
            justify-content: center;
            padding: 8px 0;
            color: #fff;
            background: ${colors.getIn(["gradientC"])};
          }
          &.unclick {
            pointer-events: none;
            background: ${colors.getIn(["mainColorA", "ten"])};
          }
        }
      }
    }
    &:last-child {
      .svgWraper {
        width: 32px;
        height: 32px;
        background-color: ${colors.getIn(["mainColorC", "twenty"])};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        svg {
          height: 16px;
          width: 16px;
          stroke-width: 3px;
          color: ${colors.getIn(["mainColorC", "original"])};
        }
        &:hover {
          background-color: ${colors.getIn(["mainColorE", "half"])};
          svg {
            color: #fff;
          }
        }
      }
    }
  }
`;
export const CRSContent = ({
  levelNum = Number(),
  isAechiveList = false,
  tagStatusList = List(),
  datakey = Number(),
  datavalue = List(),
  showItemNum = Number(),
  setShowDataList = noop,
  setPopupNo = noop,
  fetchDataListFun = noop,
  fetchDataFunAnlysis = noop,
}) => {
  const noContent = datavalue.get("content").length > 0 ? false : true;
  const [tagListClass, setTagListClass] = useState(List());
  const [updateTagList, setUpdateTagList] = useState({});
  const timedata = isAechiveList
    ? datavalue.get("deleted_at")
    : datavalue.get("create_at");
  useEffect(() => {
    const list = { original: [], tagId: [] };
    tagStatusList.map((v) => {
      const dataMatch = !!~datavalue.get("tag_id").indexOf(v.get("id"));
      return (
        list.original.push(dataMatch), dataMatch && list.tagId.push(v.get("id"))
      );
    });
    list.original.length > 0 && setUpdateTagList(fromJS(list));
  }, [datavalue, tagStatusList]);
  return (
    <FadeInList showItemNum={showItemNum} index={datakey}>
      <StyledCRSContent>
        <li className="list-style">
          <div className="content">{datavalue.get("content")}</div>
        </li>
        <li className="list-style">
          {moment.parseZone(timedata).format("YYYY.MM.DD")}
        </li>
        <li className="list-style">
          <BsThreeDotsVertical
            className={cx(
              "threedotsvg",
              { active: datavalue.get("tagListOpen") },
              { whiteList: noContent }
            )}
            onClick={() => {
              setTagListClass(List(updateTagList.get("original")));
              if (noContent) {
                return null;
              } else
                return setShowDataList((prev) =>
                  prev.setIn(
                    [datakey, "tagListOpen"],
                    !datavalue.get("tagListOpen")
                  )
                );
            }}
          />
          {datavalue.get("tagListOpen") && (
            <ul className="tags-list">
              {tagStatusList.map((value, key) => {
                if (value.get("id") === 6) {
                  return null;
                } else
                  return (
                    <React.Fragment key={key}>
                      {!isAechiveList && levelNum > 0 ? (
                        <li
                          className={cx({ check: tagListClass.get(key) })}
                          onClick={() => {
                            setTagListClass((prev) =>
                              prev.update(key, (v) => !v)
                            );
                            setUpdateTagList((prev) => {
                              const compare = !!~prev
                                .get("tagId")
                                .indexOf(value.get("id"));
                              const updateArray = compare
                                ? prev
                                    .get("tagId")
                                    .filter((v) => v !== value.get("id"))
                                : prev.get("tagId").push(value.get("id"));
                              return prev.set("tagId", updateArray);
                            });
                          }}
                        >
                          <span>{value.get("name")}</span>
                          {tagListClass.get(key) ? (
                            <FiCheck className="checksvg" />
                          ) : (
                            <IoIosAdd className="addsvg" />
                          )}
                        </li>
                      ) : (
                        <li
                          className={cx({ check: tagListClass.get(key) })}
                          style={{ cursor: "unset" }}
                        >
                          <span>{value.get("name")}</span>
                          {tagListClass.get(key) ? (
                            <FiCheck className="checksvg" />
                          ) : (
                            <IoIosAdd className="addsvg" />
                          )}
                        </li>
                      )}
                    </React.Fragment>
                  );
              })}
              {!isAechiveList && levelNum > 0 && (
                <li
                  className={cx("update-btn", {
                    unclick: !(updateTagList.get("tagId").size > 0),
                  })}
                  onClick={() => {
                    alert("update!");
                    // const data = {
                    //   feedback_id: datavalue.get("id"),
                    //   tag: updateTagList.get("tagId").toJS(),
                    // };
                    // const fetchData = (res) => {
                    //   const preview = res.data;
                    //   const SUCCESS = preview.error_msg === "SUCCESS";
                    //   if (SUCCESS) {
                    //     fetchDataListFun();
                    //     fetchDataFunAnlysis();
                    //   } else return console.error(preview.error_msg);
                    // };
                    // return apiTagUpdate(data)
                    //   .then((res) => fetchData(res))
                    //   .catch((error) => {
                    //     console.error(error);
                    //   });
                  }}
                >
                  送出
                </li>
              )}
            </ul>
          )}
        </li>
        <li className="list-style">
          <div
            className="svgWraper"
            onClick={() => {
              setPopupNo({
                key: datakey,
                status: true,
                currentList: datavalue,
              });
            }}
          >
            <FiChevronRight />
          </div>
        </li>
      </StyledCRSContent>
    </FadeInList>
  );
};
