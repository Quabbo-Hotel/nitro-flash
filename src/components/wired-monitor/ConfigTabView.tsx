import { FC, useEffect, useState } from "react";
import { Flex, Text } from '../../common';
import { GetSessionDataManager } from '../../api';
import { IRoomData } from "api";

interface ConfigTabViewProps
{
    roomData?: IRoomData;
    handleChange?: (field: string, value: string | number | boolean | string[]) => void;
    isOwner?: boolean;
}

export const ConfigTabView: FC<ConfigTabViewProps> = props => {
    const { roomData, handleChange, isOwner = false } = props;

    const [modifyWired, setModifyWired] = useState<string>('users_with_rights');
    const [inspectWired, setInspectWired] = useState<string>('everyone');

    useEffect(() => {
        if (roomData) {
            // Assuming roomData has modify_wired and inspect_wired as numbers
            // Map back to string values
            if (roomData.modify_wired === 0) setModifyWired('users_with_rights');
            else if (roomData.modify_wired === 1) setModifyWired('nobody');
            else setModifyWired('users_with_rights'); // default

            if (roomData.inspect_wired === 0) setInspectWired('everyone');
            else if (roomData.inspect_wired === 1) setInspectWired('users_with_rights');
            else if (roomData.inspect_wired === 2) setInspectWired('nobody');
            else setInspectWired('everyone'); // default
        }
    }, [roomData]);

    const handleModifyWiredChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (!isOwner) return;
        const value = e.target.value;
        setModifyWired(value);
        const numericValue = value === 'users_with_rights' ? 0 : 1;
        handleChange?.('modify_wired', numericValue);
    };

    const handleInspectWiredChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (!isOwner) return;
        const value = e.target.value;
        setInspectWired(value);
        const numericValue = value === 'everyone' ? 0 : value === 'users_with_rights' ? 1 : 2;
        handleChange?.('inspect_wired', numericValue);
    };

    return (
        <Flex className='global-grid' column gap={4} style={{ justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                            jeje diseño provisional
            <Flex column gap={2} style={{ width: '80%', backgroundColor: '#f0f0f0', padding: '16px', borderRadius: '8px' }}>
                <Text bold>Room settings:</Text>
                <Flex column gap={2}>
                    <Flex column style={{ flex: 1 }}>
                        <Text>Who can modify Wired:</Text>
                        <select value={modifyWired} onChange={handleModifyWiredChange} disabled={!isOwner} style={{ width: '100%' }}>
                            <option value='users_with_rights'>Users with rights</option>
                            <option value='nobody'>Nobody</option>
                        </select>
                    </Flex>
                    <Flex column style={{ flex: 1 }}>
                        <Text>Who can inspect Wired:</Text>
                        <select value={inspectWired} onChange={handleInspectWiredChange} disabled={!isOwner} style={{ width: '100%' }}>
                            <option value='everyone'>Everyone</option>
                            <option value='users_with_rights'>Users with rights</option>
                            <option value='nobody'>Nobody</option>
                        </select>
                    </Flex>
                </Flex>
            </Flex>

            
        </Flex>
    );
};
