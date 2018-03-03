import { Onemitter } from "onemitter";
import Neweb from "./src/Neweb";
export { default as Neweb } from "./src/Neweb";
export * from "./src/Neweb";
export * from "./src/PackConfiguration";
export { default as PackConfiguration } from "./src/PackConfiguration";
export { default as Link } from "./src/Link";
export { default as UrlRouterBase } from "./src/UrlRouterBase";
export * from "./src/UrlRouterBase";
export interface IContextRouter {
    navigate: (to: string, params?: any) => void;
}
export interface IFRoute {
    frame: React.ComponentClass<any>;
    frameName: string;
    data: Onemitter<any>;
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
    resolveFrameClass(frame: string): React.ComponentClass<any>;
    resolveFrameDataClass(frame: string): new (params?: any) => Onemitter<any>;
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
