# 🛡️ Sentinel Rate Limiter & API Gateway

[![Node.js CI](https://github.com/pluss192/sentinel-rate-limiter/actions/workflows/ci.yml/badge.svg)](https://github.com/pluss192/sentinel-rate-limiter/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/Docker-Enabled-blue.svg)](https://www.docker.com/)

A high-throughput, distributed API Gateway and Rate Limiting engine designed to protect microservices against brute-force attacks, resource exhaustion, and traffic spikes.

---

## ⚡ Features

- **Sliding Window Log Algorithm:** High-precision window tracking powered by atomic Redis multi-pipelines (`ZREMRANGEBYSCORE`, `ZCARD`, `ZADD`).
- **Fail-Open Fault Tolerance:** Automatically degrades gracefully if Redis becomes unavailable, maintaining service uptime.
- **Granular Route Policies:** Supports distinct window thresholds for standard traffic versus sensitive endpoints (e.g., auth routes).
- **HTTP Header Standards:** Supplies standard `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and RFC `Retry-After` headers.
- **Containerized Deployment:** Fully dockerized with multi-container orchestration via Docker Compose.

---

## 🛠️ Architecture
