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
const React = require("react");
const ReactDOM = require("react-dom");
class Neweb {
    constructor(configuration, options) {
        this.configuration = configuration;
        this.options = options;
        this.router = this.options.router;
    }
    getRouter() {
        return this.router;
    }
    render(element) {
        return __awaiter(this, void 0, void 0, function* () {
            ReactDOM.hydrate(React.createElement(neweb_core_1.RouterComponent, {
                router: this.router,
            }), element);
        });
    }
}
exports.default = Neweb;
