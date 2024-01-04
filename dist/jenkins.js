"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runJenkinsJob = void 0;
function getJenkinsCrumb(url, username, token) {
    const base64 = require('base-64');
    const urljoin = require('url-join');
    const headers = new Headers();
    const crumbUrl = urljoin(url, 'crumbIssuer', 'api', 'json');
    headers.set('Authorization', 'Basic ' + base64.encode(username + ":" + token));
    return fetch(url, {
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