import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class AgentTile  extends NavigationMixin(LightningElement) {
    @api agent;

    handleAgentSelected() {
        const selectedEvent = new CustomEvent('selected', {
            detail: this.agent.Id
        });
        this.dispatchEvent(selectedEvent);

        handleNavigateToRecord;
    }

    handleNavigateToRecord() {
        // this[NavigationMixin.Navigate]({
        //     type: 'standard__webPage',
        //     attributes: {
        //         url: 'agents/detail?agentId=' + this.agent.Id
        //     }
        // });

        this[NavigationMixin.GenerateUrl]({
            type: 'standard__webPage',
            attributes: {
                url: 'agents/detail?agentId=' + this.agent.Id
            }
        }).then(generatedUrl => {
            console.log(generatedUrl);
            window.open(generatedUrl, "_self");
        });
    }
}
