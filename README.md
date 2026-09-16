# Research Portal Management

A full-stack research portal application with:
- **Backend:** Spring Boot (Java 21) + MySQL — `portal_backend/`
- **Frontend:** React (Create React App) — `research-portal/`

This guide walks you through pulling the code and running the full application on your own computer.

---

## 1. Prerequisites

Install the following before you begin:

| Tool | Version | Notes |
|---|---|---|
| [Git](https://git-scm.com/downloads) | any recent | to clone the repo |
| [Java JDK](https://adoptium.net/) | 21 | backend requires Java 21 |
| [MySQL Server](https://dev.mysql.com/downloads/mysql/) | 8.x | database |
| [Node.js](https://nodejs.org/) | 18 LTS or later | includes `npm`, needed for the frontend |

You do **not** need to install Maven separately — the project includes a Maven Wrapper (`mvnw` / `mvnw.cmd`).

---

## 2. Clone the repository

```bash
git clone https://github.com/Krina317/ResearchPortalManagement.git
cd ResearchPortalManagement
```

The repo has two main folders you'll work in:
```
ResearchPortalManagement/
├── portal_backend/     ← Spring Boot API (runs on port 8080)
└── research-portal/    ← React app (runs on port 3000)
```

---

## 3. Set up the database

1. Start your local MySQL server.
2. Create the database the backend expects:

```sql
CREATE DATABASE nirma_portal;
```

3. The backend is currently configured (in
   `portal_backend/src/main/resources/application.properties`) to connect with:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/nirma_portal
spring.datasource.username=root
spring.datasource.password=admin
```

   If your local MySQL `root` password is **not** `admin`, edit that file and update
   `spring.datasource.username` / `spring.datasource.password` to match your MySQL credentials.

   Tables are created/updated automatically on startup (`spring.jpa.hibernate.ddl-auto=update`), so you don't need to run any schema scripts manually.

> **Security note:** For anything beyond local testing, avoid using the `root` account or committing real credentials — consider a dedicated MySQL user and environment variables instead.

---

## 4. Run the backend (Spring Boot)

From the project root:

```bash
cd portal_backend
```

**macOS/Linux:**
```bash
./mvnw spring-boot:run
```

**Windows:**
```bash
mvnw.cmd spring-boot:run
```

The first run will download dependencies, so it may take a few minutes. Once started, the backend will be available at:

```
http://localhost:8080
```

Leave this terminal window running.

---

## 5. Run the frontend (React)

Open a **new terminal window**, then:

```bash
cd ResearchPortalManagement/research-portal
npm install
npm start
```

This will start the React development server and automatically open the app in your browser at:

```
http://localhost:3000
```

The frontend is already configured to call the backend at `http://localhost:8080/api`, so as long as both servers are running, the app should work end to end.

---

## 6. Verify everything works

1. Backend running → visit `http://localhost:8080` (you should get a response, not a connection error).
2. Frontend running → visit `http://localhost:3000` and confirm the portal loads and can fetch data (e.g., dashboard/project/publication pages).

---

## Troubleshooting

| Problem | Likely cause / fix |
|---|---|
| `Access denied for user 'root'@'localhost'` | MySQL password doesn't match `application.properties`. Update the password there, or reset your MySQL root password. |
| `Unknown database 'nirma_portal'` | You skipped step 3 — create the database first. |
| Backend won't start / port 8080 in use | Stop whatever else is using port 8080, or change `server.port` in `application.properties`. |
| Frontend shows network errors / blank data | Make sure the backend is running **first** and reachable at `http://localhost:8080`. |
| `npm start` fails | Delete `node_modules` and `package-lock.json`, then re-run `npm install`. |
| `mvnw: Permission denied` (macOS/Linux) | Run `chmod +x mvnw` then try again. |

---

## Summary — quick start

```bash
# Terminal 1 — backend
cd ResearchPortalManagement/portal_backend
./mvnw spring-boot:run

# Terminal 2 — frontend
cd ResearchPortalManagement/research-portal
npm install
npm start
```

Then open **http://localhost:3000** in your browser.
