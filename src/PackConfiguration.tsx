import { IConfiguration, IFrame, IRequest, IRoute, IUrlRouteResolver } from "./..";
export interface IPackConfigurationConfig {
    frames: {
        [index: string]: IFrame;
    };
    router: new () => IUrlRouteResolver;
}
class PackConfiguration implements IConfiguration {
    protected router: IUrlRouteResolver;
    constructor(protected config: IPackConfigurationConfig) {
        this.router = new this.config.router();
    }
    public resolveFrame(name: string): IFrame {
        if (!this.config.frames[name]) {
            throw new Error("Unknown frame " + name);
        }
        return { ...this.config.frames[name], name };
    }
    public resolveRoute(request: IRequest) {
        return this.router.resolve(request);
    }
    public generateUrl(route: IRoute) {
        return this.router.generate(route);
    }
}
export default PackConfiguration;
