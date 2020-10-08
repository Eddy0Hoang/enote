import * as React from 'react'
import {Route,HashRouter, Redirect} from 'react-router-dom'
import Loadable from 'react-loadable'
import ReactLoading from 'react-loading'
import Home from '../pages/Home'
// const Home = () => import('../pages/Home')
// Loadable({
//   loader: () => import('../pages/Home'),
//   loading: ReactLoading as any
// })

export default () => (
  <HashRouter>
    <Route path="/home" component={Home}/>
    <Redirect from="/" to="/home" />
  </HashRouter>
)

