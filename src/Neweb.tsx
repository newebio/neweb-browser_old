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
    constructor(protected configuration: IConfiguration, protected options: INewebOptions) {
        this.router = new Router({
            configuration: this.configuration,
            context: options.context,
        });
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
        }), element);
    }
}
export default Neweb;
