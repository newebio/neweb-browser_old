import React = require("react");
import ReactDOM = require("react-dom");

import { IConfiguration } from "./..";
import Router from "./Router";
import RouterComponent from "./RouterComponent";

export interface INewebOptions {
    context: any;
}
class Neweb {
    protected router: Router;
    protected context: any;
    constructor(protected configuration: IConfiguration, protected options: INewebOptions) {
        this.context = this.options.context || {};
        this.router = new Router({
            configuration: this.configuration,
            context: this.context,
        });
        this.context.router = this.router;
    }
    public getRouter() {
        return this.router;
    }
    public async render(element: HTMLElement | null) {
        const request = {
            url: window.location.href,
        };
        this.router.run(request);

        ReactDOM.render(React.createElement(RouterComponent, {
            router: this.router,
            context: this.context,
        }), element);
    }
}
export default Neweb;
