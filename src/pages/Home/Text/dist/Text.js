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
require("./Text.scss");
var antd_1 = require("antd");
var Editor_1 = require("../../../components/Editor");
var icons_1 = require("@ant-design/icons");
var ipcRenderer = window.require('electron').ipcRenderer;
var Header = antd_1.Layout.Header, Content = antd_1.Layout.Content;
var Text = /** @class */ (function (_super) {
    __extends(Text, _super);
    function Text(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            viewMode: true,
            html: '',
            editorWrapperHeight: '0px'
        };
        _this.contentChanged = false;
        _this.save = function () {
            if (!_this.contentChanged)
                return;
            if (ipcRenderer.sendSync('alter-note', _this.props.match.params.id, { html: _this.state.html })) {
                antd_1.message.success('保存成功', 0.3);
                _this.contentChanged = false;
            }
            else {
                antd_1.message.error('保存失败', 0.5);
            }
        };
        return _this;
    }
    Text.prototype.componentDidMount = function () {
        var _this = this;
        var self = this;
        this.setState({
            html: ipcRenderer.sendSync('get-note', this.props.match.params.id).html
        });
        ipcRenderer.on('save', function () {
            self.save();
        });
        var h = document.body.clientHeight - 64 - 34;
        console.log('resize:', h);
        this.setState({ editorWrapperHeight: h + 'px' });
        window.addEventListener('resize', function () {
            var h = document.body.clientHeight - 64 - 34;
            console.log('resize:', h);
            _this.setState({ editorWrapperHeight: h + 'px' });
        });
    };
    Text.prototype.render = function () {
        var _this = this;
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "h-100" },
                React.createElement("div", { className: "txt-r bg-primary-l" },
                    React.createElement(antd_1.Radio.Group, { size: "small", defaultValue: this.state.viewMode, onChange: function (e) { return _this.setState({ viewMode: e.target.value }); } },
                        React.createElement(antd_1.Radio.Button, { value: true },
                            React.createElement(icons_1.EyeOutlined, null)),
                        React.createElement(antd_1.Radio.Button, { value: false },
                            React.createElement(icons_1.EditOutlined, null)))),
                React.createElement("div", null,
                    React.createElement("div", { className: "p-10", dangerouslySetInnerHTML: { __html: this.state.html }, style: { display: this.state.viewMode ? 'block' : 'none' } }),
                    React.createElement("div", { style: { display: !this.state.viewMode ? 'block' : 'none', height: this.state.editorWrapperHeight }, className: "editor-wrapper" },
                        React.createElement(Editor_1["default"], { onChange: function (e) { _this.setState({ html: e }); _this.contentChanged = true; }, html: this.state.html }))))));
    };
    return Text;
}(React.Component));
exports["default"] = Text;
