import { FC, useEffect, useState } from 'react';
import { LocalizeText, WiredFurniType } from '../../../../api';
import { Column, Flex, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredActionBaseView } from './WiredActionBaseView';

const ALLOWED_MODES: number[] = [0, 1];

export const WiredActionSendSignal: FC<{}> = props => {
    const [signalForEachFurni, setSignalForEachFurni] = useState(0);
    const [signalForEachUser, setSignalForEachUser] = useState(0);
    const [selectedGroup, setSelectedGroup] = useState<'first' | 'second'>('first');
    const [furniMode, setFurniMode] = useState(0)
    const [userMode, setUserMode] = useState(0)

    const { trigger = null, setIntParams = null } = useWired();

    const save = () => setIntParams([signalForEachFurni, signalForEachUser, furniMode, userMode]);

    useEffect(() => {
        if (trigger && trigger.intData) {
            setSignalForEachFurni(trigger.intData.length > 0 ? trigger.intData[0] : 0);
            setSignalForEachUser(trigger.intData.length > 1 ? trigger.intData[1] : 0);
            setFurniMode(trigger.intData.length > 2 ? trigger.intData[2] : 0);
            setUserMode(trigger.intData.length > 3 ? trigger.intData[3] : 0);
        }
    }, [trigger]);

    return <WiredActionBaseView isSignal={true} requiresFurni={WiredFurniType.STUFF_SELECTION_OPTION_BY_ID} hasSpecialInput={true} save={save} >
        <Column gap={2}>



            <Text center bold>{LocalizeText('Furnis/Items para enviar')}</Text>
            <Flex alignItems="center" gap={1} justifyContent='center' alignSelf='center'>
                {(selectedGroup === 'first' ? [0, 1, 2] : [3, 4]).map(modeValue => (
                    <Flex center className={` placeholder-adv-options ${furniMode === modeValue ? 'placeholder-adv-options-selected ' : 'placeholder-adv-options'}`}>
                        <div
                            key={modeValue}
                            className={` icon-furnis-${modeValue} button-icons-selector-general`}
                            onClick={() => setFurniMode(modeValue)}
                        >
                        </div>
                    </Flex>
                ))}
            </Flex>


            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
                <Text bold>
                    {LocalizeText(`wiredfurni.params.textmode.furni.${furniMode + 5}`)}
                </Text>
            </div>
            <hr className="m-0 bg-dark" />
            <Text center bold>{LocalizeText('Usuarios para enviar')}</Text>
            <Flex alignItems="center" gap={1} justifyContent='center' alignSelf='center'>
                {(selectedGroup === 'first' ? [0, 1, 2] : [3, 4]).map(modeValue => (
                    <Flex center className={` placeholder-adv-options ${userMode === modeValue ? 'placeholder-adv-options-selected ' : 'placeholder-adv-options'}`}>
                        <div
                            key={modeValue}
                            className={`button-icons-selector-general icon-furnis-${modeValue}`}
                            onClick={() => setUserMode(modeValue)}
                        >
                        </div>
                    </Flex>
                ))}
            </Flex>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
                <Text bold>
                    {LocalizeText(`wiredfurni.params.textmode.user.${userMode + 5}`)}
                </Text>
            </div>
            <hr className="m-0 bg-dark" />
            <Text style={{ marginLeft: "5px" }} bold>{LocalizeText('wiredfurni.params.conditions')}</Text>
            <Flex alignItems="center" gap={1}>
                <input className="check-menu-wired" type="checkbox" id="signalForEachFurni" checked={!!signalForEachFurni} onChange={event => setSignalForEachFurni(event.target.checked ? 1 : 0)} />
                <Text style={{ marginLeft: "10px" }}>Enviar señal por cada furni</Text>
            </Flex>
            <Flex alignItems="center" gap={1}>
                <input className="check-menu-wired" type="checkbox" id="signalForEachUser" checked={!!signalForEachUser} onChange={event => setSignalForEachUser(event.target.checked ? 1 : 0)} />
                <Text style={{ marginLeft: "10px" }}>Enviar señal por cada usuario</Text>
            </Flex>


        </Column>
    </WiredActionBaseView>;
};
