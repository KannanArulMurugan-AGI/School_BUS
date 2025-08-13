# Parent Web Application

This is the parent-facing web application for the School Bus Tracking System. It allows parents to view the real-time location of their children's school bus on a map. The application is built with React and Tailwind CSS.

## Key Features
- Secure user registration and login
- Real-time map view of bus locations
- Subscription to live data from Firebase
- Route selection and information display
- Notification system for alerts and updates
- Responsive design for mobile and desktop browsers

## Configuration

This project uses Firebase for its backend services. To connect the application to your Firebase project, you will need to provide your Firebase configuration.

1.  **Create a `.env.local` file:**
    In the root of the `parent-web` directory, create a new file named `.env.local`.

2.  **Copy from the example:**
    Copy the contents of the `.env.example` file into your new `.env.local` file.

3.  **Add your Firebase credentials:**
    Replace the placeholder values in `.env.local` with your actual Firebase project configuration. You can find these details in your [Firebase project settings](https://console.firebase.google.com/).

    Your `.env.local` file should look like this:

    ```
    REACT_APP_FIREBASE_API_KEY=your_api_key
    REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
    REACT_APP_FIREBASE_DATABASE_URL=your_database_url
    REACT_APP_FIREBASE_PROJECT_ID=your_project_id
    REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    REACT_APP_FIREBASE_APP_ID=your_app_id
    ```

    **Important:** Do not commit the `.env.local` file to version control. The `.gitignore` file is already configured to ignore it.
