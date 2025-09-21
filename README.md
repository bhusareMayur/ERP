# ERP Quiz System

A complete prototype of an ERP quiz system with tab switch detection, automatic submission, and teacher approval workflow.

## Features

### Student Portal
- **Tab Switch Detection**: Automatically detects when students switch tabs during a quiz
- **Warning System**: Shows warning popup on first tab switch
- **Auto-Submit**: Automatically submits quiz after 2+ tab switches
- **Resume Requests**: Students can request to resume their quiz after auto-submission
- **Real-time Updates**: Quiz status and tab switch count updated in real-time

### Teacher Dashboard
- **Statistics**: View counts of approved, pending, and rejected resume requests
- **Request Management**: Approve or reject student resume requests
- **Real-time Data**: Dashboard updates every 30 seconds automatically
- **Detailed View**: See student information, quiz details, and request reasons

### Backend Features
- **RESTful APIs**: Complete set of APIs for quiz management
- **MySQL Integration**: Full database integration with proper schema
- **Logging**: All tab switches are logged with timestamps
- **Request Tracking**: Resume requests stored with status tracking

## Technology Stack

- **Backend**: Node.js + Express
- **Database**: MySQL (mysql2)
- **Frontend**: HTML, CSS, JavaScript with Bootstrap 5
- **Architecture**: MVC pattern with controllers, routes, and models

## Database Schema

The system uses 5 main tables:
- `students`: Student information
- `quizzes`: Quiz details
- `quiz_attempts`: Quiz attempt tracking with status
- `quiz_tab_switches`: Tab switch logging
- `resume_requests`: Resume request management

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL Server
- Git (optional)

### Step-by-Step Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Setup MySQL Database**
   - Start MySQL server
   - Create database and tables by running the SQL script:
   ```bash
   mysql -u root -p < database/schema.sql
   ```
   - Or manually run the SQL commands from `database/schema.sql`

3. **Configure Database Connection**
   - Database configuration is in `backend/models/database.js`
   - Default settings:
     - Host: localhost
     - User: root
     - Password: Mayur@1234
     - Database: ERP
   - Modify these settings if your MySQL setup is different

4. **Start the Application**
   ```bash
   npm start
   ```
   
   For development with auto-restart:
   ```bash
   npm run dev
   ```

5. **Access the Application**
   - Student Quiz Portal: http://localhost:3000
   - Teacher Dashboard: http://localhost:3000/teacher

## API Endpoints

### Quiz APIs
- `POST /api/quiz/:quizId/tab-switch` - Log tab switch and handle auto-submission
- `POST /api/quiz/:quizId/resume-request` - Create resume request
- `GET /api/quiz/:quizId` - Get quiz details
- `GET /api/quiz/:quizId/student/:studentId/status` - Get attempt status

### Teacher APIs
- `GET /api/teacher/resume-requests` - Get all resume requests
- `GET /api/teacher/requests-summary` - Get request statistics
- `POST /api/teacher/resume-requests/:id/approve` - Approve resume request
- `POST /api/teacher/resume-requests/:id/reject` - Reject resume request

## Project Structure

```
/backend
  server.js                 # Main server file
  /controllers
    quizController.js       # Quiz-related business logic
    teacherController.js    # Teacher dashboard logic
  /models
    database.js            # Database connection
  /routes
    quiz.js               # Quiz API routes
    teacher.js            # Teacher API routes

/frontend
  index.html              # Student quiz page
  teacher.html           # Teacher dashboard
  /css
    style.css             # Custom styles
  /js
    quiz.js              # Student quiz functionality
    teacher.js           # Teacher dashboard functionality

/database
  schema.sql             # Database schema and sample data
```

## Usage Instructions

### For Students
1. Navigate to the quiz portal (http://localhost:3000)
2. Answer the quiz questions
3. Avoid switching tabs (will trigger warnings and auto-submission)
4. If auto-submitted, provide a reason and request resume

### For Teachers
1. Navigate to the teacher dashboard (http://localhost:3000/teacher)
2. View statistics of resume requests
3. Review pending requests in the table
4. Approve or reject requests as needed

## Configuration

### Database Settings
Modify `backend/models/database.js` to change database connection settings.

### Demo Data
The system uses dummy data:
- Student ID: 1 (John Doe)
- Quiz ID: 1 (JavaScript Fundamentals)

### Customization
- Add more quiz questions in the frontend HTML
- Modify tab switch threshold in `quizController.js`
- Customize UI styles in `frontend/css/style.css`

## Security Features

- Input validation on all API endpoints
- SQL injection prevention using parameterized queries
- CORS protection
- Proper error handling and logging

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure MySQL server is running
   - Check database credentials in `backend/models/database.js`
   - Make sure the ERP database exists

2. **Port Already in Use**
   - Change the PORT in `backend/server.js`
   - Or stop the process using port 3000

3. **Tab Switch Not Detected**
   - Ensure you're using a modern browser
   - The detection works on actual tab switching, not just clicking elsewhere

### Debug Mode
Set `NODE_ENV=development` to enable detailed error logging.

## License

This is a prototype project for educational purposes.