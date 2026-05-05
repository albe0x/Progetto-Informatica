function Post({ post }) {
  return (
    <div className="
      /* Forza 40px di distanza tra un post e l'altro */
      !mb-10 
      /* Bordi spessi e colorati */
      !border-l-[8px] border-l-blue-500 
      !border-y-[12px] border-r border-gray-200 dark:border-gray-800 
      /* Stile Card */
      rounded-2xl overflow-hidden bg-white dark:bg-black shadow-lg
      hover:bg-gray-50/50 dark:hover:bg-white/5 transition-all
    ">
      <div className="flex flex-col w-full">
        
        {/* SEZIONE TESTO: !px-10 forza 40px di spazio dal bordo blu */}
        <div className="!px-10 !py-8">
          <div className="flex justify-between items-baseline !mb-6">
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

        {/* MEDIA: Rimane Full Width per toccare i bordi laterali */}
        {post.imageUrl && (
          <div className="w-full border-t border-gray-100 dark:border-gray-800">
            <img 
              src={post.imageUrl} 
              alt="Post content" 
              /* block rimuove spazi vuoti indesiderati sotto l'immagine */
              className="w-full h-auto object-cover max-h-[600px] block"
            />
          </div>
        )}

        {/* FOOTER: Allineato con lo stesso padding del testo */}
        <div className="!px-10 !py-6">
          <span className="text-sm font-bold text-blue-500 hover:underline cursor-pointer">
            @{post.username}
          </span>
        </div>

      </div>
    </div>
  );
}

export default Post;