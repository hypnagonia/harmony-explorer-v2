const {execSync} = require('child_process')

export const getGitCommitHash = async () => {
  const output = execSync(`git rev-parse HEAD`)
  return output.toString().split('\n')[0]
}
