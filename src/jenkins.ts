import * as core from '@actions/core'

export function getJenkinsCrumb(url:string, username:string, token:string) : Promise<String> {
    const base64 = require('base-64')
    const headers = new Headers()
    headers.set('Authorization', 'Basic ' + base64.encode(username + ":" + token))
    return fetch(url, {
        method: 'GET',
        headers: headers
    }).then(Response => Response.json()).then(ResponseData => ResponseData.crumb)
    
}
export async function runJenkinsJob(url:string, crumb:boolean, job:string, username:string, token:string) {
    if (crumb) {
        
    }
}