import { Select } from 'antd';
import { useEffect, useState } from 'react';
import tagService from '~/services/tagService';

function TagSelectField({ value, onChange, mode = 'tags', placeholder }) {
    const [listTag, setListTag] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                setLoading(true);
                const response = await tagService.getAllTag();
                if (response) {
                    const newListTag = response.map((element) => ({
                        value: element.name,
                        label: element.name,
                    }));
                    setListTag(newListTag);
                }
            } catch (error) {
                console.error('Failed to fetch tags', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTags();
    }, []);

    return (
        <Select
            className="customSelectTag"
            mode={mode}
            style={{ width: '100%' }}
            placeholder={placeholder}
            loading={loading}
            value={value}
            onChange={onChange}
            options={listTag}
            allowClear
        />
    );
}

export default TagSelectField;
