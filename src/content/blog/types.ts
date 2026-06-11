import type {ComponentType} from 'react';

export interface PostMetaBase {
  slug: string;
  title: string;
  /** ISO date string (publish date). */
  date: string;
  tags: string[];
  excerpt: string;
  /** Bundled asset URL for the cover image. */
  coverImage?: string;
}

export interface MarkdownPost extends PostMetaBase {
  kind: 'markdown';
  content: string;
}

export interface ReactPost extends PostMetaBase {
  kind: 'react';
  Component: ComponentType;
}

export type Post = MarkdownPost | ReactPost;
