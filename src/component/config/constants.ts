import { ConfigService } from "./envSecrets";
import { Constants } from "../../types";
let config = new ConfigService()

const Constants: Constants = {
    NODE_ENV: config.get('NODE_ENV') as "production" | "development",
    CLIENT_EMAIL: "",
    PRIVATE_KEY: "",
    SHEET_ID: "",
    Table_Headers: ["Url", "Property_Address", "Price", "Days_On_Market", "OwnerName", "Email", "Phone_Number", "Source", "Type"]
}




export default Constants