import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function LoadingModal({ title }) {
    return (
        <div className="loading-overlay">
            <FontAwesomeIcon icon={faSpinner} className="search-loading" />
            <span>{title}</span>
        </div>
    );
}

export default LoadingModal;
