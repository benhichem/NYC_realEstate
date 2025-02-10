import Iconfig_service from "../../types"
import type { DotenvParseOutput } from 'dotenv'
import { config } from 'dotenv'

export class ConfigService implements Iconfig_service {
    private config: DotenvParseOutput
    constructor() {
        const { error, parsed } = config()
        if (error) {
            throw new Error(error.message)
        }
        if (!parsed) {
            throw new Error('Nothing in Parsed')
        }
        this.config = parsed
    }
    get(key: string): string {
        let res = this.config[key]
        if (!res) {
            throw new Error('Not Key In DOTENV FILE ... ')
        }
        return res
    }
}
