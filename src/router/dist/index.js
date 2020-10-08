"use strict";
exports.__esModule = true;
var React = require("react");
var react_router_dom_1 = require("react-router-dom");
var Home_1 = require("../pages/Home");
// const Home = () => import('../pages/Home')
// Loadable({
//   loader: () => import('../pages/Home'),
//   loading: ReactLoading as any
// })
exports["default"] = (function () { return (React.createElement(react_router_dom_1.HashRouter, null,
    React.createElement(react_router_dom_1.Route, { path: "/home", component: Home_1["default"] }),
    React.createElement(react_router_dom_1.Redirect, { from: "/", to: "/home" }))); });
