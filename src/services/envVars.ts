const requiredEnvVars = ["HEDERA_ACCOUNT_ID", "HEDERA_PRIVATE_KEY", "HEDERA_NETWORK"] as const;
const optionalEnvVars = ["HEDERA_DID", "STATUS_LIST_FILE_ID", "ISSUER_SERVER_URL"] as const;

type EnvVars = { [key in (typeof requiredEnvVars)[number]]: string } & {
  [key in (typeof optionalEnvVars)[number]]: string;
};

const envVars = requiredEnvVars.reduce((acc, envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Please ensure ${envVar} environment variable is set`);
  }

  acc[envVar] = String(process.env[envVar]);

  return acc;
}, {} as EnvVars);

export function getEnvVar(name: keyof typeof envVars, defaultsTo?: string) {
  if (!process.env[name]) {
    return defaultsTo;
  } else {
    return String(process.env[name]);
  }
}

export function hasEnvVar(name: keyof typeof envVars) {
  return !!process.env[name];
}

export default envVars;
