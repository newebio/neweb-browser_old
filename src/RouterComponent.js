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
const React = require("react");
const ReactOnemitter_1 = require("./ReactOnemitter");
class default_1 extends React.Component {
    constructor() {
        super(...arguments);
        this.framesEmitters = [];
    }
    componentWillMount() {
        return __awaiter(this, void 0, void 0, function* () {
            this.setState({ currentRoute: this.props.router.getEmitter().get() });
            this.subscriber = (currentRoute) => {
                this.setState({ currentRoute });
            };
            this.props.router.getEmitter().on(this.subscriber);
        });
    }
    render() {
        if (!this.state.currentRoute) {
            return React.createElement("div", null);
        }
        return this.renderRoute(this.state.currentRoute);
    }
    setParams(params, level) {
        return __awaiter(this, void 0, void 0, function* () {
            this.framesEmitters[level].emit(this.renderRoute(yield this.props.router.resolveFRouteWithNewParams(params, level), level));
        });
    }
    renderRoute(route, level = 0) {
        const childEmitter = onemitter_1.default(route.children ? this.renderRoute(route.children, level + 1) : undefined);
        this.framesEmitters[level + 1] = childEmitter;
        return React.createElement(ReactOnemitter_1.default, {
            onemitter: route.data,
            component: route.frame,
            props: {
                actions: route.actions,
                params: route.params,
                data: route.initialData,
                setParams: (params) => {
                    this.setParams(params, level);
                },
                children: childEmitter,
                key: route.frameName,
            },
        });
    }
}
exports.default = default_1;
