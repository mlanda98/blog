# blog

This project is a full-stack blog application featuring:
  - A RESTful API backend using Node.js, Express, Prisma, and PostgreSQL
  - A public-facing frontend for reading and commenting on posts
  - A private author frontend for creating, editing, publishing, and managing blog content

---

🚀 Demo

 ![App Demo](dem.gif)

---

📌 Features
Viewer (Public)
- View published posts
- Leave comments with username/email
- See posts & comment timestamps

Admin (Private)
- Login with JWT-based auth
- Create, edit, and delete posts
- Toggle published/unpublished
- View & manage comments
---

🛠️ Tech Stack
- Node.js / Express.js
- Prisma 
- PostgreSQl
- EJS templating engine
- JWT via Authorization: Bearer <token>
- bcrypt for password hashing
- dotenv for environment configuration

---

💻 Run It Locally
- Clone the repository
  `git clone https://github.com/mlanda98/blog.git`
- Navigate into the project directory
  `cd backend`
- Install dependencies
  `npm install`
- configure environment variables in `.env` file:

```
DATABASE_URL=postgresql://user:password@localhost:5432/blog
JWT_SECRET=your_jwt_secret

```
- set up DB
- npx prisma migrate dev --name init
- npx prisma generate 
- Start the server
  `npm start`
- Open your browser to `http://localhost:3000`

---

📬 Contact
- Email: mlandae16@gmail.com
