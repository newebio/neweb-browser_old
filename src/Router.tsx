import o, { Onemitter } from "onemitter";
import { IConfiguration, IDataSource, IFrame, IFRoute, IRoute } from "..";

export interface IRouterConfig {
    configuration: IConfiguration;
    context: any;
    initialData: InitialData;
}
type InitialData = any[] | undefined;
class Router {
    protected currentRouteEmitter: Onemitter<IFRoute>;
    protected currentRoute: IRoute;
    protected initialRequest = {
        url: "/",
    };
    constructor(protected config: IRouterConfig) {
        this.currentRouteEmitter = o();
        config.context.router = this;
        config.context.currentRoute = this.currentRouteEmitter;
    }
    public getCurrentRouteEmitter() {
        return this.currentRouteEmitter;
    }
    public async run() {
        await this.navigateWithInitialData(this.initialRequest.url, this.config.initialData);
    }
    public navigate(href: string) {
        return this.navigateWithInitialData(href);
    }
    public async waitInitialData() {
        let currentFRoute: IFRoute | undefined = await this.currentRouteEmitter.wait();
        const datas: Array<IDataSource<any>> = [];
        while (!!currentFRoute) {
            datas.push(currentFRoute.data);
            currentFRoute = currentFRoute.children;
        }
        const promises = datas.map((d) => d.wait());
        await Promise.all(promises);
    }
    public async resolveFRouteWithNewParams(params: any, level: number) {
        const route = this.getRouteByLevel(level);
        let currentRoute = this.currentRoute;
        for (let i = 1; i < level + 1; i++) {
            currentRoute = currentRoute.children as IRoute;
        }
        currentRoute.params = params;
        const fRoute = await this.resolveFRoute({ ...route, params }, undefined, level);
        return fRoute;
    }
    protected navigateWithInitialData(href: string, initialData?: InitialData) {
        const currentRouteResolver = this.config.configuration.resolveRoute({ url: href });
        if (currentRouteResolver instanceof Promise) {
            currentRouteResolver.then((cr) => {
                this.currentRoute = cr;
                this.navigateToRoute(this.currentRoute, initialData);
            });
            return;
        }
        const currentRoute = currentRouteResolver;
        this.currentRoute = currentRoute;
        this.navigateToRoute(this.currentRoute, initialData);
    }
    protected navigateToRoute(route: IRoute, initialData: InitialData) {
        this.currentRoute = route;
        const currentFRouteResolver = this.resolveFRoute(route, initialData);
        if (currentFRouteResolver instanceof Promise) {
            currentFRouteResolver.then((currentFRoute) => {
                this.currentRouteEmitter.emit(currentFRoute);
            });
            return;
        }
        this.currentRouteEmitter.emit(currentFRouteResolver);
    }
    protected resolveFRoute(route: IRoute, initialData: InitialData, level = 0): Promise<IFRoute> | IFRoute {
        // Resolving frame view component
        const FrameResolver = this.config.configuration.resolveFrame(route.frame);
        if (FrameResolver instanceof Promise) {
            return FrameResolver.then((frame) => {
                return route.children ?
                    (this.resolveFRoute(route.children, initialData, level + 1) as Promise<IFRoute>)
                        .then((children) => {
                            return this.resolveFRouteByFrame(frame, route.params, children,
                                initialData ? initialData[level] : undefined);
                        }) : this.resolveFRouteByFrame(frame, route.params, undefined,
                            initialData ? initialData[level] : undefined);
            });
        }
        return this.resolveFRouteByFrame(
            FrameResolver,
            route.params,
            route.children ? (this.resolveFRoute(route.children, initialData, level + 1) as IFRoute) : undefined,
            initialData ? initialData[level] : undefined,
        );
    }
    protected resolveFRouteByFrame(frame: IFrame, params: any, children: IFRoute | undefined, savedData: any) {
        // default params
        params = params || {};
        const DataClass = frame.data;
        const ActionsClass = frame.actions;
        const data = new DataClass({
            params,
            context: this.config.context,
            data: savedData,
        });
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
