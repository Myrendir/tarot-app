import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import AddSession from './components/Form/AddSession';
import {Provider} from 'react-redux';
import {store} from './store';
import HomePage from "./components/Pages/HomePage";
import SessionDetail from "./components/SessionDetail";
import ReduxToastr from "react-redux-toastr";
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';
import RankingPage from "./components/Pages/RankingPage";

function App() {
    return (
        <Provider store={store}>
            <Router>
                <div>
                    <Routes>
                        <Route path="/" element={<HomePage/>}/>
                        <Route path="/session" element={<AddSession/>}/>
                        <Route path="/session/:id" element={<SessionDetail/>}/>
                        <Route path="/stats" element={<RankingPage/>}/>
                    </Routes>
                </div>
            </Router>
            <ReduxToastr
                newestOnTop={false}
                preventDuplicates
                position="top-right"
                transitionIn="fadeIn"
                transitionOut="fadeOut"
                progressBar
            />
        </Provider>
    );
}

export default App;
