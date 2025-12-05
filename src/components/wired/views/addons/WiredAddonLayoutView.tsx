import { WiredAddonLayoutCode } from '../../../../api';
import { WiredAddonAnimationTimeView } from './WiredAddonAnimationTimeView';
import { WiredAddonCancelAnimation } from './WiredAddonCancelAnimation';
import { WiredAddonCarryUsers } from './WiredAddonCarryUsers';
import { WiredAddonFurniVariableView } from './WiredAddonFurniVariableView';
import { WiredAddonUserVariableView } from './WiredAddonUserVariableView';
import { WiredAddonGlobalVariableView } from './WiredAddonGlobalVariableView';
import { WiredAddonFilterFurniByVarView } from './WiredAddonFilterFurniByVarView';
import { WiredAddonFilterUsersByVarView } from './WiredAddonFilterUsersByVarView';
import { WiredAddonMovementPhysicsView } from './WiredAddonMovementPhysicsView';
import { WiredAddonFilterUserView } from './WiredAddonFilterUserView';
import { WiredAddonVariableTextView } from './WiredAddonVariableTextView';
import { WiredAddonTextOutputUsernameView } from './WiredAddonTextOutputUsernameView';
import { WiredAddonTextOutputVariableView } from './WiredAddonTextOutputVariableView';
import { WiredAddonReferenceVariableView } from './WiredAddonReferenceVariableView';
import { WiredAddonContextVariableView } from './WiredAddonContextVariableView';



export const WiredAddonLayoutView = (code: number) =>
{
    switch (code)
    {

        case WiredAddonLayoutCode.ANIMATION_TIME:
            return <WiredAddonAnimationTimeView />;
        case WiredAddonLayoutCode.CANCEL_ANIMATION:
            return <WiredAddonCancelAnimation />;
        case WiredAddonLayoutCode.CARRY_USERS:
            return <WiredAddonCarryUsers />;
            case WiredAddonLayoutCode.MOVEMENT_PHYSICS:
            return <WiredAddonMovementPhysicsView />;
        case WiredAddonLayoutCode.FURNI_VARIABLE:
            return <WiredAddonFurniVariableView />;
        case WiredAddonLayoutCode.USER_VARIABLE:
            return <WiredAddonUserVariableView />;
        case WiredAddonLayoutCode.GLOBAL_VARIABLE:
            return <WiredAddonGlobalVariableView />;
        case WiredAddonLayoutCode.FURNI_FILTER_BY_VAR:
            return <WiredAddonFilterFurniByVarView />;
        case WiredAddonLayoutCode.USERS_FILTER_BY_VAR:
            return <WiredAddonFilterUsersByVarView />;
            case WiredAddonLayoutCode.USER_FILTER:
            return <WiredAddonFilterUserView />;
        case WiredAddonLayoutCode.VARIABLE_TEXT:
            return <WiredAddonVariableTextView />;
        case WiredAddonLayoutCode.TEXT_OUTPUT_USERNAME:
            return <WiredAddonTextOutputUsernameView />;
        case WiredAddonLayoutCode.TEXT_OUTPUT_VARIABLE:
            return <WiredAddonTextOutputVariableView />;
        case WiredAddonLayoutCode.REFERENCE_VARIABLE:
            return <WiredAddonReferenceVariableView />;
        case WiredAddonLayoutCode.CONTEXT_VARIABLE:
            return <WiredAddonContextVariableView />;



    }

    return null;
};
