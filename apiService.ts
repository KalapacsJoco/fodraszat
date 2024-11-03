export class ApiService {
    private apiBaseUrl = 'http://salonsapi.prooktatas.hu/api';
  
    async getHairdressers() {
      const response = await fetch(`${this.apiBaseUrl}/hairdressers`);
      if (!response.ok) throw new Error('Nem sikerült betölteni a fodrászokat');
      return response.json();
    }

    async getAppointment() {
      const response = await fetch(`${this.apiBaseUrl}/appointments`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Nem sikerült létrehozni a foglalást');
      return response.json();

    }
  
    async createAppointment(data: {
      hairdresser_id: number;
      customer_name: string;
      customer_phone: string;
      appointment_date: string;
      service: string;
    }) {
      const response = await fetch(`${this.apiBaseUrl}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Nem sikerült létrehozni a foglalást');
      return response.json();
    }
  }
  