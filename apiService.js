var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class ApiService {
    constructor() {
        this.apiBaseUrl = 'http://salonsapi.prooktatas.hu/api';
    }
    getHairdressers() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${this.apiBaseUrl}/hairdressers`);
            if (!response.ok)
                throw new Error('Nem sikerült betölteni a fodrászokat');
            return response.json();
        });
    }
    getAppointment() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${this.apiBaseUrl}/appointments`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok)
                throw new Error('Nem sikerült létrehozni a foglalást');
            return response.json();
        });
    }
    createAppointment(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${this.apiBaseUrl}/appointments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok)
                throw new Error('Nem sikerült létrehozni a foglalást');
            return response.json();
        });
    }
}
