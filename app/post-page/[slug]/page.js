import { getAllPosts, getPost } from '@/lib/contentful/graphqlSdk';
import { notFound } from 'next/navigation';
import { Post } from '@/components/post';

export async function generateStaticParams() {
  const allPosts = await getAllPosts();
  return allPosts.map((post) => ({
    slug: post.slug
  }));
}

export default async function PostPage({ params }) {
  const post = await getPost(params.slug, true);

  if (!post) {
    notFound();
  }

  // Safe to set id now that we know post exists
  post.id = post?.sys?.id;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 bg-white">
      <section className="w-full">
        <div className="container space-y-12 px-4 md:px-6">
            <Post post={post} />
        </div>
      </section>
    </main>
  );
};