import React from "react";
import styled from "styled-components";
import { isImmutable, List } from "immutable";
import cx from "classnames";
import { noop } from "lodash";
// icon
import { IoIosArrowDown } from "react-icons/io";

// refs: https://jquense.github.io/react-widgets/api/DropdownList/
import DropdownList from "react-widgets/lib/DropdownList";

// colors
// import colors from "src/constants/colors"
// style
const StyledReactWidgetsDropdownList = styled(DropdownList)`

`;

const StyledArrowDown = styled(IoIosArrowDown)`
color:#b8b9c3;
width:18px;
height:18px;
`
export default ({
  className = "",
  disabled = false,
  busy = false,
  data = List(),
  value = "",
  onChange = noop
}) => (
  <StyledReactWidgetsDropdownList
    className={cx("react-widgets-dropdown-list", {
      [className]: className
    })}
    disabled={disabled}
    valueField="value"
    textField="label"
    busy={busy}
    data={isImmutable(data) ? data.toJS() : data}
    value={value}
    onChange={({ value }) => onChange(value)}
    selectIcon={<StyledArrowDown/>}
  />
);
