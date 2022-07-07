import { LightningElement, wire } from 'lwc';
import {
    publish,
    subscribe,
    unsubscribe,
    MessageContext
} from 'lightning/messageService';

import AGENTFILTERSCHANGEMC from '@salesforce/messageChannel/AgentFiltersChange__c';
import getPagedAgentList from '@salesforce/apex/BrokerController.getPagedAgentList';

const PAGE_SIZE = 9;

export default class AgentTileList extends LightningElement {
    pageNumber = 1;
    pageSize = PAGE_SIZE;

    searchKey = '';

    @wire(MessageContext)
    messageContext;

    @wire(getPagedAgentList, {
        searchKey: '$searchKey',
        pageSize: '$pageSize',
        pageNumber: '$pageNumber'
    })
    agents;

    connectedCallback() {
        this.subscription = subscribe(
            this.messageContext,
            AGENTFILTERSCHANGEMC,
            (message) => {
                this.handleFilterChange(message);
            }
        );
    }

    disconnectedCallback() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    handleFilterChange(filters) {
        this.searchKey = filters.searchKey;
    }

    handlePreviousPage() {
        this.pageNumber = this.pageNumber - 1;
    }

    handleNextPage() {
        this.pageNumber = this.pageNumber + 1;
    }

    handleAgentSelected(event) {
        const message = { agentId: event.detail };
        publish(this.messageContext, AGENTSELECTEDMC, message);
    }
}
