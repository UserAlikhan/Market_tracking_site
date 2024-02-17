// Store for this Redux Application
import { configureStore } from '@reduxjs/toolkit'

// connect API to the store
import { cryptoApi } from '../services/cryptoAPI'
import { cryptoNewsApi } from '../services/cryptoNewsAPI'

export default configureStore({
    reducer: {
        [cryptoApi.reducerPath] : cryptoApi.reducer,
        [cryptoNewsApi.reducerPath]: cryptoNewsApi.reducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(cryptoApi.middleware).concat(cryptoNewsApi.middleware)
    }
})