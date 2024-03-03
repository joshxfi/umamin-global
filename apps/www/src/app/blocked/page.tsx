import remarkGfm from "remark-gfm";
import Markdown from "react-markdown";

export default function Info() {
  const markdown = `
## Why Did This Happen? 
Our system has detected that you've made too many requests within a short period. This is likely due to reaching the limit set for accessing our services.

## What Can You Do?
- **Contact Support**: If you believe this message is a mistake or if you need urgent assistance, don't hesitate to reach out to our support team for help.

We appreciate your understanding and cooperation in maintaining the quality and reliability of our services.

`;

  return (
    <section className="prose prose-invert pb-52 container text-sm">
      <Markdown remarkPlugins={[remarkGfm]}>{markdown}</Markdown>
    </section>
  );
}
