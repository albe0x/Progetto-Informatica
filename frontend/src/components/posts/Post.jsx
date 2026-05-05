function Post({ post }) {
  return (
    /* Aumentato mb-12 a mb-20 per dare molto più spazio tra i post */
    <div className="w-full block !mb-20"> 
      <div className="
        w-full
        border-l-[6px] border-l-blue-500 
        border-y border-r border-gray-200 dark:border-gray-800 
        /* RIMOSSO ROUNDED - Ora i bordi sono netti */
        bg-white dark:bg-black shadow-lg
      ">
        <div className="flex flex-col w-full">
          
          {/* SEZIONE TESTO: !py-16 per molto più spazio sopra e sotto il contenuto */}
          <div className="px-6 !py-16">
            <div className="flex justify-between items-center !mb-12">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                {post.title}
              </h3>
              <span className="text-xs text-gray-500 font-mono">
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>

            <p className="text-gray-700 dark:text-gray-300 text-xl leading-relaxed">
              {post.content}
            </p>
          </div>

          {/* MEDIA */}
          {post.imageUrl && (
            <div className="w-full border-t border-gray-100 dark:border-gray-800">
              <img 
                src={post.imageUrl} 
                className="w-full h-auto object-cover max-h-[600px] block"
              />
            </div>
          )}

          {/* FOOTER: !py-10 per dare respiro anche alla firma */}
          <div className="px-6 !py-10">
            <span className="text-sm font-bold text-blue-500 uppercase tracking-wide">
              @{post.username}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Post;