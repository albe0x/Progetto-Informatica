function Post({ post }) {
  return (
    <div className="w-full block"> 
      <div className="
        w-full
        /* Solo bordo a sinistra (accento blu) e sotto (separazione) */
        /* rimosso border-r o ombre laterali che creano linee a destra */
        border-l-[6px] border-l-blue-500 
        border-b border-gray-200 dark:border-gray-800 
        bg-white dark:bg-black
      ">
        <div className="flex flex-col w-full">
          
          {/* SEZIONE TESTO */}
          <div className="px-6 !py-16">
            <div className="flex justify-between items-center !mb-10">
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

          {/* MEDIA - Va da bordo a bordo senza margini interni */}
          {post.imageUrl && (
            <div className="w-full border-t border-gray-100 dark:border-gray-800">
              <img 
                src={post.imageUrl} 
                className="w-full h-auto object-cover max-h-[700px] block"
                onError={(e) => e.target.style.display = 'none'}
              />
            </div>
          )}

          {/* FOOTER */}
          <div className="px-6 !py-10">
            <span className="text-sm font-bold text-blue-500 uppercase tracking-widest">
              @{post.username}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Post;