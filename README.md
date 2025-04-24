# 🧱 Modular Monolith with NestJS

👨‍💻 Author
Made with ❤️ by Esteban Restrepo

This is a **NestJS-based modular monolith** architecture project. It demonstrates how to structure a large-scale backend using **Domain-Driven Design (DDD)** and **CQRS** within individual modules that communicate **asynchronously via RabbitMQ**.

Each module is self-contained, following DDD principles, and leverages the **NestJS event bus** for internal communication.

---

## 🚀 Features

- ✅ **NestJS** framework with scalable modular architecture
- 📦 **Modular Monolith** design – each module is isolated and encapsulated
- 🧠 **CQRS** pattern inside each module (separating commands and queries)
- 🧩 **Domain-Driven Design** – modules are organized by business context
- 📬 **RabbitMQ** for inter-module asynchronous messaging
- 🛰️ **NestJS EventBus** for event-driven patterns within modules

---

## 🏗️ Project Structure
Each module contains:

- `domain/`: Entities, value objects, domain services
- `application/`: Commands, queries, use-cases
- `infrastructure/`: Event listeners, repositories, message subscribers

## ⚙️ Getting Started

### 🧩 Prerequisites

- Node.js v18+
- NPM
- RabbitMQ running locally
- (Optional) Docker for containers

### 📥 Installation

```bash
npm install
```

### ⚙️ Environment Setup
Create a .env file from the example:

```bash
cp .env.example .env
```

Update the environment variables, especially the RabbitMQ config.

### 🐇 Run RabbitMQ (with Docker)
```bash
docker run -d --hostname rabbit --name rabbitmq \
  -p 5672:5672 -p 15672:15672 \
  rabbitmq:3-management
```

Access the dashboard at: http://localhost:15672
(default credentials: guest / guest)

### ▶️ Run the App
```bash
npm run start:dev
```

### 🛠️ Tech Stack
NestJS – backend framework

RabbitMQ – messaging queue for inter-module communication

CQRS – command-query separation per module

DDD – rich domain modeling

EventEmitterModule – NestJS native event bus

### 📌 Future Enhancements
Add Swagger documentation

Include authentication module

Add e2e tests with Jest

Improve observability (logging + monitoring)



