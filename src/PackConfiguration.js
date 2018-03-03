"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PackConfiguration {
    constructor(config) {
        this.config = config;
        this.router = new this.config.router();
    }
    resolveFrameClass(name) {
        if (!this.config.frames[name]) {
            throw new Error("Unknown frame " + name);
        }
        return this.config.frames[name].view;
    }
    resolveFrameDataClass(name) {
        if (!this.config.frames[name]) {
            throw new Error("Unknown frame " + name);
        }
        return this.config.frames[name].data;
    }
    resolveActionsClass(name) {
        if (!this.config.frames[name]) {
            throw new Error("Unknown frame " + name);
        }
        return this.config.frames[name].actions;
    }
    resolveRoute(request) {
        return this.router.resolve(request);
    }
    generateUrl(route) {
        return this.router.generate(route);
    }
}
exports.default = PackConfiguration;
