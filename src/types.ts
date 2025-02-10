export default interface Iconfig_service {
    get(key: string): string
}

export type Constants = {
    NODE_ENV: "production" | "development"
} 