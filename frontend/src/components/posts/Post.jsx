function Post({ post }) {
  return (
    /* Spazio enorme tra i post per pulizia totale */
    <div className="w-full block !mb-32"> 
      <div className="
        w-full
        /* Solo bordo sinistro blu e bordo inferiore per separazione */
        border-l-[6px] border-l-blue-500 
        border-b border-gray-200 dark:border-gray-800 
        /* Rimosso border-r e border-t per evitare l'effetto doppio bordo */
        bg-white dark:bg-black shadow-sm
      ">
        <div className="flex flex-col w-full">
          
          {/* SEZIONE TESTO: Padding verticale massiccio */}
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

          {/* MEDIA */}
          {post.imageUrl && (
            <div className="w-full border-t border-gray-100 dark:border-gray-800">
              <img 
                src={post.imageUrl} 
                className="w-full h-auto object-cover max-h-[600px] block"
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