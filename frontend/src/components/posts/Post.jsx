function Post({ post }) {
  return (
    /* Contenitore esterno per distanziare i post tra loro */
    <div className="w-full !mb-10 px-4"> 
      <div className="
        border-l-[6px] border-l-blue-500 
        border-y border-r border-gray-200 dark:border-gray-800 
        rounded-xl overflow-hidden bg-white dark:bg-black shadow-sm
      ">
        <div className="flex flex-col w-full">
          
          {/* Padding generoso per il testo: !p-8 sposta il testo dal bordo blu */}
          <div className="!p-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {post.title}
              </h3>
              <span className="text-xs text-gray-400">
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>

            <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
              {post.content}
            </p>
          </div>

          {post.imageUrl && (
            <div className="w-full border-t border-gray-100 dark:border-gray-800">
              <img 
                src={post.imageUrl} 
                alt="Post" 
                className="w-full h-auto object-cover max-h-[500px] block"
              />
            </div>
          )}

          <div className="!px-8 !py-4">
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