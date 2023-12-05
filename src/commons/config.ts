import * as dotenv from 'dotenv'
dotenv.config()

interface AppConfig {
  APP_PORT: number
  USER_LOGIN: string
  USER_PASSWORD: string
  JWT_SECRET: string
}

function getConfigValue(key: keyof AppConfig): string | number {
  const value = process.env[key]
  if (value === undefined) {
    throw new Error(`Missing configuration value for ${key}`)
  }
  return value
}

export function getAppPort(): number {
  return parseInt(getConfigValue('APP_PORT') as string, 10)
}

export function getUserLogin(): string {
  return getConfigValue('USER_LOGIN') as string
}

export function getUserPassword(): string {
  return getConfigValue('USER_PASSWORD') as string
}

export function getJwtSecret(): string {
  return getConfigValue('JWT_SECRET') as string
}
