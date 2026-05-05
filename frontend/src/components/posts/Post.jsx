function Post({ post }) {
  return (
    <div className="w-full block mb-12"> 
      <div className="
        w-full
        border-l-[6px] border-l-blue-500 
        border-y border-r border-gray-200 dark:border-gray-800 
        rounded-2xl overflow-hidden bg-white dark:bg-black shadow-lg
      ">
        <div className="flex flex-col w-full">
          
          {/* SEZIONE TESTO: px-6 (meno lato) py-10 (più sopra/sotto) */}
          <div className="px-6 py-10">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                {post.title}
              </h3>
              <span className="text-xs text-gray-500 font-mono">
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>

            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
              {post.content}
            </p>
          </div>

          {/* MEDIA: Se presente, tocca i bordi laterali ma ha spazio sopra/sotto */}
          {post.imageUrl && (
            <div className="w-full border-t border-gray-100 dark:border-gray-800">
              <img 
                src={post.imageUrl} 
                className="w-full h-auto object-cover max-h-[550px] block"
              />
            </div>
          )}

          {/* FOOTER */}
          <div className="px-6 py-6">
            <span className="text-sm font-bold text-blue-500">
              @{post.username}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
export default Post;