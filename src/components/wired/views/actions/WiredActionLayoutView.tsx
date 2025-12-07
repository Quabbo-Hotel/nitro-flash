import { WiredActionLayoutCode } from '../../../../api';
import { WiredActionBotChangeFigureView } from './WiredActionBotChangeFigureView';
import { WiredActionBotFollowAvatarView } from './WiredActionBotFollowAvatarView';
import { WiredActionBotGiveHandItemView } from './WiredActionBotGiveHandItemView';
import { WiredActionBotMoveView } from './WiredActionBotMoveView';
import { WiredActionBotTalkToAvatarView } from './WiredActionBotTalkToAvatarView';
import { WiredActionBotTalkView } from './WiredActionBotTalkView';
import { WiredActionBotTeleportView } from './WiredActionBotTeleportView';
import { WiredActionCallAnotherStackView } from './WiredActionCallAnotherStackView';
import { WiredActionChaseView } from './WiredActionChaseView';
import { WiredActionChatView } from './WiredActionChatView';
import { WiredActionCloseDiceView } from './WiredActionCloseDiceView';
import { WiredActionFleeView } from './WiredActionFleeView';
import { WiredActionFurniToFurniView } from './WiredActionFurniToFurniView';
import { WiredActionGiveRewardView } from './WiredActionGiveRewardView';
import { WiredActionGiveScoreToPredefinedTeamView } from './WiredActionGiveScoreToPredefinedTeamView';
import { WiredActionGiveScoreView } from './WiredActionGiveScoreView';
import { WiredActionJoinTeamView } from './WiredActionJoinTeamView';
import { WiredActionKickFromRoomView } from './WiredActionKickFromRoomView';
import { WiredActionLeaveTeamView } from './WiredActionLeaveTeamView';
import { WiredActionMoveAndRotateFurniView } from './WiredActionMoveAndRotateFurniView';
import { WiredActionMoveFurniToView } from './WiredActionMoveFurniToView';
import { WiredActionMoveFurniView } from './WiredActionMoveFurniView';
import { WiredActionMuteUserView } from './WiredActionMuteUserView';
import { WiredActionRelativeMovesView } from './WiredActionRelativeMovesView';
import { WiredResetSubstractPointsView } from './WiredActionResetSubstractPointsView';
import { WiredActionResetView } from './WiredActionResetView';
import { WiredActionSendSignal } from './WiredActionSendSignalView';
import { WiredActionSetAddPointsView } from './WiredActionSetAddPointsView';
import { WiredActionSetFurniStateToView } from './WiredActionSetFurniStateToView';
import { WiredActionSetHeightView } from './WiredActionSetHeightView';
import { WiredActionSpeedUserView } from './WiredActionSpeedUserView';
import { WiredActionTeleportView } from './WiredActionTeleportView';
import { WiredActionTimerControlView } from './WiredActionTimerControlView';
import { WiredActionToggleFurniStateView } from './WiredActionToggleFurniStateView';
import { WiredActionWalkToFurniView } from './WiredActionWalkToFurni';
import { WiredActionGiveVariableView } from './WiredActionGiveVariableView';
import { WiredActionRemoveVariableView } from './WiredActionRemoveVariableView';
import { WiredActionChangeValueVariableView } from './WiredActionChangeValueVariableView';
import { WiredActionLimitUserVisionView } from './WiredActionLimitUserVisionView';
import { WiredActionSpotlightUserVisionView } from './WiredActionSpotlightUserVisionView';

