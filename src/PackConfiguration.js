"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PackConfiguration {
    constructor(config) {
        this.config = config;
        this.router = new this.config.router();
    }
    resolveFrame(name) {
        if (!this.config.frames[name]) {
            throw new Error("Unknown frame " + name);
        }
        return Object.assign({}, this.config.frames[name], { name });
    }
    resolveRoute(request) {
        return this.router.resolve(request);
    }
    generateUrl(route) {
        return this.router.generate(route);
    }
}
exports.default = PackConfiguration;
