import { Input } from 'antd';

function TextField({ value, onChange, placeholder }) {
    return <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />;
}

export default TextField;
