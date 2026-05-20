import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

const quickPrompts = [
  'I have fever',
  'Stomach pain',
  'Feeling cold',
  'Headache help',
  'Anxiety support'
];

const emergencyKeywords = [
  'chest pain',
  'cant breathe',
  "can't breathe",
  'difficulty breathing',
  'severe bleeding',
  'unconscious',
  'fainting',
  'stroke',
  'face drooping',
  'seizure',
  'suicide',
  'poison'
];

const healthcareFallbackReply = (message) => {
  const text = message.toLowerCase();

  if (emergencyKeywords.some(keyword => text.includes(keyword))) {
    return 'This may be urgent. Please call emergency services or go to the nearest emergency department now. If possible, stay with another person, avoid driving yourself, and share your symptoms clearly with medical staff.';
  }

  if (text.includes('cold') || text.includes('chill') || text.includes('shivering')) {
    return 'Feeling cold or shivering can happen with fever, viral infection, low room temperature, low sugar, dehydration, or tiredness.\n\nWhat you can do now:\n- Check your temperature.\n- Drink warm fluids.\n- Rest and keep warm.\n- Eat something light if you have not eaten.\n\nSee a doctor if you have high fever, breathing trouble, chest pain, confusion, severe weakness, or symptoms last more than 2-3 days.';
  }

  if (text.includes('fever') || text.includes('temperature')) {
    return 'For fever, rest, drink plenty of fluids, wear light clothing, and monitor your temperature every few hours. A lukewarm sponge bath can help if you feel very hot.\n\nGet medical help if fever is very high, lasts more than 3 days, comes with breathing difficulty, stiff neck, confusion, rash, severe dehydration, or affects a baby/elderly person.';
  }

  if (text.includes('headache') || text.includes('migraine')) {
    return 'For a mild headache, try drinking water, resting in a quiet room, reducing screen time, and eating if you skipped meals. Stress, dehydration, lack of sleep, eye strain, or sinus issues are common causes.\n\nSeek urgent care if it is the worst headache of your life, starts suddenly, follows an injury, or comes with weakness, vision loss, confusion, fever, stiff neck, or vomiting.';
  }

  if (text.includes('stomach') || text.includes('abdomen') || text.includes('vomit') || text.includes('diarrhea')) {
    return 'For mild stomach pain, try small sips of water, light food, rest, and avoid oily/spicy foods for now. If there is diarrhea or vomiting, focus on fluids and oral rehydration.\n\nSee a doctor urgently if pain is severe, on the lower right side, with blood in stool/vomit, persistent vomiting, high fever, dehydration, pregnancy, or pain lasting more than a day.';
  }

  if (text.includes('cough') || text.includes('throat') || text.includes('sore throat')) {
    return 'For cough or sore throat, drink warm fluids, rest, gargle warm salt water, and avoid smoke/dust. Honey may soothe cough for adults and children over 1 year.\n\nGet medical help if you have breathing difficulty, chest pain, high fever, blood in cough, wheezing, or symptoms lasting more than a week.';
  }

  if (text.includes('anxiety') || text.includes('stress') || text.includes('panic')) {
    return 'Try this for the next 60 seconds: breathe in for 4 counts, hold for 2, breathe out slowly for 6. Repeat 5 times. Name 5 things you see, 4 you feel, 3 you hear, 2 you smell, and 1 you taste.\n\nIf you feel unsafe, might harm yourself, or panic symptoms feel like chest pain or breathing trouble, seek immediate help.';
  }

  if (text.includes('medicine') || text.includes('tablet') || text.includes('dose')) {
    return 'I can give general medicine safety guidance, but I cannot prescribe. Tell me the medicine name, age, symptom, allergies, pregnancy status if relevant, and any existing conditions. Always follow the label or a doctor/pharmacist advice, and avoid mixing medicines without checking.';
  }

  return 'Tell me your main symptom, how long it has been happening, your age, temperature if you checked it, pain level from 1-10, and any serious signs like breathing trouble, chest pain, fainting, severe weakness, blood, or confusion. I can give basic health guidance and help you decide whether it sounds urgent.';
};

