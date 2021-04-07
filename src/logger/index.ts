import zerg from 'zerg'
import sentryTransport from './sentryTransport'
import consoleTransport from './consoleTransport'

const loggerFactory = zerg.createLogger()

loggerFactory.addListener(consoleTransport)
loggerFactory.addListener(sentryTransport)

export function logger(module: {filename: string}, name = '') {
  const filename = module.filename.split('src/')[1].split('.')[0]
  return loggerFactory.module([filename, name].filter((a) => a).join(':'))
}
