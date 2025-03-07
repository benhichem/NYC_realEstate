import axios from "axios"
import logger from "./logger"

export interface Proxy {
    id: string
    username: string
    password: string
    proxy_address: string
    port: number
    valid: boolean
    last_verification: string
    country_code: string
    city_name: string
    asn_name: string
    asn_number: number
    high_country_confidence: boolean
    created_at: string
}

interface ProxyResponse {
    count: number
    next: null | any
    previous: null | any
    results: Array<Proxy>
}

export async function GetProxyList(proxyListToken: string) {
    logger.info('API Request to Collect Proxies ')
    const response = await axios.get("https://proxy.webshare.io/api/v2/proxy/list/?mode=direct&page=1&page_size=10", {
        headers: {
            Authorization: `Token ${proxyListToken}`,
        },
    })

    const response_data: ProxyResponse = response.data
    logger.info(`Proxy Collected ${response.data.results.length}`)
    return response_data.results
}
