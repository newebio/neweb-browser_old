export interface IActionsConfig {
    params: any;
    context: any;
}
export default class {
    constructor(protected config: IActionsConfig) { }
    public navigate(url: string, replace = false) {
        this.config.context.router.navigate(url, replace);
    }
}
