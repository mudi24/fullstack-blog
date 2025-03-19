import Image from "next/image";
import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import Link from 'next/link'

async function getBlogList() {
  const docsDir = path.join(process.cwd(), '..', 'docs')
  const blogs = []
  const categories = await fs.readdir(docsDir)
  
  for (const category of categories) {
    const categoryPath = path.join(docsDir, category)
    const files = await fs.readdir(categoryPath)
    
    for (const file of files) {
      if (file.endsWith('.md')) {
        const content = await fs.readFile(path.join(categoryPath, file), 'utf-8')
        const { data } = matter(content)
        blogs.push({
          ...data,
          date: data.date?.toString(), // 确保日期是字符串
          path: file.replace('.md', '')
        })
      }
    }
  }
  
  return blogs
}

export default async function Home() {
  const blogs = await getBlogList()
  
  return (
    <div className="min-h-screen bg-white">
      {/* 顶部导航栏 */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-xl font-bold">Blogger</Link>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
            <Image
              src="/avatar.jpg"
              alt="Avatar"
              width={32}
              height={32}
              className="rounded-full"
            />
          </div>
        </div>
      </header>

      {/* 分类导航 */}
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 py-4">
            {['Latest', 'Popular', 'Following', 'Technology', 'Science', 'Health', 'Art', 'Culture'].map((item, index) => (
              <button
                key={item}
                className={`px-4 py-1.5 text-sm font-medium ${
                  index === 0 
                    ? 'bg-black text-white rounded-full' 
                    : 'text-gray-600 hover:text-black transition-colors'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* 主要内容区 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold mb-6">Featured</h2>
        <div className="space-y-8">
          {blogs.map(blog => (
            <Link 
              key={blog.path}
              href={`/blog/${blog.path}`}
              className="block group"
            >
              <div className="flex gap-6">
                <div className="w-64 h-40 bg-gray-100 rounded-xl overflow-hidden">
                  {/* 这里可以添加博客封面图 */}
                </div>
                <div className="flex-1">
                  <div className="flex items-center text-sm text-gray-500 mb-2 font-medium">
                    <time>{blog.date}</time>
                    <span className="mx-2">·</span>
                    <span>{blog.readTime}</span>
                    <span className="mx-2">·</span>
                    <span className="text-black">{blog.category}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-black">
                    {blog.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-2 text-base">
                    {blog.description || '暂无描述'}
                  </p>
                  <div className="mt-4">
                    <span className="inline-flex items-center text-sm font-medium text-gray-700 group-hover:text-black transition-colors">
                      Read more
                      <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
