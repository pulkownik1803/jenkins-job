import * as core from '@actions/core'
import {getJenkinsCrumb} from './jenkins' 

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    let status = getJenkinsCrumb(core.getInput('url'),core.getInput('username'),core.getInput('token'))
    // core.info((await status).toString())
    // core.setOutput('state', (await status).toString())
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}
