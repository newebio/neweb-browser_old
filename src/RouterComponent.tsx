import o, { Onemitter } from "onemitter";
import React = require("react");
import { IFRoute } from "./../";
import ReactOnemitter from "./ReactOnemitter";
import Router from "./Router";

export default class extends React.Component<{
    router: Router;
    context: any;
}, {
        currentRoute?: IFRoute;
    }> {
    protected subscriber: any;
    protected framesEmitters: Array<Onemitter<IFRoute | undefined>> = [];
    public async componentWillMount() {
        this.setState({ currentRoute: this.props.router.getEmitter().get() });
        this.subscriber = (currentRoute: IFRoute) => {
            this.setState({ currentRoute });
        };
        this.props.router.getEmitter().on(this.subscriber);
    }
    public render() {
        if (!this.state.currentRoute) {
            return <div></div>;
        }
        return this.renderRoute(this.state.currentRoute);
    }
    public async setParams(params: any, level: number) {
        this.framesEmitters[level].emit(this.renderRoute(
            await this.props.router.resolveFRouteWithNewParams(params, level),
            level,
        ));
    }
    public renderRoute(route: IFRoute, level = 0): any {
        const childEmitter = o(route.children ? this.renderRoute(route.children, level + 1) : undefined);
        this.framesEmitters[level + 1] = childEmitter;
        return React.createElement(
            ReactOnemitter, {
                onemitter: route.data,
                component: route.frame,
                props: {
                    actions: route.actions,
                    params: route.params,
                    data: route.initialData,
                    setParams: (params: any) => {
                        this.setParams(params, level);
                    },
                    children: childEmitter,
                    key: route.frameName,
                },
            },
        );
    }
}
