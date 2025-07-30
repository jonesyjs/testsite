import Image from "next/image";

const PostAuthor = (props) => {

  const { author, date, inspectorProps } = props;
  const { name, picture } = author;
  const alt = picture?.title;
  const url = picture?.url;

  return (
    <div className="flex items-center space-x-4 group">
      
      {/* Author Picture */}
      <div className="relative w-16 h-16 flex-shrink-0">
        {url ? (
          <Image
            src={url}
            layout="fill"
            className="rounded-full object-cover ring-2 ring-gray-200 group-hover:ring-blue-300 transition-all duration-200"
            alt={alt}
            unoptimized={true}
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center ring-2 ring-gray-200">
            <span className="text-white font-semibold text-lg">
              {name?.charAt(0)?.toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Author Info */}
      <div className="flex flex-col space-y-1">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 font-medium uppercase tracking-wide">
            Written by
          </span>
        </div>
        
        <span 
          className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer"
          {...inspectorProps({ fieldId: 'name' })} 
        >
          {name}
        </span>
        
        <span 
          className="text-sm text-gray-600 flex items-center space-x-1"
          {...inspectorProps({ fieldId: 'date' })} 
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{date}</span>
        </span>
      </div>
    </div>
  );
};

export default PostAuthor;
