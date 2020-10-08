"use strict";
exports.__esModule = true;
var React = require("react");
var react_dom_1 = require("react-dom");
require("./index.scss");
var router_1 = require("./router");
var serviceWorker = require("./serviceWorker");
var reportWebVitals_1 = require("./reportWebVitals");
require("antd/dist/antd.css");
react_dom_1["default"].render(React.createElement(React.StrictMode, null,
    React.createElement(router_1["default"], null)), document.getElementById('root'));
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister();
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals_1["default"]();
