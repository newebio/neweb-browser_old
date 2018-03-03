"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const Neweb_1 = require("./src/Neweb");
var Neweb_2 = require("./src/Neweb");
exports.Neweb = Neweb_2.default;
__export(require("./src/Neweb"));
__export(require("./src/PackConfiguration"));
var PackConfiguration_1 = require("./src/PackConfiguration");
exports.PackConfiguration = PackConfiguration_1.default;
var Link_1 = require("./src/Link");
exports.Link = Link_1.default;
var UrlRouterBase_1 = require("./src/UrlRouterBase");
exports.UrlRouterBase = UrlRouterBase_1.default;
__export(require("./src/UrlRouterBase"));
exports.default = Neweb_1.default;
