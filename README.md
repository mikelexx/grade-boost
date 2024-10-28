*GradeBoost*

GradeBoost is an educational web platform that offers students and educators access to a comprehensive library of study materials, including lecture notes, assignments, past papers, marking schemes, and exam solutions. Users can view, download, or save materials shared by others, and they are encouraged to upload their own study materials to contribute to the community.


**Table of Contents**
1. [Features](#features)
2. [Demo](#demo)
3. [Tech Stack](stack)
4. [Getting Started](#getting-started)
5. [Project Structure](#project-structure)
6. [Environment Variables](#environment-variables)
7. [Firebase Integration](#firebase-integration)
8. [Search and Filtering](#search-and-filtering)
9. [Authentication](#authentication)
10. [Cloud Functions and Hosting](cloud-functions-and-hosting)
11. [Contributing](#contributing)
12. [License](#demo)

**Features**

***User Authentication***: Users can sign up or log in with their email and password or through social providers like Google.
***File Uploads***: Users can upload study materials with metadata (e.g., university, course code) to help categorize and search for materials.
***Dynamic Search and Filters***: Advanced searching and filtering by material type (e.g., assignments, notes) and categories like "Engineering > Electrical Engineering."
***Download Limits***: New users can download a limited number of files until they start contributing.
***Saved Materials***: Users can save favorite materials for easy access.
***Thumbnail Generation***: Thumbnails are generated on the client side for uploaded materials to enhance the user experience.
***Admin and User Analytics***: Basic usage analytics and monitoring.

**Demo**
To view a demo of GradeBoost, [click here](https://youtu.be/sPL0t33Z1ws?feature=shared)

**Tech Stack**

***Frontend***: Next.js, Tailwind CSS, React, TypeScript
***Backend***: Firebase Authentication, Firestore, Firebase Storage, Firebase Cloud Functions
***Additional Libraries***:
react-icons: For action icons (save, download, etc.)
pdfjs-dist: For PDF thumbnail generation and previews

**Getting Started**
1. ***Prerequisites***
- Node.js version 20
- Firebase CLI
- Git
- Installation
2. ***Clone the Repository***:

bash
```
git clone https://github.com/mikelexx/gradeboost.git
cd gradeboost

```
3. ***Install Dependencies***:
bash
```
npm install

```

4. ***Configure Firebase***:
- Set up a Firebase project in the Firebase Console.
- Enable Firestore, Firebase Storage, and Firebase Authentication in your project.
- Upgrade to the Blaze plan to support Cloud Functions if needed.
**Environment Variables**: Copy your firebase project keys  to `.env.local` and fill in the necessary Firebase configuration details.
Set up .env.local as follows:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

```


5. ***Run the Development Server***:
bash
```
npm run dev
```

6. ***Build for Production:***
bash
```
npm run build
```
**Project Structure**
```
GradeBoost/
├── app/
│   ├── components/
│   ├── services/
│   ├── uploads/
│   ├── navbars/
│   └── ...
├── public/
├── services/
├── types/
├── .env.local
└── README.md

```
**components**: Reusable UI components (e.g., `UploadButton.tsx`, `RecentItems.tsx`).
**services**: Firebase service files (e.g., ` firebaseUser.ts`, `firebaseFile.ts`).
**types**: TypeScript types/interfaces (e.g., `Material`, `Result`).
Ensure your Firebase credentials are correctly configured in this file for both development and production environments.

*Firebase Integration*

*Authentication*

Firebase Authentication is used to manage user accounts. Users can sign in using email/password or OAuth providers like Google. Firebase’s auth.currentUser is used to manage the current user's state and permissions across the site.

Firestore

Firestore is the primary database for storing user profiles, file metadata, and download limits.

Cloud Functions[Future]
Cloud Functions handle the following:

Thumbnail Generation : To handle image optimizations, e.g., generating PDF thumbnails.

Search and Filtering

The search feature allows users to search for materials based on keywords, tags, and categories. It’s optimized to work with Firestore but can be enhanced by integrating Algolia or Typesense for advanced indexing and search capabilities.

Tag-Based Search

During file uploads, filenames and course codes are split into tags. Users can search materials by course code or related tags.

Category Filters

Users can filter by predefined categories. Checkboxes allow for selecting one or more types of materials to display relevant results dynamically.

Authentication

Authentication is implemented using Firebase Auth, providing access to session-based storage for logged-in users. The UploadButton.tsx and Download.tsx components internally check for authentication before permitting any actions.
*Cloud Functions and Hosting*

Firebase Cloud Functions provide server-side support for handling specific tasks, including optional image optimization for uploaded materials.

Note: Deploying with Cloud Functions requires the Blaze plan, as it enables the necessary APIs (cloudfunctions.googleapis.com, artifactregistry.googleapis.com, and cloudbuild.googleapis.com).

*Contributing*
Contributions are welcome! Feel free to open a pull request with any enhancements or bug fixes. Please ensure all pull requests follow the guidelines in the CONTRIBUTING.md file.

1. Fork the repository.
2. Create your feature branch (git checkout -b feature/YourFeature).
3. Commit your changes (git commit -m 'Add some feature').
4. Push to the branch (git push origin feature/YourFeature).
5. Open a pull request.

*License*
Not yet
