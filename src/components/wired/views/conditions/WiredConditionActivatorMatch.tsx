import { FC, useEffect, useState } from 'react';
import { LocalizeText, WiredFurniType } from '../../../../api';
import { Column, Flex, Text } from '../../../../common';
import { useWired } from '../../../../hooks';
import { WiredConditionBaseView } from './WiredConditionBaseView';

// Mapea tipos y activadores según requisitos del usuario
// selectedType: 0=Usuario, 1=Mascota, 2=Bot
// selectedActivator: 0=Cualquiera, 1=Usuario especificado (stringParam)
export const WiredConditionActivatorMatch: FC<{}> = props =>
{
    const typeIds: number[] = [0, 1, 2];
    const typeActivator: number[] = [0, 1];

    const [selectedType, setSelectedType] = useState<number>(0);
    const [selectedActivator, setSelectedActivator] = useState<number>(0);
    const [specificUsername, setSpecificUsername] = useState<string>('');

    const { trigger = null, setIntParams = null, setStringParam = null } = useWired();

    // Guardamos: intParams: [selectedType, selectedActivator], stringParam: nombre (si aplica)
    const save = () =>
    {
        setIntParams([ selectedType, selectedActivator ]);
        setStringParam(selectedActivator === 1 ? (specificUsername || '') : '');
    };

    useEffect(() =>
    {
        // Carga inicial desde el trigger si hay datos previos
        const data = (trigger as any);
        if (!data) return;

        const ints: number[] = (data.intData || []);
        setSelectedType(ints.length > 0 ? ints[0] : 0);
        setSelectedActivator(ints.length > 1 ? ints[1] : 0);
        setSpecificUsername(typeof data.stringData === 'string' ? data.stringData : '');
    }, [ trigger ]);

    return (
        <WiredConditionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } hasSpecialInput={ true } save={ save } allOrOne allOrOneFor={0}>
            {/* Tipo de entidad */}
            <Column gap={ 1 }>
                <Text gfbold>{ LocalizeText('wiredfurni.params.entitytype') }</Text>
                { typeIds.map(value => (
                    <Flex key={ value } gap={ 1 } alignItems="center">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="selectedType"
                            id={`selectedType${ value }`}
                            checked={ selectedType === value }
                            onChange={ () => setSelectedType(value) } />
                        <Text>{ LocalizeText(`wiredfurni.params.entitytype.${ value }`) }</Text>
                    </Flex>
                )) }
            </Column>

            <hr className="m-0 bg-dark" />

            {/* Activador */}
            <Column gap={ 1 }>
                <Text gfbold>{ LocalizeText('wiredfurni.params.activator') }</Text>
                { typeActivator.map(value => (
                    <Flex key={ value } gap={ 1 } alignItems="center">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="selectedActivator"
                            id={`selectedActivator${ value }`}
                            checked={ selectedActivator === value }
                            onChange={ () => setSelectedActivator(value) } />
                        <Text>{ LocalizeText(`wiredfurni.params.entityactivator.${ value }`) }</Text>
                    </Flex>
                )) }

                {/* Input de usuario específico cuando selectedActivator=1 */}
                { selectedActivator === 1 && (
                    <Flex gap={ 1 } alignItems="center">
                        <input
                            className="form-control"
                            type="text"
                            placeholder={ LocalizeText('wiredfurni.params.username.placeholder') || 'Nombre de usuario' }
                            value={ specificUsername }
                            onChange={ (e) => setSpecificUsername(e.target.value) }
                        />
                    </Flex>
                ) }
            </Column>

            <hr className="m-0 bg-dark" />
        </WiredConditionBaseView>
    );
}
