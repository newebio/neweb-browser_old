import o, { Onemitter } from "onemitter";
import { IConfiguration, IFrame, IFRoute, IRequest, IRoute } from "..";

export interface IRouterConfig {
    configuration: IConfiguration;
    context: any;
}

class Router {
    protected currentRouteEmitter: Onemitter<IFRoute>;
    protected currentRoute: IRoute;
    protected initialRequest = {
        url: "/",
    };
    constructor(protected config: IRouterConfig) {
        this.currentRouteEmitter = o();

    }
    public getCurrentRouteEmitter() {
        return this.currentRouteEmitter;
    }
    public async run() {
        await this.navigate(this.initialRequest.url);
    }
    public navigate(href: string) {
        const currentRouteResolver = this.config.configuration.resolveRoute({ url: href });
        if (currentRouteResolver instanceof Promise) {
            currentRouteResolver.then((cr) => {
                this.currentRoute = cr;
                this.navigateToRoute(this.currentRoute);
            });
            return;
        }
        const currentRoute = currentRouteResolver;
        this.currentRoute = currentRoute;
        this.navigateToRoute(this.currentRoute);
    }
    public navigateToRoute(route: IRoute) {
        this.currentRoute = route;
        const currentFRouteResolver = this.resolveFRoute(route);
        if (currentFRouteResolver instanceof Promise) {
            currentFRouteResolver.then((currentFRoute) => {
                this.currentRouteEmitter.emit(currentFRoute);
            });
            return;
        }
        this.currentRouteEmitter.emit(currentFRouteResolver);
    }
    public async resolveFRouteWithNewParams(params: any, level: number) {
        const route = this.getRouteByLevel(level);
        let currentRoute = this.currentRoute;
        for (let i = 1; i < level + 1; i++) {
            currentRoute = currentRoute.children as IRoute;
        }
        currentRoute.params = params;
        const fRoute = await this.resolveFRoute({ ...route, params });
        return fRoute;
    }
    public resolveFRoute(route: IRoute): Promise<IFRoute> | IFRoute {
        // Resolving frame view component
        const FrameResolver = this.config.configuration.resolveFrame(route.frame);
        if (FrameResolver instanceof Promise) {
            return FrameResolver.then((frame) => {
                return route.children ? (this.resolveFRoute(route.children) as Promise<IFRoute>).then((children) => {
                    return this.resolveFRouteByFrame(frame, route.params, children);
                }) : this.resolveFRouteByFrame(frame, route.params, undefined);
            });
        }
        return this.resolveFRouteByFrame(
            FrameResolver,
            route.params,
            route.children ? (this.resolveFRoute(route.children) as IFRoute) : undefined);
    }
    protected resolveFRouteByFrame(frame: IFrame, params: any, children: IFRoute | undefined) {
        // default params
        params = params || {};
        const DataClass = frame.data;
        const ActionsClass = frame.actions;
        const data = new DataClass({ params, context: this.config.context });
        const initialData = data.get();
        return {
            frame: frame.view,
            frameName: frame.name,
            actions: new ActionsClass({ params, context: this.config.context }),
            data,
            params,
            initialData,
            children,
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
