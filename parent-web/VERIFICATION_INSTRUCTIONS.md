# Verification Instructions

To verify the changes, please follow these steps:

## 1. Set up Firebase

1.  Create a `.env` file in the `parent-web` directory.
2.  Add your Firebase project credentials to the `.env` file. The file should look like this:

    ```
    REACT_APP_FIREBASE_API_KEY=your_api_key
    REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
    REACT_APP_FIREBASE_DATABASE_URL=your_database_url
    REACT_APP_FIREBASE_PROJECT_ID=your_project_id
    REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    REACT_APP_FIREBASE_APP_ID=your_app_id
    ```

## 2. Start the backend service

1.  Open a new terminal.
2.  Navigate to the `subscription-manager` directory:
    ```bash
    cd ../subscription-manager
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Start the backend service:
    ```bash
    npm start
    ```
    The service should be running on `http://localhost:3000`.

## 3. Start the frontend application

1.  Open another new terminal.
2.  Navigate to the `parent-web` directory:
    ```bash
    cd ../parent-web
    ```
3.  Start the frontend application:
    ```bash
    npm start
    ```
    The application should open in your browser at `http://localhost:3001` (or another available port).

## 4. Test the application

1.  Open the application in your browser.
2.  You should see a login form. Enter a valid email and tenant ID that exists in your system.
3.  Click "Sign In".
4.  If the login is successful, you should be redirected to the map view.
5.  To see the bus marker, you need to have live location data being published to your Firebase Realtime Database at the path `schools/{tenantId}/routes/route-1/live`. The `MapView.js` component is currently hardcoded to look for `route-1`.

    You can manually add some data to your Firebase console to test this. For example:
    - Path: `schools/your-tenant-id/routes/route-1/live`
    - Data: `{ "lat": 37.422, "lng": -122.084 }`

    The marker on the map should appear at the specified location.
