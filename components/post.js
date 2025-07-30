/*
  We have to make this a client component to use the `useContentfulInspectorMode` and `useContentfulLiveUpdates` hooks to enable live preview mode.
  This does not mean it is rendered on the client, but that the HTML, CSS and JavaScript are shipped to the client to hydrate the page.
  This is necessary because we need interactivity to enable live preview mode.
*/
'use client';

import dayjs from "dayjs";

import {
  useContentfulInspectorMode,
  useContentfulLiveUpdates,
} from '@contentful/live-preview/react';

import PostAuthor from "./postAuthor";

export const Post = ({ post }) => {

  const livePost = useContentfulLiveUpdates(post);
  const inspectorProps = useContentfulInspectorMode({ entryId: post.id });

  const postDate = dayjs(post.date).format(" dddd D MMMM, YYYY");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <article className="max-w-4xl mx-auto px-6 py-16 lg:px-8">
        
        {/* Header Section */}
        <header className="mb-12 space-y-8">
          
          {/* Title */}
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight"
            {...inspectorProps({ fieldId: 'title' })} >
            {livePost.title}
          </h1>

          {/* Summary */}
          <div className="border-l-4 border-blue-500 pl-6 py-2">
            <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed font-light"
              {...inspectorProps({ fieldId: 'summary' })} >
              {livePost.summary}
            </p>
          </div>

          {/* Author Section */}
          <div className="flex items-center space-x-4 pt-6 border-t border-gray-200">
            <PostAuthor
              author={livePost.author}
              date={postDate}
              inspectorProps={inspectorProps} />
          </div>

        </header>

        {/* Content Section */}
        <section className="prose prose-lg max-w-none">
          
          {/* Excerpt */}
          <div className="bg-gray-50 rounded-lg p-8 border-l-4 border-gray-300"
               {...inspectorProps({ fieldId: 'excerpt' })} >
            <p className="text-lg text-gray-800 leading-relaxed italic">
              {livePost.excerpt}
            </p>
          </div>

        </section>

      </article>
    </div>
  );
};