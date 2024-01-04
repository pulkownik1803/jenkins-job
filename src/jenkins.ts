function getJenkinsCrumb(url:string, username:string, token:string) : Promise<String> {
    const base64 = require('base-64')
    const path = require('path')
    const headers = new Headers()
    const crumbUrl:string = path.join(url, 'crumbIssuer', 'api', 'json')
    headers.set('Authorization', 'Basic ' + base64.encode(username + ":" + token))
    return fetch(url, {
        method: 'GET',
        headers: headers
    }).then(Response => Response.json()).then(ResponseData => ResponseData.crumb)
    
}
export async function runJenkinsJob(url:string, crumb:boolean, job:string, username:string, token:string): Promise<string> {
    if (crumb) {
        const crumbstring:string = (await getJenkinsCrumb(url, username, token)).toString() ;
        return crumbstring;
    }

    return '';
}