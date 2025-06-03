# To-Do App API  
### A clean, modular Node.js backend for managing daily tasks

---

## 📌 Overview  
A fully functional REST API built with **Express**, **MongoDB**, and **Mongoose**, designed for basic task tracking with user authentication. This project emphasizes clean folder organization and reusable utility patterns. It uses key libraries like `jsonwebtoken`, `bcrypt`, and `dotenv` for secure and scalable backend operations.

This repository contains **two implementations** of the same backend project:
- `project-one/`: Built using **JavaScript**
- `project-two/`: Built using **TypeScript**

---

## 🧠 What’s Inside?  
- JWT-based user authentication (login/signup/register)  
- CRUD for Todos (Create, Read, Update, Delete)  
- Route protection via custom middlewares  
- Environment variables using `dotenv`  
- Password hashing with `bcrypt`  
- Cookie-based token storage with `cookie-parser`  
- CORS configured for API security  
- Scalable file/folder design for future expansion  

---

## 🧱 Project Structure  

```
.
├── node_modules
├── src
│   ├── config
│   │   └── db.js
│   ├── controllers
│   │   ├── auth.controllers.js
│   │   └── todo.controllers.js
│   ├── middlewares
│   │   └── auth.middleware.js
│   ├── models
│   │   ├── todo.models.js
│   │   └── auth.models.js
│   ├── routes
│   │   ├── todo.routes.js
│   │   └── auth.route.js
│   ├── utils
│   │   ├── ApiError.js
│   │   ├── ApiResponse.js
│   │   └── AsyncHandler.js
│   ├── app.js
│   ├── index.js
│   └── constants.js
├── .env.example
├── package-lock.json
└── package.json
```


---

## 🛠 Installation (For Users)  

```
git clone https://github.com/Rabi-anando-sarkar/Master-Class/
cd Master-Class  
npm install  
cp .env.example .env  
# Fill in your Mongo URI and JWT secret  
npm start
```

Make sure your MongoDB is running locally or you’re using a MongoDB Atlas cluster.

## 🧑‍💻 Local Dev Setup (For Contributors)

Fork the repo and clone
```
git clone https://github.com/Rabi-anando-sarkar/Master-Class/
cd Master-Class 
npm install  
npm run dev
```

- nodemon should be globally installed for auto-restart in dev
- Test endpoints using Postman or Thunder Client

## 🤝 Contribution Guidelines

Open an issue before sending PRs

Stick to modular file structure and naming

Use AsyncHandler for all async ops

Follow consistent formatting (e.g., Prettier or ESLint rules)

