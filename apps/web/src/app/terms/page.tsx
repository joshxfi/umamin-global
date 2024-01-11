import remarkGfm from "remark-gfm";
import Markdown from "react-markdown";

export default function Terms() {
  const markdown = `
# Terms of Service

Welcome to TheForum! We're excited to have you join our community. Before you dive in, please take a moment to read and understand our Terms of Service.

## 1. Acceptance of Terms

By using TheForum, you agree to abide by these Terms of Service. If you do not agree with any part of these terms, please refrain from using our platform.

## 2. User Conduct

- **Respectful Communication:** TheForum is a space for positive and constructive dialogue. Users are prohibited from targeting specific individuals or engaging in personal attacks.

- **No Harassment or Discrimination:** Harassment, racism, discrimination, and any form of hate speech will not be tolerated on TheForum. We aim to create a safe and inclusive environment for all users.

## 3. Account Security

- **Protect Your Account:** Users are responsible for maintaining the security of their accounts. Do not share your password or allow others to access your account without authorization.

- **Reporting Violations:** If you come across any content or behavior that violates these terms, please report it to our moderation team.

## 4. Termination of Accounts

TheForum reserves the right to terminate or suspend user accounts that violate these terms. We may also remove content that goes against our guidelines.

## 5. Changes to Terms

TheForum may update these Terms of Service from time to time. Users will be notified of any significant changes, and continued use of the platform constitutes acceptance of the updated terms.

`;

  return (
    <section className="container prose prose-invert pb-52 text-sm">
      <Markdown remarkPlugins={[remarkGfm]}>{markdown}</Markdown>
    </section>
  );
}
