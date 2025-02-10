import { ConfigService } from "./envSecrets";
import { Constants } from "../../types";
let config = new ConfigService()

const Constants: Constants = {
    NODE_ENV: config.get('NODE_ENV') as "production" | "development"
}

export default Constants