function Post({ post }) {
  return (
    <div className="!w-full !block"> 
      <div className="
        !w-full
        border-l-[8px] border-l-blue-500 
        border-y border-r border-gray-200 dark:border-gray-800 
        rounded-2xl overflow-hidden bg-white dark:bg-black shadow-lg
      ">
        <div className="flex flex-col w-full">
          
          {/* SEZIONE TESTO: Padding forzato per staccarsi dal bordo blu */}
          <div className="!p-8 !sm:p-10">
            <div className="flex justify-between items-center !mb-6">
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

          {/* MEDIA: Full width */}
          {post.imageUrl && (
            <div className="w-full border-t border-gray-100 dark:border-gray-800">
              <img 
                src={post.imageUrl} 
                alt="Post content" 
                className="w-full h-auto object-cover max-h-[550px] block"
              />
            </div>
          )}

          {/* FOOTER */}
          <div className="!px-8 !py-5 !sm:px-10">
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