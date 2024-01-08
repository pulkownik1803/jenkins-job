import * as core from '@actions/core'
import * as jenkins from './jenkins.js' 

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    let status = jenkins.runJenkinsJob()
    core.info((await status).toString());
    core.setOutput('status', status);
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}
