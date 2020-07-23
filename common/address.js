import Address from "@/common/classes/Address.js";

export const address = {
    address1: new Address(),
    address2: new Address(),
    address1Completed: false,
    address2Completed: false,
    current: null,
    
    clear: function() {
        this.address1 = new Address();
        this.address2 = new Address();
        address1Completed = true;
        address2Completed = true;
    }
}