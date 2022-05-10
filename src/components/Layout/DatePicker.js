import React, { useState, useRef } from "react";
import styled from "styled-components";
import cx from "classnames";
import colors from "src/constants/colors";
import moment from "moment";
import { Map } from "immutable";
import { Calendar } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const StyleDatePicker = styled.div`
  font-size:0;
  .inputs {
    display:flex;
    align-items:center;
    padding:15px;
    background-color:#eff2f7;
    font-size:14px;
    color:#000;
    .caption { 
      margin-right:10px;
    }
    .date-inputs {
      display:flex;
      align-items:center;
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
`
const CreateDateInput = ({
  basicInfo,
  currentRef,
  allStatus,
})=>{
  const { max, type, Ref } = basicInfo
  const { dateRefYYYY, dateRefMM, dateRefDD } = currentRef;
  const { 
    PickDate,
    setPickDate,
    dateTip,
    setDateTip 
  } = allStatus
  return (
    <input
      className={cx({ error : dateTip.get(type)})}
      ref={Ref}
      maxLength={max}
      placeholder={type}
      onKeyDown={(e)=>{
        let previousRef;
        switch (type) {
          case "YYYY":
            previousRef = dateRefYYYY
            break;
          case "MM":
            previousRef = dateRefYYYY
            break;
          case "DD":
            previousRef = dateRefMM
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
        const loadTime = moment(PickDate).format("YYYY/MM/DD").split("/");
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
            let newMap = dateTip.set(type, true);
            setDateTip(newMap) 
          }else{ 
            let newMap = dateTip.set(type, false);
            setDateTip(newMap) 
          }
          return
        }else {
          setPickDate(newTime);
          let nextRef
          switch (type) {
            case "YYYY":
              nextRef = dateRefMM
              break;
            case "MM":
              nextRef = dateRefDD
              break;
            case "DD":
              nextRef = dateRefDD
              break;
            default:
              nextRef = null 
          };
          nextRef.current.focus()
        }                   
      }}
    />
  )
};
export default ({
  PickDate,
  setPickDate,
})=>{
  const dateRefYYYY = useRef(null);
  const dateRefMM = useRef(null);
  const dateRefDD = useRef(null);
  const [ dateTip, setDateTip ] = useState(Map({
    YYYY:false,
    MM:false,
    XX:false
  }));
  return(
    <StyleDatePicker>
      <div className="inputs">
        <div className="caption">pick date:</div>
        <div className="date-inputs">
          <CreateDateInput
            basicInfo={{max:4,type:"YYYY",Ref:dateRefYYYY}}
            currentRef={{dateRefYYYY,dateRefMM,dateRefDD}}
            allStatus={{
              PickDate,
              setPickDate,
              dateTip,
              setDateTip 
            }}
          />/
          <CreateDateInput
            basicInfo={{max:2,type:"MM",Ref:dateRefMM}}
            currentRef={{dateRefYYYY,dateRefMM,dateRefDD}}
            allStatus={{
              PickDate,
              setPickDate,
              dateTip,
              setDateTip 
            }}
          />/
          <CreateDateInput
            basicInfo={{max:2,type:"DD",Ref:dateRefDD}}
            currentRef={{dateRefYYYY,dateRefMM,dateRefDD}}
            allStatus={{
              PickDate,
              setPickDate,
              dateTip,
              setDateTip 
            }}
          />
        </div>
      </div>
      <Calendar 
        className="calendar"
        date={PickDate}
        color={colors.getIn(['mainColorC','original'])}
        onChange={(e)=>{
          const loadNewDate = moment(e).format("YYYY/MM/DD").split("/");
          dateRefYYYY.current.value = loadNewDate[0];
          dateRefMM.current.value = loadNewDate[1];
          dateRefDD.current.value = loadNewDate[2];
          setPickDate(e);
        }}
      />
    </StyleDatePicker>
  )
}