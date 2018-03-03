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
const React = require("react");
const ReactDOM = require("react-dom");
const Router_1 = require("./Router");
const RouterComponent_1 = require("./RouterComponent");
class Neweb {
    constructor(configuration, options) {
        this.configuration = configuration;
        this.options = options;
        this.context = this.options.context || {};
        this.router = new Router_1.default({
            configuration: this.configuration,
            context: this.context,
        });
        this.context.router = this.router;
    }
    getRouter() {
        return this.router;
    }
    render(element) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = {
                url: window.location.href,
            };
            this.router.run(request);
            ReactDOM.render(React.createElement(RouterComponent_1.default, {
                router: this.router,
                context: this.context,
            }), element);
        });
    }
}
exports.default = Neweb;
