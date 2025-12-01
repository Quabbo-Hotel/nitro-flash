import { FC, PropsWithChildren } from 'react';
import { WiredFurniType } from '../../../../api';
import { useWired } from '../../../../hooks';
import { WiredBaseView } from '../WiredBaseView';

export interface WiredAddonBaseViewProps {
    hasSpecialInput: boolean;
    requiresFurni: number;
    save: () => void;
}

export const WiredAddonBaseView: FC<PropsWithChildren<WiredAddonBaseViewProps>> = props => {
    const { requiresFurni = WiredFurniType.STUFF_SELECTION_OPTION_NONE, save = null, hasSpecialInput = false, children = null } = props;
    const { trigger = null } = useWired();

    return (
        <WiredBaseView wiredType="addon" requiresFurni={requiresFurni} save={save} hasSpecialInput={hasSpecialInput}>
            {children}
        </WiredBaseView>
    );
};
