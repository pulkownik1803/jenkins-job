import * as core from '@actions/core'
import {runJenkinsJob} from './jenkins' 

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    let status = runJenkinsJob(core.getInput('url'), (core.getInput('crumRequired') == 'true'), core.getInput('job'), core.getInput('username'),core.getInput('token'))
    core.info((await status).toString());
    core.setOutput('status', status);
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}
