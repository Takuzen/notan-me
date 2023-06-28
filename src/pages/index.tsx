import { useState, useEffect, useRef } from 'react';
import Image from 'next/image'
import Link from 'next/link'
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ion-icon': {
        name?: string;
        size?: 'small' | 'large' | 'default';
        color?: string;
        // Add other properties as required
      };
    }
  }
}

export default function Home() {
  const [note, setNote] = useState('');
  const [chatExpanded, setChatExpanded] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ role: string, content: string }>>([]);
  const [isToggled, setIsToggled] = useState(false);
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
            className="w-full h-screen focus:outline-none resize-none tracking-wider leading-relaxed font-minch bg-transparent"
            placeholder="6月28日 夏至 次候 菖蒲華さく"
            value={note}
            onChange={handleNoteChange}
          />
        </div>
      </div>

      <div
        id="chat-container"
        className={`z-10 cursor-pointer text-center rounded-t-lg border fixed bottom-0 left-0 right-0 mx-auto w-11/12 sm:w-9/12 lg:w-7/12 xl:w-5/12 p-5 shadow-lg overflow-y-auto ${
          chatExpanded ? 'h-2/3 sm:h-1/2 bottom-0' : ''
          }`}
        onClick={!chatExpanded ? handleChatToggle : undefined}
        >
        {chatExpanded ? (
        <>
        <button
          className="absolute -top-1 right-5 px-3 py-1 rounded-full bg-gray-400 text-white"
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
          className="z-20 resize-none w-full focus:caret-emerald-500 focus:outline-none rounded-lg mt-5 tracking-wider leading-relaxed bg-transparent text-gray-500 caret-emerald-500"
          placeholder=""
          autoFocus
          style={{ overflow: 'hidden' }}
        />
            <button
              className="submit-button w-[40px] self-end pr-3 pb-1 pl-3 pt-2 text-white bg-ja-purple bordernone rounded-lg relative bottom-0 right-0 hover:opacity-70 mb-3 mr-3" // Added mb-3 and mr-3 here for margin-bottom and margin-right
              onClick={handleButtonClick}
            >
              <ion-icon name="send"></ion-icon>
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
    `}</style>
  </main>
  )
}
