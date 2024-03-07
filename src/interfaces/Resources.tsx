export enum ResouceType {
    Product = "Product",
    Scene = "Scene",
    Table = "Table",
    SafeFunction = "SafeFunction",
    QuoteHeader = "Quote Header",
    WorkFlow = "Workflow",
    CustomAction = "Custom Action",
    GlobalType = "GlobalDefinition",
    QuoteOutput = "QuoteOutput"
}

export enum ResourceLocation {
    Product = "/admin/configurators/",
    Scene = "/admin/scenes/",
    SafeFunction = "/admin/safe-functions/",
    QuoteHeader = "/admin/quote-headers/",
    WorkFlow = "/admin/workflows/",
    CustomAction = "/admin/custom-actions/",
    QuoteOutput = "/admin/quote-outputs/"
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
    static readonly WorkFlow: ResourceAPI = { type: ResouceType.WorkFlow, api: "/api/workflows/search", resourceLoationPath: ResourceLocation.WorkFlow }
    static readonly CustomAction: ResourceAPI = { type: ResouceType.CustomAction, api: "/api/customactions/search", resourceLoationPath: ResourceLocation.CustomAction }
    static readonly QuoteOutput: ResourceAPI = { type: ResouceType.QuoteOutput, api: "/api/quoteoutputs/search", resourceLoationPath: ResourceLocation.QuoteOutput }

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