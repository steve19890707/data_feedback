import React, { useState, useRef } from "react";
import styled from "styled-components";
import cx from "classnames";
import colors from "src/constants/colors";
import moment from "moment";
import { Map } from "immutable";
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const StyleDateRangePicker = styled.div`
  .inputs-area {
    display:flex;
    align-items:center;
    padding:15px;
    background-color:#fff;
    box-shadow:0 0 3px rgb(0,0,0,0.3);
    .caption {
      font-size:12px;
      margin-right:5px;
    }
    .middle {
      margin:0 10px;
      font-size:18px;
    }
    .date-inputs {
      background-color:#eff2f7;
      padding:10px;
      display:flex;
      align-items:center;
      justify-content:center;
      input {
        width:45px;
        font-size:14px;
        padding:5px 10px;
        border-radius:5px;
        box-sizing:border-box;
        border:1px solid transparent;
        color: #000;
        outline:none;
        margin:0 10px;
        box-shadow:0 0 3px rgb(0,0,0,0.3);
        &:focus {
          border:1px solid #3c91fe;
        }
        &::placeholder {
          font-size:14px;
          color: #b1b1b1;
        }
        &:nth-child(1) {
          width:60px;
          margin-left:0;
        }
        &:last-child { margin-right:0;}
        &.error {
          border:1px solid red;
          &:focus {
            border:1px solid red;
          }
        }
      }
    }
  }
  .dateRange-component {
    box-shadow:0 0 3px rgb(0,0,0,0.3);
  }
`
const CreateStartInput = ({
  basicInfo,
  currentRef,
  oppositeRef,
  allStatus,
})=>{
  const { max, type, Ref } = basicInfo
  const { startRefYYYY, startRefMM, startRefDD } = currentRef;
  const { endRefYYYY, endRefMM, endRefDD } = oppositeRef;
  const {  
    selectionRange,
    setSelectionRange,
    startDateTip,
    setStartDateTip  
  } = allStatus
  return (
    <input
      className={cx({ error : startDateTip.get(type)})}
      ref={Ref}
      maxLength={max}
      placeholder={type}
      onKeyDown={(e)=>{
        let previousRef;
        switch (type) {
          case "YYYY":
            previousRef = startRefYYYY
            break;
          case "MM":
            previousRef = startRefYYYY
            break;
          case "DD":
            previousRef = startRefMM
            break;
          default:
            previousRef = null 
        };
        const value = Ref.current.value;
        if(e.keyCode === 8 && value.length === 0){
          previousRef.current.focus()
        }
      }}
      onChange={()=>{
        const value = Ref.current.value;
        const loadTime = moment(selectionRange.startDate).format("YYYY/MM/DD").split("/");
        let newTime;
        switch (type) {
          case "YYYY":
            newTime = moment(new Date(`${value}/01/01 00:00:00`))._d 
            break;
          case "MM":
            newTime = moment(new Date(`${loadTime[0]}/${value}/01 00:00:00`))._d 
            break;
          case "DD":
            newTime = moment(new Date(`${loadTime[0]}/${loadTime[1]}/${value} 00:00:00`))._d 
            break;
          default:
            newTime = moment(new Date(`${loadTime[0]}/${loadTime[1]}/${loadTime[2]} 00:00:00`))._d 
        }
        if(!!~String(newTime).indexOf("Invalid Date") || value.length < max || isNaN(Number(value))){
          if(value.length === max || isNaN(Number(value))){
            let newMap = startDateTip.set(type, true);
            setStartDateTip(newMap) 
          }else{ 
            let newMap = startDateTip.set(type, false);
            setStartDateTip(newMap) 
          }
          return
        }else {
          let nextRef
          if(moment(newTime).isAfter(selectionRange.endDate)){
            setSelectionRange({
              startDate: newTime,
              endDate: newTime,
              key: 'selection',
            });
            const loadNewStarDate = moment(newTime).format("YYYY/MM/DD").split("/");
            endRefYYYY.current.value = loadNewStarDate[0];
            endRefMM.current.value = loadNewStarDate[1];
            endRefDD.current.value = loadNewStarDate[2];
          }else{
            setSelectionRange({
              ...selectionRange,
              startDate: newTime,
            });
          }
          switch (type) {
            case "YYYY":
              nextRef = startRefMM
              break;
            case "MM":
              nextRef = startRefDD
              break;
            case "DD":
              nextRef = endRefYYYY
              break;
            default:
              nextRef = null 
          };
          nextRef.current.focus()
        }                   
      }}
    />
  )
}
const CreateEndInput = ({
  basicInfo,
  currentRef,
  oppositeRef,
  allStatus,
})=>{
  const { max, type, Ref } = basicInfo
  const { startRefYYYY, startRefMM, startRefDD } = currentRef;
  const { endRefYYYY, endRefMM, endRefDD } = oppositeRef;
  const {  
    selectionRange,
    setSelectionRange,
    endDateTip,
    setEndDateTip  
  } = allStatus
  return (
    <input
      className={cx({ error: endDateTip.get(type)})} 
      ref={Ref}
      maxLength={max}
      placeholder={type}
      onKeyDown={(e)=>{
        let previousRef;
        switch (type) {
          case "YYYY":
            previousRef = startRefDD
            break;
          case "MM":
            previousRef = endRefYYYY
            break;
          case "DD":
            previousRef = endRefMM
            break;
          default:
            previousRef = null 
        };
        const value = Ref.current.value;
        if(e.keyCode === 8 && value.length === 0){
          previousRef.current.focus()
        }
      }}
      onChange={()=>{ 
        const loadTime = moment(selectionRange.endDate).format("YYYY/MM/DD").split("/");
        const loadStTime = moment(selectionRange.startDate).format("YYYY/MM/DD").split("/");
        const value = Ref.current.value;
        let newTime;
        switch (type) {
          case "YYYY":
            newTime = moment(new Date(`${value}/${loadStTime[1]}/${loadStTime[2]} 23:59:59`))._d 
            break;
          case "MM":
            newTime = moment(new Date(`${loadTime[0]}/${value}/${loadStTime[2]} 23:59:59`))._d 
            break;
          case "DD":
            newTime = moment(new Date(`${loadTime[0]}/${loadTime[1]}/${value} 23:59:59`))._d 
            break;
          default:
            newTime = moment(new Date(`${loadTime[0]}/${loadTime[1]}/${loadTime[2]} 23:59:59`))._d 
        }
        if(!!~String(newTime).indexOf("Invalid Date") || value.length < max || isNaN(Number(value))){
          if(value.length === max || isNaN(Number(value))){
            let newMap = endDateTip.set(type, true);
            setEndDateTip(newMap) 
          }else{ 
            let newMap = endDateTip.set(type, false);
            setEndDateTip(newMap) 
          }
          return
        }else {
          let nextRef;
          if(moment(newTime).isBefore(selectionRange.startDate)){
            setSelectionRange({
              startDate: newTime,
              endDate: newTime,
              key: 'selection',
            });
            const loadNewStarDate = moment(newTime).format("YYYY/MM/DD").split("/");
            startRefYYYY.current.value = loadNewStarDate[0];
            startRefMM.current.value = loadNewStarDate[1];
            startRefDD.current.value = loadNewStarDate[2];
          }else{
            setSelectionRange({
              ...selectionRange,
              endDate: newTime,
            });
          }
          switch (type) {
            case "YYYY":
              nextRef = endRefMM
              break;
            case "MM":
              nextRef = endRefDD
              break;
            case "DD":
              nextRef = endRefDD
              break;
            default:
              nextRef = null 
          };
          nextRef.current.focus()
        }                   
      }}
    />
  )
}
export default ({
  selectionRange,
  setSelectionRange,
})=>{
  const startRefYYYY = useRef(null);
  const startRefMM = useRef(null);
  const startRefDD = useRef(null);
  const [ startDateTip, setStartDateTip ] = useState(Map({
    YYYY:false,
    MM:false,
    XX:false
  }));
  const endRefYYYY = useRef(null);
  const endRefMM = useRef(null);
  const endRefDD = useRef(null);
  const [ endDateTip, setEndDateTip ] = useState(Map({
    YYYY:false,
    MM:false,
    XX:false
  }));
  return(
    <StyleDateRangePicker>
      <div className="inputs-area">
        <div className="caption">Start:</div>
        <div className="date-inputs">
        <CreateStartInput
          basicInfo={{max:4,type:"YYYY",Ref:startRefYYYY}}
          currentRef={{startRefYYYY,startRefMM,startRefDD}}
          oppositeRef={{endRefYYYY,endRefMM,endRefDD}}
          allStatus={{ 
            selectionRange,
            setSelectionRange,
            startDateTip,
            setStartDateTip
          }}
        />/
        <CreateStartInput
          basicInfo={{max:2,type:"MM",Ref:startRefMM}}
          currentRef={{startRefYYYY,startRefMM,startRefDD}}
          oppositeRef={{endRefYYYY,endRefMM,endRefDD}}
          allStatus={{ 
            selectionRange,
            setSelectionRange,
            startDateTip,
            setStartDateTip
          }}
        />/
        <CreateStartInput
          basicInfo={{max:2,type:"DD",Ref:startRefDD}}
          currentRef={{startRefYYYY,startRefMM,startRefDD}}
          oppositeRef={{endRefYYYY,endRefMM,endRefDD}}
          allStatus={{ 
            selectionRange,
            setSelectionRange,
            startDateTip,
            setStartDateTip
          }}
        />
        </div>
        <div className="middle">~</div>
        <div className="caption">End:</div>
        <div className="date-inputs">
        <CreateEndInput
          basicInfo={{max:4,type:"YYYY",Ref:endRefYYYY}}
          currentRef={{startRefYYYY,startRefMM,startRefDD}}
          oppositeRef={{endRefYYYY,endRefMM,endRefDD}}
          allStatus={{ 
            selectionRange,
            setSelectionRange,
            endDateTip,
            setEndDateTip
          }}
        />/
        <CreateEndInput
          basicInfo={{max:2,type:"MM",Ref:endRefMM}}
          currentRef={{startRefYYYY,startRefMM,startRefDD}}
          oppositeRef={{endRefYYYY,endRefMM,endRefDD}}
          allStatus={{ 
            selectionRange,
            setSelectionRange,
            endDateTip,
            setEndDateTip
          }}
        />/
        <CreateEndInput
          basicInfo={{max:2,type:"DD",Ref:endRefDD}}
          currentRef={{startRefYYYY,startRefMM,startRefDD}}
          oppositeRef={{endRefYYYY,endRefMM,endRefDD}}
          allStatus={{ 
            selectionRange,
            setSelectionRange,
            endDateTip,
            setEndDateTip
          }}
        />
        </div>
      </div>
       <DateRangePicker
          className="dateRange-component"
          ranges={[selectionRange]} 
          rangeColors={[colors.getIn(['mainColorC','original'])]}
          onChange={(e)=>{
            const newStarDate = e.selection.startDate;
            const loadNewStarDate = moment(newStarDate).format("YYYY/MM/DD").split("/");
            const newEndDate = e.selection.endDate;
            const loadNewEndDate = moment(newEndDate).format("YYYY/MM/DD").split("/");
            setSelectionRange({
              startDate: newStarDate,
              endDate: newEndDate,
              key: 'selection',
            });
            startRefYYYY.current.value = loadNewStarDate[0];
            startRefMM.current.value = loadNewStarDate[1];
            startRefDD.current.value = loadNewStarDate[2];
            endRefYYYY.current.value = loadNewEndDate[0];
            endRefMM.current.value = loadNewEndDate[1];
            endRefDD.current.value = loadNewEndDate[2];
          }}
        />
    </StyleDateRangePicker>
  )
}
