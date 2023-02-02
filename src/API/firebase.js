import {initializeApp} from 'firebase/app'
import {getFirestore, collection, getDocs} from 'firebase/firestore'

const config = {
  apiKey: process.env.REACT_APP_FRB_API_KEY,
  authDomain: process.env.REACT_APP_FRB_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FRB_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FRB_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FRB_MESSAGIN_SENDER_ID,
  appId: process.env.REACT_APP_FRB_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
}

const firebaseApp = initializeApp(config)
const db = getFirestore(firebaseApp)

export default db
