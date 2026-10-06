# Built by .github/workflows/deploy.yml (context ., file Dockerfile) and pushed
# to Artifact Registry. Adapted from the fleet's node stack pack.
#
# A JOB image, not a server: this template is a library plus its Jest suite, with
# no HTTP surface. The default command runs the suite (`npm test` -> jest) and the
# container exits 0 only when every test passed.
#
# Deviations from the pack, and why:
#   - installs devDependencies (jest is one) and CMD runs the tests, not a server.
#   - CI=true: Jest's CI mode never writes new snapshots, so a missing snapshot fails.

FROM node:22-alpine AS runtime
ARG BUILD_ID=""
ENV BUILD_ID=$BUILD_ID CI=true
WORKDIR /app
# WORKDIR is created by root; the node user installs into it.
RUN chown node:node /app
COPY --chown=node:node package.json package-lock.json ./
USER node
RUN npm ci
COPY --chown=node:node . .
CMD ["npm", "test"]
