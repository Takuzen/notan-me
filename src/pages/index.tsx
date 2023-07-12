import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { DocumentReference, QueryDocumentSnapshot, addDoc, DocumentData } from '@firebase/firestore';

export default function Home() {
  const [note, setNote] = useState('');
  const [chatExpanded, setChatExpanded] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ role: string, content: string }>>([]);
  const [isToggled, setIsToggled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [showCommandModal, setShowCommandModal] = useState(false);
  const seasonsData = require('/72-seasons.json');
  const [seasonInfo, setSeasonInfo] = useState('');
  const [currentDate, setCurrentDate] = useState('');

   // Initialize Firebase
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
  let analytics: any; // Define analytics as any

  // Conditional import for Firebase Analytics
  if (typeof window !== 'undefined') {
    import('firebase/analytics').then((analyticsModule) => {
      const { getAnalytics } = analyticsModule;
      analytics = getAnalytics(app);
    });
  }

  seasonsData.forEach(async (season: any) => {
    try {
      const docRef: DocumentReference<DocumentData> = await addDoc(collection(db, 'seasons'), season);
      console.log('Document written with ID: ', docRef.id);
    } catch (error: any) {
      console.error('Error adding document: ', error);
    }
  });

  useEffect(() => {
    const getSeasonInfo = async () => {
      const currentDate = new Date();
      const currentMonthDay = `${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;


      const seasonsRef = collection(db, 'seasons');
      const q = query(seasonsRef, where("Start Date", "<=", currentMonthDay));
      const querySnapshot = await getDocs(q);

      let currentSeason: any;

      querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
        let season = doc.data();
        if (season["End Date"] >= currentMonthDay) {
          if (!currentSeason || season["End Date"] > currentSeason["End Date"]) {
            currentSeason = season;
          }
        }
      });

      if (currentSeason) {
        setSeasonInfo(`${currentSeason["24 Seasons"]} ${currentSeason["Range"]} ${currentSeason["Name"]}`);
      }
      setCurrentDate(`${(currentDate.getMonth() + 1).toString()}月${currentDate.getDate().toString()}日`);
    };

    getSeasonInfo();
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

  const processCommand = (command: string) => {
    // If the command starts with a slash, open the command window
    if (command.startsWith("/")) {
      // split the command into parts
      const parts = command.slice(1).split(' ');

      // the actual command is the first part
      const cmd = parts[0];

      // optional parameters to the command are the rest of the parts
      const params = parts.slice(1);

      console.log(`Command: ${cmd}, Params: ${params}`);
      setShowCommandModal(true);
    } else {
      // If the command doesn't start with a slash, close the command window
      setShowCommandModal(false);
    }
  };

  const handleChatSubmit = async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    if (chatInput.trim().length > 0) {
      if (chatInput.startsWith("/")) {
        processCommand(chatInput);
      } else {
        // ...existing code...
      }
    }
  };

  const handleButtonClick = () => {
    // Create a fake event to send to the handleChatSubmit function.
    const fakeEvent = {
      preventDefault: () => { },
      key: 'Enter',
      shiftKey: true
    };

    handleChatSubmit(fakeEvent as React.KeyboardEvent<HTMLTextAreaElement>);
  };

  const handleNoteChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote(event.target.value);
    processCommand(event.target.value);
  };

  const handleToggle = () => {
    setIsToggled(!isToggled);
  };

  const closeModal = () => {
    setShowCommandModal(false);
  };

  return (
    <main className="p-8 sm:p-24">
      {/* modal */}
      {showCommandModal && (
        <div className="absolute top-0 left-0 z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-sm px-4 text-left overflow-hidden border shadow-md transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="flex flex-col gap-3">
                <button type="button" className="w-full inline-flex justify-center rounded-md border border-transparent px-4 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm" onClick={closeModal}>
                  ジルを呼ぶ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col">
        <div className="flex w-full justify-between items-center">
          <p className="font-serif text-2xl font-bold">notan</p>
          <div className='flex gap-5'>
            <div className='flex'>
              <p><span className="ball" onClick={handleChatToggle}></span></p>
              <div className="pt-2 cursor-pointer" onClick={handleChatToggle}>
                  <Image
                    className="object-contain"
                    src="/chatnote-image.png"
                    alt="Chatnote Logo"
                    width={30}
                    height={30}
                    priority
                  />
                </div>
            </div>
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
        </div>

        <div className="flex flex-col items-center mt-12">
          <div className="flex w-full text-start ml-2 gap-5">
            <p className="font-mincho text-3xl">{currentDate}</p>
            <p className="flex flex-col justify-center pt-2 font-serif text-md">{seasonInfo}</p>
          </div>
          <div className="w-full">
            <textarea
              id='lptextarea'
              className="w-full h-full ml-2 mt-5 focus:outline-none caret-black focus:caret-black resize-none tracking-wider leading-relaxed font-mincho bg-transparent no-tap-highlighting"
              placeholder="・"
              value={note}
              onChange={handleNoteChange}
              onInput={autoResizeTextArea}
              autoFocus
            />
          </div>
          <div
            id="chat-container"
            className={`z-10 w-full bg-white cursor-pointer text-center ${
              chatExpanded ? 'h-[19rem]' : 'hidden'
              }`}
          >
            {chatExpanded ? (
              <>
                <p className="tracking-wider leading-relaxed font-mincho text-start mt-4 cursor-auto">こんにちは、<br />あなたのパートナーAIのジルです。<br /><br />何でも話してください。</p>
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
              </>
            ) : (
              <p className=""></p>
            )}
          </div>
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
  );
}