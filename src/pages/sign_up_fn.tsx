import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, createUserWithEmailAndPassword, Auth, UserCredential } from 'firebase/auth';
import { getFirestore, collection, addDoc, Firestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

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

function getErrorMessage(code: string): string {
  switch (code) {
    case 'auth/invalid-email':
      return '無効なメールアドレスです。有効なメールアドレスを入力してください。';
    case 'auth/user-disabled':
      return 'このユーザーは無効化されています。サポートにお問い合わせください。';
    case 'auth/user-not-found':
      return 'ユーザーが見つかりません。メールアドレスとパスワードを確認してください。';
    case 'auth/wrong-password':
      return 'パスワードが間違っています。';
    case 'auth/email-already-in-use':
      return 'このメールアドレスは既に使用されています。';
    case 'auth/weak-password':
      return 'パスワードのセキュリティが不十分です。';
    case 'auth/missing-email':
      return 'メールアドレスが入力されていません。';
    default:
      return 'エラーが発生しました。もう一度お試しください。';
  }
}

export default function SignUp() {
  const [givenName, setGivenName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [postCode, setPostCode] = useState('');
  const [auth, setAuth] = useState<Auth | null>(null);
  const [db, setDb] = useState<Firestore | null>(null);
  const [error, setError] = useState(''); // New state variable for error
  const router = useRouter();

  useEffect(() => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const firestore = getFirestore(app);
    setAuth(auth);
    setDb(firestore);
  }, []);

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (!auth || !db) {
        throw new Error('Firebase app not initialized');
      }

      const { user }: UserCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Save user information to Firestore
      await addDoc(collection(db, 'users'), {
        userId: user.uid,
        email: user.email,
        givenName: givenName,
        familyName: familyName,
        address: address,
        postCode: postCode,
      });

      console.log('User signed up successfully!');
      router.push('./shipping');
    } catch (error) {
      const errorCode = (error as { code?: string }).code;
      const errorMessage = errorCode ? getErrorMessage(errorCode) : 'エラーが発生しました。もう一度お試しください。';
      setError(errorMessage);
      console.error('Error signing up:', error);
    }
  };

  const handleGivenNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setGivenName(e.target.value);
  };

  const handleFamilyNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFamilyName(e.target.value);
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };

  const handlePostCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPostCode(e.target.value);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-center">会員登録</h2>
      <p className='text-center'>大切なお客様の書類をお預かりする為、<br /><br />
        ご連絡用のEメールと、<br />
        お客様情報の設定をお願いします。<br /><br />
        お手数ですが、ご記入ください。
      </p>
      {error && <p className="text-red-500 text-center mt-6">{error}</p>} {/* Display error message */}
      <form onSubmit={handleSignUp}>
        <div className="bg-white rounded-xl p-10 w-full max-w-md">
        <input
            className="bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-600 rounded-lg px-4 py-2 mb-4 w-full"
            type="text"
            placeholder="姓"
            value={familyName}
            onChange={handleFamilyNameChange}
          />
          <input
            className="bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-600 rounded-lg px-4 py-2 mb-4 w-full"
            type="text"
            placeholder="名"
            value={givenName}
            onChange={handleGivenNameChange}
          />
          <input
            className="bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-600 rounded-lg px-4 py-2 mb-4 w-full"
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={handleEmailChange}
          />
          <input
            className="bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-600 rounded-lg px-4 py-2 mb-4 w-full"
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={handlePasswordChange}
          />
          <input
            className="bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-600 rounded-lg px-4 py-2 mb-4 w-full"
            type="text"
            placeholder="郵便番号"
            value={postCode}
            onChange={handlePostCodeChange}
          />
          <input
            className="bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-600 rounded-lg px-4 py-2 mb-4 w-full"
            type="text"
            placeholder="住所"
            value={address}
            onChange={handleAddressChange}
          />
          <button 
            className="bg-blue-600 text-white mt-7 px-4 py-2 rounded-lg w-full hover:bg-blue-700"
            type="submit">
              送信する
          </button>
        </div>
      </form>
    </div>
  );
}
