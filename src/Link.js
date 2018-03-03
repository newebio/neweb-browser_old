"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
class Link extends React.Component {
    render() {
        return React.createElement("a", { href: this.props.to, onClick: (e) => {
                e.preventDefault();
                this.context.router.navigate(this.props.to);
            } }, this.props.children);
    }
}
exports.default = Link;
