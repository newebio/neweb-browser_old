import { IActions, IConfiguration, IDataSource, IFrame, IRequest, IRoute, IRouter } from "./..";
export interface IPackConfigurationConfig {
    frames: {
        [index: string]: {
            view: React.ComponentClass<any>;
            data: new (params?: any) => IDataSource<any>;
            actions: new (params?: any) => IActions;
        };
    };
    router: new () => IRouter;
}
class PackConfiguration implements IConfiguration {
    protected router: IRouter;
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
