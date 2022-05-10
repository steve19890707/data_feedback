import React from "react";
import styled from "styled-components";
import colors from "src/constants/colors";
import { IoIosAdd } from "react-icons/io";
import cx from "classnames";
// spinners
import { BeatLoader } from "react-spinners";
// icons
import { MdArrowDropUp, MdArrowDropDown } from "react-icons/md";

const StyleEditButton = styled.button`
  display:flex;
  justify-content:center;
  align-items:center;
  padding:5px 15px;
  border-radius:50px;
  background-color:${colors.getIn(['mainColorC', 'twenty'])};
  box-shadow: 0 0 5px transparent;
  transition:.2s;
  cursor: pointer;
  svg {
    width:18px;
    height:18px;
    margin-right:5px;
    stroke-width:1px;
    color:${colors.getIn(['mainColorC', 'original'])};
  }
  span {
    color:${colors.getIn(['mainColorC', 'original'])};
    font-size:14px;
  }
  &:hover {
    box-shadow: 0 0 5px ${colors.getIn(['mainColorC', 'original'])};
  }
`
const StyleConfirmButton = styled.button`
  padding:12px 24px;
  border-radius:5px;
  color:#fff;
  font-size:14px;
  background:${colors.get("gradientB")};
  box-shadow:0 0 5px transparent;
  transition:.2s;
  cursor: pointer;
  &.unset {
    background:#dcdbfd;
    pointer-events:none;
  }
  &:hover {
    box-shadow:0 0 5px ${colors.getIn(['mainColorB', 'half'])};
  }
`
const StyleCancelButton = styled.button`
  padding:12px 24px;
  border-radius:5px;
  color:${colors.getIn(['mainColorB', 'half'])};
  font-size:14px;
  background:#fff;
  box-shadow:0 0 5px ${colors.getIn(['mainColorA', 'twenty'])};
  transition:.2s;
  cursor: pointer;
  &:hover {
    box-shadow:0 0 5px ${colors.getIn(['mainColorA', 'half'])};
  }
`
const StyleAddOtherTagButton = styled.button`
  display:flex;
  justify-content: center;
  align-items:center;
  padding:12px 20px;
  border-radius:10px;
  background:${colors.get("gradientC")};
  box-shadow:0 0 10px ${colors.getIn(['mainColorA', 'twenty'])};
  transition:.2s;
  cursor: pointer;
  svg {
    width:24px;
    height:24px;
    margin-right:5px;
    fill:#fff;
  }
  span {
    display:block;
    color:#fff;
    font-size:14px;
    margin-right:5px;
  }
  &:hover {
    box-shadow:0 0 10px ${colors.getIn(['mainColorA', 'half'])};
  }
`
const StyleLoader = styled.li`
  width:100%;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:25px 0;
  color:${colors.getIn(['mainColorB','original'])};
  background-color:${colors.getIn(['mainColorC','five'])};
  box-shadow: 0 10px 20px 0 rgba(4, 8, 73, 0.1);
  border-radius:0 0 10px 10px;
`
export const EditButton = ({ onClick, title, svg }) => {
  return (
    <StyleEditButton
      onClick={onClick}
    >
      {svg}
      <span>{title}</span>
    </StyleEditButton>
  )
};
export const ConfirmButton = ({ onClick, className, disabled }) => {
  return (
    <StyleConfirmButton
      disabled={disabled}
      onClick={onClick}
      className={className}
    >確定</StyleConfirmButton>
  )
};
export const CancelButton = ({ onClick, className }) => {
  return (
    <StyleCancelButton
      onClick={onClick}
      className={className}
    >取消</StyleCancelButton>
  )
};
export const AddOtherTagButton = ({ onClick, title, className }) => {
  return (
    <StyleAddOtherTagButton
      className={className}
      onClick={onClick}
    >
      <IoIosAdd />
      <span>{title}</span>
    </StyleAddOtherTagButton>
  )
}
export const LiLoader = ({ status=true, text='' })=>{
  return (
    <StyleLoader>
      {
        status ?
        <BeatLoader 
          size={10}
          margin={3}
          color={colors.getIn(['mainColorC','original'])}
        /> : text
      }
    </StyleLoader>
  )
}

const StyledCheckbox = styled.label`
  display:flex;
  align-items:center;
  cursor: pointer;
  /* box-sizing:border-box; */
  .square {
  width: 20px;
  height: 20px;
  position: relative;
  display: flex;
  transition: color 250ms cubic-bezier(.4,.0,.23,1);
    >span{
      display: flex;
      justify-content: center;
      align-items: center;
      width: 18px;
      height: 17px;
      background: transparent;
      border: 2px solid ${colors.getIn(['mainColorC', 'half'])};
      border-radius: 5px;
      cursor: pointer;
      transition: all 250ms cubic-bezier(.4,.0,.23,1);
    }
  }
  &.active {
    .square {
      >span{
      width: 0px;
      height: 0px;
        border: 10px solid ${colors.getIn(['mainColorC', 'original'])};
        animation: shrink-bounce 200ms cubic-bezier(.4,.0,.23,1);
      &::before {
        content: "";
        position: absolute;
        top:13px;
        left:5px;
        border-right: 3px solid transparent;
        border-bottom: 3px solid transparent;
        transform: rotate(45deg);
        transform-origin: 0% 100%;
        animation: checkbox-check 125ms 250ms cubic-bezier(.4,.0,.23,1) forwards;
      }
        @keyframes checkbox-check{
          0%{
            width: 0;
            height: 0;
            border-color: #ffffff;
            transform: translate3d(0,0,0) rotate(45deg);
          }
          33%{
            width: .2em;
            height: 0;
            transform: translate3d(0,-.3em,0) rotate(45deg);
          }
          100%{    
            width: .2em;
            height: .4em;    
            border-color: #ffffff;
            transform: translate3d(0,-.7em,0) rotate(45deg);
          }
        }
      }
      @keyframes shrink-bounce{
        0%{
          transform: scale(1);
        }
        33%{    
          transform: scale(.85);
        }
        100%{
          transform: scale(1);    
        }
      }
    }
  }
`
export const CheckBox = ({ className, active , onClick }) => {
  return <StyledCheckbox className={cx(className, { active })}
    onClick={onClick}
  >
    <div className="square">
      <span />
    </div>
  </StyledCheckbox>
};
const StyleArrowIcons = styled.div`
  position: relative;
  margin-left:2px;
  width:21px;
  height:21px;
  svg {
    position: absolute;
    width:21px;
    height:21px;
  };
  .up-arrow {
    bottom:3px;
    left:0;
    color:#bbc0cf;
  }
  .down-arrow {
    top:3px;
    left:0;
    color:#bbc0cf;
  }
  &.active-up {
    .down-arrow {
      color:#bbc0cf;
    }
    .up-arrow {
      color:${colors.getIn(['mainColorC', 'original'])};
    }
  }
  &.active-down {
    .down-arrow {
      color:${colors.getIn(['mainColorC', 'original'])};
    }
    .up-arrow {
      color:#bbc0cf;
    }
  }
`
export const ArrowIcons = ({ up=false, down=false, typeup, typedown })=>{
  return (
    <StyleArrowIcons className={cx({ [typeup] : up},{ [typedown] : down})}>
      <MdArrowDropUp className="up-arrow"/>
      <MdArrowDropDown className="down-arrow"/>
    </StyleArrowIcons>
  )
};