import { LightningElement, wire } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import AGENTFILTERSCHANGEMC from '@salesforce/messageChannel/AgentFiltersChange__c';

const DELAY = 350;

export default class AgentSearch extends LightningElement {
    searchKey = '';

    @wire(MessageContext)
    messageContext;

    handleReset() {
        this.searchKey = '';
        this.fireChangeEvent();
    }

    handleSearchKeyChange(event) {
        this.searchKey = event.detail.value;
        this.fireChangeEvent();
    }

    fireChangeEvent() {
        // Debouncing this method: Do not actually fire the event as long as this function is
        // being called within a delay of DELAY. This is to avoid a very large number of Apex
        // method calls in components listening to this event.
        //console.log('Search : ' + this.searchKey );
        window.clearTimeout(this.delayTimeout);
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(() => {
            const filters = {
                searchKey: this.searchKey,
            };
            publish(this.messageContext, AGENTFILTERSCHANGEMC, filters);
        }, DELAY);
    }
}
