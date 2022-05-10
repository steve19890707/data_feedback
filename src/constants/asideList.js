import { fromJS } from "immutable";

export default fromJS([
  {
    routeName: "遊戲反饋",
    route:"/game-feedback",
    children:false,
    insideChildrenRoute:"/game-feedback/details/",
    insideChildren:true,
    insideChildrenLink:[
      {
        routeName: "反饋列表",
        route:"/game-feedback/details/feedback-list/",
      },
      {
        routeName: "封存列表",
        route:"/game-feedback/details/archive-list/",
      }
    ],
  },
]);