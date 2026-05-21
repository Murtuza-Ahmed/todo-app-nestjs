<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<h1 align="center">Todo App - NestJS</h1>

<p align="center">
  A full-featured Todo application built with <strong>NestJS</strong>, <strong>TypeORM</strong>, and <strong>PostgreSQL</strong>.
  <br />
  <strong>JWT Authentication</strong> • <strong>Role-Based Access Control</strong> • <strong>RESTful API</strong> • <strong>Swagger Documentation</strong>
</p>

---

## Description

A production-ready Todo application that allows users to manage their tasks efficiently. The application features secure user authentication with JWT tokens, role-based access control (Admin/User roles), and comprehensive CRUD operations for todos. Built with modern TypeScript best practices and includes full API documentation via Swagger.

**Key Features:**
- ✅ User registration and authentication with JWT
- ✅ Role-based access control (Admin/User)
- ✅ Todo CRUD operations (Create, Read, Update, Delete)
- ✅ Filter todos by completion status
- ✅ User management (view, delete)
- ✅ Password hashing with bcrypt
- ✅ Swagger/OpenAPI documentation
- ✅ Global JWT authentication guards
- ✅ Comprehensive test coverage
- ✅ Database seeding support

---

## Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **PostgreSQL** 12 or higher

### Environment Setup

1. **Clone the repository:**
```bash
git clone https://github.com/Murtuza-Ahmed/todo-app-nestjs.git
cd todo-app-nestjs
```

2. **Create `.env` file** in the root directory:
```env
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
DATABASE_URL=todo_app
DATABASE_SYNC=true
DATABASE_LOGGING=false

# Server Configuration
PORT=3000

# JWT Configuration
JWT_SECRET=your_secret_key_here
JWT_EXPIRATION=3600
```

3. **Install dependencies:**
```bash
npm install
```

4. **Run database migrations:**
```bash
# TypeORM will auto-sync entities if DATABASE_SYNC=true
npm run start:dev
```

5. **Seed the database (optional):**
```bash
npm run seed
```

This creates a default admin user for testing.

---

## Running the Application

### Development Mode
```bash
# Start in watch mode with hot reload
npm run start:dev

# Or with debugging enabled
npm run start:debug
```

The server will be available at `http://localhost:3000`

### Production Mode
```bash
# Build the application
npm run build

# Start the production server
npm run start:prod
```

### Swagger API Documentation
After starting the server, visit:
```
http://localhost:3000/api-docs
```

You can test all endpoints directly from the Swagger UI. Use the "Authorize" button to add your JWT token.

---

## Testing

### Run Unit Tests
```bash
npm run test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Generate Coverage Report
```bash
npm run test:cov
```

### Run E2E Tests
```bash
npm run test:e2e
```

---

## Development Commands

| Command | Description |
|---------|-------------|
| `npm run build` | Build the application for production |
| `npm run format` | Format code with Prettier |
| `npm run lint` | Lint code with ESLint and fix issues |
| `npm run start` | Start the application |
| `npm run start:dev` | Start in watch mode |
| `npm run start:debug` | Start with debugging |
| `npm run start:prod` | Start production build |
| `npm run test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:cov` | Generate test coverage |
| `npm run test:e2e` | Run e2e tests |
| `npm run seed` | Seed the database |

---

## Example API Usage

### 1. Register a New User
```bash
curl -X POST http://localhost:3000/user/create \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "SecurePassword123",
    "role": "user"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePassword123"
  }'
```

Response includes JWT token:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### 3. Create a Todo (Authenticated)
```bash
curl -X POST http://localhost:3000/todo/create/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Learn NestJS"
  }'
```

### 4. Get Pending Todos
```bash
curl -X GET http://localhost:3000/todo/not-completed/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 5. Mark Todo as Completed
```bash
curl -X PATCH http://localhost:3000/todo/update/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 6. Delete a Todo
```bash
curl -X DELETE http://localhost:3000/todo/delete/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Architecture

### Project Structure

