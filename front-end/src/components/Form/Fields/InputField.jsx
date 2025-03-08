import React from 'react';
import { Form, Input } from 'antd';

const InputField = ({ name, label, control, errors, ...props }) => {
    return (
        <Form.Item label={label} validateStatus={errors[name] ? 'error' : ''} help={errors[name]?.message}>
            <Input {...field} {...props} />
        </Form.Item>
    );
};

export default InputField;
