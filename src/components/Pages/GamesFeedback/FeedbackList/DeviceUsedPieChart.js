import React,{ useRef, useEffect } from "react";
import styled from "styled-components";
import colors from "src/constants/colors";
import { List } from "immutable";
import numeral from "numeral";
import * as d3 from "d3";
import 'd3-selection-multi';

const StyleDeviceUsedDom = styled.div`
  background-color:#fff;
  border-radius:10px;
  box-shadow: 0 10px 20px 0 rgb(4, 8, 73, 0.1);
  margin:0 25px 25px 0;
  .pieChart {
    position: relative;
    padding:15px 25px 16px 25px;
    .center-title {
      position: absolute;
      top:50%;
      left:50%;
      transform:translate(-50%,-50%);
      font-size:18px;
      color:#000;
    }
  }
  .bottom-caption {
    display:flex;
    justify-content:center;
    align-items:center;
    border-top:1px solid #eff3f8;
    li {
      display:flex;
      align-items:center;
      padding:25px 0;
      .dot {
        width:10px;
        height:10px;
        border-radius:50px;
        background-color:#000;
        margin-right:10px;
      }
      span {
        display:inline-block;
        margin-right:15px;
        font-size:14px;
        color:${colors.getIn(['mainColorB','original'])};
      }
      &:last-child {
        span {
          margin-right:0;
        }
      }
    }
  }
`
const pieColors = {
  mobile:colors.getIn(['mainColorD','original']),
  web:colors.getIn(['mainColorC','original']),
  tab:colors.getIn(['mainColorG','original'])
};
const CreateDeviceUsedPieChart = (dataList = List(), Ref)=>{
  d3.select(Ref).select("svg").remove();
  let mobile = Number();
  let web = Number();
  let tab = Number();
  let pieData = {}
  dataList.map((v)=>{
    switch (v.get("device")) {
      case "iPhone" :
        return mobile += v.get("count");
      case "PC" :
        return web += v.get("count");
      case "iPad" :
        return tab += v.get("count");
      default:
        return mobile += v.get("count");
    };
  });
  let dataTotalAmount = mobile+web+tab
  if(mobile > 0){
    pieData = { ...pieData, mobile:mobile}
  }
  if(tab > 0){
    pieData = { ...pieData, tab:tab}
  }
  if(web > 0){
    pieData = { ...pieData, web:web}
  }
  const scalePercentage = d3.scaleLinear()
    .domain([0, dataTotalAmount ])
    .range([0, 100])
  const diameter = 300;
  const paddingWidth = 40;
  const pieSetting = d3.select(Ref).append("svg")
    .attrs({
      "width":diameter,
      "height":diameter
    }).append("g")
      .attrs({
      "transform":"translate("+ diameter/2 +"," +diameter/2+ ")",
    })
  const radius = Math.min(diameter,diameter) / 2 - paddingWidth;
  const pie = d3.pie().sort(null).value((d)=>d.value);
  const pieDataReady = pie(d3.entries(pieData));
  const arc = d3.arc()
    .innerRadius(radius * 0.8)
    .outerRadius(radius * 0.9)
    // .padAngle(.075)
    // .padRadius(75)
  const pieGroup = pieSetting.selectAll('group')
    .data(pieDataReady)
    .enter()
    .append("g");
  pieGroup.append("path")
    .style("transition","0.5s")
    .attrs({
      "d": arc,
      "fill": d=>pieColors[d.data.key],
      "transform":"scale(0)",
    })
    .transition()
    .delay((d,i)=>i*100)
    .style("transform","scale(1)")
  pieGroup.append("text")
    .text(0+"%")
    .style("text-anchor","middle")
    .style("font-size","14px")
    .style("transform","translateY(8px)")
    .attrs({
      "fill": colors.getIn(['mainColorB','original']),
      "x":(d)=> {
        const center = arc.centroid(d);
        return center[0]*1.4
      },
      "y":(d)=> {
        const center = arc.centroid(d);
        return center[1]*1.4
      },
    })
    .transition()
    .duration(800)
    .tween(
      'number',
      function (d) {
        const value = Number(scalePercentage(d.value));
        let node = d3.select(this);
        let i = d3.interpolateNumber(0, value);
        return function (t) {
          node.text(numeral(i(t)).format("0")+"%");
        };
      }
    )  
};
const removeSVG = (Ref)=>{
  d3.select(Ref).select("svg").remove();
  const pieSetting = d3.select(Ref).append("svg");
  pieSetting.attrs({"width": 300,"height": 300});
};
export default ({
  dataList=List()
}) => {
  const deviceUsedPieChartRef = useRef(null);
  useEffect(()=>{
    dataList.size > 0 ?
    CreateDeviceUsedPieChart(
      dataList,
      deviceUsedPieChartRef.current,
    ) : removeSVG(deviceUsedPieChartRef.current)
  },[dataList, deviceUsedPieChartRef])
  return (
    <StyleDeviceUsedDom>
      <div className="pieChart" ref={deviceUsedPieChartRef}>
        <div className="center-title">裝置比例</div>
      </div>
      <ul className="bottom-caption">
        <li><div 
          className="dot"
          style={{"backgroundColor":pieColors.web}}
        ></div><span>桌機</span></li>
        <li><div 
          className="dot"
          style={{"backgroundColor":pieColors.tab}}
        ></div><span>平板電腦</span></li>
        <li><div 
          className="dot"
          style={{"backgroundColor":pieColors.mobile}}
        ></div><span>行動裝置</span></li>
      </ul>
    </StyleDeviceUsedDom>
  );
}