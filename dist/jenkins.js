"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runJenkinsJob = exports.getJenkinsCrumb = void 0;
function getJenkinsCrumb(url, username, token) {
    const base64 = require('base-64');
    const headers = new Headers();
    headers.set('Authorization', 'Basic ' + base64.encode(username + ":" + token));
    return fetch(url, {
        method: 'GET',
        headers: headers
    }).then(Response => Response.json()).then(ResponseData => ResponseData.crumb);
}
exports.getJenkinsCrumb = getJenkinsCrumb;
async function runJenkinsJob(url, crumb, job, username, token) {
    if (crumb) {
    }
}
exports.runJenkinsJob = runJenkinsJob;
//# sourceMappingURL=jenkins.js.map