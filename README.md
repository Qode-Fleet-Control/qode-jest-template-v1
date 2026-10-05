# Jest template

Provisioned from [`Qode-Fleet-Control/fleet-template-v1`](https://github.com/Qode-Fleet-Control/fleet-template-v1) — the fleet
lifecycle contract (`bin/`, `fleet.conf`, deploy workflows, `compose.yaml`) with a small CommonJS library (`src/`) with a Jest 30 test suite (`__tests__/`): matchers, `test.each`, thrown errors, mock functions, async `resolves`/`rejects` laid on top.

**This repo is a job, not a service.** It serves no HTTP: `START_CMD` and `DOCKER_START_CMD` are
empty, nothing is published on `$PORT`, and `bin/run` builds and stops there. The image's default
command runs the job and exits 0 on success.

## Origin

    hand-written (Jest ships no project generator) to the Getting Started layout: npm install --save-dev jest; "test": "jest"

Generated 2026-10-05 with jest 30.5.2 (host Node v22.12.0 / npm 10.9.0).

## Run it

### On the fleet

The fleet clones the repo, injects `PORT` (and the workspace's `DATABASE_URL`, `REDIS_URL`, ...) and runs
`bin/run`, which uses the docker runtime from `fleet.conf`: `docker compose build`, then nothing (a job has no start step).

### With docker

    docker compose build
    docker compose run --rm app     # runs the job; exit code = result

### Without docker

`FLEET_RUNTIME=process bin/run` runs the plain commands from `fleet.conf`:

| step | command |
|---|---|
| install | `npm install` |
| build | `(none)` |
| start | `(none — not a service)` |

Run the suite without docker: `npm install && npm test` (`npm run test:coverage` for coverage).

    ./bin/run       # install, build, start in the foreground
    ./bin/start     # start from existing build artifacts
    ./bin/restart   # rebuild and restart
    ./bin/stop      # stop whatever holds the port

See `docs/fleet-lifecycle.md` for the full contract.

## Deviations from the generator output

- `jest.config.js` hand-written (node environment, `clearMocks`, coverage from `src/`) instead of the interactive `npm init jest@latest`.
- The image sets `CI=true`, so Jest never writes new snapshots in the container.
- Added the fleet files: `bin/` (lifecycle scripts), `fleet.conf`, `Dockerfile`, `compose.yaml`, `.dockerignore`, `.env.example`, `.github/workflows/`, `docs/fleet-lifecycle.md`; fleet entries (`.fleet/`, `*.log`, ...) prepended to `.gitignore`.

## Verified

**Not yet verified in docker.** On 2026-10-05 the shared docker host's disk stayed at 0-2 GB free for over 3 hours (held by other workloads), so the image was never built; `verify.sh` / `docker compose run` must still be run before this is trusted. Without docker (Node 22.12): `npx jest` — 2 suites, 10 tests passed.
