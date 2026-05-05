function Post({ post }) {
  return (
    <div className="
      /* Distanza tra i post aumentata a 40px per sicurezza */
      mb-10 
      /* Bordo laterale blu */
      border-l-[8px] border-l-blue-500 
      /* Bordi orizzontali spessi */
      border-y-[12px] border-r border-gray-200 dark:border-gray-800 
      rounded-2xl overflow-hidden bg-white dark:bg-black shadow-lg
      hover:bg-gray-50/50 dark:hover:bg-white/5 transition-all 
    ">
      <div className="flex flex-col w-full">
        
        {/* TESTO: px-10 forza 40px di spazio dai lati */}
        <div className="px-10 py-8">
          <div className="flex justify-between items-baseline mb-6">
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

        {/* MEDIA: Rimane Full Width */}
        {post.imageUrl && (
          <div className="w-full border-t border-gray-100 dark:border-gray-800">
            <img 
              src={post.imageUrl} 
              alt="Post content" 
              className="w-full h-auto object-cover max-h-[600px] block"
            />
          </div>
        )}

        {/* FOOTER: Anch'esso con px-10 */}
        <div className="px-10 py-6">
          <span className="text-sm font-bold text-blue-500 hover:underline cursor-pointer">
            @{post.username}
          </span>
        </div>

      </div>
    </div>
  );
}
export default Post;