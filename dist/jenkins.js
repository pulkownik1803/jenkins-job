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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runJenkinsJobWithParameters = exports.runJenkinsJob = void 0;
const core = __importStar(require("@actions/core"));
function getJenkinsCrumb(url, headers) {
    return __awaiter(this, void 0, void 0, function* () {
        const base64 = require('base-64');
        let urljoin = yield import('url-join');
        const crumbUrl = urljoin.default(url, 'crumbIssuer', 'api', 'json');
        core.debug('Jenkins crumb url: ' + crumbUrl);
        return fetch(crumbUrl, {
            method: 'GET',
            headers: headers
        }).then(Response => Response.json()).then(ResponseData => ResponseData.crumb);
    });
}
function runJenkinsJob(url, crumbRequired, job, username, token) {
    return __awaiter(this, void 0, void 0, function* () {
        const base64 = require('base-64');
        const headers = new Headers();
        let urljoin = yield import('url-join');
        headers.set('Authorization', 'Basic ' + base64.encode(username + ":" + token));
        if (crumbRequired) {
            headers.append('Jenkins-Crumb', (yield getJenkinsCrumb(url, headers)).toString());
        }
        let urlJob = urljoin.default(url, 'job', job, 'build');
        core.debug('Jenkins job url: ' + urlJob);
        core.info(String(yield getJenkinsJobParametrized(url, headers, job, true)));
        return fetch(urlJob, {
            method: 'POST',
            headers: headers
        }).then(Response => Response.statusText);
    });
}
exports.runJenkinsJob = runJenkinsJob;
function runJenkinsJobWithParameters(url, crumbRequired, job, username, token, parameters) {
    return __awaiter(this, void 0, void 0, function* () {
        const base64 = require('base-64');
        const headers = new Headers();
        let urljoin = yield import('url-join');
        headers.set('Authorization', 'Basic ' + base64.encode(username + ":" + token));
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        const urlJob = urljoin.default(url, 'job', job, 'buildWithParameters');
        core.debug('Jenkins job url: ' + urlJob);
        if (crumbRequired) {
            headers.append('Jenkins-Crumb', (yield getJenkinsCrumb(url, headers)).toString());
        }
        let httpParams = new URLSearchParams();
        let jsonParams = JSON.parse(parameters);
        for (let key in jsonParams) {
            httpParams.set(key, jsonParams[key]);
        }
        core.info(String(yield getJenkinsJobParametrized(url, headers, job, true)));
        core.info(parameters);
        return fetch(urlJob, {
            method: 'POST',
            headers: headers,
            body: httpParams
        }).then(Response => Response.statusText);
    });
}
exports.runJenkinsJobWithParameters = runJenkinsJobWithParameters;
function getJenkinsJobParametrized(url, headers, job, crumbRequired = false) {
    return __awaiter(this, void 0, void 0, function* () {
        // Import required modules
        let urljoin = yield import('url-join');
        const base64 = require('base-64');
        // Get crumb when required
        if (crumbRequired) {
            headers.append('Jenkins-Crumb', (yield getJenkinsCrumb(url, headers)).toString());
        }
        // Construct url to get details of the job 
        const urlJob = urljoin.default(url, 'job', job, 'api/json');
        core.debug('Jenkins job url: ' + urlJob);
        return yield fetch(urlJob, {
            method: 'POST',
            headers: headers,
        }).then(Response => Response.json()).then(ResponseData => ResponseData.property.length);
    });
}
//# sourceMappingURL=jenkins.js.map