```
src/
├── auth/                 # Authentication module (JWT & Local strategies)
│   ├── strategy/        # Passport strategies (JWT, Local)
│   ├── guard/           # JWT and Role-based guards
│   ├── dto/             # Login DTO
│   └── auth.service.ts  # Authentication business logic
├── user/                # User management module
│   ├── repo/            # User repository (database queries)
│   ├── dto/             # Create user DTO
│   ├── entities/        # User entity
│   └── user.service.ts  # User business logic
├── todo/                # Todo management module
│   ├── repo/            # Todo repository (database queries)
│   ├── dto/             # Create & update todo DTOs
│   ├── entities/        # Todo entity
│   └── todo.service.ts  # Todo business logic
├── config/              # Database configuration
├── database/            # Database seeds
├── utils/               # Constants and utilities
├── main.ts              # Application entry point
└── app.module.ts        # Root application module
```

### Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **NestJS** | ^11.0.1 | Framework |
| **TypeORM** | ^0.3.28 | ORM |
| **PostgreSQL** | - | Database |
| **JWT** | ^11.0.2 | Authentication |
| **Bcrypt** | ^6.0.0 | Password hashing |
| **Swagger** | ^11.4.3 | API documentation |
| **TypeScript** | ^5.7.3 | Language |
| **Jest** | ^30.0.0 | Testing |

---

## Authentication & Authorization

### JWT Authentication
- Global JWT guard protects all endpoints by default
- Public endpoints: User registration, Login
- Token-based access control for authenticated users

### Role-Based Access Control (RBAC)
- **Admin Role**: Can view all users, delete users
- **User Role**: Can manage own todos, view own profile

### Supported Roles
```typescript
- ADMIN_ROLE: 'admin'
- USER_ROLE: 'user'
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| POST | `/auth/login` | Login and get JWT token | ❌ No |

### Users
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| POST | `/user/create` | Register a new user | ❌ No |
| GET | `/user` | Get all users (Admin only) | ✅ JWT + Admin |
| GET | `/user/:id` | Get user by ID | ✅ JWT |
| DELETE | `/user/delete/:id` | Delete user (Admin only) | ✅ JWT + Admin |

### Todos
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| POST | `/todo/create/:userId` | Create a new todo | ✅ JWT |
| GET | `/todo/completed/:userId` | Get completed todos | ✅ JWT |
| GET | `/todo/not-completed/:userId` | Get pending todos | ✅ JWT |
| PATCH | `/todo/update/:id` | Toggle todo completion status | ✅ JWT |
| DELETE | `/todo/delete/:id` | Delete a todo | ✅ JWT |

**API Documentation:** Visit `http://localhost:3000/api-docs` after starting the server.

---

## Database Schema

### User Entity
```typescript
{
  id: number (PK)
  firstName: string
  lastName: string
  email: string (unique)
  password: string (hashed)
  role: string (admin/user)
  createdAt: Date
  todos: Todo[] (One-to-Many relationship)
}
```

### Todo Entity
```typescript
{
  id: number (PK)
  title: string
  completed: boolean (default: false)
  createdAt: Date
  user: User (Many-to-One relationship)
}
```

**Relationship:** One User → Many Todos (with CASCADE delete)

---

## Key Features in Detail

### User Authentication & Registration
- Secure password hashing using bcrypt
- JWT token-based stateless authentication
- Token persistence in Swagger UI for easy testing
- Login with email and password

### Todo Management
- Create todos for authenticated users
- Toggle todo completion status
- Filter todos by completion status (completed/pending)
- Delete todos with cascade from user deletion
- Todos are automatically associated with the logged-in user

### Role-Based Access Control
- Admin can view and delete any user
- Admin can access user management endpoints
- Regular users can only manage their own todos
- Role validation on protected endpoints

### Security Features
- Global JWT authentication guard
- Password hashing with bcrypt
- Email uniqueness constraint
- Role-based endpoint protection
- Input validation with class-validator
- CORS and helmet support ready

### API Documentation
- Swagger/OpenAPI 3.0 integration
- Interactive API testing in Swagger UI
- JWT authentication configuration in Swagger
- Detailed endpoint documentation with examples

