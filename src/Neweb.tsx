import React = require("react");
import ReactDOM = require("react-dom");
import { IConfiguration } from "./..";
import Router from "./Router";
import RouterComponent from "./RouterComponent";

export interface INewebOptions {
    router: Router;
}
class Neweb {
    protected router: Router;
    constructor(protected configuration: IConfiguration, protected options: INewebOptions) {
        this.router = this.options.router;
    }
    public getRouter() {
        return this.router;
    }
    public async render(element: HTMLElement | null) {
        ReactDOM.hydrate(React.createElement(RouterComponent, {
            router: this.router,
        }), element);
    }
}
export default Neweb;
