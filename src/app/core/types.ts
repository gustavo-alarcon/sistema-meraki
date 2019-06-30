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
    requestedBy: string;
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
    correlative: number;
    regDate: number;
}

export interface Order {
    id: string;
    correlative: number;
    document: string;
    documentCorrelative: string;
    deliveryDate: number;
    status: string;
    color?: Array<Color>;
    quantity: number;
    description: string;
    image1: string;
    image2: string;
    file1: string;
    file2: string;
    regDate: number;
    requestedBy: string;
}