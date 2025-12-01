import { FC } from 'react';
import { WiredSelectorBaseView } from './WiredSelectorBaseView';

export const WiredSelectorFurniPicks: FC<{}> = () =>
{

    return (
        <WiredSelectorBaseView hasSpecialInput={true} save={null} requiresFurni={1}>
        </WiredSelectorBaseView>
    );
};
