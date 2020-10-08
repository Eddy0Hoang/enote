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
require("./Editor.css");
var wangeditor_1 = require("wangeditor");
var Editor = /** @class */ (function (_super) {
    __extends(Editor, _super);
    function Editor(props) {
        var _this = _super.call(this, props) || this;
        _this.editorRef = React.createRef();
        _this.editor = null;
        return _this;
    }
    Editor.prototype.componentDidMount = function () {
        var _this = this;
        var editorEle = this.editorRef.current;
        var editor = new wangeditor_1["default"](editorEle);
        editor.customConfig.uploadImgServer = 'http://localhost:9010/upload';
        editor.customConfig.onchange = function (html) {
            _this.props.onChange && _this.props.onChange(html);
        };
        editor.create();
        this.editor = editor;
    };
    Editor.prototype.render = function () {
        this.props.html && this.editor.txt.html(this.props.html);
        return (React.createElement("div", { className: "editor h-100", ref: this.editorRef }));
    };
    return Editor;
}(React.Component));
exports["default"] = Editor;
