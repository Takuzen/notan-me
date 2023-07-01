'use client';
import { useState, useEffect, useRef } from 'react';
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
  const [isToggled, setIsToggled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null); 

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

  const autoResizeTextArea = () => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  };
  
  const handleChatToggle = () => {
    setChatExpanded(!chatExpanded);
  };

  const handleChatSubmit = async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    if (chatInput.trim().length > 0) {
      setChatMessages([...chatMessages, {role: 'user', content: chatInput}]);
      setChatInput('');
      setIsLoading(true);

      try {
        const res = await fetch('/api/chatgpt', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ message: chatInput })
        });
        const data = await res.json();
        
        setChatMessages(prevChatMessages => [...prevChatMessages, {role: 'assistant', content: data.message}]);

      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(`Error with OpenAI API request: ${error.message}`);
        } else {
          console.error(`An unexpected error occurred: ${error}`);
        }
      }
      setIsLoading(false);
    }
  };

  const handleButtonClick = () => {
    // Create a fake event to send to the handleChatSubmit function.
    const fakeEvent = {
      preventDefault: () => {},
      key: 'Enter',
      shiftKey: true
    };

    handleChatSubmit(fakeEvent as unknown as React.KeyboardEvent<HTMLTextAreaElement>);
  };

  const handleNoteChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote(event.target.value);
  };

  const handleToggle = () => {
    setIsToggled(!isToggled);
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
            id='lptextarea'
            className="w-full h-screen focus:outline-none caret-black focus:caret-black resize-none tracking-wider leading-relaxed font-minch bg-transparent no-tap-highlighting"
            placeholder="7月2日 夏至 末候 半夏生ず"
            value={note}
            onChange={handleNoteChange}
          />
        </div>
      </div>

      <div
        id="chat-container"
        className={`z-10 bg-white cursor-pointer text-center rounded-t-lg border fixed bottom-0 left-0 right-0 mx-auto w-11/12 sm:w-9/12 lg:w-7/12 xl:w-5/12 p-5 shadow-lg overflow-y-auto ${
          chatExpanded ? 'h-[19rem] bottom-0' : ''
          }`}
        onClick={!chatExpanded ? handleChatToggle : undefined}
        >
        {chatExpanded ? (
        <>
        <button
          className="absolute -top-1 right-[7.5rem] sm:right-[17rem] lg:right-[15rem] px-12 py-0 rounded-full bg-gray-400 text-white"
          onClick={handleChatToggle}
        >
          ↓
        </button>
        <p className="tracking-wider leading-relaxed font-mincho text-start mt-4 cursor-auto">こんにちは、<br/>あなたのパートナーAIのジルです。<br/><br/>何でも話してください。</p>
        <div className="chat-messages tracking-wider leading-relaxed my-5">
          {chatMessages.map((message, index) => (
            <p key={index} className={`text-left ${message.role === 'assistant' ? 'text-black' : 'text-gray-500'} mb-3`}>{message.content}</p>
          ))}
        </div>
        <div className="chat-input-container relative flex flex-col h-full">
      <div className='flex flex-col'>
        <textarea
          ref={textAreaRef}
          onInput={autoResizeTextArea}
          value={chatInput}
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setChatInput(event.target.value)}
          onKeyDown={(event: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (event.key === 'Enter' && event.shiftKey) {
              event.preventDefault();
              handleChatSubmit(event);
            }
          }}
          className="z-20 resize-none w-full focus:caret-emerald-500 focus:outline-none rounded-lg mt-5 tracking-wider leading-relaxed bg-transparent text-gray-500 caret-emerald-500 no-tap-highlighting"
          placeholder=""
          autoFocus
          style={{ overflow: 'hidden' }}
        />
            <button
              className="submit-button w-[40px] fill-white self-end pr-3 pb-3 pl-3 pt-3 bg-ja-purple bordernone rounded-lg relative bottom-0 right-0 hover:opacity-70 mb-3 mr-3" // Added mb-3 and mr-3 here for margin-bottom and margin-right
              onClick={handleButtonClick}
              disabled={isLoading} // Disable the button while loading
            >
            {isLoading ? (
              // Render loading animation while loading
              <div className="loading-animation">
                <div></div>
                <div></div>
                <div></div>
              </div>
            ) : (
            // Render submit button icon when not loading
              <svg viewBox="0 0 512 512">
                <path d="m476.59 227.05-.16-.07L49.35 49.84A23.56 23.56 0 0 0 27.14 52 24.65 24.65 0 0 0 16 72.59v113.29a24 24 0 0 0 19.52 23.57l232.93 43.07a4 4 0 0 1 0 7.86L35.53 303.45A24 24 0 0 0 16 327v113.31A23.57 23.57 0 0 0 26.59 460a23.94 23.94 0 0 0 13.22 4 24.55 24.55 0 0 0 9.52-1.93L476.4 285.94l.19-.09a32 32 0 0 0 0-58.8z" />
              </svg>
            )}
            </button>
      </div>

      </div>
        
        {/* 
        <div
          className="flex self-center absolute bottom-10 right-10 z-50 bg-red-500 p-3 rounded-full"
        >
          <label>
            Toggle
            <input type="checkbox" checked={isToggled} onChange={handleToggle} />
          </label>
        </div>
      */}
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

      .toggle-container {
        appearance: none;
        position: relative;
        z-index: 30;
        padding: 10px;
        background-color: white;
      }
    
      .toggle-label {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .loading-animation {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 24px;
      }
      
      .loading-animation div {
        width: 8px;
        height: 8px;
        background-color: #ffffff;
        border-radius: 50%;
        animation: loading-animation 1.2s infinite ease-in-out;
      }
      
      .loading-animation div:nth-child(1) {
        animation-delay: 0s;
      }
      
      .loading-animation div:nth-child(2) {
        animation-delay: 0.4s;
      }
      
      .loading-animation div:nth-child(3) {
        animation-delay: 0.8s;
      }
      
      @keyframes loading-animation {
        0%,
        100% {
          transform: scale(1);
        }
        50% {
          transform: scale(0.6);
        }
      }
      
    `}</style>
  </main>
  )
}