export const WiredActionLayoutView = (code: number) =>
{
    switch (code)
    {
        case WiredActionLayoutCode.BOT_CHANGE_FIGURE:
            return <WiredActionBotChangeFigureView />;
        case WiredActionLayoutCode.BOT_FOLLOW_AVATAR:
            return <WiredActionBotFollowAvatarView />;
        case WiredActionLayoutCode.BOT_GIVE_HAND_ITEM:
            return <WiredActionBotGiveHandItemView />;
        case WiredActionLayoutCode.BOT_MOVE:
            return <WiredActionBotMoveView />;
        case WiredActionLayoutCode.BOT_TALK:
            return <WiredActionBotTalkView />;
        case WiredActionLayoutCode.BOT_TALK_DIRECT_TO_AVTR:
            return <WiredActionBotTalkToAvatarView />;
        case WiredActionLayoutCode.BOT_TELEPORT:
            return <WiredActionBotTeleportView />;
        case WiredActionLayoutCode.CALL_ANOTHER_STACK:
            return <WiredActionCallAnotherStackView />;
        case WiredActionLayoutCode.CHASE:
            return <WiredActionChaseView />;
        case WiredActionLayoutCode.CHAT:
            return <WiredActionChatView />;
        case WiredActionLayoutCode.FLEE:
            return <WiredActionFleeView />;
        case WiredActionLayoutCode.GIVE_REWARD:
            return <WiredActionGiveRewardView />;
        case WiredActionLayoutCode.GIVE_SCORE:
            return <WiredActionGiveScoreView />;
        case WiredActionLayoutCode.GIVE_SCORE_TO_PREDEFINED_TEAM:
            return <WiredActionGiveScoreToPredefinedTeamView />;
        case WiredActionLayoutCode.JOIN_TEAM:
            return <WiredActionJoinTeamView />;
        case WiredActionLayoutCode.KICK_FROM_ROOM:
            return <WiredActionKickFromRoomView />;
        case WiredActionLayoutCode.LEAVE_TEAM:
            return <WiredActionLeaveTeamView />;
        case WiredActionLayoutCode.MOVE_FURNI:
            return <WiredActionMoveFurniView />;
        case WiredActionLayoutCode.MOVE_AND_ROTATE_FURNI:
            return <WiredActionMoveAndRotateFurniView />;
        case WiredActionLayoutCode.MOVE_FURNI_TO:
            return <WiredActionMoveFurniToView />;
        case WiredActionLayoutCode.MUTE_USER:
            return <WiredActionMuteUserView />;
        case WiredActionLayoutCode.RESET:
            return <WiredActionResetView />;
        case WiredActionLayoutCode.SET_FURNI_STATE:
            return <WiredActionSetFurniStateToView />;
        case WiredActionLayoutCode.TELEPORT:
            return <WiredActionTeleportView />;
        case WiredActionLayoutCode.TOGGLE_FURNI_STATE:
            return <WiredActionToggleFurniStateView />;
        case WiredActionLayoutCode.WALK_TO_FURNI:
            return <WiredActionWalkToFurniView />;
        case WiredActionLayoutCode.SET_ADD_POINTS:
            return <WiredActionSetAddPointsView />;
        case WiredActionLayoutCode.RESET_SUBSTRACT_POINTS:
            return <WiredResetSubstractPointsView />;
        case WiredActionLayoutCode.RELATIVE_MOVES:
            return <WiredActionRelativeMovesView />;
        case WiredActionLayoutCode.CLOSE_DICE:
            return <WiredActionCloseDiceView />;
        case WiredActionLayoutCode.FURNI_TO_FURNI:
            return <WiredActionFurniToFurniView />;
        case WiredActionLayoutCode.TIMER_CONTROL:
            return <WiredActionTimerControlView />;
        case WiredActionLayoutCode.SET_HEIGHT:
            return <WiredActionSetHeightView />;
        case WiredActionLayoutCode.SEND_SIGNAL:
            return <WiredActionSendSignal />;
        case WiredActionLayoutCode.SPEED_USER:
            return <WiredActionSpeedUserView />;
        case WiredActionLayoutCode.LIMIT_USER_VISION:
            return <WiredActionLimitUserVisionView />;
        case WiredActionLayoutCode.GIVE_VARIABLE:
            return <WiredActionGiveVariableView />;
        case WiredActionLayoutCode.REMOVE_VARIABLE:
            return <WiredActionRemoveVariableView />;
        case WiredActionLayoutCode.CHANGE_VARIABLE_VALUE:
            return <WiredActionChangeValueVariableView />;
        case WiredActionLayoutCode.SPOTLIGHT_USER_VISION:
            return <WiredActionSpotlightUserVisionView />;
    }

    return null;
}
