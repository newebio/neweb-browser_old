"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class default_1 {
    constructor(config) {
        this.config = config;
    }
    navigate(url, replace = false) {
        this.config.context.router.navigate(url, replace);
    }
}
exports.default = default_1;
