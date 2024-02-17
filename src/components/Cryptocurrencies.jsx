import React, { useState, useEffect } from 'react'
import millify from 'millify'
import { Link } from 'react-router-dom'
import { Card, Row, Col, Input } from 'antd'

import { useGetCryptosQuery } from '../services/cryptoAPI'

const Cryptocurrencies = ({simplified}) => {
    // if classname 'simplified' show 10 cards else 100
    const count = simplified ? 10: 100;

    const {data: cryptosList, isFetching} = useGetCryptosQuery(count)
    const [cryptos, setCryptos] = useState([])
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
 
        const filteredData = cryptosList?.data?.coins.filter((coin) => 
            coin.name.toLowerCase().includes(searchTerm.toLowerCase()))

        setCryptos(filteredData)
        
    }, [cryptosList, searchTerm])

    if(isFetching) return 'Loading...'

    return (
        <>
            {!simplified ? (
                <div className='search-crypto'>
                    <Input placeholder='Search Cryptocurrency' onChange={(e) => setSearchTerm(e.target.value)}/>
                </div>
            ) : null}
            <Row gutter={[32, 32]} className='crypto-card-container'>
                {cryptos?.map((currency, idx) => (
                    <Col xs={24} sm={12} lg={6} className='crypto-card' key={currency.uuid}>
                        <Link key={currency.uuid} to={`/crypto/${currency.uuid}`}>
                            <Card 
                                title={`${currency.rank}. ${currency.name}`}
                                extra={<img className='crypto-image' style={{height: '35px', width: '35px'}} src={currency.iconUrl}/>}
                                hoverable
                                >
                                    {/* millify makes long numbers readable */}
                                    <p>Price: {millify(currency.price)}</p>
                                    <p>Market Cap: {millify(currency.marketCap)}</p>
                                    <p>Daily Change: {millify(currency.change)}%</p>
                            </Card>
                        </Link>
                    </Col>
                ))}
            </Row>
        </>
    )
}

export default Cryptocurrencies