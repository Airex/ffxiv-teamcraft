import {List} from '../list/list';
import {CommissionStatus} from './commission-status';
import {CommissionDiscussion} from './commission-discussion';
import {DataModel} from '../../core/database/storage/data-model';
import {DeserializeAs} from '@kaiu/serializer';
import {ListRow} from '../list/list-row';

export class Commission extends DataModel {

    /**
     * The name of the list used for the commission
     */
    name: string;

    /**
     * The id of the list linked to the commission
     */
    listId: string;

    items: ListRow[] = [];

    /**
     * The price that the buyer is willing to pay, defaults to 0 if he wants to negotiate the price or doesn't know which one to set.
     * @type {number}
     */
    price = 0;

    /**
     * The id of the request's author.
     */
    authorId: string;

    /**
     * The name of the server for the request.
     */
    server: string;

    /**
     * The discussions of the request, one per crafter.
     */
    @DeserializeAs([CommissionDiscussion])
    discussions: CommissionDiscussion[] = [];

    /**
     * The date of the commissio creation.
     * @type {string}
     */
    createdAt: string = new Date().toISOString();

    /**
     * The status of the request.
     */
    status: CommissionStatus = CommissionStatus.CREATED;

    /**
     * The id of the crafter who's crafting the request, can be undefined if status is CREATED.
     */
    crafterId?: string;

    constructor(authorId?: string, list?: List, server?: string) {
        super();
        // Only use constructor logic if we're creating a new commission, else it means we're deserializing the object, meaning that
        // everything we need is already in the object itself.
        if (list !== undefined) {
            this.items = list.recipes;
            this.listId = list.$key;
            this.server = server;
            this.authorId = authorId;
            this.name = list.name;
        }
    }

    public isGathering(): boolean {
        return this.items.find(item => item.gatheredBy !== undefined) !== undefined;
    }

    public isCrafting(): boolean {
        return this.items.find(item => item.craftedBy !== undefined && item.craftedBy.length > 0) !== undefined;
    }

    public isHunting(): boolean {
        return this.items.find(item => item.drops !== undefined && item.drops.length > 0) !== undefined;
    }
}
