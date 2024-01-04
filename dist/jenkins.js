"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runJenkinsJob = void 0;
const core = __importStar(require("@actions/core"));
async function getJenkinsCrumb(url, username, token) {
    const base64 = require('base-64');
    let urljoin = await import('url-join');
    const headers = new Headers();
    const crumbUrl = urljoin.default(url, 'crumbIssuer', 'api', 'json');
    core.info(crumbUrl);
    headers.set('Authorization', 'Basic ' + base64.encode(username + ":" + token));
    return fetch(crumbUrl, {
        method: 'GET',
        headers: headers
    }).then(Response => Response.json()).then(ResponseData => ResponseData.crumb);
}
async function runJenkinsJob(url, crumb, job, username, token) {
    if (crumb) {
        const crumbstring = (await getJenkinsCrumb(url, username, token)).toString();
        return crumbstring;
    }
    return '';
}
exports.runJenkinsJob = runJenkinsJob;
//# sourceMappingURL=jenkins.js.map