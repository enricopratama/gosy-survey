export class CustomerService {
    getCustomersMedium() {
        return new Promise((resolve) => {
            const customers = [
                {
                    id: 1,
                    name: "John Doe",
                    country: { name: "USA", code: "US" },
                    representative: {
                        name: "Amy Elsner",
                    },
                    status: "Active",
                    verified: true,
                },
                {
                    id: 2,
                    name: "Jane Smith",
                    country: { name: "Germany", code: "DE" },
                    representative: {
                        name: "Anna Fali",
                    },
                    status: "qualified",
                    verified: false,
                },
                {
                    id: 3,
                    name: "Michael Brown",
                    country: { name: "Canada", code: "CA" },
                    representative: {
                        name: "Asiya Javayant",
                    },
                    status: "negotiation",
                    verified: true,
                },
                {
                    id: 4,
                    name: "Jessica Williams",
                    country: { name: "France", code: "FR" },
                    representative: {
                        name: "Bernardo Dominic",
                    },
                    status: "renewal",
                    verified: false,
                },
            ];

            setTimeout(() => resolve(customers), 500); // Simulating an API call with a delay
        });
    }
}
