import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import cx from "classnames";
import colors from "src/constants/colors";
import { TweenMax } from "gsap";
import { List, fromJS } from "immutable";
import numeral from "numeral";
import * as d3 from "d3";
import "d3-selection-multi";
import { useCompare } from "src/components/Common/customeUse/useCompare";
const StyleTotalAmount = styled.div`
  background-color: ${colors.getIn(["mainColorC", "twenty"])};
  border: 1px #fff solid;
  overflow: hidden;
  margin: 0 25px 25px 0;
  border-radius: 10px;
  box-shadow: 0 10px 20px 0 rgb(4, 8, 73, 0.1);
  display: flex;
  align-items: flex-start;
  .left-area {
    padding: 0 40px;
    .caption {
      color: ${colors.getIn(["mainColorB", "original"])};
      font-size: 20px;
      font-weight: bold;
      padding: 40px 0;
    }
    .total {
      font-size: 50px;
      font-weight: bold;
      min-width: 145px;
      color: ${colors.getIn(["mainColorB", "original"])};
    }
  }
  .right-area {
    background-color: #fff;
    min-width: 433px;
    .caption {
      position: relative;
      padding: 40px 0;
      display: flex;
      .text {
        color: ${colors.getIn(["mainColorB", "original"])};
        font-size: 20px;
        font-weight: bold;
        padding-left: 40px;
      }
      &:before {
        content: "%";
        position: absolute;
        bottom: 15px;
        right: 65px;
        color: #949cab;
        font-size: 14px;
      }
    }
    .info {
      display: flex;
      align-items: flex-start;
      height: 202px;
      overflow: auto;
      padding-right: 35px;
      margin-right: 15px;
      margin-bottom: 30px;
      &::-webkit-scrollbar {
        width: 6px;
      }
      &::-webkit-scrollbar-track {
        background: ${colors.getIn(["mainColorC", "ten"])};
        border-radius: 10px;
      }
      &::-webkit-scrollbar-thumb {
        background: ${colors.getIn(["mainColorC", "half"])};
        border-radius: 10px;
      }
      .info-caption {
        margin: 0 35px 0 40px;
        li {
          text-align: right;
          font-size: 14px;
          color: ${colors.getIn(["mainColorA", "twenty"])};
          padding: 3px 0 15px 0;
          margin-bottom: 8px;
          &.isTure {
            color: ${colors.getIn(["mainColorB", "original"])};
          }
          &.none {
            padding: 30px 0;
          }
        }
      }
      .chart {
        font-family: "sans-serif";
      }
    }
    .total {
      display: flex;
      justify-content: flex-end;
      padding: 24px 0;
      border-top: 1px solid #f2f2f2;
      .title {
        font-size: 14px;
        color: #949cab;
        margin-right: 40px;
      }
      .bottom-number {
        display: flex;
        justify-content: space-between;
        width: 250px;
        padding-right: 65px;
        .number {
          color: ${colors.getIn(["mainColorB", "original"])};
          font-size: 14px;
        }
        .hundred {
          color: ${colors.getIn(["mainColorB", "original"])};
          font-size: 14px;
        }
      }
    }
  }
`;
const CreateTotalAmountChart = (
  dataList = List(),
  Ref = null,
  dataTotalTag = Number()
) => {
  d3.select(Ref).select("svg").remove();
  let dataHeight = Number(dataList.size * 40);
  const chartWidth = 250;
  const scaleHeight = d3
    .scaleLinear()
    .domain([0, dataTotalTag])
    .range([0, chartWidth]);
  const scalePercentage = d3
    .scaleLinear()
    .domain([0, dataTotalTag])
    .range([0, 100]);
  const linearChart = d3.select(Ref).append("svg");
  linearChart.attrs({
    width: chartWidth + 10,
    height: dataHeight,
  });
  const groups = linearChart
    .selectAll("g.linearChart")
    .data(dataList.sort((a, b) => a.get("id") - b.get("id")).toArray())
    .enter()
    .append("g");
  groups
    .append("text")
    .style("transform", "translateY(14px)")
    .attrs({
      x: 0,
      y: (d, i) => i * 40,
      "font-size": "14px",
      fill: (d) => {
        const color = !d.get("status")
          ? colors.getIn(["mainColorA", "twenty"])
          : colors.getIn(["mainColorB", "original"]);
        return color;
      },
    })
    .transition()
    .duration(800)
    .tween("number", function (d) {
      const value = d.get("count");
      let node = d3.select(this);
      let i = d3.interpolateNumber(0, value);
      return function (t) {
        node.text(numeral(i(t)).format("0", Math.round));
      };
    });
  groups
    .append("text")
    .style("transform", "translate(-22px,14px)")
    .attrs({
      x: 255,
      y: (d, i) => i * 40,
      "font-size": "14px",
      "font-weight": (d) => {
        const status = !d.get("status") ? "unset" : "bold";
        return status;
      },
      fill: (d) => {
        const color = !d.get("status")
          ? colors.getIn(["mainColorA", "twenty"])
          : colors.getIn(["mainColorB", "original"]);
        return color;
      },
    })
    .transition()
    .duration(800)
    .tween("number", function (d) {
      const value = Number(scalePercentage(d.get("count")));
      let node = d3.select(this);
      let i = d3.interpolateNumber(0, value);
      return function (t) {
        node.text(numeral(i(t)).format("0", Math.round));
      };
    });
  groups
    .append("rect")
    .style("transform-box", "fill-box")
    .style("transform", "translateY(22px)")
    .style("border-radius", "50px")
    .attrs({
      x: 0,
      y: (d, i) => i * 40,
      width: chartWidth,
      fill: colors.getIn(["mainColorC", "ten"]),
      height: 6,
      rx: 3,
    });
  groups
    .append("rect")
    .style("transform-box", "fill-box")
    .style("transform", "translateY(22px)")
    .style("border-radius", "50px")
    .attrs({
      x: 0,
      y: (d, i) => i * 40,
      width: 0,
      fill: (d) => {
        const color = !d.get("status")
          ? colors.getIn(["mainColorC", "twenty"])
          : colors.getIn(["mainColorC", "original"]);
        return color;
      },
      height: 6,
      rx: 3,
    })
    .transition()
    .duration(800)
    .attr("width", (d) => scaleHeight(d.get("count")));
};
const removeSVG = (Ref) => {
  d3.select(Ref).select("svg").remove();
  const linearChart = d3.select(Ref).append("svg");
  linearChart.attrs({ width: 260, height: 0 });
};
export default ({
  chartData = List(),
  DataTotal = Number(),
  tagStatusList = List(),
}) => {
  const preCompare = useCompare(chartData);
  const totalAmountChartRef = useRef(null);
  const [dataCombine, setDataCombine] = useState(null);
  const [animationNumberDTA, setAnimationNumberDTA] = useState(Number());
  const [animationNumberDTT, setAnimationNumberDTT] = useState(Number());
  const dataTotalAmount = DataTotal > 0 ? DataTotal : Number();
  let dataTotalTag = Number();
  chartData.size > 0 &&
    chartData.map((value) => {
      return (dataTotalTag += value.get("count"));
    });
  // TweenMax number
  useEffect(() => {
    const animeData = { number: 0 };
    TweenMax.to(animeData, 0.8, {
      number: dataTotalAmount,
      onUpdate: () => setAnimationNumberDTA(Math.ceil(animeData.number)),
    });
  }, [dataTotalAmount, preCompare]);
  useEffect(() => {
    const animeData = { number: 0 };
    TweenMax.to(animeData, 0.8, {
      number: dataTotalTag,
      onUpdate: () => setAnimationNumberDTT(Math.ceil(animeData.number)),
    });
  }, [dataTotalTag, preCompare]);
  useEffect(() => {
    if (!preCompare && dataCombine !== null) {
      return;
    }
    const list = [];
    chartData.map((value) => {
      return tagStatusList.map((v) => {
        if (v.get("id") === value.get("id")) {
          return list.push({
            id: value.get("id"),
            count: value.get("count"),
            status: v.get("status"),
            name: v.get("name"),
          });
        } else return null;
      });
    });
    list.length > 0 && setDataCombine(fromJS(list));
  }, [chartData, tagStatusList, preCompare, dataCombine]);
  useEffect(() => {
    if (dataCombine !== null) {
      const eachCallback = () => {
        const updateList = [];
        dataCombine.forEach((v) => updateList.push(v.set("count", 0)));
        return fromJS(updateList);
      };
      const updateData = dataTotalTag > 0 ? dataCombine : eachCallback();
      const updateAmount = dataTotalTag > 0 ? dataTotalTag : 100;
      return CreateTotalAmountChart(
        updateData,
        totalAmountChartRef.current,
        updateAmount
      );
    } else return removeSVG(totalAmountChartRef.current);
  }, [dataTotalTag, dataCombine]);
  return (
    <StyleTotalAmount>
      <div className="left-area">
        <div className="caption">反饋總數</div>
        <div className="total">{animationNumberDTA}</div>
      </div>
      <div className="right-area">
        <div className="caption">
          <div className="text">標籤統計</div>
        </div>
        <div className="info">
          <ul className="info-caption">
            {chartData.size > 0 &&
              chartData
                .sort((a, b) => a.get("id") - b.get("id"))
                .map((value) => {
                  return tagStatusList.map((v, k) => {
                    if (v.get("id") === value.get("id")) {
                      return (
                        <li className={cx({ isTure: v.get("status") })} key={k}>
                          {v.get("name")}
                        </li>
                      );
                    } else return null;
                  });
                })}
          </ul>
          <div className="chart" ref={totalAmountChartRef} />
        </div>
        <div className="total">
          <div className="title">總計</div>
          <div className="bottom-number">
            <span className="number">{animationNumberDTT}</span>
            <span className="hundred">100</span>
          </div>
        </div>
      </div>
    </StyleTotalAmount>
  );
};
