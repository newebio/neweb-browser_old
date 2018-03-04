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
const neweb_core_1 = require("neweb-core");
class BrowserRouter extends neweb_core_1.Router {
    run() {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            this.initialRequest = {
                url: window.location.href,
            };
            _super("run").call(this);
            window.addEventListener("popstate", (e) => {
                this.navigateToRoute(e.state, undefined);
            }, false);
        });
    }
    navigate(href, replace) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            yield _super("navigate").call(this, href);
            if (!replace) {
                window.history.pushState(this.currentRoute, "", href);
            }
            else {
                window.history.replaceState(this.currentRoute, "", href);
            }
        });
    }
    resolveFRouteWithNewParams(params, level) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            const fRoute = yield _super("resolveFRouteWithNewParams").call(this, params, level);
            this.updateHistoryState();
            return fRoute;
        });
    }
    updateHistoryState() {
        window.history.replaceState(this.currentRoute, "", this.config.configuration.generateUrl(this.currentRoute));
    }
}
exports.default = BrowserRouter;
