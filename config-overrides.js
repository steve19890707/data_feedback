const { override, addWebpackAlias } = require('customize-cra');
const path = require('path');

module.exports = override(
  addWebpackAlias({
    ["src"]: path.resolve(__dirname, "./src/"),
    ["feedbackContentComponents"]: path.resolve(__dirname, "./src/components/Pages/GamesFeedback/CreateContentComponents/"),
    ["~"]: path.resolve(__dirname, "./"),
  }),
);