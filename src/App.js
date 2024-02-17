// basic functional component
import React, { useEffect, useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { Layout, Typography, Space } from 'antd'

import './App.css'

import { Navbar, HomePage, Cryptocurrencies, Cryptodetails, Exchanges, News } from './components'

import LoadData from './components/chartTutorial/LoadData'

const App = () => {

  return ( 
    <div className='app'>
        <div className='navbar'>
            <Navbar/>
        </div>
        <div className='main'>
          <Layout>
            <div className='routes'>
              <Routes>
                <Route path='/' element={<HomePage/>}/>

                <Route exact path='/exchanges'element={<Exchanges/>}/>

                <Route exact path='/cryptocurrencies' element={<Cryptocurrencies/>}/>

                <Route exact path='/crypto/:coinId' element={<Cryptodetails/>}/>

                <Route exact path='/news' element={<News/>}/>

                <Route exact path='/chart' element={<LoadData/>}/>

              </Routes>
            </div>
          </Layout>

          <div className='footer' level={5}>
            <Typography.Title style={{ color: "white", textAlign: "center", fontSize: "28px" }}>
              Cryptoverse <br />
              All rights reserved
            </Typography.Title>
            <Space>
              <Link to="/">Home</Link>
              <Link to="/exchanges">Exchanges</Link>
              <Link to="/news">News</Link>
            </Space>
          </div>
        </div>
    </div>
  )
}

export default App