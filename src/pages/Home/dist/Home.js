"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var React = require("react");
require("./Home.scss");
var antd_1 = require("antd");
var react_router_dom_1 = require("react-router-dom");
var icons_1 = require("@ant-design/icons");
var uuid_1 = require("uuid");
var ipcRenderer = window.require('electron').ipcRenderer;
var Header = antd_1.Layout.Header, Sider = antd_1.Layout.Sider, Content = antd_1.Layout.Content;
var Home = /** @class */ (function (_super) {
    __extends(Home, _super);
    function Home(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            noteNames: [],
            curItem: '',
            showNameInput: false
        };
        _this.tmpInputName = '';
        /**
         * createNote
         */
        _this.createNote = function () {
            // this.tmpInputName = ''
            // this.setState({ showNameInput: true })
            var self = _this;
            antd_1.Modal.confirm({
                title: '输入新建项名称',
                content: (React.createElement(antd_1.Form, null,
                    React.createElement(antd_1.Form.Item, { label: "Name:", rules: [{ required: true, message: '不可为空' }] },
                        React.createElement(antd_1.Input, { onChange: function (e) { return _this.tmpInputName = e.target.value; } })))),
                onOk: function () {
                    var result = ipcRenderer.sendSync('create-note', self.tmpInputName);
                    if (result) {
                        self.setState({ noteNames: ipcRenderer.sendSync('get-notes') });
                        antd_1.message.success('successful');
                    }
                    else {
                        antd_1.message.error('failed');
                    }
                }
            });
        };
        _this.handleInputBlur = function () {
            var result = ipcRenderer.sendSync('create-note', _this.tmpInputName);
            if (result) {
                _this.setState({ noteNames: ipcRenderer.sendSync('get-notes') });
                antd_1.message.success('successful');
            }
            else {
                antd_1.message.error('failed');
            }
            _this.setState({ showNameInput: false });
        };
        _this.importNote = function () {
        };
        _this.deleteNote = function (name) {
            if (ipcRenderer.sendSync('delete-note', name.split('-')[0])) {
                antd_1.message.success('删除成功');
                _this.setState({ noteNames: ipcRenderer.sendSync('get-notes') });
            }
            else {
                antd_1.message.error('删除失败');
            }
        };
        return _this;
    }
    Home.prototype.componentDidMount = function () {
        this.setState({ noteNames: ipcRenderer.sendSync('get-notes') });
    };
    Home.prototype.render = function () {
        var _this = this;
        var dropdownMenu = (React.createElement(antd_1.Menu, { style: { width: '150px' } },
            this.state.showNameInput
                &&
                    React.createElement(antd_1.Input, { onChange: function (e) { _this.tmpInputName = e.target.value; }, onBlur: this.handleInputBlur, onKeyUp: function (e) { if (e.key === 'Enter')
                            _this.handleInputBlur(); } }),
            this.state.noteNames.length === 0 ?
                React.createElement(antd_1.Menu.Item, { className: "tc p-10" },
                    React.createElement("span", null, "\u5565\u4E5F\u6CA1\u6709"))
                :
                    this.state.noteNames.map(function (v) { return (React.createElement(antd_1.Menu.SubMenu, { title: Buffer.from(v.split('-')[2], 'base64').toString(), key: uuid_1.v4() },
                        React.createElement(antd_1.Menu.Item, null,
                            React.createElement(react_router_dom_1.Link, { to: '/home/' + v.split('-')[0] + '/html' }, "\u67E5\u770B")),
                        React.createElement(antd_1.Menu.Item, null,
                            React.createElement(react_router_dom_1.Link, { to: '/home/' + v.split('-')[0] + '/files' }, "\u6587\u4EF6")),
                        React.createElement(antd_1.Menu.Item, null,
                            React.createElement(react_router_dom_1.Link, { to: '/home/' + v.split('-')[0] + '/tasks' }, "\u4EFB\u52A1")),
                        React.createElement(antd_1.Menu.Item, null,
                            React.createElement("a", { className: "link warning", onClick: function () { return _this.deleteNote(v); } }, "\u5220\u9664")))); }),
            React.createElement(antd_1.Menu.Item, null,
                React.createElement("div", { className: "flex-3 bg-aqua" },
                    React.createElement("a", { className: "link", onClick: this.createNote }, "Create"),
                    React.createElement("span", null, ' or '),
                    React.createElement("a", { className: "link", onClick: this.importNote }, "Import")))));
        return (React.createElement(antd_1.Menu, null,
            React.createElement("div", { className: "header flex-3" },
                React.createElement("div", null),
                React.createElement("div", null,
                    React.createElement(antd_1.Dropdown, { overlay: dropdownMenu },
                        React.createElement("a", { className: "btn p-10", onClick: function (e) { return e.preventDefault(); } },
                            this.state.noteNames.length === 0 ? '空空如也'
                                : this.state.curItem ? Buffer.from(this.state.curItem.split('-')[2], 'base64').toString()
                                    : 'Click To Choose',
                            " ",
                            React.createElement(icons_1.DownOutlined, null)))),
                React.createElement("div", null))));
    };
    return Home;
}(React.Component));
exports["default"] = Home;
