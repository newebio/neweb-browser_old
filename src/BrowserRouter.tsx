import { IRequest } from "./..";
import Router from "./Router";

class BrowserRouter extends Router {
    public async run() {
        this.initialRequest = {
            url: window.location.href,
        };
        super.run();
        window.addEventListener("popstate", (e) => {
            this.navigateToRoute(e.state);
        }, false);
    }
    public async navigate(href: string, replace?: boolean) {
        await super.navigate(href);
        if (!replace) {
            window.history.pushState(this.currentRoute, "", href);
        } else {
            window.history.replaceState(this.currentRoute, "", href);
        }
    }
    public async resolveFRouteWithNewParams(params: any, level: number) {
        const fRoute = await super.resolveFRouteWithNewParams(params, level);
        this.updateHistoryState();
        return fRoute;
    }
    public updateHistoryState() {
        window.history.replaceState(this.currentRoute, "", this.config.configuration.generateUrl(this.currentRoute));
    }
}
export default BrowserRouter;
