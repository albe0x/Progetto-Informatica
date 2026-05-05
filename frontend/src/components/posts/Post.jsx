function Post({ post }) {
  return (
    <div className="border-l-4 border-l-blue-500 border-y-8 border-r border-gray-200 dark:border-gray-800 m-4 rounded-xl shadow-sm hover:bg-gray-50/50 dark:hover:bg-white/5 transition-all overflow-hidden bg-white dark:bg-black">
      <div className="flex flex-col">
        
        {/* Sezione Testo: Qui applichiamo il padding generoso */}
        <div className="p-8 pb-4">
          <div className="flex justify-between items-baseline mb-3">
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

        {/* Media: SENZA padding laterale per toccare i bordi */}
        {post.imageUrl && (
          <div className="w-full border-y border-gray-100 dark:border-gray-800">
            <img 
              src={post.imageUrl} 
              alt="" 
              className="w-full object-cover max-h-[500px]"
            />
          </div>
        )}

        {/* Footer: Riprendiamo il padding per le info utente */}
        <div className="p-8 pt-4">
          <span className="text-sm font-bold text-blue-500 hover:underline cursor-pointer">
            @{post.username}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Post;