import {
  Home,
  Banner,
  Category,
  Chat,
  Order,
  Product,
  ProductForm,
  User,
  Profile,
  NotFound,
  Admin,
  AdminForm,
} from './pages'

const routes = [
  {
    path: '/admins/create',
    component: AdminForm,
  },
  {
    path: '/admins',
    component: Admin,
  },
  {
    path: '/users',
    component: User,
  },
  {
    path: '/products/edit/:id',
    component: ProductForm,
  },
  {
    path: '/products/create',
    component: ProductForm,
  },
  {
    path: '/products',
    component: Product,
  },
  {
    path: '/orders',
    component: Order,
  },
  {
    path: '/chat',
    component: Chat,
  },
  {
    path: '/categories',
    component: Category,
  },
  {
    path: '/banners',
    component: Banner,
  },
  {
    path: '/profile',
    component: Profile,
  },
  {
    path: '/',
    exact: true,
    component: Home,
  },
  {
    path: '*',
    component: NotFound,
  },
]

export default routes
