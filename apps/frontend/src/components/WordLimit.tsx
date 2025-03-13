import { useState} from 'react';


// export interface Caption {
//   "test": string
// }
export const CaptionLimit = ({caption}: {caption: string}) => {
  // Set the word limit to 100 words
  const wordLimit = 20;

  // State to track if the caption is expanded or truncated
  const [isExpanded, setIsExpanded] = useState(false);

  // Function to toggle the state between expanded and collapsed
  const toggleText = () => {
    setIsExpanded(!isExpanded);
  };

  // Function to truncate the text if it exceeds the word limit
  const truncateText = (text: string) => {
    const words = text.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...  ';
    }
    return text;
  };

  // Check if the caption needs to be truncated
  const isLongCaption = caption.split(' ').length > wordLimit;

  // Truncated caption (if applicable)
  const displayText = isLongCaption && !isExpanded ? truncateText(caption) : caption;

  return (
    <div>
      {/* Display the caption text */}
      {displayText}

      {/* Only show "See More" button if the caption is long */}
      {isLongCaption && (
        <button onClick={toggleText} className="text-black cursor-pointer">
          {isExpanded ? 'See Less' : 'See More'}
        </button>
      )}
    </div>
  );
};

 
export const CommentLimit = ({comment}: {comment: string}) => {
  // Set the word limit to 100 words
  const wordLimit = 20;

  // State to track if the caption is expanded or truncated
  const [isExpanded, setIsExpanded] = useState(false);

  // Function to toggle the state between expanded and collapsed
  const toggleText = () => {
    setIsExpanded(!isExpanded);
  };

  // Function to truncate the text if it exceeds the word limit
  const truncateText = (text: string) => {
    const words = text.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '... ';
    }
    return text;
  };

  // Check if the caption needs to be truncated
  const isLongCaption = comment.split(' ').length > wordLimit;

  // Truncated caption (if applicable)
  const displayText = isLongCaption && !isExpanded ? truncateText(comment) : comment;

  return (
    <div>
      {/* Display the caption text */}
      {displayText}

      {/* Only show "See More" button if the caption is long */}
      {isLongCaption && (
        <button onClick={toggleText} className="text-black cursor-pointer">
          {isExpanded ? 'See Less' : 'See More'}
        </button>
      )}
    </div>
  );
};

