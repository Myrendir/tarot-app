import React from 'react';
import {Link, useLocation} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faHome, faClipboard, faTrophy} from '@fortawesome/free-solid-svg-icons';

interface MobileLayoutProps {
    children: React.ReactNode;
}

const getSelectedColor = (pathname: string, paths: string[]): string => {

    if (paths.length === 1 && paths[0] === '/') {
        return pathname === '/' ? 'text-warning' : '';
    }

    return paths.some(path => pathname.includes(path)) ? 'text-warning' : '';
}
const MobileLayout: React.FC<MobileLayoutProps> = ({children}) => {
    const location = useLocation();
    return (
        <div className="d-flex flex-column vh-100 ">
            <div className="flex-grow-1 overflow-auto">
                {children}
            </div>
            <br/>
            <br/>
            <div className="navbar navbar-expand-lg navbar-light bg-light border-top fixed-bottom mt-5">
                <div className="d-flex justify-content-around w-100">
                    <Link className="nav-link" to="/"><FontAwesomeIcon icon={faHome}
                                                                       size="lg"
                                                                       className={getSelectedColor(location.pathname, ['/'])}/></Link>
                    <Link className="nav-link" to="/session"><FontAwesomeIcon icon={faClipboard}
                                                                                 size="lg"
                                                                                 className={getSelectedColor(location.pathname, ['/session', '/session/'])}/></Link>
                    <Link className="nav-link" to="/stats"><FontAwesomeIcon icon={faTrophy}
                                                                             size="lg"
                                                                             className={getSelectedColor(location.pathname, ['/profil'])}/></Link>
                </div>
            </div>
        </div>
    );
}

export default MobileLayout;
