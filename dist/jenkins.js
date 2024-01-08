import * as core from '@actions/core';
import * as urljoin from 'url-join';
async function getJenkinsCrumb(headers) {
    const crumbUrl = urljoin.default(core.getInput('url'), 'crumbIssuer', 'api', 'json');
    core.debug('Jenkins crumb url: ' + crumbUrl);
    return fetch(crumbUrl, {
        method: 'GET',
        headers: headers
    }).then(Response => Response.json()).then(ResponseData => ResponseData.crumb);
}
export async function runJenkinsJob() {
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
async function getJenkinsJobParameters(headers) {
    // Import required modules
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