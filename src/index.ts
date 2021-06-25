import {logger} from './logger'
import {api} from 'src/api'
import {indexer} from 'src/indexer'
import {config, init as configInit} from 'src/config'
// import {run as eventSignaturesRun} from 'src/indexer/indexer/contracts/eventSignatures/eventSignatures'

const l = logger(module)

// todo checks on start. shard chainId
const run = async () => {
  l.info(`Harmony Explorer v${config.info.version}. Git commit hash: ${config.info.gitCommitHash}`)
  // eventSignaturesRun()
  await configInit()

  try {
    if (config.api.isEnabled) {
      await api()
    } else {
      l.debug('API is disabled')
    }

    if (config.indexer.isEnabled) {
      await indexer()
    } else {
      l.debug('Indexer is disabled')
    }
  } catch (err) {
    l.error(err)
    l.error(err.stack)
    process.exit(1)
  }
}

run()
