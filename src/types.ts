export default interface Iconfig_service {
    get(key: string): string
}

export type Constants = {
    NODE_ENV: "production" | "development"
    CLIENT_EMAIL: string;
    PRIVATE_KEY: string
    SHEET_ID: string
    Table_Headers: Array<string>
}


export type source = "zillow" | "street easy" | "trullia"

export type Property = {
    Url: string;
    Property_Address: string;
    Price: string;
    Days_On_Market: string;
    OwnerName: string;
    Email: string;
    Phone_Number: string;
    Source: source,
    /*   type: "Rental" | "sold" */
}

export type Payload = Array<Property>