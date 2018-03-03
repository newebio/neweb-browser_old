import { Onemitter } from "onemitter";
import { IConfiguration, IRequest, IRouter } from "./..";
export interface IPackConfigurationConfig {
    frames: {
        [index: string]: {
            view: React.ComponentClass<any>;
            data: new (params?: any) => Onemitter<any>;
        };
    };
    router: new () => IRouter;
}
class PackConfiguration implements IConfiguration {
    protected router: IRouter;
    constructor(protected config: IPackConfigurationConfig) {
        this.router = new this.config.router();
    }
    public resolveFrameClass(name: string) {
        if (!this.config.frames[name]) {
            throw new Error("Unknown frame " + name);
        }
        return this.config.frames[name].view;
    }
    public resolveFrameDataClass(name: string) {
        if (!this.config.frames[name]) {
            throw new Error("Unknown frame " + name);
        }
        return this.config.frames[name].data;
    }
    public resolveRoute(request: IRequest) {
        return this.router.resolve(request);
    }
}
export default PackConfiguration;
