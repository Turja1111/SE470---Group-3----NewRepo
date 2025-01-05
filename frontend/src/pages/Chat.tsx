import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

interface Message {
    _id: string;
    content: string;
    sender: string;
    timestamp: string;
}

interface User {
    _id: string;
    username: string;
    isOnline?: boolean;
    isCompanion: boolean;
}

interface Chat {
    _id: string;
    participants: User[];
    messages: Message[];
    lastMessage?: Message;
}

interface TypingStatus {
    chatId: string;
    userId: string;
    username: string;
}

const Chat: React.FC = () => {
    const [chats, setChats] = useState<Chat[]>([]);
    const [currentChat, setCurrentChat] = useState<Chat | null>(null);
    const [message, setMessage] = useState('');
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [typingStatus, setTypingStatus] = useState<TypingStatus | null>(null);
    const [showCompanions, setShowCompanions] = useState(false);
    const [companions, setCompanions] = useState<User[]>([]);
    const socket = useRef<any>();
    const messageEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout>();
    const currentChatRef = useRef<Chat | null>(null);
    const fetchCompanions = async () => {
        try {
            const response = await axios.get("http://localhost:5000/companions");
            setCompanions(response.data);
        } catch (error) {
            setError('Failed to fetch companions');
        }
    };

    const startCompanionChat = async (companionId: string) => {
        try {
            const response = await axios.post(
                "http://localhost:5000/chat/create",
                { participantId: companionId },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            
            // Set current chat immediately
            setCurrentChat(response.data);
            
            // Add to chats list if not already present
            setChats(prevChats => {
                const chatExists = prevChats.some(chat => chat._id === response.data._id);
                if (chatExists) {
                    return prevChats;
                }
                return [...prevChats, response.data];
            });
            
            setShowCompanions(false);
        } catch (error) {
            setError('Failed to start chat with companion');
        }
    };

    return ( 

        <div className="w-1/3 border-r border-[#7F8C8D] bg-[#34495E] overflow-y-auto">
                        <div className="p-4 border-b border-[#7F8C8D]">
                            <h2 className="text-xl font-semibold text-[#ECF0F1]">Chats</h2>
                            {currentUser && !currentUser.isCompanion && (
                                <button
                                    onClick={() => {
                                        setShowCompanions(true);
                                        fetchCompanions();
                                    }}
                                    className="mt-2 w-full py-2 px-4 bg-[#1ABC9C] text-white rounded-lg hover:bg-[#16A085] transition-colors"
                                >
                                    Find Companions
                                </button>
                            )}
                        </div>
                        {showCompanions ? (
                            <div className="p-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-[#ECF0F1]">Available Companions</h3>
                                    <button
                                        onClick={() => setShowCompanions(false)}
                                        className="text-[#ECF0F1] hover:text-[#BDC3C7]"
                                    >
                                        Back to Chats
                                    </button>
                                </div>
                                {companions.map(companion => (
                                    <div
                                        key={companion._id}
                                        className="p-4 border-b border-[#7F8C8D] hover:bg-[#2C3E50] cursor-pointer transition-colors"
                                        onClick={() => startCompanionChat(companion._id)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-[#ECF0F1]">{companion.username}</p>
                                                <p className="text-sm text-[#BDC3C7]">Companion</p>
                                            </div>
                                            {companion.isOnline && (
                                                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            chats.map(chat => {
                                const otherParticipant = chat.participants.find(
                                    p => p._id !== currentUser?._id
                                );
                                return (
                                    <div
                                        key={chat._id}
                                        onClick={() => setCurrentChat(chat)}
                                        className={`p-4 hover:bg-[#2C3E50] cursor-pointer border-b border-[#7F8C8D] transition-colors ${
                                            currentChat?._id === chat._id ? 'bg-[#2C3E50]' : ''
                                        }`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium text-[#ECF0F1]">
                                                {otherParticipant?.username}
                                            </span>
                                            {chat.lastMessage && (
                                                <span className="text-xs text-[#BDC3C7]">
                                                    {format(new Date(chat.lastMessage.timestamp || Date.now()), 'HH:mm')}
                                                </span>
                                            )}
                                        </div>
                                        {chat.lastMessage && (
                                            <p className="text-sm text-[#BDC3C7] truncate">
                                                {chat.lastMessage.content}
                                            </p>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
        );
};