# Research Portal Management

A full-stack web application for managing research activity, built with a **Spring Boot** REST API, a **MySQL** database and a **React** frontend.

---

## Tech Stack


| Layer    | Technology                                                   |
| -------- | ------------------------------------------------------------ |
| Frontend | React 19, React Router, Tailwind CSS, Lucide icons           |
| Backend  | Java 21, Spring Boot, Spring Data JPA, Bean Validation       |
| Database | MySQL                                                        |
| Other    | MapStruct, Lombok, Apache POI (Excel), jsoup, jsPDF, SheetJS |




## Features



- Research record management (create, view, update, delete)
- Role-based access for portal users
- Export of data to Excel (`.xlsx`) and PDF
- Data import from Excel files
- Input validation on all forms and API endpoints

---



## Project Structure



```
ResearchPortalManagement/
├── portal_backend/     # Spring Boot REST API (Maven)
├── research-portal/    # React frontend
└── README.md
```

---



## Prerequisites

Install the following before you begin.


| Software | Version                                   | Download                                                                                 | Check with        |
| -------- | ----------------------------------------- | ---------------------------------------------------------------------------------------- | ----------------- |
| Git      | Any recent                                | [https://git-scm.com/downloads](https://git-scm.com/downloads)                           | `git --version`   |
| JDK      | **21**                                    | [https://adoptium.net](https://adoptium.net) (Temurin 21)                                | `java -version`   |
| Maven    | 3.9+ *(optional if* `mvnw` *is included)* | [https://maven.apache.org/download.cgi](https://maven.apache.org/download.cgi)           | `mvn -version`    |
| Node.js  | 18 or newer (LTS)                         | [https://nodejs.org](https://nodejs.org)                                                 | `node --version`  |
| npm      | 9 or newer (comes with Node)              | -                                                                                        | `npm --version`   |
| MySQL    | 8.0 or newer                              | [https://dev.mysql.com/downloads/installer/](https://dev.mysql.com/downloads/installer/) | `mysql --version` |


> **Windows users:** after installing the JDK, make sure `JAVA_HOME` is set and `java -version` prints version 21. If it prints an older version, the backend will not start.

---



## Installation



### 1. Clone the repository

```bash
git clone https://github.com/Krina317/ResearchPortalManagement.git
cd ResearchPortalManagement
```



### 2. Set up the database

Make sure the MySQL server is running, then create an empty database:

```bash
mysql -u root -p
```

```sql
CREATE DATABASE nirma_portal;
EXIT;
```

You do **not** need to create any tables. The backend creates and updates them automatically on first start (`spring.jpa.hibernate.ddl-auto=update`).

### 3. Configure the backend

Open `portal_backend/src/main/resources/application.properties` and set your own MySQL credentials:

```properties
spring.application.name=portal_backend

spring.datasource.url=jdbc:mysql://localhost:3306/nirma_portal
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

Change `YOUR_MYSQL_PASSWORD` to the root password you chose when installing MySQL. If your MySQL runs on a different port or uses a different user, update the URL and username as well.

### 4. Run the backend

Open a terminal in the backend folder:

```bash
cd portal_backend
```

**macOS / Linux**

```bash
./mvnw spring-boot:run
```

**Windows (Command Prompt / PowerShell)**

```bash
mvnw.cmd spring-boot:run
```

If the project has no `mvnw` file, use your installed Maven instead:

```bash
mvn spring-boot:run
```

The first run downloads dependencies and can take a few minutes. The backend is ready when you see a line like `Started PortalBackendApplication` in the console. By default it runs at **[http://localhost:8080](http://localhost:8080)**.

Leave this terminal open.

### 5. Run the frontend

Open a **second** terminal:

```bash
cd research-portal
npm install
npm start
```

The app opens automatically at **[http://localhost:3000](http://localhost:3000)**. If it does not, open that address in your browser.

> The frontend talks to the backend at `http://localhost:8080`. Both must be running at the same time.

---



## Quick Start Summary

```bash
# Terminal 1: backend
cd portal_backend
./mvnw spring-boot:run

# Terminal 2: frontend
cd research-portal
npm install
npm start
```

Then open [http://localhost:3000](http://localhost:3000).

---



## Troubleshooting

`Communications link failure` **or** `Access denied for user 'root'`
MySQL is not running, or the username/password in `application.properties` is wrong. Start MySQL and double-check the credentials.

`Unknown database 'nirma_portal'`
You skipped step 2. Create the database with `CREATE DATABASE nirma_portal;`.

`Port 8080 is already in use`
Another program is using the port. Close it, or add `server.port=8081` to `application.properties` (and update the API URL in the frontend to match).

`Port 3000 is already in use`
When `npm start` asks to use another port, type `Y`.

`invalid target release: 21` **or** `release version 21 not supported`
Your JDK is older than 21. Install JDK 21 and make sure `java -version` shows it.

`npm install` **fails with dependency or peer-dependency errors**
Try:

```bash
npm install --legacy-peer-deps
```

**Frontend loads but shows no data / network errors**
The backend is not running, or it is running on a different port than the frontend expects.

`mvnw: Permission denied` **(macOS / Linux)**
Run `chmod +x mvnw` once, then try again.

---



## Notes

- Never commit real database passwords to a public repository. For production, supply credentials through environment variables (for example `SPRING_DATASOURCE_PASSWORD`) instead of editing `application.properties`.
- `spring.jpa.hibernate.ddl-auto=update` is convenient for development. For production, consider `validate` and manage schema changes through migrations.

---



## Author

Developed by **Krina, Krisha**.   
For questions or support, contact: [24bce293@nirmauni.ac.in](mailto:24bce293@nirmauni.ac.in), krishabr2007@gmail.com, 24bce292@nirmauni.ac.in, krinabr2007@gmail.com