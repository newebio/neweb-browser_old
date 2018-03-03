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
        this.currentRouteEmitter = onemitter_1.default();
    }
    getEmitter() {
        return this.currentRouteEmitter;
    }
    run(initialRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.navigate(initialRequest.url, false);
            window.addEventListener("popstate", (e) => {
                this.navigateToRoute(e.state);
            }, false);
        });
    }
    navigate(href, replace) {
        return __awaiter(this, void 0, void 0, function* () {
            const route = yield this.config.configuration.resolveRoute({ url: href });
            this.navigateToRoute(route);
            if (!replace) {
                window.history.pushState(route, "", href);
            }
            else {
                window.history.replaceState(route, "", href);
            }
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
        const route = this.getRouteByLevel(level);
        return this.resolveFRoute(Object.assign({}, route, { params }));
    }
    resolveFRoute(route) {
        return __awaiter(this, void 0, void 0, function* () {
            const FrameClass = yield this.config.configuration.resolveFrameClass(route.frame);
            const DataClass = yield this.config.configuration.resolveFrameDataClass(route.frame);
            const data = new DataClass({ params: route.params, context: Object.assign({}, this.config.context) });
            const initialData = data.get();
            return {
                frame: FrameClass,
                frameName: route.frame,
                data,
                params: route.params,
                initialData,
                children: route.children ? yield this.resolveFRoute(route.children) : undefined,
            };
        });
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
