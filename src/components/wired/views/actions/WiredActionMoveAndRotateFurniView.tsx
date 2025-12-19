import { FC, useEffect, useState } from 'react';
import { LocalizeText, WiredFurniType } from '../../../../api';
import { Column, Flex, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredActionBaseView } from './WiredActionBaseView';

const directionOptions: { value: number, icon: string }[] = [
    {
        value: 4,
        icon: 'ne'
    },
    {
        value: 5,
        icon: 'se'
    },
    {
        value: 6,
        icon: 'sw'
    },
    {
        value: 7,
        icon: 'nw'
    },
    {
        value: 8,
        icon: 'e'
    },
    {
        value: 9,
        icon: 's'
    },
    {
        value: 10,
        icon: 'w'
    },
    {
        value: 11,
        icon: 'n'
    },
    {
        value: 2,
        icon: 'mv-2'
    },
    {
        value: 3,
        icon: 'mv-3'
    },
    {
        value: 1,
        icon: 'mv-1'
    }
];

const rotationOptions: number[] = [ 0, 1, 2, 3, 4, 5, 6 ];

export const WiredActionMoveAndRotateFurniView: FC<{}> = props =>
{
    const [ movement, setMovement ] = useState(-1);
    const [ rotation, setRotation ] = useState(-1);
    const { trigger = null, setIntParams = null } = useWired();

    const save = () => setIntParams([ movement, rotation ]);

    useEffect(() =>
    {
        if(trigger.intData.length >= 2)
        {
            setMovement(trigger.intData[0]);
            setRotation(trigger.intData[1]);
        }
        else
        {
            setMovement(-1);
            setRotation(-1);
        }
    }, [ trigger ]);

    return (
        <WiredActionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_BY_ID_BY_TYPE_OR_FROM_CONTEXT } hasSpecialInput={ true } save={ save }>
            <Column gap={ 1 }>
                <Text>{ LocalizeText('wiredfurni.params.startdir') }</Text>
                <Column gap={ 1 }>
                    <Flex gap={ 1 }>
                        { directionOptions.slice(0, 4).map(option =>
                        {
                            return (
                                <Flex key={ option.value } alignItems="center" gap={ 1 }>
                                    <input className="form-check-radio-wired" type="radio" name="movement" id={ `movement${ option.value }` } checked={ (movement === option.value) } onChange={ event => setMovement(option.value) } />
                                    <Text>
                                        <i className={ `icon icon-${ option.icon }` } />
                                    </Text>
                                </Flex>
                            )
                        }) }
                    </Flex>
                    <Flex gap={ 1 }>
                        { directionOptions.slice(4, 8).map(option =>
                        {
                            return (
                                <Flex key={ option.value } alignItems="center" gap={ 1 }>
                                    <input className="form-check-radio-wired" type="radio" name="movement" id={ `movement${ option.value }` } checked={ (movement === option.value) } onChange={ event => setMovement(option.value) } />
                                    <Text>
                                        <i className={ `icon icon-${ option.icon }` } />
                                    </Text>
                                </Flex>
                            )
                        }) }
                    </Flex>
                    { directionOptions.slice(8).length > 0 && (
                        <Flex gap={ 1 }>
                            { directionOptions.slice(8).map(option =>
                            {
                                return (
                                    <Flex key={ option.value } alignItems="center" gap={ 1 }>
                                        <input className="form-check-radio-wired" type="radio" name="movement" id={ `movement${ option.value }` } checked={ (movement === option.value) } onChange={ event => setMovement(option.value) } />
                                        <Text>
                                            <i className={ `icon icon-${ option.icon }` } />
                                        </Text>
                                    </Flex>
                                )
                            }) }
                        </Flex>
                    ) }
                </Column>
            </Column>
            <Column gap={ 1 }>
                <Text >{ LocalizeText('wiredfurni.params.turn') }</Text>
                { rotationOptions.map(option =>
                {
                    return (
                        <Flex key={ option } alignItems="center" gap={ 1 }>
                            <input className="form-check-radio-wired" type="radio" name="rotation" id={ `rotation${ option }` } checked={ (rotation === option) } onChange={ event => setRotation(option) } />
                            <Text>{ LocalizeText(`wiredfurni.params.turn.${ option }`) }</Text>
                        </Flex>
                    )
                }) }
            </Column>
        </WiredActionBaseView>
    );
}
