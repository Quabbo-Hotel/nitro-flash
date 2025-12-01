import { FC, useEffect, useState } from 'react';
import ReactSlider from 'react-slider';
import { LocalizeText, WiredFurniType } from '../../../../api';
import { Button, Column, Flex, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredConditionBaseView } from './WiredConditionBaseView';

export const WiredConditionSelectQuantity: FC<{}> = props =>
{
    const typeIds: number[] = [0, 1, 2];
    const [selectedType, setSelectedType] = useState<number>(0);
    const [value, setValue] = useState(50);
    const [selectedGroup, setSelectedGroup] = useState<'first' | 'second'>('first');
    const [typeMode, setTypeMode] = useState(0);

    // 👉 recordar últimos valores por grupo
    const [lastFirstGroupMode, setLastFirstGroupMode] = useState(8);
    const [lastSecondGroupMode, setLastSecondGroupMode] = useState(11);

    const { trigger = null, setIntParams = null } = useWired();

    const save = () =>
    {
        setIntParams([selectedType, typeMode, value]);
    };

    useEffect(() =>
    {
        const data = (trigger as any);
        if (!data) return;

        const ints: number[] = (data.intData || []);
        setSelectedType(ints.length > 0 ? ints[0] : 0);
        setTypeMode(ints.length > 1 ? ints[1] : 0);

        const loadedTypeMode = trigger.intData[1];
        if ([8, 9, 10].includes(loadedTypeMode))
        {
            setSelectedGroup('first');
            setLastFirstGroupMode(loadedTypeMode);
        }
        else if ([11, 12, 13].includes(loadedTypeMode))
        {
            setSelectedGroup('second');
            setLastSecondGroupMode(loadedTypeMode);
        }

        setValue(ints.length > 2 ? ints[2] : 0);
    }, [trigger]);

    const handleGroupChange = (group: 'first' | 'second') =>
    {
        setSelectedGroup(group);

        if(group === 'first')
        {
            setTypeMode(lastFirstGroupMode);
        }
        else
        {
            setTypeMode(lastSecondGroupMode);
        }
    };

    const handleModeChange = (modeValue: number) =>
    {
        setTypeMode(modeValue);

        if(selectedGroup === 'first') setLastFirstGroupMode(modeValue);
        else setLastSecondGroupMode(modeValue);
    };

    return (
        <WiredConditionBaseView requiresFurni={WiredFurniType.STUFF_SELECTION_OPTION_NONE} hasSpecialInput={true} save={save}>
            <Column gap={1}>
                <Text gfbold>{LocalizeText('wired_select_mode_u_want')}</Text>
                {typeIds.map(value => (
                    <Flex key={value} gap={1} alignItems="center">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="selectedType"
                            id={`selectedType${value}`}
                            checked={selectedType === value}
                            onChange={() => setSelectedType(value)} />
                        <Text>{LocalizeText(`wired.params.height.mode.${value}`)}</Text>
                    </Flex>
                ))}
            </Column>

            <hr className="m-0 bg-dark" />

            <Text bold>{LocalizeText('wiredfurni.params.compare.with') + " " + value}</Text>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Button onClick={() => setValue(prev => Math.max(1, prev - 1))}>-</Button>
                <ReactSlider
                    className={'nitro-slider'}
                    min={1}
                    max={100}
                    value={value}
                    onChange={(val) => setValue(val as number)}
                />
                <Button onClick={() => setValue(prev => Math.min(100, prev + 1))}>+</Button>
            </div>

            <hr className="m-0 bg-dark" />

            <Column style={{ display: "flex", alignItems: "flex-start" }} gap={1}>
                <div className='container-button-user-furni'>
                    <Text bold>{LocalizeText('wiredfurni.params.select.neighbor.title')}</Text>
                    <Flex style={{ height: "20px" }}>
                        <button
                            onClick={() => handleGroupChange('first')}
                            style={{
                                border: selectedGroup === 'first' ? '2px solid white' : '2px solid rgb(182, 190, 197)',
                                backgroundColor: selectedGroup === 'first' ? '#ececec' : 'rgb(205, 211, 217)',
                                borderTopLeftRadius: "10px"
                            }}
                        >
                            <div className='icon-furnis-neighbor icon-neighbor-selectfurniuser'></div>
                        </button>
                        <div style={{ width: "5px", height: "1px" }}></div>
                        <button
                            onClick={() => handleGroupChange('second')}
                            style={{
                                border: selectedGroup === 'second' ? '2px solid white' : '2px solid rgb(182, 190, 197)',
                                backgroundColor: selectedGroup === 'second' ? '#ececec' : 'rgb(205, 211, 217)',
                                borderBottomRightRadius: "10px",
                            }}
                        >
                            <div className='icon-users-neighbor icon-neighbor-selectfurniuser'></div>
                        </button>
                    </Flex>
                </div>

                <Flex alignItems="center" gap={1} justifyContent='center' alignSelf='center'>
                    {(selectedGroup === 'first' ? [8, 9, 10] : [11, 12, 13]).map(modeValue => (
                        <button
                            key={modeValue}
                            className={`button-icons-selector-general icon-neighbor-${modeValue}`}
                            onClick={() => handleModeChange(modeValue)}
                            style={{
                                backgroundColor: typeMode === modeValue ? 'rgb(236, 236, 236)' : '#cdd3d9',
                                border: typeMode === modeValue ? '2px solid white' : '2px solid #b6bec5',
                            }}
                        >
                        </button>
                    ))}
                </Flex>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
                    <Text bold>
                        {LocalizeText(`wiredfurni.params.textmode.neighbor.${typeMode}`)}
                    </Text>
                </div>
            </Column>
        </WiredConditionBaseView>
    );
}
