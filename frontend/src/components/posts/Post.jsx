function Post({ post }) {
  return (
    <div className="
      /* 20px di separazione esterna tra i post */
      mb-[20px] 
      /* Bordi spessi come richiesto */
      border-l-[6px] border-l-blue-500 
      border-y-[8px] border-r border-gray-200 dark:border-gray-800 
      /* Stile card */
      rounded-xl overflow-hidden bg-white dark:bg-black shadow-sm
      hover:bg-gray-50/50 dark:hover:bg-white/5 transition-all
    ">
      <div className="flex flex-col w-full">
        
        {/* 1. SEZIONE TESTO: Padding generoso e fisso */}
        <div className="p-8">
          <div className="flex justify-between items-baseline mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
              {post.title}
            </h3>
            <span className="text-xs text-gray-400 font-mono">
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>

          <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
            {post.content}
          </p>
        </div>

        {/* 2. SEZIONE MEDIA: Forza l'espansione totale */}
        {post.imageUrl && (
          <div className="w-full border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/20">
            <img 
              src={post.imageUrl} 
              alt="Post content" 
              className="w-full h-auto object-cover max-h-[500px] block"
            />
          </div>
        )}

        {/* 3. FOOTER: Padding costante indipendentemente dall'immagine */}
        <div className="p-8 pt-4 pb-8">
          <span className="text-sm font-bold text-blue-500 hover:underline cursor-pointer">
            @{post.username}
          </span>
        </div>

      </div>
    </div>
  );
}
export default Post;