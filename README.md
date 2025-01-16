

Events Dashboard
The Events Dashboard is a React application that allows users to view, join, and manage events. It utilizes the NextUI component library for a modern and responsive design and Lucide React for scalable vector icons. The application fetches event data from a backend API and provides functionalities such as joining and leaving events.

Features
Event Listings: Displays a list of upcoming and past events with details such as title, description, date, time, and number of attendees.
User Events: Allows users to view and manage events they are participating in.
Join/Leave Events: Enables users to join upcoming events and leave events they are currently attending.
Responsive Design: Ensures the application is accessible and user-friendly across various devices.
Technologies Used
React: A JavaScript library for building user interfaces.
NextUI: A React component library for building accessible and customizable user interfaces.
Lucide React: A collection of high-quality, customizable icons for React applications. 
LUCIDE
React Router: A library for handling routing in React applications.
React Toastify: A library for adding toast notifications to React applications.
Installation
Clone the Repository:

bash
Copy
Edit
git clone https://github.com/your-username/events-dashboard.git
Navigate to the Project Directory:

bash
Copy
Edit
cd events-dashboard
Install Dependencies:

bash
Copy
Edit
npm install
Start the Development Server:

bash
Copy
Edit
npm start

Usage
Viewing Events: Upon loading, the dashboard displays a list of all upcoming events.
Managing Events: Users can view events they are participating in and leave them if desired.
Joining Events: Users can join upcoming events by clicking the "Join Event" button.
API Endpoints
The application interacts with the following API endpoints:

Get All Events: GET http://localhost:4000/api/v1/event/get-all-events

Get User Events: GET http://localhost:4000/api/v1/event/get-all-event

Get Past Events: GET http://localhost:4000/api/v1/event/get-past-event

Join Event: POST http://localhost:4000/api/v1/event/join/{eventId}

Leave Event: POST http://localhost:4000/api/v1/event/leave/{eventId}

Credentials
Id: test@gmail.com
Password: Test@12345

Contributing
Fork the Repository: Click the "Fork" button at the top right of this page.

Clone Your Fork:

bash
Copy
Edit
git clone https://github.com/your-username/events-dashboard.git
Create a New Branch:

bash
Copy
Edit
git checkout -b feature/your-feature
Make Your Changes: Implement your feature or fix.

Commit Your Changes:

bash
Copy
Edit
git add .
git commit -m "Add your commit message"
Push to Your Fork:

bash
Copy
Edit
git push origin feature/your-feature
Create a Pull Request: Navigate to the original repository and click "New Pull Request".

License
This project is licensed under the MIT License.

Acknowledgments
NextUI: For providing a comprehensive and accessible component library.
Lucide React: For offering a collection of high-quality icons.
React Router: For enabling dynamic routing in React applications.
React Toastify: For facilitating toast notifications in React applications.
