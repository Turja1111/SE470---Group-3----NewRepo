import { MailQuestion } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TrainingProgram = () => {
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/questions', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setQuestions(response.data);
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };
        fetchQuestions();
    }, []);

    return (
        <div className="min-h-screen py-12 px-4" style={{ backgroundColor: '#f8f9fa' }}>
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-3" style={{ color: '#4D6A6D' }}>
                    SoulSpeak Training Program
                </h1>
                <p className="text-lg mb-12 text-center" style={{ color: '#4C5B61' }}>
                    Enhance your understanding with detailed explanations and curated resources for each topic.
                </p>

                <div className="space-y-6">
                    {questions.map((question, index) => (
                        <div 
                            key={index} 
                            className="rounded-xl shadow-lg transition-transform duration-300 hover:transform hover:scale-[1.02]"
                            style={{ 
                                background: 'white',
                                borderLeft: '4px solid #4D6A6D'
                            }}
                        >
                            <div className="p-6">
                                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: '#4D6A6D' }}>
                                    <MailQuestion className="w-6 h-6" />
                                    Topic {index + 1}: {question.question}
                                </h2>

                                <div className="mt-6">
                                    <h3 className="text-lg font-medium mb-3" style={{ color: '#4C5B61' }}>
                                        Related Resources
                                    </h3>
                                    <div className="pl-4 py-3 rounded-md" style={{ backgroundColor: '#f8f9fa' }}>
                                        <a 
                                            href={question.resource} 
                                            target='_blank' 
                                            className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
                                        >
                                            {question.resource}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* <div className="mt-12 text-center">
                    <button 
                        className="px-8 py-3 rounded-full font-medium text-white shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
                        style={{ 
                            backgroundColor: '#4D6A6D',
                        }}
                    >
                        Track Your Progress
                    </button>
                </div> */}
            </div>
        </div>
    );
};

export default TrainingProgram;
