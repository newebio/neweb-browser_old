import React = require("react");
import ReactDOM = require("react-dom");
import { IConfiguration } from "./..";
import Router from "./Router";
import RouterComponent from "./RouterComponent";

export interface INewebOptions {
    context: any;
    router: Router;
}
class Neweb {
    protected router: Router;
    protected context: any;
    constructor(protected configuration: IConfiguration, protected options: INewebOptions) {
        this.context = this.options.context || {};
        this.router = this.options.router;
        this.context.router = this.router;
        this.context.currentRoute = this.router.getCurrentRouteEmitter();
    }
    public getRouter() {
        return this.router;
    }
    public async render(element: HTMLElement | null) {
        ReactDOM.hydrate(React.createElement(RouterComponent, {
            router: this.router,
            context: this.context,
        }), element);
    }
}
export default Neweb;
