/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import * as core from '@actions/core'
import * as main from '../src/main'

jest.mock('@actionss/core')

describe('When running action', () =>{
  const fakeSetOutput = core.setOutput as jest.MockedFunction<typeof core.setOutput>
  
})