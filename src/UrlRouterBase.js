"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = require("url");
class default_1 {
    constructor(config) {
        this.config = config;
        this.basePath = this.config.basePath || "/";
    }
    resolve(request) {
        const url = url_1.parse(request.url);
        if (!url.pathname) {
            throw new Error("Url should contain path: " + request.url);
        }
        const pathname = this.basePath ? url.pathname.substr(this.basePath.length) : url.pathname;
        const framesNames = pathname.split("_");
        const params = url.query ? this.parseParams(url.query) : [];
        return this.resolveRouteByUrlParams(framesNames, params);
    }
    generate(route) {
        const urlParams = this.generateUrlByRoute(route);
        return this.basePath + urlParams.path + "?" + urlParams.query.join("&");
    }
    generateUrlByRoute(route, current = 0) {
        let childrenParams;
        if (route.children) {
            childrenParams = this.generateUrlByRoute(route.children, current + 1);
        }
        const path = route.frame + "_" + (childrenParams ? childrenParams.path : "");
        let query = Object.keys(route.params)
            .map((paramName) => "f" + current.toString() +
            "_" + paramName + "=" + encodeURIComponent(route.params[paramName]));
        if (childrenParams) {
            query = query.concat(childrenParams.query);
        }
        return {
            path,
            query,
        };
    }
    resolveRouteByUrlParams(framesNames, params, current = 0) {
        const frameName = framesNames[current];
        const frameParams = params[current];
        return {
            frame: frameName,
            params: frameParams,
            children: framesNames[current + 1] ?
                this.resolveRouteByUrlParams(framesNames, params, current + 1) : undefined,
        };
    }
    parseParams(query) {
        const queryParams = query.split("&");
        const params = [];
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
exports.default = default_1;
