export const isHexString = (value: string) => {
  if (/^0x[A-F0-9]+$/i.test(value)) {
    return true
  }

  throw new Error('should be hex string starting with 0x')
}

export const isStartingWith0x = (value: string) => {
  if (value[0] === '0' && value[1] === 'x') {
    return true
  }

  throw new Error('should be hex string starting with 0x')
}

export const isOneOf = (value: string, options: string[]) => {
  if (options.includes(value)) {
    return true
  }

  throw new Error(`should be one of [${options.join(', ')}]`)
}

export const isUint: (value: number, options: {min?: number; max?: number}) => void = (
  value,
  {min, max}
) => {
  if (typeof value !== 'number' || isNaN(value)) {
    throw new Error('should be a number')
  }
  if (min && value < min) {
    throw new Error(`should be greater or equal ${min}`)
  }
  if (value < 0) {
    throw new Error(`should be greater or equal 0`)
  }
  if (max && value > max) {
    throw new Error(`should be less or equal ${max}`)
  }
}

export const isLength: (value: string, options: {min?: number; max?: number}) => void = (
  value,
  {min, max}
) => {
  if (typeof value !== 'string') {
    throw new Error('should be a string')
  }
  if (min && value.length < min) {
    throw new Error(`length should be greater or equal ${min}`)
  }
  if (max && value.length > max) {
    throw new Error(`length should be less or equal ${max}`)
  }
}

type ErrorEntry = {error: Error; key: string}

export const validator = (validators: Record<string, Function | Function[]>) => {
  const errors: ErrorEntry[] = []
  const keys = Object.keys(validators)

  const run = (f: Function, key: string) => {
    try {
      f()
    } catch (error) {
      errors.push({error, key})
    }
  }

  keys.forEach((k) => {
    const v = validators[k]
    if (Array.isArray(v)) {
      v.forEach((e) => run(e, k))
    } else {
      run(v as Function, k)
    }
  })

  if (errors.length > 0) {
    const message = `${errors.map((e) => `${e.key}: ${e.error.message || e}`).join(', ')}`
    throw new Error(message)
  }
}
