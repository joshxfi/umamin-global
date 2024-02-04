import remarkGfm from "remark-gfm";
import Markdown from "react-markdown";

export default function Info() {
  const markdown = `
# Table of Contents
1. [Creating an Account](#authentication)
2. [Anonymity & Security](#security)

## Creating an Account

Browsing content within Umamin Global doesn't require you to authenticate, however, creating an account allows Umamin Global to be interactive where you can upvote and comment on posts. 

To create an account, tap on the user icon from the menu below or go to [/login](https://global.umamin.link/login).

## Anonymity & Security

To ensure anonimity, make sure that your username does not link to your identity.

Any content that goes against Umamin Global's [terms of service](https://global.umamin.link/terms) will be removed.
`;

  return (
    <section className="prose prose-invert pb-52 container text-sm">
      <Markdown remarkPlugins={[remarkGfm]}>{markdown}</Markdown>
    </section>
  );
}
