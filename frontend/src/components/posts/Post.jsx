function Post({ post }) {
  return (
    <div className="border-b border-gray-100 dark:border-gray-800 p-6 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-all">
      <div className="flex flex-col gap-3">
        {/* Header */}
        <div className="flex justify-between items-baseline">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
            {post.title}
          </h3>
          <span className="text-xs text-gray-400 font-mono">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>

        {/* Content */}
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          {post.content}
        </p>

        {/* Media */}
        {post.imageUrl && (
          <img 
            src={post.imageUrl} 
            alt="" 
            className="mt-2 rounded-lg border border-gray-100 dark:border-gray-800 w-full object-cover max-h-80"
          />
        )}

        {/* Footer info */}
        <div className="pt-2">
          <span className="text-xs font-medium text-blue-500 opacity-80">
            Posted by ID: {post.id_user}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Post;