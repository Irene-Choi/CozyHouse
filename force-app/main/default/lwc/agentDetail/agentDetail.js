import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { NavigationMixin, CurrentPageReference } from 'lightning/navigation';
import {
    subscribe,
    unsubscribe,
    MessageContext
} from 'lightning/messageService';
import AGENTSELECTEDMC from '@salesforce/messageChannel/AgentSelected__c';

import NAME_FIELD from '@salesforce/schema/Broker__c.Name';
import PICTURE_FIELD from '@salesforce/schema/Broker__c.Picture__c';

import EMAIL_FIELD from '@salesforce/schema/Broker__c.Email__c';
import MOBILE_FIELD from '@salesforce/schema/Broker__c.Mobile_Phone__c';
import PHONE_FIELD from '@salesforce/schema/Broker__c.Phone__c';
import TITLE_FIELD from '@salesforce/schema/Broker__c.Title__c';
import DESC_FIELD from '@salesforce/schema/Broker__c.Description__c';


export default class AgentDetail extends NavigationMixin(LightningElement) {
    //agentId;
    agentFields = [EMAIL_FIELD, MOBILE_FIELD, PHONE_FIELD, TITLE_FIELD, DESC_FIELD];
    subscription = null;
    currentPageReference = null; 
    urlStateParameters = null;

    @wire(MessageContext)
    messageContext;

    @wire(getRecord, {
        recordId: '$agentId',
        fields: [NAME_FIELD, PICTURE_FIELD]
    })
    agent;

    @api
    get recordId() {
        return this.agentId;
    }

    set recordId(agentId) {
        this.agentId = agentId;
    }

    @wire(CurrentPageReference)
    getStateParameters(currentPageReference) {
       if (currentPageReference) {
          this.urlStateParameters = currentPageReference.state;
          this.setParametersBasedOnUrl();
       }
    }

    setParametersBasedOnUrl() {
       this.agentId = this.urlStateParameters.agentId || null;
    }

    get agentName() {
        return getFieldValue(this.agent.data, NAME_FIELD);
    }

    get pictureURL() {
        return getFieldValue(this.agent.data, PICTURE_FIELD);
    }

    connectedCallback() {
        this.subscription = subscribe(
            this.messageContext,
            AGENTSELECTEDMC,
            (message) => {
                this.handleAgentSelected(message);
            }
        );
    }

    disconnectedCallback() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    handleAgentSelected(message) {
        this.agentId = message.agentId;
    }

    handleNavigateToRecord() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.agentId,
                objectApiName: 'Broker__c',
                actionName: 'view'
            }
        });
    }

    handleNavigateToBack() {
      history.back();
    }
}