const getAssistantReply = (message) => {
  const text = message.toLowerCase();

  if (text.includes('record') || text.includes('report') || text.includes('history')) {
    return 'If you are tracking health history, keep reports, prescriptions, allergies, and current medicines in one place. In this app you can also use Health Records, but medically the important thing is to keep accurate dates, doctor names, test values, and medicine doses.';
  }

  if (text.includes('hospital') || text.includes('ambulance') || text.includes('emergency')) {
    return 'If symptoms feel serious or sudden, do not wait. Call local emergency services or go to the nearest hospital. Red flags include chest pain, severe breathing trouble, fainting, stroke signs, heavy bleeding, severe allergic reaction, or confusion.';
  }

  if (text.includes('doctor') || text.includes('specialist') || text.includes('specialization')) {
    return 'For general fever, cough, weakness, stomach upset, or body pain, start with a general physician. For children choose pediatrics, chest/heart symptoms cardiology or emergency care, skin issues dermatology, ear/nose/throat ENT, bone injury orthopedics, and dental pain dentistry.';
  }

  if (text.includes('medicine') || text.includes('pharmacy') || text.includes('cart') || text.includes('order')) {
    return healthcareFallbackReply(message);
  }

  if (text.includes('symptom') || text.includes('diagnosis') || text.includes('tracker') || text.includes('sick')) {
    return healthcareFallbackReply(message);
  }

  if (text.includes('wellness') || text.includes('camera') || text.includes('stress') || text.includes('mood')) {
    return 'For daily wellness, focus on sleep, hydration, balanced meals, movement, sunlight, and stress control. If mood is low for more than two weeks, or you feel hopeless or unsafe, please talk to a trusted person and seek professional help.';
  }

  if (text.includes('secure') || text.includes('privacy') || text.includes('password')) {
    return 'This project is a prototype. The password and localStorage records are useful for demo purposes, but real health data needs proper authentication, encryption, and a secure database.';
  }

  if (text.includes('hello') || text.includes('hi') || text.includes('hey')) {
    return 'Hi, I am ArogyaAI Assistant. Tell me what you are feeling, how long it has been happening, and your age. I can help with basic healthcare guidance and tell you when it may be urgent.';
  }

  return healthcareFallbackReply(message);
};

const MentalHealthBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: 'Hi, I am ArogyaAI Assistant. Tell me your symptoms or health question. I can give basic guidance, red flags, and next steps when a doctor is not immediately available.',
      isBot: true
    }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const requestAiReply = async (nextMessages) => {
    const response = await fetch('/api/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: nextMessages })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Assistant is not available right now.');
    }

    return data.reply;
  };

  const sendMessage = async (message) => {
    const cleanMessage = message.trim();
    if (!cleanMessage || isThinking) return;
    
    const newMsg = { text: cleanMessage, isBot: false };
    const nextMessages = [...messages, newMsg];
    setMessages(nextMessages);
    setInput('');
    setIsThinking(true);

    try {
      const reply = await requestAiReply(nextMessages);
      setMessages(prev => [...prev, { text: reply, isBot: true }]);
    } catch (error) {
      console.warn(error.message);
      setMessages(prev => [...prev, { text: getAssistantReply(cleanMessage), isBot: true }]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="assistant-shell">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="assistant-panel"
          >
            <div className="assistant-header">
              <div className="assistant-title">
                <div className="assistant-avatar">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h4>ArogyaAI Assistant</h4>
                  <div className="assistant-status">
                    <span className="assistant-status-dot" />
                    <span>Ready to help</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="assistant-close" aria-label="Close assistant">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div ref={scrollRef} className="assistant-messages">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: msg.isBot ? -10 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`assistant-message-row ${msg.isBot ? 'bot' : 'user'}`}
                >
                  <div className={`assistant-message ${msg.isBot ? 'bot' : 'user'}`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {isThinking && (
                <div className="assistant-message-row bot">
                  <div className="assistant-message bot">Thinking...</div>
                </div>
              )}
            </div>

            <div className="assistant-quick-actions">
              {quickPrompts.map(prompt => (
                <button
                  key={prompt}
                  className="assistant-chip"
                  onClick={() => sendMessage(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="assistant-input-bar">
              <input
                type="text"
                placeholder="Ask about this healthcare app..."
                className="assistant-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                disabled={isThinking}
              />
              <button 
                className="assistant-send"
                onClick={() => sendMessage(input)}
                aria-label="Send message"
                disabled={isThinking}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="assistant-fab"
        aria-label="Open ArogyaAI Assistant"
      >
        {isOpen ? <X /> : <MessageCircle className="w-8 h-8" />}
      </button>
    </div>
  );
};

export default MentalHealthBot;
