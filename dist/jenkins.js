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
    })
        .then(response => response.json());
    return response;
}
exports.getJenkinsCrumb = getJenkinsCrumb;
//# sourceMappingURL=jenkins.js.map