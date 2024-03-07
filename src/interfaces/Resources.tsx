export enum ResouceType {
    Product = "Product",
    Scene = "Scene",
    Table = "Table",
    SafeFunction = "Safe Function",
    QuoteHeader = "Quote Header"
}

export enum ResourceLocation {
    Product = "/admin/configurators/",
    Scene = "/admin/scenes/",
    SafeFunction = "/admin/safe-functions/",
    QuoteHeader = "/admin/quote-headers/"
}

export interface ResourceAPI {
    type: ResouceType,
    api: string,
    resourceLoationPath: ResourceLocation
}

export class ResourceSearchAPI {
    static readonly Products: ResourceAPI = { type: ResouceType.Product, api: "/api/admin/products/search", resourceLoationPath: ResourceLocation.Product };
    static readonly Scenes: ResourceAPI = { type: ResouceType.Scene, api: "/api/scenes/search", resourceLoationPath: ResourceLocation.Scene }
    static readonly SafeFunctions: ResourceAPI = { type: ResouceType.SafeFunction, api: "/api/functions/search", resourceLoationPath: ResourceLocation.SafeFunction }
    static readonly QuoteHeader: ResourceAPI = { type: ResouceType.QuoteHeader, api: "/api/quoteheaders/search", resourceLoationPath: ResourceLocation.QuoteHeader }

    // private to disallow creating other instances of this type
    private constructor(private readonly key: string, public readonly value: any) { }

    toString() {
        return this.key;
    }
}

export interface ReferencedResource {
    id: number,
    type: ResouceType
}

export interface Resource {
    id: number,
    references: ReferencedResource[],
}