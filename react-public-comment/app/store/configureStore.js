import { createStore } from 'redux'
import rootReducer from '../reducers'

export default function configureStore(initialState) {
    window.devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;
    const store = createStore(rootReducer, initialState,
        // 触发 redux-devtools
        window.devToolsExtension ? window.devToolsExtension() : undefined
    )
    return store
}
