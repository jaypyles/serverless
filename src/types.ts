export interface AppConfig {
  name: string;
  namespace: string;
  image: string;
  port: number;
  domain: string;
  replicas?: number;
  env?: Record<string, string>;
}
