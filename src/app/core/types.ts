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
    product: Product;
    color: Color;
    description: string;
    
}