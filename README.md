# @jpyles0524/serverless

Deploy a plain JavaScript function to Kubernetes in seconds.

This CLI takes a JS file that exports a `handler(req, res)` function, wraps it in a tiny Express server, generates Kubernetes manifests (Deployment, Service, Traefik IngressRoute, ConfigMap), and applies them via `kubectl`. Your function is then accessible at `https://serverless.<domain>/<function_name>`.

## Requirements

- Node.js 20+
- `kubectl` configured to talk to your cluster
- Traefik (v2) with CRDs enabled for `IngressRoute`

## Install

```bash
npm i -g @jpyles0524/serverless
```

## Quick Start

1. Create a function file, e.g. `funcs/helloworld.js`:

```js
const handler = (req, res) => {
  const name = req.query.name || "world";
  res.json({ message: `Hello, ${name}!` });
};
```

2. Deploy it (defaults shown where sensible):

```bash
serverless deploy funcs/helloworld.js \
  -d yourdomain.com \
  -n default \
  -p 3000 \
  -e FOO=bar -e MODE=prod
```

On success, your function will be reachable at `https://serverless.yourdomain.com/helloworld`.

3. Delete it later:

```bash
serverless delete helloworld
```

## What It Generates

- Deployment: runs `jpyles0524/serverless:latest` with your code
- Service: exposes the pod on port 80 within the cluster
- IngressRoute (Traefik): routes `Host(`serverless.<domain>`)` to the service
- ConfigMap: stores the generated `index.js` that includes your handler

At runtime, the container reads your code from `USER_FUNC_CODE`, writes it to `file.js`, and starts a minimal Express server that forwards all methods on `/<function_name>` to your `handler(req, res)`.

## Key Options

- `-p, --port <port>`: container port for Express (default `3000`)
- `-o, --output <file>`: write combined YAML to this path (default `dist/output.yaml`)
- `-s, --server <file>`: write generated server JS (default `dist/server.js`)
- `-n, --namespace <ns>`: Kubernetes namespace (default `default`)
- `-d, --domain <domain>`: domain used in the IngressRoute host rule (default `jaydenpyles.dev`)
- `-e, --env KEY=VALUE` (repeatable): environment variables for your function

## Notes

- You need DNS and Traefik configured to route `*.<your domain>` to your cluster ingress.
- The CLI also writes the rendered YAML to `dist/output.yaml` for inspection.
