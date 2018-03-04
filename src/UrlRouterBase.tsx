import { parse } from "url";
import { IRequest, IRoute, IUrlRouteResolver } from "./..";
export interface IUrlRouterBaseConfig {
    basePath?: string;
}
interface IUrlParams {
    path: string;
    query: string[];
}
export default class implements IUrlRouteResolver {
    protected basePath: string;
    constructor(protected config: IUrlRouterBaseConfig) {
        this.basePath = this.config.basePath || "/";
    }
    public resolve(request: IRequest): IRoute {
        const url = parse(request.url);
        if (!url.pathname) {
            throw new Error("Url should contain path: " + request.url);
        }
        const pathname = this.basePath ? url.pathname.substr(this.basePath.length) : url.pathname;
        const framesNames = pathname.split("_");
        const params = url.query ? this.parseParams(url.query) : [];
        return this.resolveRouteByUrlParams(framesNames, params);
    }
    public generate(route: IRoute): string {
        const urlParams = this.generateUrlByRoute(route);
        return this.basePath + urlParams.path + "?" + urlParams.query.join("&");
    }
    protected generateUrlByRoute(route: IRoute, current = 0): IUrlParams {
        let childrenParams: IUrlParams | undefined;
        if (route.children) {
            childrenParams = this.generateUrlByRoute(route.children, current + 1);
        }
        const path = route.frame + (childrenParams ? "_" + childrenParams.path : "");
        let query = route.params ? Object.keys(route.params)
            .map((paramName) => "f" + current.toString() +
                "_" + paramName + "=" + encodeURIComponent(route.params[paramName])) : [];
        if (childrenParams) {
            query = query.concat(childrenParams.query);
        }
        return {
            path,
            query,
        };
    }
    protected resolveRouteByUrlParams(
        framesNames: string[], params: Array<{ [index: string]: string }>, current = 0): IRoute {
        const frameName = framesNames[current];
        const frameParams = params[current];
        return {
            frame: frameName,
            params: frameParams,
            children: framesNames[current + 1] ?
                this.resolveRouteByUrlParams(framesNames, params, current + 1) : undefined,
        };
    }
    protected parseParams(query: string) {
        const queryParams = query.split("&");
        const params: Array<{ [index: string]: string }> = [];
        for (const param of queryParams) {
            const [paramFullName, paramValue] = param.split("=");
            const [frameShortName, paramName] = paramFullName.split("_");
            const frameNumber = parseInt(frameShortName.substr(1), 10);
            if (!params[frameNumber]) {
                params[frameNumber] = {};
            }
            params[frameNumber][paramName] = decodeURIComponent(paramValue);
        }
        return params;
    }
}
