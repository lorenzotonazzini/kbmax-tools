import { ReferencedResource } from "./Resources"

export default interface Product {
    references: ReferencedResource[], 
    id: number
}