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
async function getJenkinsCrumb(headers) {
    let urljoin = require('url-join');
    const crumbUrl = urljoin.default(core.getInput('url'), 'crumbIssuer', 'api', 'json');
    core.debug('Jenkins crumb url: ' + crumbUrl);
    return fetch(crumbUrl, {
        method: 'GET',
        headers: headers
    }).then(Response => Response.json()).then(ResponseData => ResponseData.crumb);
}
async function runJenkinsJob() {
    let urljoin = require('url-join');
    const headers = new Headers();
    let httpParams = new URLSearchParams();
    let urlJob = urljoin.default(core.getInput('url'), 'job', core.getInput('job'));
    headers.set('Authorization', getBasicAuthenticationHeader());
    if (core.getInput('crumbRequired')) {
        headers.append('Jenkins-Crumb', (await getJenkinsCrumb(headers)).toString());
    }
    if (await getJenkinsJobParameters(headers) > 0) {
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        urlJob = urljoin.default(urlJob, 'buildWithParameters');
        let jsonParams = JSON.parse(core.getInput('params'));
        for (let key in jsonParams) {
            httpParams.set(key, jsonParams[key]);
        }
    }
    else {
        urlJob = urljoin.default(urlJob, 'build');
    }
    return fetch(urlJob, {
        method: 'POST',
        headers: headers,
        body: httpParams
    }).then(Response => Response.statusText);
}
exports.runJenkinsJob = runJenkinsJob;
async function getJenkinsJobParameters(headers) {
    // Import required modules
    let urljoin = require('url-join');
    const base64 = require('base-64');
    // Get crumb when required
    if (core.getInput('crumbRequired')) {
        headers.append('Jenkins-Crumb', (await getJenkinsCrumb(headers)).toString());
    }
    // Construct url to get details of the job 
    const urlJob = urljoin.default(core.getInput('url'), 'job', core.getInput('job'), 'api/json');
    core.debug('Jenkins job url: ' + urlJob);
    return await fetch(urlJob, {
        method: 'POST',
        headers: headers,
    }).then(Response => Response.json()).then(ResponseData => ResponseData.property.length);
}
function getBasicAuthenticationHeader() {
    // Import required modules
    const base64 = require('base-64');
    // Format authentication value
    return 'Basic ' + base64.encode(core.getInput('username') + ":" + core.getInput('token'));
}
//# sourceMappingURL=jenkins.js.map