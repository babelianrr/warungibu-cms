import { useState, useEffect } from 'react'
import { Switch, useHistory, Route } from 'react-router-dom'
import PrivateRoute from './components/route/PrivateRoute'
import LoginRoute from './components/route/LoginRoute'
import {
  Dashboard,
  Admin,
  AdminCreate,
  User,
  UserCreate,
  UserEdit,
  UserDetail,
  Banner,
  BannerCreatePage,
  Order,
  Invoice,
  EditInvoice,
  Faktur,
  Product,
  ProductCreate,
  ProductDetail,
  ProductEdit,
  Category,
  CategoryCreate,
  CategoryEdit,
  Chat,
  NotFound,
  FlashSale,
  OutletType,
  OutletTypeEdit,
  OutletTypeCreate,
  News,
  NewsCreate,
  NewsDetail,
  NewsEdit,
  Promotion,
  PromotionDetail,
  Maintenance,
  Payment,
  Ppob,
  OutletTypeDetail
} from 'pages'
import serverAuthAPI from 'API/serverAuthAPI'

function App() {
  const history = useHistory()

  //! check expired token (?)
  const [check, setCheck] = useState(false)
  useEffect(() => {
    serverAuthAPI({
      url: '/admin/categories',
      method: 'GET',
    })
      .then((_) => { })
      .catch((error) => {
        if (error.errorCode === 'UNAUTHORIZED_USER') {
          localStorage.clear()
          history.push('/login')
        }
      })
      .finally((_) => setCheck(true))
  }, [history])

  if (check === false) return null

  return (
    <Switch>
      {/* <Maintenance /> */}
      <LoginRoute path="/login" />
      <PrivateRoute path="/users/create">
        <UserCreate />
      </PrivateRoute>
      <PrivateRoute path="/users/edit/:email">
        <UserEdit />
      </PrivateRoute>
      <PrivateRoute path="/users/:email">
        <UserDetail />
      </PrivateRoute>
      <PrivateRoute path="/users">
        <User />
      </PrivateRoute>

      <PrivateRoute path="/admins/create">
        <AdminCreate />
      </PrivateRoute>
      <PrivateRoute path="/admins">
        <Admin />
      </PrivateRoute>
      <PrivateRoute path="/products/create">
        <ProductCreate />
      </PrivateRoute>
      <PrivateRoute path="/products/:id/edit">
        <ProductEdit />
      </PrivateRoute>
      <PrivateRoute path="/products/:id/detail">
        <ProductDetail />
      </PrivateRoute>
      <PrivateRoute path="/products">
        <Product />
      </PrivateRoute>

      <PrivateRoute path="/categories/:id/edit">
        <CategoryEdit />
      </PrivateRoute>
      <PrivateRoute path="/categories/create">
        <CategoryCreate />
      </PrivateRoute>
      <PrivateRoute path="/categories">
        <Category />
      </PrivateRoute>

      <PrivateRoute path="/outlet_types/:id/edit">
        <OutletTypeEdit />
      </PrivateRoute>
      <PrivateRoute path="/outlet_types/:id/detail">
        <OutletTypeDetail />
      </PrivateRoute>
      <PrivateRoute path="/outlet_types/create">
        <OutletTypeCreate />
      </PrivateRoute>
      <PrivateRoute path="/outlet_types">
        <OutletType />
      </PrivateRoute>

      <PrivateRoute path="/banners/create">
        <BannerCreatePage />
      </PrivateRoute>
      <PrivateRoute path="/banners">
        <Banner />
      </PrivateRoute>

      <PrivateRoute path="/orders/faktur/:orderId" plain>
        <Faktur />
      </PrivateRoute>
      <PrivateRoute path="/orders/invoice/:orderId" plain>
        <Invoice />
      </PrivateRoute>
      <PrivateRoute path="/orders/EditInvoice/:orderId" plain>
        <EditInvoice />
      </PrivateRoute>
      <PrivateRoute path="/orders">
        <Order />
      </PrivateRoute>

      <PrivateRoute path="/chat">
        <Chat />
      </PrivateRoute>

      <PrivateRoute path="/flash-sale">
        <FlashSale />
      </PrivateRoute>

      <PrivateRoute path="/news/:slug/:id/edit">
        <NewsEdit />
      </PrivateRoute>
      <PrivateRoute path="/news/:slug/detail">
        <NewsDetail />
      </PrivateRoute>
      <PrivateRoute path="/news/create">
        <NewsCreate />
      </PrivateRoute>
      <PrivateRoute path="/news">
        <News />
      </PrivateRoute>
      <PrivateRoute path="/promotion/:id/detail">
        <PromotionDetail />
      </PrivateRoute>
      <PrivateRoute path="/promotion">
        <Promotion />
      </PrivateRoute>

      <PrivateRoute path="/payment">
        <Payment />
      </PrivateRoute>

      <PrivateRoute path="/ppob">
        <Ppob/>
      </PrivateRoute>


      <PrivateRoute exact path="/">
        <Dashboard />
      </PrivateRoute>

      <PrivateRoute path="*">
        <NotFound />
      </PrivateRoute>
    </Switch>
  )
}

export default App
