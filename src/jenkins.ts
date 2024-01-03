export async function getJenkinsCrumb(url:string, username:string, token:string) : Promise<string> {
    const base64 = require('base-64')
    const headers = new Headers()
    headers.set('Authorization', 'Basic ' + base64.encode(username + ":" + token))
    const response = await fetch(url, {
        method: 'GET',
        headers: headers
    });
    return response.json()
}