---

## Module Overview

### AuthModule
Handles user authentication and JWT token generation
- **LocalStrategy**: Validates email/password credentials
- **JwtStrategy**: Validates JWT tokens
- **JwtGuard**: Protects endpoints requiring authentication
- **RoleGuard**: Protects endpoints requiring specific roles

### UserModule
Manages user registration and profile operations
- **Create**: Register new users with role assignment
- **FindAll**: Admin endpoint to list all users
- **FindOne**: Get user details by ID
- **Remove**: Admin endpoint to delete users

### TodoModule
Manages todo CRUD operations
- **Create**: Add new todos for a user
- **FindCompletedTodos**: Get completed todos by user
- **FindPendingTodos**: Get pending todos by user
- **UpdateStatus**: Toggle todo completion
- **Remove**: Delete a todo

---

## Code Quality

### Testing
- Unit tests for all services and controllers
- E2E tests for API endpoints
- Jest configuration with ts-jest
- Coverage tracking with jest coverage

### Code Standards
- ESLint configuration with TypeScript support
- Prettier for code formatting
- TypeScript strict mode enabled
- Comprehensive documentation comments

### Development Experience
- Hot reload in development mode
- Source map support for debugging
- TypeScript path aliases (@/ prefix)
- Organized module structure following NestJS best practices

---

## Project Structure Details

```
todo-app-nestjs/
├── src/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.controller.spec.ts
│   │   ├── auth.service.ts
│   │   ├── auth.service.spec.ts
│   │   ├── auth.module.ts
│   │   ├── dto/
│   │   │   └── login.dto.ts
│   │   ├── guard/
│   │   │   ├── jwt.guard.ts
│   │   │   └── role.guard.ts
│   │   └── strategy/
│   │       ├── jwt.strategy.ts
│   │       └── local.strategy.ts
│   ├── user/
│   │   ├── user.controller.ts
│   │   ├── user.controller.spec.ts
│   │   ├── user.service.ts
│   │   ├── user.service.spec.ts
│   │   ├── user.module.ts
│   │   ├── dto/
│   │   │   └── create-user.dto.ts
│   │   ├── entities/
│   │   │   └── user.entity.ts
│   │   └── repo/
│   │       └── user.repository.ts
│   ├── todo/
│   │   ├── todo.controller.ts
│   │   ├── todo.controller.spec.ts
│   │   ├── todo.service.ts
│   │   ├── todo.service.spec.ts
│   │   ├── todo.module.ts
│   │   ├── dto/
│   │   │   ├── create-todo.dto.ts
│   │   │   └── update-todo.dto.ts
│   │   ├── entities/
│   │   │   └── todo.entity.ts
│   │   └── repo/
│   │       └── todo.repository.ts
│   ├── database/
│   │   └── seeds/
│   │       └── admin.seed.ts
│   ├── config/
│   │   └── data-source.ts
│   ├── utils/
│   │   └── constants.ts
│   ├── app.module.ts
│   └── main.ts
├── test/
│   └── jest-e2e.json
├── .env.example
├── .gitignore
├── .prettierrc
├── eslint.config.mjs
├── jest.config.js
├── package.json
├── tsconfig.json
├── tsconfig.build.json
└── README.md
```

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is unlicensed. See the [LICENSE](LICENSE) file for details.

---

## Author

**Murtuza Ahmed**
- Email: murtuza.programmer@gmail.com
- GitHub: [@Murtuza-Ahmed](https://github.com/Murtuza-Ahmed)

---

## Acknowledgments

- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [TypeORM](https://typeorm.io/) - ORM for TypeScript
- [PostgreSQL](https://www.postgresql.org/) - Advanced open-source database
- [JWT](https://jwt.io/) - JSON Web Tokens for authentication
- [Swagger](https://swagger.io/) - API documentation

---

## Support

For questions or issues, please:
1. Check existing GitHub issues
2. Create a new GitHub issue with detailed description
3. Contact the author directly at murtuza.programmer@gmail.com

---

**Happy Coding! **
