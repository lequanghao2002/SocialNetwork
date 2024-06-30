import classNames from 'classnames';
import { useState, forwardRef } from 'react';
import images from '~/assets/images';
import styles from './Image.module.scss';

const Image = forwardRef(
    ({ src, alt, className, fallback: customFallback = 'UploadFiles/Images/avatar.jpg', ...props }, ref) => {
        const [fallback, setFallback] = useState('');

        const handleError = () => {
            setFallback(customFallback);
        };

        const processedSrc = src?.startsWith('UploadFiles') ? `${process.env.REACT_APP_BASE_URL2}${src}` : src;
        return (
            <img
                className={classNames(styles.wrapper, className)}
                ref={ref}
                src={fallback || processedSrc}
                alt={alt}
                {...props}
                onError={handleError}
            />
        );
    },
);

export default Image;
