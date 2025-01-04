import React, { useState, useEffect } from 'react';

import axios from 'axios';

const CompanionText = () => {
    const [score, setScore] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [userAnswers, setUserAnswers] = useState({});
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/questions', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setQuestions(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };

        fetchQuestions();
    }, []);
    
    // const questions = [
    // {
    //     question: "What is the primary purpose of active listening?",
    //     options: [
    //         "To prepare your response",
    //         "To show you're paying attention",
    //         "To understand deeply and empathetically",
    //         "To pass time"
    //     ],
    //     correct: 2
    // },
    // {
    //     question: "Which emotion is considered a primary emotion?",
    //     options: [
    //         "Jealousy",
    //         "Fear",
    //         "Guilt",
    //         "Shame"
    //     ],
    //     correct: 1
    // },
    // {
    //     question: "What is the first step in effective communication?",
    //     options: [
    //         "Making assumptions",
    //         "Listening actively",
    //         "Speaking loudly",
    //         "Avoiding eye contact"
    //     ],
    //     correct: 1
    // },
    // {
    //     question: "What does EQ stand for?",
    //     options: [
    //         "Educational Quotient",
    //         "Emotional Quotient",
    //         "Energy Quotient",
    //         "Efficiency Quotient"
    //     ],
    //     correct: 1
    // },
    // {
    //     question: "Which of these is an example of a growth mindset?",
    //     options: [
    //         "I’m not good at this, so I’ll give up.",
    //         "I can improve with effort and practice.",
    //         "Failure means I’m not smart.",
    //         "Only talent matters, not hard work."
    //     ],
    //     correct: 1
    // },
    // {
    //     question: "What does empathy involve?",
    //     options: [
    //         "Feeling sorry for someone",
    //         "Understanding and sharing someone’s feelings",
    //         "Giving advice to someone",
    //         "Agreeing with someone’s perspective"
    //     ],
    //     correct: 1
    // },
    // {
    //     question: "What is the most effective way to handle conflict?",
    //     options: [
    //         "Avoid it completely",
    //         "Use open communication and collaboration",
    //         "Blame others for the issue",
    //         "Ignore the other person"
    //     ],
    //     correct: 1
    // },
    // {
    //     question: "Which of these is a sign of self-awareness?",
    //     options: [
    //         "Blaming others for mistakes",
    //         "Understanding your strengths and weaknesses",
    //         "Refusing feedback",
    //         "Avoiding personal growth"
    //     ],
    //     correct: 1
    // },
    // {
    //     question: "Which of these is NOT a primary emotion?",
    //     options: [
    //         "Joy",
    //         "Sadness",
    //         "Pride",
    //         "Anger"
    //     ],
    //     correct: 2
    // },
    // {
    //     question: "What is a key characteristic of active listening?",
    //     options: [
    //         "Interrupting the speaker",
    //         "Making eye contact and nodding",
    //         "Thinking about your next comment",
    //         "Focusing only on facts"
    //     ],
    //     correct: 1
    // },
    // {
    //     question: "What is the best way to give constructive feedback?",
    //     options: [
    //         "Focus on the person, not the behavior",
    //         "Use specific and actionable comments",
    //         "Be vague to avoid hurting feelings",
    //         "Focus only on negative aspects"
    //     ],
    //     correct: 1
    // },
    // {
    //     question: "Which of these describes resilience?",
    //     options: [
    //         "Avoiding challenges",
    //         "Giving up easily",
    //         "Bouncing back from setbacks",
    //         "Focusing on negatives"
    //     ],
    //     correct: 2
    // },
    // {
    //     question: "What is the purpose of mindfulness?",
    //     options: [
    //         "Multitasking efficiently",
    //         "Staying present and aware",
    //         "Ignoring your emotions",
    //         "Planning for the future"
    //     ],
    //     correct: 1
    // },
    // {
    //     question: "Which of these is a strategy for managing stress?",
    //     options: [
    //         "Procrastination",
    //         "Deep breathing and relaxation",
    //         "Blaming others",
    //         "Avoiding all responsibilities"
    //     ],
    //     correct: 1
    // },
    // {
    //     question: "What does the term 'emotional regulation' mean?",
    //     options: [
    //         "Ignoring emotions",
    //         "Understanding and managing your emotions effectively",
    //         "Expressing all emotions openly",
    //         "Suppressing feelings entirely"
    //     ],
    //     correct: 1
    // },
    // {
    //     question: "Which of these is an example of assertive communication?",
    //     options: [
    //         "Yelling to get your point across",
    //         "Avoiding conflict at all costs",
    //         "Clearly stating your needs while respecting others",
    //         "Ignoring others’ perspectives"
    //     ],
    //     correct: 2
    // },
    // {
    //     question: "What is the key benefit of self-reflection?",
    //     options: [
    //         "Boosting self-awareness",
    //         "Reinforcing biases",
    //         "Avoiding responsibility",
    //         "Criticizing yourself constantly"
    //     ],
    //     correct: 0
    // },
    // {
    //     question: "What does body language convey in communication?",
    //     options: [
    //         "Only your verbal message",
    //         "Your feelings and attitudes",
    //         "Nothing significant",
    //         "Your exact words"
    //     ],
    //     correct: 1
    // },
    // {
    //     question: "What is a critical element of emotional intelligence?",
    //     options: [
    //         "Ignoring emotions",
    //         "Understanding and managing emotions",
    //         "Avoiding interactions",
    //         "Reacting impulsively"
    //     ],
    //     correct: 1
    // },
    // {
    //     question: "Which of these promotes teamwork?",
    //     options: [
    //         "Competition within the team",
    //         "Clear communication and collaboration",
    //         "Avoiding conflict",
    //         "Focusing only on individual goals"
    //     ],
    //     correct: 1
    // }
    // ];


    const handleAnswer = (questionIndex, optionIndex) => {
        setUserAnswers({
            ...userAnswers,
            [questionIndex]: optionIndex
        });
    };

    const makeUserCompanion = async (percentage) => {
        try {
            const token = localStorage.getItem('token');
            console.log(token);
            const response = await axios.post('http://localhost:5000/companion', {percentage}, {
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch (error) {
            console.error('Error registering as companion:', error);
        }
    };
    const handleSubmit = () => {
        setIsLoading(true);
        let finalScore = 0;

        Object.keys(userAnswers).forEach(questionIndex => {
            if (userAnswers[questionIndex] === questions[questionIndex].correct) {
                finalScore += 1;
            }
        });

        setScore(finalScore);
        const percentage = (finalScore / questions.length) * 100;
        if (percentage >= 70) {
            console.log(`Percentage: ${percentage}%`);
            makeUserCompanion(percentage);
        }
        setShowResult(true);
        setIsLoading(false);
    };

    const renderResultContent = () => {
        const percentage = ((score / questions.length) * 100).toFixed(2);

        if (percentage >= 70) {
            return (
                <div className="text-center space-y-4">
                    <h3 className="text-2xl font-bold" style={{ color: '#4D6A6D' }}>
                        Congratulations! 🎉
                    </h3>
                    <p className="text-lg" style={{ color: '#4C5B61' }}>
                        You've demonstrated excellent understanding and empathy skills.
                        You're ready to be a SoulSpeak companion!
                    </p>
                </div>
            );
        }


        return (
            <div className="text-center space-y-4">
                <h3 className="text-xl font-bold" style={{ color: '#4D6A6D' }}>
                    Keep Growing!
                </h3>
                <p className="text-lg" style={{ color: '#4C5B61' }}>
                    We see your potential! Enhance your skills with our training program.
                </p>
                <a
                    href="/training-program"
                    className="inline-block text-white font-medium py-2 px-6 rounded-md transition-colors"
                    style={{ backgroundColor: '#4D6A6D', hover: { backgroundColor: '#4C5B61' } }}
                >
                    Join Training Program
                </a>
            </div>
        );
    };

    return (
            <div className="max-w-4xl mx-auto p-5">
                {!showResult ? (
                    <>
                        <h2 className="text-3xl font-bold text-center mb-8" style={{ color: '#4D6A6D' }}>
                            SoulSpeak Companion Assessment
                        </h2>
                        <div className="space-y-6">
                            {questions.map((q, qIndex) => (
                                <div key={qIndex} className="rounded-lg shadow-md p-6" style={{ backgroundColor: '#C5C5C5' }}>
                                    <h3 className="text-xl font-semibold mb-4" style={{ color: '#4D6A6D' }}>
                                        Question {qIndex + 1}
                                    </h3>
                                    <p className="mb-4" style={{ color: '#4C5B61' }}>
                                        {q.question}
                                    </p>
                                    <div className="space-y-3">
                                        {[q.option1[0], q.option2[0], q.option3[0], q.option4[0]].map((option, oIndex) => (
                                            <label
                                                key={oIndex}
                                                className="flex items-center space-x-3 p-3 rounded-md cursor-pointer transition-colors"
                                                style={{ 
                                                    backgroundColor: '#829191',
                                                    hover: { backgroundColor: '#949896' }
                                                }}
                                            >
                                                <input
                                                    type="radio"
                                                    name={`question-${qIndex}`}
                                                    checked={userAnswers[qIndex] === oIndex}
                                                    onChange={() => handleAnswer(qIndex, oIndex)}
                                                    className="form-radio h-4 w-4"
                                                    style={{ accentColor: '#4D6A6D' }}
                                                />
                                                <span style={{ color: '#4C5B61' }}>{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={handleSubmit}
                                disabled={Object.keys(userAnswers).length !== questions.length || isLoading}
                                className={`w-full py-3 px-6 rounded-md text-white font-medium transition-colors`}
                                style={{
                                    backgroundColor: isLoading || Object.keys(userAnswers).length !== questions.length
                                        ? '#949896'
                                        : '#4D6A6D',
                                    cursor: isLoading || Object.keys(userAnswers).length !== questions.length
                                        ? 'not-allowed'
                                        : 'pointer',
                                    hover: { backgroundColor: '#4C5B61' }
                                }}
                            >
                                {isLoading ? 'Processing...' : 'Submit Test'}
                            </button>
                        </div>
                    </>
            ) : (
                <div className="rounded-lg shadow-md p-8" style={{ backgroundColor: '#C5C5C5' }}>
                <h2 className="text-3xl font-bold mb-6" style={{ color: '#4D6A6D' }}>
                    Your Assessment Results
                </h2>
                    {/* <div className="mb-8">
                        <h3 className="text-2xl font-semibold mb-2">
                            Score: {score} out of {questions.length}
                        </h3>
                        <p className="text-xl text-gray-600">
                            Percentage: {((score/questions.length) * 100).toFixed(2)}%
                        </p>
                    </div> */}
                    {renderResultContent()}
                </div>
            )}
        </div>
    );
};

export default CompanionText;