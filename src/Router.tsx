import o, { Onemitter } from "onemitter";
import { IConfiguration, IFRoute, IRequest, IRoute } from "..";

export interface IRouterConfig {
    configuration: IConfiguration;
    context: any;
}

class Router {
    protected currentRouteEmitter: Onemitter<IFRoute>;
    protected currentRoute: IRoute;
    constructor(protected config: IRouterConfig) {
        this.currentRouteEmitter = o();
    }
    public getEmitter() {
        return this.currentRouteEmitter;
    }
    public async run(initialRequest: IRequest) {
        await this.navigate(initialRequest.url, false);
        window.addEventListener("popstate", (e) => {
            this.navigateToRoute(e.state);
        }, false);
    }
    public async navigate(href: string, replace?: boolean) {
        const route = await this.config.configuration.resolveRoute({ url: href });
        this.navigateToRoute(route);
        if (!replace) {
            window.history.pushState(route, "", href);
        } else {
            window.history.replaceState(route, "", href);
        }
    }
    public async navigateToRoute(route: IRoute) {
        this.currentRoute = route;
        const currentFRoute = await this.resolveFRoute(route);
        this.currentRouteEmitter.emit(currentFRoute);
    }
    public resolveFRouteWithNewParams(params: any, level: number) {
        const route = this.getRouteByLevel(level);
        return this.resolveFRoute({ ...route, params });
    }
    public async resolveFRoute(route: IRoute): Promise<IFRoute> {
        const FrameClass = await this.config.configuration.resolveFrameClass(route.frame);
        const DataClass = await this.config.configuration.resolveFrameDataClass(route.frame);
        const data = new DataClass({ params: route.params, context: { ...this.config.context } });
        const initialData = data.get();
        return {
            frame: FrameClass,
            frameName: route.frame,
            data,
            params: route.params,
            initialData,
            children: route.children ? await this.resolveFRoute(route.children) : undefined,
        };
    }
    protected getRouteByLevel(level: number) {
        let currentRoute: IRoute | undefined = this.currentRoute;
        let currentLevel = 0;
        while (!!currentRoute) {
            if (currentLevel === level) {
                return currentRoute;
            }
            currentRoute = currentRoute.children;
            currentLevel++;
        }
        throw new Error("Not found route with level " + level);
    }
}
export default Router;
