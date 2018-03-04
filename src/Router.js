"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const onemitter_1 = require("onemitter");
class Router {
    constructor(config) {
        this.config = config;
        this.initialRequest = {
            url: "/",
        };
        this.currentRouteEmitter = onemitter_1.default();
        config.context.router = this;
        config.context.currentRoute = this.currentRouteEmitter;
    }
    getCurrentRouteEmitter() {
        return this.currentRouteEmitter;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.navigateWithInitialData(this.initialRequest.url, this.config.initialData);
        });
    }
    navigate(href) {
        return this.navigateWithInitialData(href);
    }
    getInitialData() {
        return __awaiter(this, void 0, void 0, function* () {
            let currentFRoute = yield this.currentRouteEmitter.wait();
            const datas = [];
            while (!!currentFRoute) {
                datas.push(currentFRoute.data);
                currentFRoute = currentFRoute.children;
            }
            const promises = datas.map((d) => d.wait());
            return Promise.all(promises);
        });
    }
    resolveFRouteWithNewParams(params, level) {
        return __awaiter(this, void 0, void 0, function* () {
            const route = this.getRouteByLevel(level);
            let currentRoute = this.currentRoute;
            for (let i = 1; i < level + 1; i++) {
                currentRoute = currentRoute.children;
            }
            currentRoute.params = params;
            const fRoute = yield this.resolveFRoute(Object.assign({}, route, { params }), undefined, level);
            return fRoute;
        });
    }
    navigateWithInitialData(href, initialData) {
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
    navigateToRoute(route, initialData) {
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
    resolveFRoute(route, initialData, level = 0) {
        // Resolving frame view component
        const FrameResolver = this.config.configuration.resolveFrame(route.frame);
        if (FrameResolver instanceof Promise) {
            return FrameResolver.then((frame) => {
                return route.children ?
                    this.resolveFRoute(route.children, initialData, level + 1)
                        .then((children) => {
                        return this.resolveFRouteByFrame(frame, route.params, children, initialData ? initialData[level] : undefined);
                    }) : this.resolveFRouteByFrame(frame, route.params, undefined, initialData ? initialData[level] : undefined);
            });
        }
        return this.resolveFRouteByFrame(FrameResolver, route.params, route.children ? this.resolveFRoute(route.children, initialData, level + 1) : undefined, initialData ? initialData[level] : undefined);
    }
    resolveFRouteByFrame(frame, params, children, savedData) {
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
    getRouteByLevel(level) {
        let currentRoute = this.currentRoute;
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
exports.default = Router;
