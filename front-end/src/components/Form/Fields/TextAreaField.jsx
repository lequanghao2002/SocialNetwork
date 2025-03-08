import { Input } from 'antd';
import { forwardRef } from 'react';

const TextAreaField = forwardRef(({ value, onChange, placeholder, ...props }, ref) => {
    return <Input.TextArea ref={ref} value={value} onChange={onChange} placeholder={placeholder} {...props} />;
});

export default TextAreaField;
