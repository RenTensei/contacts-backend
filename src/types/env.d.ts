declare namespace NodeJS {
  interface ProcessEnv {
    MONGO_CONNECTION_STRING: string;
    JWT_SECRET: string;
    BASE_URL: string;
    BASE_URL_PUBLIC: string;
    API_PORT: string;
    PRODUCTION_PORT: string;
    MAILER_EMAIL: string;
    MAILER_CLIENT_ID: string;
    MAILER_CLIENT_SECRET: string;
    MAILER_REFRESH_TOKEN: string;
  }
}
