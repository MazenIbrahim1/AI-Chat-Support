import React, { useState } from 'react';
import './feedbackModal.css';

const FeedbackModal = ({ isOpen, onClose, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');

    if (!isOpen) {
        return null;
    }

    const submitFeedback = () => {
        onSubmit({ rating, feedback });
        onClose();
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Please rate your experience</h2>
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        className={`star ${rating >= star ? 'filled' : ''}`}
                        onClick={() => setRating(star)}
                    >
                        ★
                    </button>
                ))}
                <textarea
                    placeholder="Additional feedback"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                />
                <button onClick={submitFeedback} className='feedback-button'>Submit</button>
                <button onClick={onClose} className='feedback-button'>Close</button>
            </div>
        </div>
    );
};

export default FeedbackModal;
