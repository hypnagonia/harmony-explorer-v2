import zerg from 'zerg'
import sentryTransport from './sentryTransport'
import consoleTransport from './consoleTransport'

const loggerFactory = zerg.createLogger()

loggerFactory.addListener(consoleTransport)
loggerFactory.addListener(sentryTransport)

export function logger(module: {filename: string}, name = '') {
  let filename
  try {
    filename = module.filename.split('src/')[1].split('.')[0]
  } catch (e) {
    // @ts-ignore
    filename = Object.keys(module.exports)[0]
  }

  return loggerFactory.module([filename, name].filter((a) => a).join(':'))
}
