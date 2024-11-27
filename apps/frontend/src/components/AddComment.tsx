import { useState } from 'react';
import axios from 'axios';

const CommentBox = () => {
  // State to store the comment entered by the user
  const [comment, setComment] = useState('');
  const [isPosting, setIsPosting] = useState(false); // To show loading state

  // Handle change in the input box
  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  // Function to handle the form submission on Enter key press
  const handleKeyPress = async (e) => {
    // If the user presses the Enter key (keyCode 13)
    if (e.key === 'Enter' && comment.trim() !== '') {
      e.preventDefault(); // Prevent default form submission behavior

      // Set posting to true to show a loading indicator
      setIsPosting(true);

      try {
        // Post the comment to the backend
        const response = await axios.post('comments', { comment });  //cahnge hhereeljdljfa 

        // Handle successful response
        if (response.status === 200) {
          console.log('Comment posted successfully:', response.data);
          setComment(''); // Clear the input field after successful post
        }
      } catch (error) {
        // Handle error (e.g., network issues, server errors)
        console.error('Error posting comment:', error);
      } finally {
        setIsPosting(false); // Reset loading state
      }
    }
  };

  return (
    <div className="p-1 block w-full">
      <textarea
        onChange={handleCommentChange}
        onKeyDown={handleKeyPress}
        placeholder="Add a comment... "
        className="p-1 block w-full"
      />
      {isPosting && <p>Posting your comment...</p>}
    </div>
  );
};

export default CommentBox;
