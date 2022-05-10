import { fromJS } from "immutable";

export default fromJS({
  // dark blue
  mainColorA:{
    original:`#040849`,
    half:`#8e90ad`,
    twenty:`#cdcedb`,
    ten:`#e5e6ec`
  },
  gradientA:`linear-gradient(to bottom, #2e2e96, #040849)`,
  // grey blue
  mainColorB:{
    original:`#42578f`,
    half:`#a0abc7`,
    twenty:`#d9dde9`,
  },
  gradientB:`linear-gradient(256deg, #9d96fb, #645df6)`,
  // purple
  mainColorC:{
    original:`#645df6`,
    half:`#b1aefa`,
    twenty:`#e0dffd`,
    ten:`#efeefe`,
    five:`#f7f7fe`
  },
  gradientC:`linear-gradient(254deg, #4cd3cf, #17aca8)`,
  // green
  mainColorD:{
    original:`#4cd3cf`,
    twenty:`#dbf6f5`,
  },
  // blue
  mainColorE:{
    original:`#4e8afb`,
    twenty:`#dce8fe`,
    half:'#4d8afb80'
  },
  // orange
  mainColorF:{
    original:`#fb9f00`,
    twenty:`#ffecd5`,
  },
  // red
  mainColorG:{
    original:`#ff6594`,
    twenty:`#ffe0ea`,
  },
  backgroundColor:`#eceffb`,
  backgroundColor_half:`#f5f7fd`
})