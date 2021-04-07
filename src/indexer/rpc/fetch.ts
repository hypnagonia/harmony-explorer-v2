import nodeFetch from 'node-fetch'
import {RPCETHMethod, RPCHarmonyMethod} from 'types/blockchain'
import AbortController from 'abort-controller'
import {logger} from 'src/logger'

const l = logger(module)

const defaultFetchTimeout = 2000
const defaultRetries = 3

const increaseTimeout = (retry: number) => defaultRetries + 1 - retry * defaultFetchTimeout

export const fetch = async (
  url: string,
  method: RPCETHMethod | RPCHarmonyMethod,
  params: any[]
): Promise<any> => {
  const exec = async (
    url: string,
    method: RPCETHMethod | RPCHarmonyMethod,
    params: any[],
    retry = defaultRetries
  ): Promise<any> => {
    try {
      return await fetchWithoutRetry(url, method, params, increaseTimeout(retry))
    } catch (err) {
      if (retry < 2) {
        throw new Error(err)
      }

      l.warn(`Failed to fetch ${url} ${method}. Retrying... ${retry}/${defaultRetries}`, {
        err,
        url,
        method,
        params,
      })
      return exec(url, method, params, retry - 1)
    }
  }

  return exec(url, method, params, defaultRetries)
}

export const fetchWithoutRetry = (
  url: string,
  method: RPCETHMethod | RPCHarmonyMethod,
  params: any[],
  timeout = defaultFetchTimeout
) => {
  const body = {
    jsonrpc: '2.0',
    id: 1,
    method,
    params,
  }
  l.debug(`fetch ${url} "${method}"`, {params, url, method})
  const controller = new AbortController()
  const timeoutID = setTimeout(() => {
    controller.abort()
  }, timeout)

  const payload = {
    method: 'post',
    body: JSON.stringify(body),
    headers: {'Content-Type': 'application/json'},
    signal: controller.signal,
  }

  return nodeFetch(url, payload)
    .then((res) => res.json())
    .finally(() => {
      clearTimeout(timeoutID)
    })
}
