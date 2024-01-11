import remarkGfm from "remark-gfm";
import Markdown from "react-markdown";

export default function Info() {
  const markdown = `
# Table of Contents
1. [What is TheForum?](#about)
2. [Creating an Account](#authentication)
3. [Anonymity & Security](#security)
3. [Content Moderation](#moderation)

## What is TheForum?

If you are here, hello 👋

TheForum is a place for the unheard voices; a place that gives you a voice. A place to share stories, rants, confessions, and more. 

## Creating an Account

Browsing content within TheForum doesn't require you to authenticate, however, creating an account allows TheForum to be interactive where you can upvote and comment on posts. To create an account, tap on the user icon from the menu below or go to [/register](https://theforum.vercel.app/register).

## Anonymity & Security

To ensure anonimity, make sure that your username does not link to your identity. TheForum's authentication process only requires you a username and a password (hashed using *bcrypt*) since emails might contain the user's identity. If you lose your password, you need to create a new account. 

## Content Moderation

TheForum is an open space, an open space that is safe. Any content that goes against TheForum's [terms of service](https://theforum.vercel.app/terms) will be removed.
`;

  return (
    <section className="prose prose-invert pb-52 container text-sm">
      <Markdown remarkPlugins={[remarkGfm]}>{markdown}</Markdown>
    </section>
  );
}
