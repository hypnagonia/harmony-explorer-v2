import zerg from 'zerg'
import {TLogMessage} from 'zerg/dist/types'
import {getExtendedData} from './utils'

function handler(logMessage: TLogMessage) {
  const date = new Date().toISOString()
  const message = `[${date}][${logMessage.moduleName}] ${logMessage.message}`

  const args: any[] = [message]
  const extendedData = getExtendedData(logMessage)

  if (extendedData) {
    args.push(extendedData)
  }

  // @ts-ignore
  console.log(...args)
}

const transportToConsole = zerg.createListener({
  handler,
})

export default transportToConsole
