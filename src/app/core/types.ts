export interface User {
    uid: string;
    name: string;
    lastname: string;
    displayName: string;
    password: string;
    permit: Permit;
    db: string;
    regDate: number;
}

export interface Permit {
    id: string;
    name: string;
    regDate: number;
}

export interface SerialNumber {
    id: string;
    serial: number;
    name: string;
    code: string;
    regDate: number;
}

export interface Color {
    id: string;
    name: string;
    regDate: number;
}

export interface Product {
    id: string;
    name: string;
    code: string;
    colors?: Array<Color>;
    serialNumbers?: Array<SerialNumber>;
    regDate: number;
}

export interface Requirement {
    id: string;
    correlative: number;
    status: string;
    product: Product;
    color: Color;
    quantity: number;
    description: string;
    image1: string;
    image2: string;
    file1: string;
    file2: string;
    regDate: number;
    createdBy: string;
    createdByUid: string;
}

export interface Correlative {
    id: string;
    correlative: number;
    regDate: number;
}

export interface Document {
    id: string;
    name: string;
    serie: number;
    correlative?: number;
    regDate: number;
}

export interface Order {
    id: string;
    correlative: number;
    ORCorrelative?: number;
    OPeCorrelative?: number;
    document: Document;
    documentCorrelative: string;
    deliveryDate: number;
    status: string;
    quantity: number;
    description: string;
    image1: string;
    image2: string;
    file1: string;
    file2: string;
    regDate: number;
    createdBy: string;
    createdByUid: string;
}

export interface RawMaterial {
    id: string;
    category: string;
    warehouse?: Warehouse;
    code: string;
    name: string;
    unit: string;
    stock: number;
    purchase: number;
    sale: number;
}

export interface Category {
    id: string;
    name: string;
    regDate: number;
}

export interface Warehouse {
    id: string;
    name: string;
    regDate: number;
}

export interface Unit {
    id: string;
    name: string;
    regDate: number;
}

export interface ProductionOrder{
    id: string;
    correlative: number;
    ORCorrelative?: number;
    OPeCorrelative?: number;
    product?: Product;
    document?: Document;
    documentCorrelative?: string;
    deliveryDate?: number;
    status: string;
    color?: Array<Color>;
    quantity: number;
    description: string;
    image1: string;
    image2: string;
    file1: string;
    file2: string;
    regDate: number;
    createdBy: string;
    createdByUid: string;
    approvedBy: string;
    approvedByUid: string;
}

export interface TicketRawMaterial {
    id: string;
    document: string;
    documentCorrelative: string;
    provider?: Provider;
    raw: RawMaterial;
    quantity: number;
    totalPrice: number;
    unitPrice?: number;
    source: string;
    regDate: number;
    createdBy: string;
    createdByUid: string;
}

export interface DepartureRawMaterial {
    id: string;
    OPCorrelative: string;
    raw: RawMaterial;
    quantity: number;
    source: string;
    regDate: number;
    createdBy: string;
    createdByUid: string;
}

export interface Provider {
    id: string;
    name: string;
    shortName: string;
    address: string;
    ruc: number;
    regDate: number;
    createdBy: string;
    createdByUid: string;
}