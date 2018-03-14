import { IRouterConfig, Router } from "neweb-core";

class BrowserRouter extends Router {
    constructor(protected config: IRouterConfig) {
        super(config);
        this.initialRequest = {
            url: window.location.href,
        };
        window.addEventListener("popstate", (e) => {
            this.navigateToRoute(e.state, undefined);
        }, false);
        this.currentRouteStateEmitter.on(() => this.updateHistoryState());
    }
    public async navigate(href: string, replace?: boolean) {
        await super.navigate(href);
        if (!replace) {
            window.history.pushState(this.currentRoute, "", href);
        } else {
            window.history.replaceState(this.currentRoute, "", href);
        }
    }
    protected updateHistoryState() {
        window.history.replaceState(this.currentRoute, "", this.config.configuration.generateUrl(this.currentRoute));
    }
}
export default BrowserRouter;
