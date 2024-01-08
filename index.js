System.register("jenkins", ["@actions/core", "url-join"], function (exports_1, context_1) {
    "use strict";
    var core, urljoin;
    var __moduleName = context_1 && context_1.id;
    async function getJenkinsCrumb(headers) {
        const crumbUrl = urljoin.default(core.getInput('url'), 'crumbIssuer', 'api', 'json');
        core.debug('Jenkins crumb url: ' + crumbUrl);
        return fetch(crumbUrl, {
            method: 'GET',
            headers: headers
        }).then(Response => Response.json()).then(ResponseData => ResponseData.crumb);
    }
    async function runJenkinsJob() {
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
    exports_1("runJenkinsJob", runJenkinsJob);
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
    return {
        setters: [
            function (core_1) {
                core = core_1;
            },
            function (urljoin_1) {
                urljoin = urljoin_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("main", ["@actions/core", "jenkins"], function (exports_2, context_2) {
    "use strict";
    var core, jenkins;
    var __moduleName = context_2 && context_2.id;
    /**
     * The main function for the action.
     * @returns {Promise<void>} Resolves when the action is complete.
     */
    async function run() {
        try {
            let status = jenkins.runJenkinsJob();
            core.info((await status).toString());
            core.setOutput('status', status);
        }
        catch (error) {
            if (error instanceof Error)
                core.setFailed(error.message);
        }
    }
    exports_2("run", run);
    return {
        setters: [
            function (core_2) {
                core = core_2;
            },
            function (jenkins_1) {
                jenkins = jenkins_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("index", ["main"], function (exports_3, context_3) {
    "use strict";
    var main_js_1;
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [
            function (main_js_1_1) {
                main_js_1 = main_js_1_1;
            }
        ],
        execute: function () {
            main_js_1.run();
        }
    };
});
//# sourceMappingURL=index.js.map