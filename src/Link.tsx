import React = require("react");
class Link extends React.Component<{
    to: string;
}, {}> {
    public render() {
        return <a href={this.props.to} onClick={(e) => {
            e.preventDefault();
            this.context.router.navigate(this.props.to);
        }}>{this.props.children}</a>;
    }
}
export default Link;
