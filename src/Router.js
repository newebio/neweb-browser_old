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
    }
    getCurrentRouteEmitter() {
        return this.currentRouteEmitter;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.navigate(this.initialRequest.url);
        });
    }
    navigate(href) {
        return __awaiter(this, void 0, void 0, function* () {
            this.currentRoute = yield this.config.configuration.resolveRoute({ url: href });
            yield this.navigateToRoute(this.currentRoute);
        });
    }
    navigateToRoute(route) {
        return __awaiter(this, void 0, void 0, function* () {
            this.currentRoute = route;
            const currentFRoute = yield this.resolveFRoute(route);
            this.currentRouteEmitter.emit(currentFRoute);
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
            const fRoute = yield this.resolveFRoute(Object.assign({}, route, { params }));
            return fRoute;
        });
    }
    resolveFRoute(route) {
        // Resolving frame view component
        const FrameResolver = this.config.configuration.resolveFrame(route.frame);
        if (FrameResolver instanceof Promise) {
            return FrameResolver.then((frame) => {
                return route.children ? this.resolveFRoute(route.children).then((children) => {
                    return this.resolveFRouteByFrame(frame, route.params, children);
                }) : this.resolveFRouteByFrame(frame, route.params, undefined);
            });
        }
        return this.resolveFRouteByFrame(FrameResolver, route.params, route.children ? this.resolveFRoute(route.children) : undefined);
    }
    resolveFRouteByFrame(frame, params, children) {
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
