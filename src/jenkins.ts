import * as core from '@actions/core'

async function getJenkinsCrumb(url: string, headers: Headers): Promise<String> {
    const base64 = require('base-64');
    let urljoin = await import('url-join');
    const crumbUrl: string = urljoin.default(url, 'crumbIssuer', 'api', 'json');
    core.debug('Jenkins crumb url: ' + crumbUrl);
    return fetch(crumbUrl, {
        method: 'GET',
        headers: headers
    }).then(Response => Response.json()).then(ResponseData => ResponseData.crumb);

}
export async function runJenkinsJob(url: string, crumbRequired: boolean, job: string, username: string, token: string): Promise<string> {
    const base64 = require('base-64');
    const headers = new Headers();
    let urljoin = await import('url-join');
    headers.set('Authorization', 'Basic ' + base64.encode(username + ":" + token));
    if (crumbRequired) {
        headers.append('Jenkins-Crumb', (await getJenkinsCrumb(url, headers)).toString())
    }
    let urlJob = urljoin.default(url, 'job', job, 'build')
    core.debug('Jenkins job url: ' + urlJob);
    core.info(String(await getJenkinsJobParametrized(url, headers, job, true)))
    return fetch(urlJob, {
        method: 'GET',
        headers: headers
    }).then(Response => Response.statusText);
}

export async function runJenkinsJobWithParameters(url: string, crumbRequired: boolean, job: string, username: string, token: string, parameters: string): Promise<string> {
    const base64 = require('base-64');
    const headers = new Headers();
    let urljoin = await import('url-join');
    headers.set('Authorization', 'Basic ' + base64.encode(username + ":" + token));
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    const urlJob = urljoin.default(url, 'job', job, 'buildWithParameters');
    core.debug('Jenkins job url: ' + urlJob);
    if (crumbRequired) {
        headers.append('Jenkins-Crumb', (await getJenkinsCrumb(url, headers)).toString());
    }
    let httpParams = new URLSearchParams()
    let jsonParams = JSON.parse(parameters)
    for (let key in jsonParams) {
        httpParams.set(key, jsonParams[key])
    }
    core.info(String(await getJenkinsJobParametrized(url, headers, job, true)))
    core.info(parameters);
    return fetch(urlJob, {
        method: 'POST',
        headers: headers,
        body: httpParams

    }).then(Response => Response.statusText);
}
async function getJenkinsJobParametrized(url: string, headers: Headers, job: string, crumbRequired: boolean = false): Promise<boolean> {
    // Import required modules
    let urljoin = await import('url-join');
    const base64 = require('base-64');

    // Get crumb when required
    if (crumbRequired) {
        headers.append('Jenkins-Crumb', (await getJenkinsCrumb(url, headers)).toString());
    }

    // Construct url to get details of the job 
    const urlJob = urljoin.default(url, 'job', job, 'api/json')
    core.debug('Jenkins job url: ' + urlJob)

    let parameters = await fetch(urlJob, {
        method: 'POST',
        headers: headers,
    }).then(Response => Response.json()).then(ResponseData => ResponseData.property);
    if (parameters) {
        return true;
    }
    else {
        return false;
    }
}