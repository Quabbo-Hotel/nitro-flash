import { IMessageDataWrapper, IMessageParser } from '../../../../../../api';
import { RoomUnitStatusAction } from './RoomUnitStatusAction';
import { RoomUnitStatusMessage } from './RoomUnitStatusMessage';

export class RoomUnitStatusParser implements IMessageParser {
    private _statuses: RoomUnitStatusMessage[];

    public flush(): boolean {
        this._statuses = [];
        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean {
        if (!wrapper) return false;

        const totalUnits = wrapper.readInt();
        this._statuses = [];

        for (let i = 0; i < totalUnits; i++) {
            const status = this.parseStatus(wrapper);
            if (status) this._statuses.push(status);
        }

        return true;
    }

    private parseStatus(wrapper: IMessageDataWrapper): RoomUnitStatusMessage {
        if (!wrapper) return null;

        const unitId = wrapper.readInt();
        const x = wrapper.readInt();
        const y = wrapper.readInt();
        const z = parseFloat(wrapper.readString());
        const headDirection = (wrapper.readInt() % 8) * 45;
        const direction = (wrapper.readInt() % 8) * 45;
        const actions = wrapper.readString();

        let targetX = 0;
        let targetY = 0;
        let targetZ = 0;
        let height = 0;
        let canStandUp = false;
        let didMove = false;
        const statusActions: RoomUnitStatusAction[] = [];

        if (actions) {
            const actionParts = actions.split('/');

            for (const action of actionParts) {
                const parts = action.split(' ');

                if (parts[0] === '') continue;

                if (parts.length >= 2) {
                    switch (parts[0]) {
                        case 'mv': {
                            const values = parts[1].split(',');

                            if (values.length >= 3) {
                                targetX = parseInt(values[0]);
                                targetY = parseInt(values[1]);
                                targetZ = parseFloat(values[2]);
                                didMove = true;
                            }
                            break;
                        }
                        case 'sit': {
                            const sitHeight = parseFloat(parts[1]);
                            if (parts.length >= 3) canStandUp = (parts[2] === '1');
                            height = sitHeight;
                            break;
                        }
                        case 'lay': {
                            const layHeight = parseFloat(parts[1]);
                            height = Math.abs(layHeight);
                            break;
                        }
                    }
                    statusActions.push(new RoomUnitStatusAction(parts[0], parts[1]));
                }
            }
        }

        return new RoomUnitStatusMessage(
            unitId,
            x,
            y,
            z,
            height,
            headDirection,
            direction,
            targetX,
            targetY,
            targetZ,
            didMove,
            canStandUp,
            statusActions
        );
    }

    public get statuses(): RoomUnitStatusMessage[] {
        return this._statuses;
    }
}
