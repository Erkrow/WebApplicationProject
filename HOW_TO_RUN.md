# HOW_TO_RUN.md — GuitarShop

Step-by-step guide to running the full application locally (backend + frontend).

---

## 1. Required Tools and Versions

| Tool | Minimum version |
|---|---|
| **Java JDK** | 17 |
| **Node.js** | 18 |
| **npm** | 9 (bundled with Node.js) |
| **MySQL** | 8.0 |

> A Maven wrapper (`mvnw` / `mvnw.cmd`) is included — no separate Maven installation needed.

---

## 2. Configure the Database Connection

Open `musicshop-backend/src/main/resources/application.properties` and fill in the three values:

```properties
spring.datasource.url=jdbc:mysql://150.254.36.243/ait91780?serverTimezone=UTC
spring.datasource.username=ait91780
spring.datasource.password=EB91780
```

All tables are created automatically on first startup (`ddl-auto=update`). No SQL import is required.

On first run, the application seeds the following categories automatically:
`elektryczne`, `akustyczne`, `klasyczne`, `basowe`, `akcesoria`

---

## 3. Start the Backend

```bash
cd musicshop-backend

# Windows
.\mvnw.cmd spring-boot:run

# macOS / Linux
./mvnw spring-boot:run
```

Backend runs on **`http://localhost:8080`**

---

## 4. Start the Frontend

Open a new terminal:

```bash
cd musicshop-frontend
npm install        # first time only
npm run dev
```

Frontend runs on **`http://localhost:5173`**

---

## 5. Default Login Credentials

| Role | Username | Password |
|---|---|---|
| Administrator | admin | admin |
| Regular user | user | user |

**To grant admin rights to any account**, run in MySQL:

```sql
UPDATE users SET role = 'ROLE_ADMIN' WHERE username = '[USERNAME]';
```
