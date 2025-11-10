import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Star } from 'lucide-react';
import '../styles/ClientProjectRating.css';

export default function ClientProjectRating() {
  const { projectId } = useParams<{ projectId: string }>();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    setSubmitting(true);
    
    try {
      // Aquí se haría la llamada a la API para guardar la valoración
      // await ratingService.createRating({ projectId, rating, feedback });
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Thank you for your feedback!');
      navigate('/client/dashboard');
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Error submitting rating. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rating-page">
      <div className="rating-container">
        <div className="rating-header">
          <h1>Rate your project</h1>
          <p className="subtitle">Share your experience and help us improve</p>
        </div>

        <form onSubmit={handleSubmit} className="rating-form">
          {/* Overall Rating */}
          <div className="rating-section">
            <label className="rating-label">Overall Rating</label>
            <div className="stars-container">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="star-button"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                  aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                >
                  <Star
                    size={40}
                    className={`star-icon ${
                      star <= (hoveredRating || rating) ? 'filled' : 'empty'
                    }`}
                    fill={star <= (hoveredRating || rating) ? '#ffc107' : 'none'}
                    stroke={star <= (hoveredRating || rating) ? '#ffc107' : '#ddd'}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="rating-text">
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Fair'}
                {rating === 3 && 'Good'}
                {rating === 4 && 'Very Good'}
                {rating === 5 && 'Excellent'}
              </p>
            )}
          </div>

          {/* Feedback Section */}
          <div className="feedback-section">
            <label htmlFor="feedback" className="feedback-label">
              Share your experience
            </label>
            <textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tell us about your experience with this project. What did you like? What could be improved?"
              className="feedback-textarea"
              rows={6}
            />
          </div>

          {/* Additional Rating Categories (Optional) */}
          <div className="additional-ratings">
            <h3 className="additional-title">Rate specific aspects (optional)</h3>
            <div className="rating-categories">
              {[
                { label: 'Communication', value: 0 },
                { label: 'Design Quality', value: 0 },
                { label: 'Timeline', value: 0 },
                { label: 'Budget Management', value: 0 }
              ].map((category, index) => (
                <div key={index} className="category-rating">
                  <label className="category-label">{category.label}</label>
                  <div className="category-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="category-star-button"
                        aria-label={`${category.label} ${star} stars`}
                      >
                        <Star
                          size={24}
                          className="category-star"
                          fill="none"
                          stroke="#ddd"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="submit-section">
            <button
              type="submit"
              className="submit-button"
              disabled={rating === 0 || submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Rating'}
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate('/client/dashboard')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

