import React,{ useState, useRef, useEffect } from "react";
import styled from "styled-components";
import colors from "src/constants/colors";
import { TweenMax } from 'gsap';
import { List } from "immutable";
import numeral from "numeral";
import * as d3 from "d3";
import 'd3-selection-multi';
// icons
import { IoMdClose } from "react-icons/io";
import { TiInfoLarge } from "react-icons/ti";

const StyleScoringStatistics = styled.div`
  background-color:#fff;
  margin-bottom: 25px;
  border-radius:10px;
  box-shadow: 0 10px 20px 0 rgb(4, 8, 73, 0.1);
  .caption {
    position: relative;
    box-sizing:border-box;
    padding:44px 40px 34px 40px;
    .caption-content {
      position: relative;
      display: inline-block;
      span {
        display: inline-block;
        vertical-align: middle;
        font-size:20px;
        font-weight: bold;
        color:${colors.getIn(['mainColorB','original'])};
      }
      .infoSvg {
        display: inline-block;
        vertical-align: middle;
        position: relative;
        width:22px;
        height:22px;
        border-radius:50%;
        background: ${colors.get('gradientB')};
        box-shadow: 0 5px 20px 0 rgba(4, 8, 73, 0.2);
        margin-left:8px;
        transition:.2s;
        cursor: pointer;
        svg {
          position: absolute;
          top:50%;
          left:50%;
          transform:translate(-50%,-50%);
          width:20px;
          height:20px;
          fill: ${colors.get('backgroundColor')};
        }
        &:hover {
          opacity:0.8;
        }
      }
      .inside-popup {
        @keyframes popupShow {
          0% { opacity:0 }
          100% { opacity:1 }
        }
        position: absolute;
        left:calc(100% - 40px);
        top:calc(100% + 15px);
        background-color:${colors.getIn(['mainColorA','original'])};
        z-index:100;
        border-radius:5px;
        box-shadow:0 0 5px rgb(0,0,0,0.6);
        animation: popupShow .3s;
        &:before {
          content:'';
          position: absolute;
          top:0;
          left:20px;
          border-top:8px solid transparent;
          border-left:8px solid transparent;
          border-bottom:8px solid #1c2231;
          border-right:8px solid transparent;
          transform:translateY(-100%);
        }
        .content {
          position: relative;
          padding:40px;
          min-width: 250px;
          box-sizing:border-box;
          .close {
            position: absolute;
            top:15px;
            right:15px;
            width:25px;
            height:25px;
            fill:${colors.getIn(['mainColorD','original'])};
            transition:.2s;
            cursor: pointer;
            &:hover {
              fill:#83acff;
            }
          }
          .ip-caption {
            text-transform:uppercase;
            font-size:16px;
            color:#fff;
            padding-bottom:20px;
            letter-spacing:.5px;
          }
          .ip-list {
            display:flex;
            align-items:center;
            margin-bottom:10px;
            &:last-child { margin-bottom:0%; }
            span {
              font-size:14px;
              color:#9597ba;
              letter-spacing:.5px;
            }
            .spacing {
              color:#9597ba;
              margin:0 5px;
            }
          }
        }     
      }
    }
    &:before {
      content:'%';
      position: absolute;
      bottom:15px;
      right:50px;
      color:#c2c4c9;
      font-size:14px;
    }
  }
  .chart {
    font-family: "sans-serif";
    padding:0 40px 15px 40px;
    min-height: 202px;
  }
  .bottom-caption {
    display:flex;
    justify-content:space-between;
    align-items:center;
    border-top:1px solid #eff3f8;
    margin-top:15px;
    padding:16px 40px;
    .text {
      font-size:16px;
      color:${colors.getIn(['mainColorB','original'])};
    }
    .number {
      font-size:32px;
      color:${colors.getIn(['mainColorC','original'])};
      font-weight:bold;
    }
  }
`
const CreateScoringStatisticsChart = (
  dataList = List(),
  Ref
) => {
  d3.select(Ref).select("svg").remove();
  let rateOne = Number(),
    rateTwo = Number(),
    rateThree = Number(),
    rateFour = Number(),
    ratefive = Number();
  const sortList = dataList
  .filter(v=>v.get("rate")!==0)
  .sort((a,b)=>b.get("rate") - a.get("rate"))
  sortList.map((v)=>{
    switch (v.get("rate")) {
      case 1 :
        return rateOne = v.get("count");
      case 2 :
        return rateTwo = v.get("count");
      case 3 :
        return rateThree = v.get("count");
      case 4 :
        return rateFour = v.get("count");
      case 5 :
        return ratefive = v.get("count");
      default:
        break;
    }
    return null
  });
  let dataTotalAmount = 
    rateOne+rateTwo+rateThree+rateFour+ratefive === 0 ? 100 : 
    rateOne+rateTwo+rateThree+rateFour+ratefive
  let dataHeight = Number(sortList.size * 40);
  const chartWidth = 300;
  const scaleWidth = d3.scaleLinear()
    .domain([0, dataTotalAmount])
    .range([0, chartWidth])
  const scalePercentage = d3.scaleLinear()
    .domain([0, dataTotalAmount])
    .range([0, 100])
  const linearChart = d3.select(Ref).append("svg");
  linearChart.attrs({
    "width": chartWidth+10,
    "height": dataHeight
  });
  const groups = linearChart.selectAll("g.linearChart")
    .data(sortList.toArray())
    .enter()
    .append("g")
  groups.append("text")
    .style("transform", "translateY(14px)")
    .text((d)=> `${d.get("rate")} 星` )
    .attrs({
      "x": 0,
      "y": (d, i) => i * 40,
      "font-size": "14px",
      "fill": colors.getIn(['mainColorB','original']),
    })
  groups.append("text")
    .style("transform", "translate(-22px,14px)")
    .attrs({
      "x": 305,
      "y": (d, i) => i * 40,
      "font-size": "14px",
      "font-weight": "bold",
      "fill": colors.getIn(['mainColorB','original']),
    })
    .transition()
    .duration(800)
    .tween(
      'number',
      function (d) {
        const value = Number(scalePercentage(d.get("count")));
        let node = d3.select(this);
        let i = d3.interpolateNumber(0, value);
        return function (t) {
          node.text(numeral(i(t)).format("0", Math.round));
        };
      }
    );
  groups.append("rect")
    .style("transform-box", "fill-box")
    .style("transform", "translateY(22px)")
    .style("border-radius", "50px")
    .attrs({
      "x": 0,
      "y": (d, i) => i * 40,
      "width": chartWidth,
      "fill": colors.getIn(['mainColorC','ten']),
      "height": 6,
      "rx": 3,
    })
  groups.append("rect")
    .style("transform-box", "fill-box")
    .style("transform", "translateY(22px)")
    .style("border-radius", "50px")
    .attrs({
      "x": 0,
      "y": (d, i) => i * 40,
      "width": 0,
      "fill": colors.getIn(['mainColorC','original']),
      "height": 6,
      "rx": 3,
    })
    .transition()
    .duration(800)
    .attr("width", (d) => scaleWidth(d.get("count")))
  // groups.append("circle")
  //   .style("transform-box", "fill-box")
  //   .style("transform", "translate(7.5px,25px)")
  //   .attrs({
  //     "cx": 0,
  //     "cy": (d, i) => i * 40,
  //     "r": 6,
  //     "stroke-width": 3,
  //     "stroke": "#4e88fc",
  //     "fill": "#fff"
  //   })
  //   .transition()
  //   .duration(800)
  //   .attr("cx", (d) => {
  //     if(Math.sign(scaleWidth(d.get("count"))-6) === -1){
  //       return 0
  //     }else {
  //       return scaleWidth(d.get("count"))-6
  //     }
  //   });
}
const removeSVG = (Ref)=>{
  d3.select(Ref).select("svg").remove();
  const linearChart = d3.select(Ref).append("svg");
  linearChart.attrs({"width": 310,"height": 0});
}
export default ({
  dataList=List()
}) => {
  const scoringStatisticsRef = useRef(null);
  const [ openTitlePopup, setOpenTitlePopup ] = useState(false);
  const [ animationNumberSSA, setAnimationNumberSSA ] = useState({ number: 0 });
  const [ resultAmount, setResultAmount ] = useState(Number())
  useEffect(()=>{
    let rateOne = Number(),
        rateTwo = Number(),
        rateThree = Number(),
        rateFour = Number(),
        ratefive = Number();
    dataList.size > 0 &&
    dataList.map((v)=>{
      switch (v.get("rate")) {
        case 1 :
          return rateOne = v.get("count");
        case 2 :
          return rateTwo = v.get("count");
        case 3 :
          return rateThree = v.get("count");
        case 4 :
          return rateFour = v.get("count");
        case 5 :
          return ratefive = v.get("count");
        default:
          break;
      }
      return null
    });
    let dataTotalAmount = 
      rateOne+
      rateTwo*2+
      rateThree*3+
      rateFour*4+
      ratefive*5
    let fullMarksAmount = 
      (
        rateOne+
        rateTwo+
        rateThree+
        rateFour+
        ratefive
      ) * 5
    setResultAmount(numeral((dataTotalAmount / fullMarksAmount)*5).format("0.0"))
    TweenMax.to(animationNumberSSA, 0.8, {
      number: resultAmount,
      onUpdate: () => {
        setAnimationNumberSSA({
          number: numeral(animationNumberSSA.number).format("0.0")
        })
      },
    });
  // eslint-disable-next-line
  },[dataList, resultAmount])
  useEffect(()=>{
    dataList.size > 0 ?
    CreateScoringStatisticsChart(
      dataList,
      scoringStatisticsRef.current,
    ) : removeSVG(scoringStatisticsRef.current)
  },[dataList, scoringStatisticsRef])
  return (
    <StyleScoringStatistics>
      <div className="caption">
        <div className="caption-content">
          <span>總評分</span>
          <div
            className="infoSvg"
            onClick={()=>{ setOpenTitlePopup(!openTitlePopup) }}
          >
            <TiInfoLarge/>
          </div>
          {
            openTitlePopup &&
            <div className="inside-popup">
              <div className="content">
                <IoMdClose
                  className="close"
                  onClick={()=>{ setOpenTitlePopup(false) }}
                />
                <div className="ip-caption">總評分說明</div>
                {
                  [1,2,3,4,5].map((v,key)=>{
                    if(v === 5){
                      return <div key={key} className="ip-list">
                        <span>5星：</span>
                        <span>滿分分數</span>
                      </div>
                    }else {
                      return <div key={key} className="ip-list">
                        <span>{`${v}星：`}</span>
                        <span className="spacing">{v}~{v}.9</span>
                        <span>分數</span>
                      </div>
                    }
                  })
                }
              </div>
            </div>
          }
        </div>
      </div>
      <div className="chart" ref={scoringStatisticsRef}></div>
      <ul className="bottom-caption">
        <li className="text">平均分數</li>
        <li className="number">{animationNumberSSA.number}</li>
      </ul>
    </StyleScoringStatistics>
  );
}