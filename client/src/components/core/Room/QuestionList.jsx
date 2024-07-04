import React from 'react';
import ReactStars from 'react-rating-stars-component';

const QuestionList = ({ questions, handleStarClick, handleInputChange, newQuestionText, setNewQuestionText, addQuestion }) => {
    return (
        <div className="question-list bg-black text-white p-4 h-full overflow-auto">
            <h2 className="text-2xl font-bold ">Questions</h2>
            {questions.map((question, index) => (
                <div key={index} className="question-item mb-6 p-4 bg-gray-800 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-2">{question.text}</h3>
                    <ReactStars
                        count={10}
                        value={question.feedback || 0}
                        onChange={(nextValue) => handleStarClick(index, nextValue)}
                        size={24}
                        activeColor="#ffd700"
                        color="#4a5568"
                    />
                    <div className="mt-4">
                        <label className="block text-sm font-medium mb-1">Strength:</label>
                        <input
                            type="text"
                            value={question.strength || ''}
                            onChange={(e) => handleInputChange(index, 'strength', e.target.value)}
                            placeholder="Enter strength"
                            className="input-field w-full p-2 bg-gray-700 rounded-md text-white"
                        />
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium mb-1">Ease of Improvement:</label>
                        <input
                            type="text"
                            value={question.improvement || ''}
                            onChange={(e) => handleInputChange(index, 'improvement', e.target.value)}
                            placeholder="Enter ease of improvement"
                            className="input-field w-full p-2 bg-gray-700 rounded-md text-white"
                        />
                    </div>
                </div>
            ))}
            <div className="add-question mt-6">
                <input
                    type="text"
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    placeholder="Enter new question"
                    className="input-field w-full p-2 bg-gray-700 rounded-md mb-4 text-black"
                />
                <button onClick={addQuestion} className="add-question-button w-full p-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-600 hover:from-blue-500 hover:via-purple-600 hover:to-pink-700 text-white font-bold rounded">
                    Add Question
                </button>
            </div>
        </div>
    );
};

export default QuestionList;
