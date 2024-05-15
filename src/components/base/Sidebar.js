import { NavLink } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router'
import {
  HomeIcon,
  UserIcon,
  UserGroupIcon,
  ShoppingCartIcon,
  ShoppingBagIcon,
  FlagIcon,
  CollectionIcon,
  ColorSwatchIcon,
  LightningBoltIcon,
  ChatAlt2Icon,
  NewspaperIcon,
  LogoutIcon,
  TagIcon,
  CashIcon,
  WifiIcon,
  CreditCardIcon
} from '@heroicons/react/outline'

import { signout } from 'store/slices/auth'
// import logo from '../../assets/logo.png'
import logo from '../../assets/logo-wi.png'

function Logo() {
  return (
    <NavLink to="/">
      <div className="flex items-center flex-shrink-0 px-4">
        <img className="h-12 w-auto" src={logo} alt="DNR" />
      </div>
    </NavLink>
  )
}

function Profile() {
  const history = useHistory()
  // refactor, reinstall redux
  const dispatch = useDispatch()
  const handleLogOut = () => {
    dispatch(signout())
    history.push('/login')
  }
  return (
    <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
      <button className="flex-shrink-0 w-full group block" onClick={handleLogOut}>
        <div className="flex items-center">
          <LogoutIcon className="inline-block h-9 w-9 rounded-full" />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{'Admin'}</p>
            <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">Log Out</p>
          </div>
        </div>
      </button>
    </div>
  )
}

export default function Sidebar() {
  const bars = [
    {
      name: 'Dashboard',
      Component: HomeIcon,
      url: '/',
    },
    {
      name: 'Admin',
      Component: UserIcon,
      url: '/admins',
    },
    {
      name: 'User',
      Component: UserGroupIcon,
      url: '/users',
    },
    {
      name: 'Product',
      Component: CollectionIcon,
      url: '/products',
    },
    {
      name: 'Order',
      Component: ShoppingCartIcon,
      url: '/orders',
    },
    {
      name: 'Flash Sale',
      Component: LightningBoltIcon,
      url: '/flash-sale',
    },
    {
      name: 'Client Name',
      Component: ShoppingBagIcon,
      url: '/outlet_types',
    },
    {
      name: 'Category',
      Component: ColorSwatchIcon,
      url: '/categories',
    },
    {
      name: 'Banner',
      Component: FlagIcon,
      url: '/banners',
    },
    {
      name: 'Promotion',
      Component: TagIcon,
      url: '/promotion',
    },
    // {
    //   name: 'Chat',
    //   Component: ChatAlt2Icon,
    //   url: '/chat',
    // },
    {
      name: 'News',
      Component: NewspaperIcon,
      url: '/news',
    },
    // {
    //   name: 'Payment Terms',
    //   Component: CashIcon,
    //   url: '/payment',
    // },
    {
      name: 'PPOB',
      Component: CreditCardIcon,
      url: '/ppob',
    },
  ]
  return (
    <div className="flex flex-col">
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto min-h-0 border-r border-gray-200 bg-white">
        <Logo />
        <nav className="mt-5 flex-1 px-2 bg-white space-y-2">
          {bars.map((bar, i) => (
            <NavLink
              key={bar.name + i}
              exact
              to={bar.url}
              className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
              activeClassName="bg-gray-50 text-gray-900"
            >
              <bar.Component className="text-gray-400 group-hover:text-gray-500 mr-4 flex-shrink-0 h-6 w-6" />
              <p>{bar.name}</p>
            </NavLink>
          ))}
        </nav>
        <Profile />
      </div>
    </div>
  )
}
