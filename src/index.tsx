import * as React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import Router from './router'
import * as serviceWorker from './serviceWorker';
import reportWebVitals from './reportWebVitals';
import 'antd/dist/antd.css'
import { message } from 'antd';
message.config({
    duration: 1,
    maxCount: 1
})

ReactDOM.render(
    // <React.StrictMode>
        <Router></Router>
    // </React.StrictMode>,
    ,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();