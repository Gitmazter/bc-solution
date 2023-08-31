"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleTransaction = void 0;
class VehicleTransaction {
    constructor(sender, recipient, vehicle, year, make, model) {
        this.vehicle = vehicle ? vehicle : this.makePlate();
        this.sender = sender;
        this.recipient = recipient;
        this.year = year;
        this.make = make;
        this.model = model;
        this.hash = '';
    }
    makePlate() {
        const length = 3;
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const charactersLength = characters.length;
        const numbers = '1234567890';
        const numbersLength = numbers.length;
        let counter = 0;
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
        result += '-';
        counter = 0;
        while (counter < length) {
            result += numbers.charAt(Math.floor(Math.random() * numbersLength));
            counter += 1;
        }
        console.log("New Plate Number Generated: ", result);
        return result;
    }
}
exports.VehicleTransaction = VehicleTransaction;
//# sourceMappingURL=Transaction.js.map