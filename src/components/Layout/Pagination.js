import React, { useState, useEffect } from "react";
import Select from "react-select";
import cx from "classnames";
import styled from "styled-components";
import { usePagination } from "react-pagination-hook";
import colors from "src/constants/colors";
import noop from "lodash/noop";
// icons
import { MdArrowBack, MdArrowForward } from "react-icons/md";
// style
const StylePagination = styled.ul`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 54px;
  margin-top: 50px;
  .itemPer {
    position: absolute;
    margin: 0;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    .select {
      width: 125px;
      margin-right: 10px;
      font-size: 16px;
      color: #818181;
    }
  }
  li {
    margin-right: 15px;
    &.previous {
      margin-right: 25px;
    }
    &.next {
      margin-left: 10px;
    }
    &:last-child {
      margin-right: 0;
    }
    .ellipsis {
      font-size: 16px;
      color: #818181;
    }
    button {
      background-color: transparent;
      display: flex;
      align-items: center;
      cursor: pointer;
      &.number {
        position: relative;
        background-color: #fff;
        width: 30px;
        height: 30px;
        border-radius: 50px;
        span {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 16px;
          color: ${colors.getIn(["mainColorB", "original"])};
        }
      }
      svg {
        width: 20px;
        height: 20px;
        color: ${colors.getIn(["mainColorB", "original"])};
      }
      &.active {
        background-color: ${colors.getIn(["mainColorC", "original"])};
        span {
          color: #fff;
        }
      }
      &.disabled {
        pointer-events: none;
        svg {
          opacity: 0.2;
        }
      }
    }
  }
`;
export default ({
  secondValue = false,
  setCurrentPage = Number(),
  setShowItemNum = noop,
  fetchFun = noop,
  numberOfPages = 1,
  showItemNum = 12,
}) => {
  // page basic setting
  const [initialPage, setInitialPage] = useState(1);
  const [maxButtons, setMaxButtons] = useState(3);
  const { activePage, visiblePieces, goToPage } = usePagination({
    initialPage,
    numberOfPages,
    maxButtons,
  });
  const valueOptions = [
    { value: 12, label: "12" },
    { value: 30, label: "30" },
    { value: 50, label: "50" },
    { value: 100, label: "100" },
  ];
  const valueSecondOptions = [
    { value: 100, label: "100" },
    { value: 500, label: "500" },
    { value: 1000, label: "1000" },
  ];
  const selectStyles = {
    control: (styles) => ({
      ...styles,
      padding: "12px 10px",
      border: "none",
      borderRadius: "10px",
      boxShadow: "0 2px 6px 0 rgba(4, 8, 73, 0.1)",
    }),
    valueContainer: (styles) => ({
      ...styles,
      justifyContent: "center",
    }),
    singleValue: (styles) => ({
      ...styles,
      color: colors.getIn(["mainColorB", "original"]),
    }),
    indicatorSeparator: (styles) => ({
      ...styles,
      display: "none",
    }),
    dropdownIndicator: (styles) => ({
      ...styles,
      padding: "0px",
    }),
  };
  // useEffect
  useEffect(() => {
    goToPage(1);
    setCurrentPage({ start: 1, end: showItemNum });
  }, [numberOfPages, showItemNum, goToPage, setCurrentPage]);
  useEffect(() => {
    initialPage > numberOfPages && setInitialPage(numberOfPages);
  }, [initialPage, numberOfPages]);
  useEffect(() => {
    initialPage > maxButtons && setMaxButtons(maxButtons);
  }, [initialPage, maxButtons]);
  return (
    <StylePagination>
      <li className="itemPer">
        <Select
          className="select"
          styles={selectStyles}
          defaultValue={secondValue ? valueSecondOptions[0] : valueOptions[0]}
          options={secondValue ? valueSecondOptions : valueOptions}
          onChange={(e) => {
            setShowItemNum(e.value);
            fetchFun();
          }}
        />
      </li>
      {visiblePieces.map((value, key) => {
        const { pageNumber } = value;
        const minItem = pageNumber * showItemNum - showItemNum + 1;
        const maxItem = pageNumber * showItemNum;
        if (value.type === "ellipsis") {
          return (
            <li key={key}>
              <div className="ellipsis">...</div>
            </li>
          );
        } else if (value.type === "page-number") {
          const isActive = pageNumber === activePage;
          return (
            <li key={key}>
              <button
                onClick={() => {
                  goToPage(pageNumber);
                  setCurrentPage({
                    start: minItem,
                    end: maxItem,
                  });
                }}
                className={cx("number", { active: isActive })}
              >
                <span>{pageNumber}</span>
              </button>
            </li>
          );
        } else {
          return (
            <li
              key={key}
              className={cx(
                { previous: value.type === "previous" },
                { next: value.type === "next" }
              )}
            >
              <button
                className={cx({ disabled: value.isDisabled })}
                disabled={value.isDisabled}
                onClick={() => {
                  goToPage(pageNumber);
                  setCurrentPage({
                    start: minItem,
                    end: maxItem,
                  });
                }}
              >
                {value.type === "next" ? <MdArrowForward /> : <MdArrowBack />}
              </button>
            </li>
          );
        }
      })}
    </StylePagination>
  );
};
