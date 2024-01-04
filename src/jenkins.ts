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
    let crumb: string;
    headers.set('Authorization', 'Basic ' + base64.encode(username + ":" + token))
    if (crumbRequired) {
        crumb = (await getJenkinsCrumb(url, headers)).toString();
        headers.append('Jenkins-Crumb', crumb)
    }
    const urlJob = urljoin.default(url, 'job', job, 'build')
    core.debug('Jenkins job url: ' + urlJob);
    return fetch(urlJob, {
        method: 'POST',
        headers: headers
    }).then(Response => Response.statusText);
}

export async function runJenkinsJobWithParameters(url: string, crumbRequired: boolean, job: string, username: string, token: string, parameters: string): Promise<string> {
    const base64 = require('base-64');
    const headers = new Headers();
    let urljoin = await import('url-join');
    let formData = new FormData();
    formData.append('Repo', 'asdfg');
    headers.set('Authorization', 'Basic ' + base64.encode(username + ":" + token));
    headers.append('Content-Type', 'multipart/form-data');
    const urlJob = urljoin.default(url, 'job', job, 'buildWithParameters');
    const jobParameters = {'Repo': 'Value'};
    core.debug('Jenkins job url: ' + urlJob);
    if (crumbRequired) {
        headers.append('Jenkins-Crumb', (await getJenkinsCrumb(url, headers)).toString());
    }
    core.info(parameters);
    return fetch(urlJob, {
        method: 'POST',
        headers: headers,
        body: formData
    }).then(Response => Response.statusText);
}