<div align="center">
  <img src="public/favicon.svg" alt="CodeCompass Logo" width="120">
  <h1>CodeCompass</h1>
  <p><strong>Stop Guessing. Start Growing.</strong></p>
  <p>An AI-powered mentor that analyzes your code to create a personalized learning path.</p>
  
  <p>
    <a href="https://codecompass-tau.vercel.app/"><strong>View Live Demo »</strong></a>
  </p>
  
  <img src="https://img.shields.io/badge/status-MVP-brightgreen" alt="Status">
  <img src="https://img.shields.io/badge/license-MIT-blue" alt="License">
  <img src="https://img.shields.io/github/stars/bit2swaz/codecompass?style=social" alt="GitHub Stars">
</div>

---

## 🧭 About The Project

CodeCompass is a web application designed to help developers accelerate their growth by providing targeted, actionable feedback on their own code. Instead of following generic tutorials, developers can submit their public GitHub repositories to receive a personalized analysis that identifies conceptual gaps, security risks, and areas for improvement.

The core of CodeCompass is an AI engine that not only finds issues but also explains the "why" behind them and provides a clear, step-by-step solution, turning every project into a valuable learning opportunity.

## ✨ Key Features

- **GitHub Integration:** Securely sign in with your GitHub account.
- **AI-Powered Code Analysis:** Submit any public repository URL for a deep code analysis.
- **Opportunity Detection:** Identifies issues like hardcoded secrets, prop drilling, and more.
- **Personalized Feedback:** The AI generates easy-to-understand explanations and actionable solutions for every opportunity found.
- **Interactive Dashboard:** Track your analysis history and see your progress over time.

## 🛠️ Built With

This project is built on a modern, type-safe, and highly performant tech stack.

- **[T3 Stack](https://create.t3.gg/)**
  - **[Next.js](https://nextjs.org/)** (React Framework)
  - **[tRPC](https://trpc.io/)** (Type-safe APIs)
  - **[Prisma](https://www.prisma.io/)** (Next-gen ORM)
  - **[Tailwind CSS](https://tailwindcss.com/)** (Styling)
  - **[NextAuth.js](https://next-auth.js.org/)** (Authentication)
- **[Google Gemini API](https://ai.google.dev/)** for AI-powered code interpretation.
- **[Vercel](https://vercel.com/)** for hosting and database.

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- A Vercel account for the database

### Installation

1.  **Clone the repo**
    ```sh
    git clone [https://github.com/bit2swaz/codecompass.git](https://github.com/bit2swaz/codecompass.git)
    ```
2.  **Install NPM packages**
    ```sh
    npm install
    ```
3.  **Set up your environment variables**
    - Copy the `.env.example` file to a new file named `.env`.
    - Create a **GitHub OAuth App** to get your `AUTH_GITHUB_ID` and `AUTH_GITHUB_SECRET`.
    - Create a **Vercel Postgres** database and fill in the `POSTGRES_*` variables.
    - Get a **Google Gemini API Key** and add it as `GEMINI_API_KEY`.
4.  **Sync your database schema**
    ```sh
    npx prisma db push
    ```
5.  **Run the development server**
    ```sh
    npm run dev
    ```

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 🙏 Acknowledgements

- **Theo - T3 Stack:** For creating the incredible stack that powers this project.
- **Vercel:** For their seamless hosting and database solutions.
- **Google:** For the powerful Gemini API.
