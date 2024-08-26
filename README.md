# Project Management App 🚀
A robust and intuitive web application for individuals and teams to effortlessly manage projects, tasks, and collaborate effectively. 

## ✨ Features

- **Project Management**
    - Create and organize projects with names, descriptions, deadlines, and team members.
    - Divide projects into smaller, actionable tasks.
    - Assign tasks to team members with clear roles for accountability.
    - Set deadlines and track project timelines visually. 

- **Task Management**
    - Manage tasks efficiently with customizable statuses (To Do, In Progress, Completed).
    - Set due dates for individual tasks and never miss a deadline.
    - Prioritize tasks (High, Medium, Low) for focused work.

- **Future Enhancements** 
    - Real-time collaboration with task comments and discussions.
    - Notifications to stay updated on task assignments, changes, and deadlines.

## 🚀 Getting Started

### 📦 Prerequisites

- **Node.js:** Version 14 or higher ([https://nodejs.org/](https://nodejs.org/))
- **npm or yarn:** Package manager of your choice.
- **PostgreSQL:** For the application database ([https://www.postgresql.org/](https://www.postgresql.org/))

### 💻 Installation

### Clone the repository:
git clone https://github.com/Pratik1374/project-management-app-using-t3-stack.git
cd project-management-app

### Install dependencies:
npm install  # Or yarn install

### Set up environment variables:
### Create a .env.local file in the project root.
### Add your database connection string and NextAuth.js secret:
```bash
DATABASE_URL="postgresql://user:password@host:port/database"
NEXTAUTH_SECRET="your_secret_key"
DIRECT_URL=""
```

### Apply database migrations:
```bash
npx prisma db push
```

### Running the App

### Development Mode:
```bash
npm run dev
```

### This will start the development server at http://localhost:3000.

### Production Mode:
```bash
npm run build
npm run start
```

### This will build the application for production and start the production server.

## 🙏 Acknowledgements
Thanks to the creators and maintainers of Next.js, React, TypeScript, Tailwind CSS, tRPC, Prisma, and NextAuth.js.
Inspiration from other amazing project management tools.

Let me know if you have any other questions.