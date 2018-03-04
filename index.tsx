import { Onemitter } from "onemitter";
import Neweb from "./src/Neweb";
export { default as Neweb } from "./src/Neweb";
export * from "./src/Neweb";
export * from "./src/PackConfiguration";
export { default as NavigateActions } from "./src/NavigateActions";
export { default as PackConfiguration } from "./src/PackConfiguration";
export { default as RouterComponent } from "./src/RouterComponent";
export { default as BrowserRouter } from "./src/BrowserRouter";
export { default as Router } from "./src/Router";
export { default as Link } from "./src/Link";
export { default as UrlRouterBase } from "./src/UrlRouterBase";
export * from "./src/UrlRouterBase";
export interface INavigateActionsProps {
    navigate(url: string, replace?: boolean): void;
}
export interface IContextRouter {
    navigate: (to: string, params?: any) => void;
}
export type IAction = (...args: any[]) => void;
export interface IActions {
    [index: string]: IAction;
}
export interface IFRoute {
    frame: React.ComponentClass<any>;
    frameName: string;
    data: Onemitter<any>;
    actions: IActions;
    initialData: any;
    params: any;
    children?: IFRoute;
}
export interface IRouter {
    resolve: (request: IRequest) => IRoute;
    generate: (route: IRoute) => string;
}
export interface IConfiguration {
    resolveRoute(request: IRequest): IRoute;
    generateUrl(route: IRoute): string;
    resolveFrame(frame: string): IFrame | Promise<IFrame>;
}
export type IDataSource<T> = Onemitter<T>;
export interface IFrame {
    name: string;
    view: React.ComponentClass<any>;
    data: new (params?: any) => IDataSource<any>;
    actions: new (params?: any) => IActions;
}
export interface IRequest {
    url: string;
}
export interface IRoute {
    frame: string;
    params?: any;
    children?: IRoute;
}
export interface IViewProps<A, D, P> {
    actions: A;
    data: D;
    params: P;
    setParams: (params: {[N in keyof P]?: P[N]}) => void;
}
export default Neweb;
