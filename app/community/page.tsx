'use client';

import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Send, Users, Sparkles } from 'lucide-react';

export default function CommunityChatroom() {
  const [messages, setMessages] = useState([
    { id: 1, user: 'System', text: 'Welcome to the global GR8 GAMZ Chatroom! Connect with players worldwide.', isSystem: true },
    { id: 2, user: 'ArcadeMaster99', text: 'Has anyone beaten the new Neon Snake high score yet?', isSystem: false },
    { id: 3, user: 'PixelQueen', text: 'Working on it right now! That last level is insane.', isSystem: false }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setMessages([...messages, { id: Date.now(), user: 'GuestPlayer', text: newMessage, isSystem: false }]);
    setNewMessage('');
  };

  return (
    <main className="page-shell">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-brand/20 rounded-xl text-brand border border-brand/30 shadow-[0_0_20px_rgba(53,255,141,0.2)]">
            <Users size={28} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white m-0 tracking-tight">Global Live Chat</h1>
            <p className="text-cyan-400 font-bold text-sm tracking-wide uppercase mt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand animate-pulse" /> 1,204 Players Online
            </p>
          </div>
        </div>

        <div className="glass-panel rounded-2xl overflow-hidden flex flex-col h-[70vh] min-h-[500px]">
          {/* Chat Header */}
          <div className="p-4 border-b border-white/10 bg-black/40 flex justify-between items-center backdrop-blur-md">
            <div className="flex items-center gap-2 text-white/80 font-semibold text-sm">
              <Sparkles size={16} className="text-gold" /> General Arcade Channel
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            {messages.map((msg, idx) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`flex flex-col ${msg.user === 'GuestPlayer' ? 'items-end' : 'items-start'}`}
              >
                {!msg.isSystem && msg.user !== 'GuestPlayer' && (
                  <span className="text-xs font-bold text-white/50 mb-1 ml-1">{msg.user}</span>
                )}
                
                <div 
                  className={`px-4 py-3 rounded-2xl max-w-[80%] ${
                    msg.isSystem 
                      ? 'bg-brand/10 text-brand border border-brand/20 w-full text-center rounded-xl mx-auto' 
                      : msg.user === 'GuestPlayer'
                        ? 'bg-gradient-to-r from-brand to-cyan-400 text-[#07110b] font-medium shadow-lg rounded-tr-sm'
                        : 'bg-white/5 text-white/90 border border-white/10 rounded-tl-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 bg-black/50 border-t border-white/10">
            <form onSubmit={handleSend} className="relative flex items-center">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all font-medium"
              />
              <button 
                type="submit"
                disabled={!newMessage.trim()}
                className="absolute right-2 p-2.5 bg-brand text-black rounded-lg disabled:opacity-50 disabled:bg-white/20 hover:bg-white transition-colors"
              >
                <Send size={18} className="translate-x-[1px] translate-y-[-1px]" />
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
