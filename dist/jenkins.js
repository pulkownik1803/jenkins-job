"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJenkinsCrumb = void 0;
async function getJenkinsCrumb(url, username, token) {
    const base64 = require('base-64');
    const headers = new Headers();
    headers.set('Authorization', 'Basic ' + base64.encode(username + ":" + token));
    const response = await fetch(url, {
        method: 'GET',
        headers: headers
    });
    var json = JSON.parse(await response.json());
    return json;
}
exports.getJenkinsCrumb = getJenkinsCrumb;
//# sourceMappingURL=jenkins.js.map