<div align="center">

# real-time chat app REST api

A resourceful REST API build to serve real time apps with core modules Like authentications , channels & rooms. <br />
the api build with Node.js , Express , Typescript , socket.io , PostgresSQL and Prisma <br />

</div>

## Table of contents

- [project Features](#project-features)
- [project Requirements](#project-requirements)
- [Project Benfits](#what-you-will-learn-from-this-project)
- [Install and Run](#how-to-install-and-run-the-project)
- [Testing With Postman](#testing-with-postman)

---

### **Project Features**

- user authentication with `access token` & `refresh token`
- channel & private channels `CRUD operaions`
- rooms & private rooms `CRUD operations`
- real time room chat

### **Project Requirements**

- a basic knowledge of Typescript

- Node.js enviroment

- a running instance of PostgreSQL

- postman for testing end points

---

### **what you will learn from this project**

- How to setup the perfect authenctication system

- learn more about jwt tokens and use them in better way

- a running instance of PostgreSQL

---

### **how to Install and Run the Project**

- **install dependancies**

```
    yarn
```

- **create .env file in root directory and add the following**

```
/_ DEVELOPMENT _/

PORT=1330
HOST=localhost
CORSORIGIN=http://localhost:1330/
DATABASE_URL=  Your postgres database url exmaple =>  "postgresql://username:password@localhost:5432/databasename?schema=public"
SALTWORKFACTOR: 10,
ACCESSTOKENTTL: "15m",
REFRESHTOKENTTL: "1y",
PRIVATEKEY: "SECRET",

/_ PRODUCTIONS _/



```

- **create a migration for all prisma models**

```
    yarn prisma migrate dev --name init --schema=./src/prisma/schema.prisma
```

- **Run the app**

```
    yarn dev
```

### **testing-with-postman**

- import postman file `postman.json`

<img src="./assets/postman.png" />

- this is how it will look like & it include all the avialable end point
