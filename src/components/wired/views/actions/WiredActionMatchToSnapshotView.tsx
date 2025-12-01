import { FC, useEffect, useState } from 'react';
import { LocalizeText, SendMessageComposer, WiredFurniType } from '../../../../api';
import { Column, Flex, Text, Button } from '../../../../common';
import { useWired } from '../../../../hooks';
import { ApplySnapshotMessageComposer } from '@nitrots/nitro-renderer';
import { WiredActionBaseView } from './WiredActionBaseView';

export const WiredActionMatchToSnapshotView: FC<{}> = props =>
{
    const [ stateFlag, setStateFlag ] = useState(0);
    const [ directionFlag, setDirectionFlag ] = useState(0);
    const [ positionFlag, setPositionFlag ] = useState(0);
    const [ heightFlag, setHeightFlag ] = useState(0);
    const { trigger = null, setIntParams = null } = useWired();

    const save = () => setIntParams([ stateFlag, directionFlag, positionFlag, heightFlag ]);

    const applySnapshot = () => SendMessageComposer(new ApplySnapshotMessageComposer(trigger.id));

    useEffect(() =>
    {
        setStateFlag(trigger.getBoolean(0) ? 1 : 0);
        setDirectionFlag(trigger.getBoolean(1) ? 1 : 0);
        setPositionFlag(trigger.getBoolean(2) ? 1 : 0);
        setHeightFlag(trigger.getBoolean(3) ? 1 : 0);
    }, [ trigger ]);

    return (
        <WiredActionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_BY_ID } hasSpecialInput={ true } save={ save }>
            <Column gap={ 1 }>
                <Text bold>{ LocalizeText('wiredfurni.params.conditions') }</Text>
                <Flex alignItems="center" gap={ 1 }>
                    <input className="form-check-input" type="checkbox" id="stateFlag" checked={ !!stateFlag } onChange={ event => setStateFlag(event.target.checked ? 1 : 0) } />
                    <Text>{ LocalizeText('wiredfurni.params.condition.state') }</Text>
                </Flex>aa
                <Flex alignItems="center" gap={ 1 }>
                    <input className="form-check-input" type="checkbox" id="directionFlag" checked={ !!directionFlag } onChange={ event => setDirectionFlag(event.target.checked ? 1 : 0) } />
                    <Text>{ LocalizeText('wiredfurni.params.condition.direction') }</Text>
                </Flex>
                <Flex alignItems="center" gap={ 1 }>
                    <input className="form-check-input" type="checkbox" id="positionFlag" checked={ !!positionFlag } onChange={ event => setPositionFlag(event.target.checked ? 1 : 0) } />
                    <Text>{ LocalizeText('wiredfurni.params.condition.position') }</Text>
                </Flex>
                <Flex alignItems="center" gap={ 1 }>
                    <input className="form-check-input" type="checkbox" id="heightFlag" checked={ !!heightFlag } onChange={ event => setHeightFlag(event.target.checked ? 1 : 0) } />
                    <Text>{ LocalizeText('wiredfurni.params.condition.height') }</Text>
                </Flex>
                <Button onClick={ applySnapshot }>
                    Apply Snapshot Now
                </Button>
            </Column>
        </WiredActionBaseView>
    );
}