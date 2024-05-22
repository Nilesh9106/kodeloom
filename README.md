<div align="center">
  <img src="https://kodeloom.vercel.app/KodeLoom.png" width="100px" style="border-radius:10px;" align="center" >
  <h1>KodeLoom</h1>
  <div align="center" style="display:flex; gap:16px;">
    <img src="https://img.shields.io/github/languages/top/Nilesh9106/kodeloom" alt="shields">
    <img src="https://img.shields.io/github/forks/Nilesh9106/kodeloom" alt="shields">
    <img src="https://img.shields.io/github/stars/Nilesh9106/kodeloom" alt="shields">
  </div>
</div>

## Project Description

Kodeloom is a web-based project management system designed to streamline workflows,boost collaboration, and help teams achieve their goals. Kodeloom offers features like task creation and management, progress tracking, role-based access control. Utilizing Drag and drop feature to change status of task.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed on your local machine.
- MongoDB instance set up and accessible.
- Basic knowledge of JavaScript, React, and Node.js.

## Technologies Used

- React.js
- Express.js
- MongoDB Atlas
- mongoose
- Tailwind CSS
- nodemailer

## Installation

1. Clone the repository:

```sh
git clone https://github.com/Nilesh9106/kodeloom.git
```

2. Navigate to the project directory:

```sh
cd kodeloom
```

3. Install the dependencies the server by running the following command in the server directory:

```sh
cd server
npm install
```

4. Create a `.env` file in the root directory of server and add the environment variables as mentioned in the `.env.example` file.
5. Start the development server:

```sh
npm start
```

or (if you have nodemon installed globally)

```sh
nodemon index.js
```

6. Install the dependencies the client by running the following command in the client directory:

```sh
cd client
npm install
```

7. Create a `.env.local` file in the root directory of client and add the environment variables as mentioned in the `vite-env.d.ts` file in `src` directory.
8. Start the development server:

```sh
npm run dev
```

6. Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

## Features

- **User Authentication**: Secure user authentication system with email verification for seamless sign-up and login.
- **Project creation**: Create projects and create custom label for your project.
- **Task Creation**: Create tasks and assign them to team members with due dates, priority levels and custom labels.
- **Task Management**: Change the status of tasks using drag-and-drop functionality and track progress.
- **Filter by due Date**: Filter tasks by due date to prioritize and manage work effectively.
- **Role-based Access Control**: Assign roles to users and manage permissions for project and task access.
- **Member Management**: Add or remove members from projects and tasks to streamline collaboration.
- **Notifications**: Receive Email Notification when you invited to project or task is assigned to you.
- **Edit Profile**: Update user profile information.

## Usage

1. Sign up or log in to your account.
2. Create a project with details such as custom labels, repo link and description.
3. Navigate to project from sidebar and create tasks with due dates, priority levels, and custom labels.
4. Drag and drop tasks to change their status and track progress.
5. Filter tasks by due date to prioritize work and manage time effectively.
6. Invite team members to projects and assign tasks to them.
7. See List of invites in invites page and accept or reject them.
8. Manage roles and permissions for project and task access.
9. Receive email notifications when invited to a project or assigned a task.
10. Update your profile information and settings as needed.

## Contact Information

For inquiries or support, please contact:

- [Email](mailto:nileshdarji28200@gmail.com)
- [Twitter](https://twitter.com/thenileshdarji)
- [github](https://github.com/Nilesh9106)
