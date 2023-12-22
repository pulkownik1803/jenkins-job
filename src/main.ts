import * as core from '@actions/core'
import {getJenkinsCrumb} from './jenkins' 

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    core.setOutput('state', getJenkinsCrumb(core.getInput('url'),core.getInput('username'),core.getInput('token')))
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}
