import {useState, useEffect, useRef} from 'react'
import {useMutation} from 'react-query'
import {collection, onSnapshot, doc, getDocs, query, orderBy} from 'firebase/firestore'
import {SearchIcon} from '@heroicons/react/solid'
import debounce from 'lodash.debounce'

import db from 'API/firebase'
import serverAuthAPI from 'API/serverAuthAPI'
import {createChat, readChat} from 'API'

import {LoadingPage} from 'components/base'

export default function ChatPage() {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [usersFiltered, setUsersFiltered] = useState([])
  const [search, setSearch] = useState('')
  const debounceSearch = debounce((e) => setSearch(e.target.value), 250)

  const {mutate: readChatMutation} = useMutation('read-chat', (userId) => readChat(userId))

  useEffect(() => {
    if (search !== '') {
      const filtered = users.filter((user) => user.includes(search))
      setUsersFiltered(filtered)
    }
  }, [search])

  const [user, setUser] = useState(undefined)
  const [chat, setChat] = useState([])

  const fetchUserRoom = () => {
    setIsLoading(true)

    const queryRef = collection(db, 'notifications')

    const unsubscribe = onSnapshot(queryRef, async (snapshot) => {
      let docs = []
      snapshot.forEach((doc) => {
        docs.push({...doc.data(), id: doc.id})
      })
      const sortedDocs = docs.sort((a, b) => {
        if (a.last_message.seconds < b.last_message.seconds) {
          return 1
        }
        return -1
      })

      let customerData = sortedDocs.map((doc) =>
        serverAuthAPI({
          url: `/admin/users?page=1&limit=1&ids[]=${doc.id}`,
          method: 'GET',
        }).then((data) => {
          if (data.users[0]) {
            return {...data.users[0], ...doc}
          }
          return false
        })
      )

      const customers = await (await Promise.all(customerData)).filter(Boolean)
      console.log('file: index.js ~ line 74 ~ }).then ~ customers', customers)

      setUsers(customers)

      setIsLoading(false)
    })

    return unsubscribe
  }

  // get user.id
  useEffect(() => {
    // fetchRooms()
    const unsubscribe = fetchUserRoom()

    return unsubscribe
  }, [])

  useEffect(() => {
    if (user) {
      const unsubscribe = onSnapshot(doc(db, 'rooms', `${user.id}`), (doc) => {
        setChat(doc.data().chats)
      })
      // handle supaya ga listen terus
      return () => {
        unsubscribe()
      }
    }
  }, [user])

  if (isLoading) return <LoadingPage />

  return (
    <>
      <div className="w-full px-4 grid grid-cols-3 gap-4">
        <div className="col-span-1 flex flex-col">
          <div className="py-2 mb-4">
            <div className="mb-4">
              <h1 className="text-2xl font-semibold text-gray-900">Chat</h1>
              <p className="text-gray-500 text-lg">Search Directory of {users.length} Customer</p>
            </div>
            <div className="flex-1">
              <div className="relative w-full">
                <input
                  id="name"
                  name="name"
                  type="text"
                  onChange={debounceSearch}
                  className="focus:ring-dnr-dark-blue focus:border-dnr-dark-blue block w-full pr-10 sm:text-sm placeholder-gray-400 rounded-md py-2 px-4 bg-gray-100 border-gray-100 focus:bg-white focus:text-gray-900"
                  placeholder="Find Customer"
                  autoComplete="off"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-300" />
                </div>
              </div>
            </div>
          </div>
          {/* List Customer, Sem :| */}
          <nav className="border">
            <div className="z-10 sticky top-0 border-t border-b border-gray-200 bg-gray-50 px-6 text-sm font-medium text-gray-500">
              <h3>List Customer</h3>
            </div>
            <ListUsers setUser={setUser} data={search ? usersFiltered : users} readChatMutation={readChatMutation} />
          </nav>
        </div>
        {/* CHAT */}
        <div className="border col-span-2 flex justify-between flex-col" style={{height: '94vh'}}>
          <div className="w-full p-4 bg-gray-100">
            <h1>{user?.name}</h1>
          </div>
          <ChatContent data={[...chat]} userId={user?.id} />
        </div>
      </div>
    </>
  )
}

function ListUsers({data = [], setUser, readChatMutation}) {
  return (
    <ul role="list" className="relative z-0 divide-y divide-gray-200 overflow-scroll " style={{height: '73vh'}}>
      {data.map((user) => (
        <li
          key={user.id}
          onClick={() => {
            setUser(user)
            readChatMutation(user.id)
          }}
        >
          <div className="relative px-6 py-5 flex justify-between items-center space-x-3 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-dnr-dark-turqoise">
            <div className="flex items-center space-x-2">
              <div className="flex-shrink-0">
                <img
                  className="h-10 w-10 rounded-full"
                  src={
                    user.photo_url
                      ? `${process.env.REACT_APP_PUBLIC_URL}${user.photo_url}`
                      : 'https://nrcqmmgoobssxyudfvxm.supabase.in/storage/v1/object/public/dnr-asset/user.png'
                  }
                  alt={user.name}
                />
              </div>
              <div className="min-w-0">
                <button className="focus:outline-none">
                  <span className="absolute inset-0" aria-hidden="true"></span>
                  <p className="text-sm font-medium text-gray-900 text-left">{user.name}</p>
                  <p className="text-sm text-gray-500 truncate text-left">{user.email}</p>
                </button>
              </div>
            </div>

            {user.unread_admin.length ? (
              <div className="bg-dnr-dark-orange w-5 h-5 p-0.5 text-center rounded-full text-white text-sm">
                {user.unread_admin.length}
              </div>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  )
}

function ChatContent({data = [], userId}) {
  const [text, setText] = useState('')
  const chatRef = useRef(null)
  const {mutate} = useMutation(createChat, {
    onSuccess(_) {
      window.scrollTo(0, document.body.scrollHeight)
      setText('')
    },
  })

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.lastElementChild.scrollIntoView(false)
    }
  }, [data])

  function handleSendText(e) {
    e.preventDefault()
    mutate({
      text: text,
      user_id: userId,
    })
  }

  if (data.length === 0)
    return (
      <div className="mb-4 overflow-scroll h-full flex justify-center items-center">
        <p>Pilih Customer</p>
      </div>
    )

  function ChatItem({chat = {}}) {
    return (
      <div className="clear-both">
        <div
          className={`mx-4 my-2 p-2 rounded-lg ${
            chat.sender_role_status === 'ADMIN'
              ? 'bg-dnr-dark-turqoise text-white float-right clear-both text-right'
              : 'bg-gray-700 text-white float-left clear-both text-left'
          }`}
        >
          {chat.text}
          <p className="text-xs text-white my-2">
            {chat.created.toDate().toDateString()}, {chat.created.toDate().toLocaleTimeString()}
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="mb-4 overflow-scroll h-full">
        {/* <p>{JSON.stringify(chat)}</p> */}
        <div className="mb-4 overflow-scroll h-full flex flex-col" ref={chatRef}>
          {data.map((chat, index) => (
            <ChatItem key={index + chat.sender_id} chat={chat} />
          ))}
        </div>
      </div>
      <form className="w-full flex justify-between bg-gray-100" onSubmit={handleSendText}>
        <input
          className="flex-grow m-2 py-2 px-4 mr-1 rounded-full border border-gray-300 bg-gray-200 resize-none"
          rows="1"
          placeholder="Message..."
          value={text}
          type="text"
          onChange={(e) => setText(e.target.value)}
        />
        <button className="border rounded-xl px-8 bg-dnr-dark-turqoise text-white m-2">Send</button>
      </form>
    </>
  )
}
