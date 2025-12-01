import { WiredSelectorLayoutCode } from '../../../../api';
import { WiredSelectorByUsername } from './WiredSelectorByUsername';
import { WiredSelectorFurniArea } from './WiredSelectorFurniArea';
import { WiredSelectorFurniByHeight } from './WiredSelectorFurniByHeight';
import { WiredSelectorFurniByType } from './WiredSelectorFurniByType';
import { WiredSelectorFurniFilter } from './WiredSelectorFurniFilter';
import { WiredSelectorFurniNeighbor } from './WiredSelectorFurniNeighbor';
import { WiredSelectorFurniOnFurni } from './WiredSelectorFurniOnFurni';
import { WiredSelectorFurniPicks } from './WiredSelectorFurniPicks';
import { WiredSelectorFurniWithVar } from './WiredSelectorFurniWithVar';
import { WiredSelectorUserFilter } from './WiredSelectorUserFilter';
import { WiredSelectorUserHaveHanditem } from './WiredSelectorUserHaveHanditem';
import { WiredSelectorUserOnFurni } from './WiredSelectorUserOnFurni';
import { WiredSelectorUserOnTeam } from './WiredSelectorUserOnTeam';
import { WiredSelectorUsersByAction } from './WiredSelectorUsersByAction';
import { WiredSelectorUsersByType } from './WiredSelectorUsersByType';
import { WiredSelectorUserSignal } from './WiredSelectorUserSignal';
import { WiredSelectorUsersNeighbor } from './WiredSelectorUsersNeighbor';
import { WiredSelectorUsersWithVar } from './WiredSelectorUsersWithVar';



export const WiredSelectorLayoutView = (code: number) =>
{
    switch (code)
    {

        case WiredSelectorLayoutCode.FURNI_AREA:
            return <WiredSelectorFurniArea />;
        case WiredSelectorLayoutCode.USERS_NEIGHBOR:
            return <WiredSelectorUsersNeighbor />;
        case WiredSelectorLayoutCode.FURNI_NEIGHBOR:
            return <WiredSelectorFurniNeighbor />;
        case WiredSelectorLayoutCode.FURNI_BY_TYPE:
            return <WiredSelectorFurniByType />
        case WiredSelectorLayoutCode.FURNI_FILTER:
            return <WiredSelectorFurniFilter />
        case WiredSelectorLayoutCode.USER_FILTER:
            return <WiredSelectorUserFilter />
        case WiredSelectorLayoutCode.USER_BY_NAME:
            return <WiredSelectorByUsername />
        case WiredSelectorLayoutCode.FURNI_BY_HEIGHT:
            return <WiredSelectorFurniByHeight />
        case WiredSelectorLayoutCode.FURNI_ON_FURNI:
            return <WiredSelectorFurniOnFurni />
        case WiredSelectorLayoutCode.USER_ON_FURNI:
            return <WiredSelectorUserOnFurni />
        case WiredSelectorLayoutCode.USER_ON_TEAM:
            return <WiredSelectorUserOnTeam />
        case WiredSelectorLayoutCode.USER_HAVE_HANDITEM:
            return <WiredSelectorUserHaveHanditem />
        case WiredSelectorLayoutCode.FURNI_PICKS:
            return <WiredSelectorFurniPicks />
        case WiredSelectorLayoutCode.USERS_BY_TYPE:
            return <WiredSelectorUsersByType />
        case WiredSelectorLayoutCode.USERS_BY_ACTION:
            return <WiredSelectorUsersByAction />
        case WiredSelectorLayoutCode.USER_SIGNALS:
            return <WiredSelectorUserSignal />
        case 16:
            return <WiredSelectorFurniWithVar />
        case 17:
            return <WiredSelectorUsersWithVar />
    }

    return null;
};
