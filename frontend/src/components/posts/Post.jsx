import { Link } from 'react-router-dom';

/**
 * Post Component: Displays a single social media post.
 * Uses simple props to render data from the backend.
 */
function Post({ post }) {
  // Check if image URL is valid or should be shown
  const hasImage = post.imageUrl && post.imageUrl.trim() !== '';

  return (
    <div className="w-full border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-black hover:bg-gray-50/30 dark:hover:bg-white/[0.02] transition-colors">
      <div className="flex flex-col w-full">
        
        {/* Post Body: Title and Content */}
        <div className="px-6 py-10 md:py-14">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight">
              {post.title}
            </h3>
            <span className="text-[10px] text-gray-400 font-mono uppercase tracking-widest bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>

          <p className="text-gray-700 dark:text-gray-300 text-lg md:text-xl leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>
        </div>

        {/* Media Section: Only rendered if imageUrl exists */}
        {hasImage && (
          <div className="w-full px-4 mb-6">
            <div className="rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm">
              <img 
                src={post.imageUrl} 
                className="w-full h-auto object-cover max-h-[600px] block"
                onError={(e) => e.target.style.display = 'none'}
                alt={post.title}
              />
            </div>
          </div>
        )}

        {/* Footer: User Link */}
        <div className="px-6 py-6 flex items-center gap-2">
          <Link 
            to={`/profile/${post.username}`}
            className="text-sm font-black text-blue-500 hover:text-blue-600 uppercase tracking-widest transition-colors flex items-center gap-1.5"
          >
            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px]">
               {post.username.charAt(0).toUpperCase()}
            </div>
            @{post.username}
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Post;
