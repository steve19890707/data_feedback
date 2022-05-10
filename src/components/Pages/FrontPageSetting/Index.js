import React, { useState } from "react";
import { withRouter } from "react-router";
import styled from "styled-components";
import Switch from "react-switch";
// fadeIn
import FadeInList from "src/components/Common/FadeInList";
// colors
import colors from "src/constants/colors";
// // api
// import { apiSetting, apiSettingUpdate } from "src/api";
import { fromJS } from "immutable";
// style
const StyleFrontPageSetting = styled.div`
  max-width: 1450px;
  margin: 0 auto;
  box-sizing: border-box;
  padding: 50px 75px;
  min-height: 100vh;
  .main-title {
    font-size: 26px;
    font-weight: bold;
    color: #181f3a;
    margin-bottom: 45px;
    padding-bottom: 20px;
    border-bottom: 1px solid ${colors.getIn(["mainColorB", "twenty"])};
  }
`;
const StyleList = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 45px;
  &:last-child {
    margin-bottom: 0;
  }
  .name {
    font-size: 18px;
    font-weight: bold;
    color: ${colors.getIn(["mainColorB", "original"])};
    margin-right: 150px;
  }
`;
export default withRouter(({ history, location: { pathname } }) => {
  // const {
  //   fetchApiFunc: fetchSettingData,
  //   isLoading: loadingGetSettingData,
  //   fetchData: apiGetSettingData,
  // } = apiSetting();
  const loadingGetSettingData = false;
  const apiGetSettingData = fromJS([
    {
      name: "maintain",
      value: false,
    },
  ]);
  // const [apiIsLoding, setApiIsLoding] = useState(false);
  const [switchStatus, setSwitchStatus] = useState(false);
  return (
    <StyleFrontPageSetting>
      <p className="main-title">設定清單</p>
      <ul className="settingContent">
        {!loadingGetSettingData &&
          apiGetSettingData.map((value, key) => {
            return (
              <FadeInList
                showItemNum={apiGetSettingData.size}
                index={key}
                key={key}
              >
                <StyleList>
                  <div className="name">{value.get("name")}</div>
                  <Switch
                    className="switch"
                    // checked={value.get("value")}
                    checked={switchStatus}
                    checkedIcon={false}
                    uncheckedIcon={false}
                    offColor={colors.getIn(["mainColorC", "twenty"])}
                    onColor={colors.getIn(["mainColorC", "original"])}
                    handleDiameter={20}
                    height={24}
                    width={42}
                    boxShadow={
                      value.get("value")
                        ? "0 0 2px rgb(0,0,0,0.5)"
                        : "0 0 0 #000"
                    }
                    onChange={() => {
                      setSwitchStatus((prev) => !prev);
                      alert("update!");
                      // const open = window.confirm(`確定 啟用/關閉 嗎?`);
                      // if (open) {
                      //   setApiIsLoding(true);
                      //   const data = {
                      //     name: value.get("name"),
                      //     value: !value.get("value"),
                      //   };
                      //   !apiIsLoding &&
                      //     apiSettingUpdate(data)
                      //       .then((res) => {
                      //         const preview = res.data;
                      //         const SUCCESS = preview.error_msg === "SUCCESS";
                      //         if (SUCCESS) {
                      //           setApiIsLoding(false);
                      //           fetchSettingData();
                      //         } else {
                      //           console.error(preview.error_msg);
                      //         }
                      //       })
                      //       .catch((error) => {
                      //         console.error(error);
                      //       });
                      // } else return setTimeout(() => fetchSettingData());
                    }}
                  />
                </StyleList>
              </FadeInList>
            );
          })}
      </ul>
    </StyleFrontPageSetting>
  );
});
