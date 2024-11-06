# Image Background Remover

This project allows users to easily remove the background from their images using a credit-based system. The project is divided into two parts: the **Client** and the **Server**.

Upon creating an account, users receive free credits and can purchase more credits as needed. Different plans are available to suit users' needs.

## Features

- **User registration:** Upon signing up, users receive 5 free credits.
- **Background removal:** Users can upload an image to remove its background.
- **Credit system:** After using up the free credits, users can purchase more credits in three different plans:
  - **Basic:** $10 for 100 credits
  - **Advanced:** $50 for 500 credits
  - **Business:** $250 for 5000 credits
- **Authentication:** Uses **Clerk** for managing user login and authentication.

## Project Structure

This project is split into two parts:

- **Client:** The frontend application where users interact with the image background removal tool.
- **Server:** The backend API that handles payment processing, credit management, and background removal tasks.

### Client

The **Client** is responsible for:
- User authentication via **Clerk**
- Handling user interactions, including image uploads and background removal
- Displaying credits and payment options

### Server

The **Server** is responsible for:
- Handling API requests for image background removal
- Managing user credits stored in **MongoDB**
- Integrating with **Stripe** for payment processing and credit purchases
- Verifying payments and updating user credits
- Integrating with the **ClipDrop API** for background removal

## Technologies Used

- **Frontend:**
  - **React**: JavaScript library for building user interfaces.
  - **Tailwind CSS**: A utility-first CSS framework for responsive and customizable styling.
  - **Clerk**: Authentication system to manage user logins and accounts.

- **Backend:**
  - **MERN Stack:**
    - **MongoDB**: NoSQL database for storing user data and credits.
    - **Express**: Web framework for Node.js to handle API requests.
    - **React**: On the client side, responsible for UI rendering.
    - **Node.js**: JavaScript runtime to run the server.
  - **ClipDrop API**: Provides background removal functionality for images.
  - **Stripe**: To process payments and manage credit purchases.
  - **REST API**: To handle payment and credit verification operations.



### Project finished

1. **Access the Project:** [Click here to access the project](https://bg-removal-jkmd.vercel.app/).
2. **Create an account:** Sign up to get 5 free credits.
3. **Upload your image:** Upload the image you want to remove the background from.
4. **Remove the background:** Once the image is uploaded, the background will be automatically removed using **ClipDrop API**.
5. **Buy more credits:** If your credits run out, you can choose a plan to purchase more credits.

## Deployment

The **Client** and **Server** is deployed on [Vercel](https://vercel.com/)

## License

This project is licensed under the [MIT License](LICENSE).


