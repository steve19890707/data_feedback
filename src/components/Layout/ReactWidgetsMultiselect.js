import React from "react";
import styled from "styled-components";
import { isImmutable, List } from "immutable";
import cx from "classnames";
import { noop } from "lodash";
import { Multiselect } from 'react-widgets'
import 'react-widgets/dist/css/react-widgets.css';

const StyledReactWidgetsMultiselect = styled(Multiselect)`
  .rw-multiselect-tag {
    background-color:#e8eaf6;
    color:#56637b;
  }
  input::placeholder {
    color:#ababab;
  }
`;
export default ({
  type="",
  className="",
  disabled=[],
  busy=false,
  data=List(),
  value="",
  onChange=noop
})=> {
  const typeReducer = (type,value=List())=>{
    switch(type) {
      case 'game-edit': 
        return onChange((prev)=>{
          const v = List(value).size > 2 ? prev : value;
          return v;
        });
      default:
        return onChange(value);
    };
  }
  const typeTitleReducer = (type)=>{
    switch(type) {
      case 'game-edit': 
        return '請選擇評分   '
      default:
        return '請選擇遊戲   ';
    };
  }
  return (
  <StyledReactWidgetsMultiselect
    className={cx("react-widgets-multiselect", {
      [className]: className
    })}
    placeholder={typeTitleReducer(type)}
    disabled={isImmutable(disabled) ? disabled.toJS() : disabled}
    valueField="value"
    textField="label"
    busy={busy}
    data={isImmutable(data) ? data.toJS() : data}
    value={isImmutable(value) ? value.toJS() : value}
    onChange={value => typeReducer(type,value)}
  />
  )
}