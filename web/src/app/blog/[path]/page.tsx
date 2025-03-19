import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'
import { notFound } from 'next/navigation'
import Link from 'next/link'

async function getBlogContent(blogPath: string) {
  const docsDir = path.join(process.cwd(), '..', 'docs')
  const categories = await fs.readdir(docsDir)
  
  for (const category of categories) {
    try {
      const filePath = path.join(docsDir, category, `${blogPath}.md`)
      const content = await fs.readFile(filePath, 'utf-8')
      const { data, content: markdown } = matter(content)
      return { metadata: data, content: marked(markdown) }
    } catch (e) {
      continue
    }
  }
  
  return null
}

export default async function BlogPage({ params }: { params: { path: string } }) {
  const blog = await getBlogContent(params.path)
  
  if (!blog) {
    notFound()
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link 
          href="/"
          className="inline-flex items-center text-sm text-gray-600 hover:text-emerald-600 mb-8 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回列表
        </Link>
        
        <article>
          <header className="mb-12">
            <div className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-emerald-50 text-emerald-600 mb-4">
              {blog.metadata.category}
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {blog.metadata.title}
            </h1>
            <div className="flex items-center text-sm text-gray-500 space-x-4">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {blog.metadata.date}
              </span>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {blog.metadata.readTime}
              </span>
            </div>
          </header>
          
          <div 
            className="prose prose-lg prose-emerald max-w-none"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </article>
      </div>
    </div>
  )
}