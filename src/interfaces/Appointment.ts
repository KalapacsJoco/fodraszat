// Appointment structure
interface Appointment {
    id?: string;
    hairdresser_id: string;
    customer_name: string;
    customer_phone: string;
    appointment_date: string;
    service: string;
    created_at?: string;
  }