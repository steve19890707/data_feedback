import React, { useState, useEffect } from "react";
import styled from "styled-components";
import colors from "src/constants/colors";

const StyleNav = styled.div`
  max-width:1450px;
  margin: 0 auto;
  .main-title {
    font-size:26px;
    font-weight:bold;
    color: ${colors.getIn(['mainColorA','original'])};
  }
  .subtitle {
    font-size:14px;
    color: ${colors.getIn(['mainColorB','half'])};
    margin-top:15px;
    span {
      display:inline-block;
      margin:0 10px;
    }
  }
`
export default ({
  gameId=String(),
  totalListNum=Number(),
  apiGetFilterGameListData=[]
})=>{
  const [ showGameDetail, setShowGameDetail ] = useState({
    name:"loading...",
  });
  useEffect(()=>{
    const findData = apiGetFilterGameListData.find((value)=>value.get("game_id")===gameId);
    findData && setShowGameDetail({
      name: `${findData.get("game_id")}.${findData.getIn(["name","cn"])}`
    });
  },[ apiGetFilterGameListData, gameId ])
  return(
    <StyleNav>
      <div className="main-title">封存列表({totalListNum}筆)</div>
      <p className="subtitle">遊戲反饋<span>/</span>{showGameDetail.name}<span>/</span>封存列表</p>
    </StyleNav>
  );
};