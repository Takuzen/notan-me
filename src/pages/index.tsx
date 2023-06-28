import { useState, useEffect } from 'react';
import Image from 'next/image'
import Link from 'next/link'
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

export default function Home() {
  const [note, setNote] = useState('');
  const [chatExpanded, setChatExpanded] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ role: string, content: string }>>([]);

  useEffect(() => {
    const firebaseConfig = {
      apiKey: "AIzaSyCkqzaX5BtTGOCig_ET4JC6lnalRDCEerg",
      authDomain: "notan-aefef.firebaseapp.com",
      databaseURL: "https://notan-aefef-default-rtdb.asia-southeast1.firebasedatabase.app",
      projectId: "notan-aefef",
      storageBucket: "notan-aefef.appspot.com",
      messagingSenderId: "508688241479",
      appId: "1:508688241479:web:a360539232061b83243262",
      measurementId: "G-96ELDLYJZM"
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const analytics = getAnalytics(app);

  }, []);

  
  const handleChatToggle = () => {
    setChatExpanded(!chatExpanded);
  };

  const handleChatSubmit = async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    if (chatInput.trim().length > 0) {
      setChatMessages([...chatMessages, {role: 'user', content: chatInput}]);
  
      try {
        const res = await fetch('/api/chatgpt', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ message: chatInput })
        });
        const data = await res.json();
        console.log(data);
        
        setChatMessages(prevChatMessages => [...prevChatMessages, {role: 'assistant', content: data.message}]);
        setChatInput('');
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(`Error with OpenAI API request: ${error.message}`);
        } else {
          console.error(`An unexpected error occurred: ${error}`);
        }
      }
      
    }
  };

  const handleNoteChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote(event.target.value);
  };

  return (
    <main className="p-8 sm:p-24">
    <div className="flex flex-col">
      <div className="flex w-full justify-between items-center">
        <p className="font-serif text-2xl font-bold">notan</p>
        <p className="hidden font-serif text-1xl font-semibold text-gray-400">
          <Link href="/">開発物語</Link>
        </p>
        <p className="hidden font-serif text-1xl font-semibold text-gray-400">
          ログイン
        </p>
        <Link href="/beta_mypage">
          <div className="pt-2 cursor-pointer">
            <Image
              className="object-contain"
              src="/library-outline.svg"
              alt="Library Logo"
              width={30}
              height={30}
              priority
            />
          </div>
        </Link>
      </div>

      <div className="flex flex-col items-center mt-12">
        <div className="w-full text-end">
          <textarea
            className="w-full h-screen focus:outline-none resize-none tracking-wider leading-relaxed font-minch bg-transparent"
            placeholder="6月28日 夏至 次候 菖蒲華さく"
            value={note}
            onChange={handleNoteChange}
          />
        </div>
      </div>

  <div
    id="chatbtn"
    className={`z-10 cursor-pointer text-center rounded-lg border fixed bottom-5 left-0 right-0 mx-auto w-11/12 sm:w-9/12 lg:w-7/12 xl:w-5/12 p-5 shadow-lg ${
      chatExpanded ? 'h-2/3 sm:h-1/2 bottom-0' : ''
    }`}
    onClick={!chatExpanded ? handleChatToggle : undefined}
  >
  {chatExpanded ? (
  <>
  <button
    className="absolute -top-4 right-6 transform translate-x-full px-3 py-1 rounded-full bg-gray-400 text-white"
    onClick={handleChatToggle}
  >
    ↓
  </button>
  <p className="tracking-wider leading-relaxed font-mincho text-start mt-4 cursor-auto">こんにちは、<br/>あなたのパートナーAIのジルです。<br/><br/>何でも話してください。</p>
  <div className="chat-messages tracking-wider leading-relaxed">
    {chatMessages.map((message, index) => (
      <p key={index} className={`text-left ${message.role === 'assistant' ? 'text-black' : 'text-gray-500'}`}>{message.content}</p>
    ))}
  </div>
  <textarea
    value={chatInput}
    onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setChatInput(event.target.value)}
    onKeyDown={(event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter' && event.shiftKey) {
        event.preventDefault();
        handleChatSubmit(event);
      }
    }}
    className="z-20 w-full h-screen focus:caret-emerald-900 focus:outline-none rounded-lg mt-6 tracking-wider leading-relaxed bg-transparent text-gray-500 caret-emerald-900"
    placeholder=""
    autoFocus/>
</>
) : (

<p className="text-md opacity-60 font-mincho">
  <span className="ball"></span> いま何を考えていますか?
</p>

)}
  
  </div>
    </div>

    <style jsx>{`
      .ball {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #728fce;
        animation: ball-roll 4s linear infinite;
        position: relative;
        top: 5px;
        left: -20px;
      }

      @keyframes ball-roll {
        0% {
          transform: translate(0, 0);
        }
        25% {
          transform: translate(calc(100% - 1.5rem), calc(100% - 1.5rem));
          background-color: #728fce;
        }
        50% {
          transform: translate(calc(100% - 1.5rem), 0);
          background-color: #728fce;
        }
        75% {
          transform: translate(0, calc(100% - 1.5rem));
          background-color: #728fce;
        }
        100% {
          transform: translate(0, 0);
          background-color: #728fce;
        }
      }
    `}</style>
  </main>
  )
}
