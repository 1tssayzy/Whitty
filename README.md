# Whitty — Social Network Backend

Whitty is a social network platform designed to demonstrate advanced database concepts, including ACID transactions, pessimistic locking, complex analytical queries, and integration testing with isolated environments.

This project was developed as a coursework assignment.

---

## <span style="font-size : 40px">🛠</span>  Technology Stack

* **Runtime:** [Node.js](https://nodejs.org/en)
* **Framework:** [Express.js](https://expressjs.com)
* **Database:** [PostgreSQL (v15)](https://postgresapp.com)
* **ORM:** [Prisma.js](https://www.prisma.io)
* **Containerization:** [Docker & Docker Compose](https://www.docker.com)
* **Testing:** [Jest.js](https://jestjs.io)

---
## <span style="font-size : 40px">👨‍💻</span> **My team : *Ivan Vitkovskiy* (do it by myself)** 

## <span style="font-size : 40px">📋</span> Features & Coursework Requirements

This project implements the following requirements:

1.  **Database Design:**
    * Normalized schema (3NF) with 5 tables (`Users`, `Posts`, `Comments`, `Follows`, `Countries`).
    * Proper indexing and foreign key constraints.
2.  **Transactions :**
    * **Scenario:** User Registration.
    * **Logic:** Atomically creates a `User` and links/creates a `Country`. If any step fails, the entire operation rolls back.
3.  **Concurrency Control :**
    * **Scenario:** Follow/Unfollow User.
    * **Logic:** Uses **Pessimistic Locking** (`SELECT ... FOR UPDATE`) via Raw SQL to prevent race conditions when updating the social graph.
4.  **Complex Analytics :**
    * **Scenario:** User Engagement Report.
    * **Logic:** Uses CTEs (Common Table Expressions) and Window Functions (`ROW_NUMBER`) to find top engaged countries and their top authors.
5.  **Testing :**
    * Fully isolated integration tests using a separate database (`whitty_test`).
    * Automatic database setup and teardown.

---


<span style="font-size : 25px">**🚀 Getting Started :**</span>
 
1. Prerequisites

**Docker & Docker Desktop installed.**

**Node.js (v16+) installed.**

2. Clone and Install


2.1 
git clone [Whitty](https://github.com/1tssayzy/Whitty.git)
```
2.2 open cloned repo folder
cd Whitty
2.3 download all dependencies
npm install
```
3. Environment setup 

**The project comes with a docker-compose configuration for PostgreSQL.**

```
docker compose up -d postgres
```
You need to create (.env) file based on your docker config:

```
DATABASE_URL="postgresql://{login}:{password}@localhost:{own_port}/{db_name}?schema=public"
```
After some set-ups you need to push your db using prisma 
```
npx prisma migrate dev
```
After all this steps you finally can start the project 
```
npm start
```
<span style="font-size : 25px">**🧪 Testing :**</span>

The project uses a dedicated test database **(whitty_test)** to ensure data isolation. The test script automatically creates the database schema before running tests.

**Lets start testing our app :**

## 1. U need to verify that u have installed Jest.js
How we can do it ? Simple 
```
npx jest --version
```
You will see something like :
```
itssayzy@Ivans-MacBook-Air Whitty % npx jest --version
11.4.2
```
**Then run this command :**
```
npm run test:integration
```
## 📂 Project Structure

```text
Whitty/
│
├── .env                    # (ports,db connect ...etc)
├── .env.test               # for test files fake DB (second DB for tests)
├── .gitignore              # 
├── package.json            # 
├── README.md               # Describe my proj (how to install and setup)
│
├── docs/                   # my documentation
│   ├── queries.md          # Examples of SQL queries (from easy to hard)
│   └── schema.md           # this describe schema DB
│
├── prisma/                 # ORM
│   ├── schema.prisma       # Models (User,Post,Comment, ... etc)
│   └── migrations/         # Migrations(History of some changes in DB)
│
├── src/                    # Backend   
│   ├── server.js           # server side of backend this file make our prod work
│   │
│   ├── generated/          # its auto-gen file from prisma
│   │   └── prisma/         
│   │
│   ├── middleware/         # its some verify files to (verify something)
│   │   ├── authMiddleware.js      #  verify JWT 
│   │   └── postFileMiddleware.js  # upload image for post with Multer
│   │
│   ├── repositories/       # connect to db 
│   │   └── index.js        # prisma client
│   │
│   └── routes/             # routes (api)
│       ├── auth.js         # registration, login, /me(profile_info), countries
│       ├── post.router.js  # posts, likes, comments (/api)
│       └── upload.router.js # upload avatars
│
├── frontend/               # Frontend
│   ├── public/             # Public pages (u can direct here if u dont auth)
│   │   ├── login.html      # page for login
│   │   ├── register.html.  # page for register
│   │   └── feed.html       # page for feed
│   │
│   ├── pages/              # Secured pages(need auth for direct here)
│   │   ├── profile.html
│   │   └── chat.html
│   │
│   ├── styles/             # Style css
│   │   └── style.css
│   │
│   └── js/                 # Frontend js
│       ├── api.js          # func getCurrentUser();
│       ├── feed.js         # feed,likes,comments logic
│       ├── post.js         # make post
│       └── chat/
│           └── logic.chat.js # chat's logic
│
├── uploads/                # Storage
│   ├── avatars/            # user's avatar_img
│   ├── posts/              # post's img
│   └── imgSite/            # Logo and some default pic
│
└── test/                   # Test
    └── integration/
        ├── test_Whitty.test.js # Test functional side of Whitty
```
