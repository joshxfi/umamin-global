/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\nquery GetPosts($cursorId: ID) {\n  getPosts(cursorId: $cursorId) {\n    cursorId\n    data {\n      id\n      content\n      createdAt\n      isAnonymous\n      author {\n        id\n        username\n        image\n      }\n      tags {\n        id\n        name\n      }\n      upvotes {\n        id\n        userId\n      }\n      _count {\n        comments\n      }\n    }\n  }\n}\n": types.GetPostsDocument,
    "\nquery GetPost($postId: ID!) {\n  getPost(postId: $postId) {\n    id\n    content\n    createdAt\n    isAnonymous\n    author {\n      id\n      image\n      username\n    }\n    tags {\n      id\n      name\n    }\n    upvotes {\n      id\n      userId\n    }\n    comments {\n      id\n      content\n      createdAt\n      isAnonymous\n      author {\n        id\n        image\n        username\n      }\n      upvotes {\n        id\n        userId\n      }\n    }\n  }\n}\n": types.GetPostDocument,
    "\nquery GetUsers($role: Role!) {\n  getUsers(role: $role) {\n    id\n    username\n  }\n}\n": types.GetUsersDocument,
    "\nmutation setUserRole($role: Role!, $username: String!) {\n  setUserRole(role: $role, username: $username) {\n    id\n    username\n  }\n}\n": types.SetUserRoleDocument,
    "\nquery GetTags {\n  getTags {\n    id\n    name\n  }\n}\n": types.GetTagsDocument,
    "\nmutation AddTag($name: String!) {\n  addTag(name: $name) {\n    id\n    name\n  }\n}\n": types.AddTagDocument,
    "\nmutation RemoveTag($tagId: ID!) {\n  removeTag(id: $tagId)\n}\n": types.RemoveTagDocument,
    "\nmutation RemovePost($postId: ID!) {\n  removePost(postId: $postId)\n}\n": types.RemovePostDocument,
    "\nmutation AddTagToPost($postId: ID!, $tagName: String!) {\n  addTagToPost(postId: $postId, tagName: $tagName) {\n    id\n    name\n  }\n}\n": types.AddTagToPostDocument,
    "\nmutation RemoveTagOnPost($postId: ID!, $tagName: String!) {\n  removeTagOnPost(postId: $postId, tagName: $tagName)\n}\n": types.RemoveTagOnPostDocument,
    "\nmutation AddPost($isAnonymous: Boolean!, $content: String!) {\n  addPost(isAnonymous: $isAnonymous, content: $content) {\n    id\n    content\n    createdAt\n    isAnonymous\n    author {\n      id\n      image\n      username\n    }\n  }\n}\n": types.AddPostDocument,
    "\nmutation AddUpvote($postId: ID!) {\n  addUpvote(postId: $postId) {\n    id\n  }\n}\n": types.AddUpvoteDocument,
    "\nmutation RemoveUpvote($upvoteId: ID!) {\n  removeUpvote(id: $upvoteId) \n}\n": types.RemoveUpvoteDocument,
    "\nmutation AddComment($postId: ID!, $isAnonymous: Boolean!, $content: String!) {\n  addComment(postId: $postId, isAnonymous: $isAnonymous, content: $content) {\n    id\n    content\n    createdAt\n    isAnonymous\n    author {\n      id\n      image\n      username\n    }\n  }\n}\n": types.AddCommentDocument,
    "\nquery GetUserPosts($input: UserPostsInput!) {\n  getUserPosts(input: $input) {\n    cursorId\n    data {\n      id\n      content\n      createdAt\n      isAnonymous\n      author {\n        id\n        username\n        image\n      }\n      tags {\n        id\n        name\n      }\n      upvotes {\n        id\n        userId\n      }\n      _count {\n        comments\n      }\n    }\n  }\n}\n": types.GetUserPostsDocument,
    "\nquery GetUser($username: String!) {\n  getUser(username: $username) {\n    id\n    createdAt\n    username\n    image\n    bio\n  }\n}\n": types.GetUserDocument,
    "\nmutation SetUsername($username: String!) {\n  setUsername(username: $username)\n}\n": types.SetUsernameDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery GetPosts($cursorId: ID) {\n  getPosts(cursorId: $cursorId) {\n    cursorId\n    data {\n      id\n      content\n      createdAt\n      isAnonymous\n      author {\n        id\n        username\n        image\n      }\n      tags {\n        id\n        name\n      }\n      upvotes {\n        id\n        userId\n      }\n      _count {\n        comments\n      }\n    }\n  }\n}\n"): (typeof documents)["\nquery GetPosts($cursorId: ID) {\n  getPosts(cursorId: $cursorId) {\n    cursorId\n    data {\n      id\n      content\n      createdAt\n      isAnonymous\n      author {\n        id\n        username\n        image\n      }\n      tags {\n        id\n        name\n      }\n      upvotes {\n        id\n        userId\n      }\n      _count {\n        comments\n      }\n    }\n  }\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery GetPost($postId: ID!) {\n  getPost(postId: $postId) {\n    id\n    content\n    createdAt\n    isAnonymous\n    author {\n      id\n      image\n      username\n    }\n    tags {\n      id\n      name\n    }\n    upvotes {\n      id\n      userId\n    }\n    comments {\n      id\n      content\n      createdAt\n      isAnonymous\n      author {\n        id\n        image\n        username\n      }\n      upvotes {\n        id\n        userId\n      }\n    }\n  }\n}\n"): (typeof documents)["\nquery GetPost($postId: ID!) {\n  getPost(postId: $postId) {\n    id\n    content\n    createdAt\n    isAnonymous\n    author {\n      id\n      image\n      username\n    }\n    tags {\n      id\n      name\n    }\n    upvotes {\n      id\n      userId\n    }\n    comments {\n      id\n      content\n      createdAt\n      isAnonymous\n      author {\n        id\n        image\n        username\n      }\n      upvotes {\n        id\n        userId\n      }\n    }\n  }\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery GetUsers($role: Role!) {\n  getUsers(role: $role) {\n    id\n    username\n  }\n}\n"): (typeof documents)["\nquery GetUsers($role: Role!) {\n  getUsers(role: $role) {\n    id\n    username\n  }\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nmutation setUserRole($role: Role!, $username: String!) {\n  setUserRole(role: $role, username: $username) {\n    id\n    username\n  }\n}\n"): (typeof documents)["\nmutation setUserRole($role: Role!, $username: String!) {\n  setUserRole(role: $role, username: $username) {\n    id\n    username\n  }\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery GetTags {\n  getTags {\n    id\n    name\n  }\n}\n"): (typeof documents)["\nquery GetTags {\n  getTags {\n    id\n    name\n  }\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nmutation AddTag($name: String!) {\n  addTag(name: $name) {\n    id\n    name\n  }\n}\n"): (typeof documents)["\nmutation AddTag($name: String!) {\n  addTag(name: $name) {\n    id\n    name\n  }\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nmutation RemoveTag($tagId: ID!) {\n  removeTag(id: $tagId)\n}\n"): (typeof documents)["\nmutation RemoveTag($tagId: ID!) {\n  removeTag(id: $tagId)\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nmutation RemovePost($postId: ID!) {\n  removePost(postId: $postId)\n}\n"): (typeof documents)["\nmutation RemovePost($postId: ID!) {\n  removePost(postId: $postId)\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nmutation AddTagToPost($postId: ID!, $tagName: String!) {\n  addTagToPost(postId: $postId, tagName: $tagName) {\n    id\n    name\n  }\n}\n"): (typeof documents)["\nmutation AddTagToPost($postId: ID!, $tagName: String!) {\n  addTagToPost(postId: $postId, tagName: $tagName) {\n    id\n    name\n  }\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nmutation RemoveTagOnPost($postId: ID!, $tagName: String!) {\n  removeTagOnPost(postId: $postId, tagName: $tagName)\n}\n"): (typeof documents)["\nmutation RemoveTagOnPost($postId: ID!, $tagName: String!) {\n  removeTagOnPost(postId: $postId, tagName: $tagName)\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nmutation AddPost($isAnonymous: Boolean!, $content: String!) {\n  addPost(isAnonymous: $isAnonymous, content: $content) {\n    id\n    content\n    createdAt\n    isAnonymous\n    author {\n      id\n      image\n      username\n    }\n  }\n}\n"): (typeof documents)["\nmutation AddPost($isAnonymous: Boolean!, $content: String!) {\n  addPost(isAnonymous: $isAnonymous, content: $content) {\n    id\n    content\n    createdAt\n    isAnonymous\n    author {\n      id\n      image\n      username\n    }\n  }\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nmutation AddUpvote($postId: ID!) {\n  addUpvote(postId: $postId) {\n    id\n  }\n}\n"): (typeof documents)["\nmutation AddUpvote($postId: ID!) {\n  addUpvote(postId: $postId) {\n    id\n  }\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nmutation RemoveUpvote($upvoteId: ID!) {\n  removeUpvote(id: $upvoteId) \n}\n"): (typeof documents)["\nmutation RemoveUpvote($upvoteId: ID!) {\n  removeUpvote(id: $upvoteId) \n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nmutation AddComment($postId: ID!, $isAnonymous: Boolean!, $content: String!) {\n  addComment(postId: $postId, isAnonymous: $isAnonymous, content: $content) {\n    id\n    content\n    createdAt\n    isAnonymous\n    author {\n      id\n      image\n      username\n    }\n  }\n}\n"): (typeof documents)["\nmutation AddComment($postId: ID!, $isAnonymous: Boolean!, $content: String!) {\n  addComment(postId: $postId, isAnonymous: $isAnonymous, content: $content) {\n    id\n    content\n    createdAt\n    isAnonymous\n    author {\n      id\n      image\n      username\n    }\n  }\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery GetUserPosts($input: UserPostsInput!) {\n  getUserPosts(input: $input) {\n    cursorId\n    data {\n      id\n      content\n      createdAt\n      isAnonymous\n      author {\n        id\n        username\n        image\n      }\n      tags {\n        id\n        name\n      }\n      upvotes {\n        id\n        userId\n      }\n      _count {\n        comments\n      }\n    }\n  }\n}\n"): (typeof documents)["\nquery GetUserPosts($input: UserPostsInput!) {\n  getUserPosts(input: $input) {\n    cursorId\n    data {\n      id\n      content\n      createdAt\n      isAnonymous\n      author {\n        id\n        username\n        image\n      }\n      tags {\n        id\n        name\n      }\n      upvotes {\n        id\n        userId\n      }\n      _count {\n        comments\n      }\n    }\n  }\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery GetUser($username: String!) {\n  getUser(username: $username) {\n    id\n    createdAt\n    username\n    image\n    bio\n  }\n}\n"): (typeof documents)["\nquery GetUser($username: String!) {\n  getUser(username: $username) {\n    id\n    createdAt\n    username\n    image\n    bio\n  }\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nmutation SetUsername($username: String!) {\n  setUsername(username: $username)\n}\n"): (typeof documents)["\nmutation SetUsername($username: String!) {\n  setUsername(username: $username)\n}\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;