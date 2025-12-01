import { IMessageEvent } from '../../../../../../api';
import { MessageEvent } from '../../../../../../events';
import { BulkHeightMapUpdateParser } from '../../../parser';

export class BulkHeightMapUpdateEvent extends MessageEvent implements IMessageEvent {
    constructor(callBack: Function) {
        super(callBack, BulkHeightMapUpdateParser);
    }

    public getParser(): BulkHeightMapUpdateParser {
        return this.parser as BulkHeightMapUpdateParser;
    }
}
