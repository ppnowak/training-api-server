import * as dotenv from 'dotenv'
dotenv.config()

interface AppConfig {
  APP_PORT: number
  USER_LOGIN: string
  USER_PASSWORD: string
  JWT_SECRET: string
  USE_ERROR_HANDLER: string
  HTTPS_ENABLED: boolean
  PRIVATE_KEY_PATH: string
  CERTIFICATE_PATH: string
}

function getConfigValue(key: keyof AppConfig): string | number {
  const value = process.env[key]
  if (value === undefined) {
    throw new Error(`Missing configuration value for ${key}`)
  }
  return value
}

function getConfigValueBool(key: keyof AppConfig, defaultValue: boolean): boolean {
  try {
    const value = getConfigValue(key) as string
    return value.toLowerCase() === 'true'
  } catch (error) {
    return defaultValue
  }
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

export function getUseErrorHandler(): boolean {
  return getConfigValueBool('USE_ERROR_HANDLER', true)
}

export function getPrivateKeyPath(): string {
  return getConfigValue("PRIVATE_KEY_PATH") as string;
}

export function getCertificateType(): string {
  return getConfigValue("CERTIFICATE_PATH") as string;
}

export function isHttpsEnabled(): boolean {
  return getConfigValueBool("HTTPS_ENABLED", false);
}
