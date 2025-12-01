import { FC, useEffect, useState } from 'react';
import { LocalizeText, WiredFurniType } from '../../../../api';
import { Column, Flex, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredAddonBaseView } from './WiredAddonBaseView';

export const WiredAddonMovementPhysicsView: FC = () =>
{
    const [height, setHeight] = useState(false);
    const [throughFurni, setThroughFurni] = useState(false);
    const [throughUser, setThroughUser] = useState(false);
    const [blockedByFurni, setBlockedByFurni] = useState(false);

    const [typeOfAdvancedOptionOne, setTypeOfAdvancedOptionOne] = useState(0);
    const [typeOfAdvancedOptionTwo, setTypeOfAdvancedOptionTwo] = useState(0);
    const [typeOfAdvancedOptionThree, setTypeOfAdvancedOptionThree] = useState(0);

    const { trigger = null, setIntParams = null } = useWired();

    const save = () =>
    {
        // empaquetar flags como bitmask en un solo entero
        let flags = 0;
        if (height) flags |= 1;          // bit 0
        if (throughFurni) flags |= 2;    // bit 1
        if (throughUser) flags |= 4;     // bit 2
        if (blockedByFurni) flags |= 8;  // bit 3

        setIntParams([flags, typeOfAdvancedOptionOne, typeOfAdvancedOptionTwo, typeOfAdvancedOptionThree]);
    };

    useEffect(() =>
    {
        const intData = trigger?.intData || [];
        const flags = intData[0] ?? 0;

        setHeight((flags & 1) !== 0);
        setThroughFurni((flags & 2) !== 0);
        setThroughUser((flags & 4) !== 0);
        setBlockedByFurni((flags & 8) !== 0);

        setTypeOfAdvancedOptionOne(intData[1] ?? 0);
        setTypeOfAdvancedOptionTwo(intData[2] ?? 0);
        setTypeOfAdvancedOptionThree(intData[3] ?? 0);
    }, [trigger]);

    return (
        <WiredAddonBaseView hasSpecialInput={true} save={save} requiresFurni={WiredFurniType.STUFF_SELECTION_OPTION_BY_ID}>
            <Column gap={1}>
                <Text bold>{LocalizeText('wiredfurni.params.conditions')}</Text>
                <Flex alignItems="center" gap={1}>
                    <input className="form-check-input" type="checkbox" id="height" checked={height} onChange={e => setHeight(e.target.checked)} />
                    <Text>{LocalizeText('wiredfurni.params.mov.physic.height')}</Text>
                </Flex>
                <Flex alignItems="center" gap={1}>
                    <input className="form-check-input" type="checkbox" id="throughFurni" checked={throughFurni} onChange={e => setThroughFurni(e.target.checked)} />
                    <Text>{LocalizeText('wiredfurni.params.mov.physic.throughFurni')}</Text>
                </Flex>
                <Flex alignItems="center" gap={1}>
                    <input className="form-check-input" type="checkbox" id="throughUser" checked={throughUser} onChange={e => setThroughUser(e.target.checked)} />
                    <Text>{LocalizeText('wiredfurni.params.mov.physic.throughUser')}</Text>
                </Flex>
                <Flex alignItems="center" gap={1}>
                    <input className="form-check-input" type="checkbox" id="blockedByFurni" checked={blockedByFurni} onChange={e => setBlockedByFurni(e.target.checked)} />
                    <Text>{LocalizeText('wiredfurni.params.mov.physic.blockedByFurni')}</Text>
                </Flex>
            </Column>
            <hr className="m-0 bg-dark" />
            <Text>Mover a través de furnis</Text>
            {/* Advanced Option One */}
            <div className='align-advancedoptionsone'>
                <div className="button-group">
                    <button onClick={() => setTypeOfAdvancedOptionOne(0)} className={` icon-neighbor-3 ${typeOfAdvancedOptionOne === 0 ? 'button-icons-selector-general-selected' : 'button-icons-selector-general'}`} />
                    <button onClick={() => setTypeOfAdvancedOptionOne(1)} className={` icon-neighbor-1 ${typeOfAdvancedOptionOne === 1 ? 'button-icons-selector-general-selected' : 'button-icons-selector-general'}`} />
                    <button onClick={() => setTypeOfAdvancedOptionOne(2)} className={` icon-neighbor-5 ${typeOfAdvancedOptionOne === 2 ? 'button-icons-selector-general-selected' : 'button-icons-selector-general'}`} />
                    <button onClick={() => setTypeOfAdvancedOptionOne(3)} className={` icon-neighbor-2 ${typeOfAdvancedOptionOne === 3 ? 'button-icons-selector-general-selected' : 'button-icons-selector-general'}`} />
                    <button onClick={() => setTypeOfAdvancedOptionOne(4)} className={` icon-neighbor-7 ${typeOfAdvancedOptionOne === 4 ? 'button-icons-selector-general-selected' : 'button-icons-selector-general'}`} />
                </div>
            </div>

            {typeOfAdvancedOptionOne !== undefined && (
                <Text style={{ textAlign: "center" }}>{['Accionador', 'Seleccionados', 'Selector', 'Señal', 'Todos en la sala'][typeOfAdvancedOptionOne]}</Text>
            )}
            <Text>Bloqueado por furnis</Text>
            {/* Advanced Option Two */}
            <div className='align-advancedoptionsone'>
                <div className="button-group">
                    <button onClick={() => setTypeOfAdvancedOptionTwo(0)} className={` icon-neighbor-3 ${typeOfAdvancedOptionTwo === 0 ? 'button-icons-selector-general-selected' : 'button-icons-selector-general'}`} />
                    <button onClick={() => setTypeOfAdvancedOptionTwo(1)} className={` icon-neighbor-1 ${typeOfAdvancedOptionTwo === 1 ? 'button-icons-selector-general-selected' : 'button-icons-selector-general'}`} />
                    <button onClick={() => setTypeOfAdvancedOptionTwo(2)} className={` icon-neighbor-5 ${typeOfAdvancedOptionTwo === 2 ? 'button-icons-selector-general-selected' : 'button-icons-selector-general'}`} />
                    <button onClick={() => setTypeOfAdvancedOptionTwo(3)} className={` icon-neighbor-2 ${typeOfAdvancedOptionTwo === 3 ? 'button-icons-selector-general-selected' : 'button-icons-selector-general'}`} />
                    <button onClick={() => setTypeOfAdvancedOptionTwo(4)} className={` icon-neighbor-7 ${typeOfAdvancedOptionTwo === 4 ? 'button-icons-selector-general-selected' : 'button-icons-selector-general'}`} />
                </div>
            </div>
            {typeOfAdvancedOptionTwo !== undefined && (
                <Text style={{ textAlign: "center" }}>{['Accionador', 'Seleccionados', 'Selector', 'Señal', 'Todos en la sala'][typeOfAdvancedOptionTwo]}</Text>
            )}
            <Text>Mover a través de usuarios</Text>
            {/* Advanced Option Three */}
            <div className='align-advancedoptionsone'>
                <div className="button-group">
                    <button onClick={() => setTypeOfAdvancedOptionThree(0)} className={` icon-neighbor-3 ${typeOfAdvancedOptionThree === 0 ? 'button-icons-selector-general-selected' : 'button-icons-selector-general'}`} />
                    <button onClick={() => setTypeOfAdvancedOptionThree(1)} className={` icon-neighbor-5 ${typeOfAdvancedOptionThree === 1 ? 'button-icons-selector-general-selected' : 'button-icons-selector-general'}`} />
                    <button onClick={() => setTypeOfAdvancedOptionThree(2)} className={` icon-neighbor-2 ${typeOfAdvancedOptionThree === 2 ? 'button-icons-selector-general-selected' : 'button-icons-selector-general'}`} />
                    <button onClick={() => setTypeOfAdvancedOptionThree(3)} className={` icon-neighbor-6 ${typeOfAdvancedOptionThree === 3 ? 'button-icons-selector-general-selected' : 'button-icons-selector-general'}`} />
                </div>
            </div>
            {typeOfAdvancedOptionThree !== undefined && (
                <Text style={{ textAlign: "center" }}>{['Accionador', 'Selector', 'Señal', 'Todos en la sala'][typeOfAdvancedOptionThree]}</Text>
            )}
        </WiredAddonBaseView>
    );
};
