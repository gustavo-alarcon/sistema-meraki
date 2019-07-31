export interface User {
    uid: string;
    name: string;
    lastname: string;
    displayName: string;
    password: string;
    permitId: string;
    db: string;
    regDate: number;
}

export interface Permit {
    id: string;
    name: string;
    salesSection: boolean;
    salesRequirementsButton: boolean;
    salesOrdersButton: boolean;
    salesQuotationsButton: boolean;
    salesShoppingButton: boolean;
    salesStoresButton: boolean;
    salesCheckStockButton: boolean;
    productionSection: boolean;
    productionRequirementsButton: boolean;
    productionOrdersButton: boolean;
    productionProductionOrdersButton: boolean;
    productionQuotationsButton: boolean;
    productionRawMaterialsButton: boolean;
    productionFinishedProductsButton: boolean;
    productionFinishedProductsTableSale: boolean;
    logisticSection: boolean;
    logisticTransfersButton: boolean;
    logisticTransfersCompleteList: boolean;
    logisticReceptionsButton: boolean;
    cashSection: boolean;
    cashActualButton: boolean;
    cashPreviousButton: boolean;
    cashManageButton: boolean;
    regDate: number;
}

export interface SerialNumber {
    id: string;
    index?: number;
    serie: number;
    productId: string;
    location: string | Store;
    name: string;
    code: string;
    color: string;
    status: string;
    regDate: number;
    createdBy: string;
    createdByUid: string;
    modifiedBy?: string;
    modifiedByUid?: string;
    modifiedDate?: number;
    customerDisplayName?: string;
    customerDocumentNumber?: string;
    customerDate?: number;
    takedBy?: string;
    takedByUid?: string;
    takedDate?: number;
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
    category: string;
    description: string;
    image: string;
    correlative: number;
    initialStock: number;
    stock: number;
    rawMaterialList?: RawMaterialList;
    sale: number;
    regDate: number;
}

export interface Requirement {
    id: string;
    correlative: number;
    status: string;
    product: Product;
    color: string;
    quantity: number;
    description: string;
    image1: string;
    image2: string;
    file1: string;
    file2: string;
    regDate: number;
    createdBy: string;
    createdByUid: string;
    approvedBy?: string;
    approvedByUid?: string;
    approvedDate?: number;
    canceledBy?: string;
    canceledByUid?: string;
    canceledDate?: number;
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
    ORCorrelative?: number;
    OPeCorrelative?: number;
    quotationCorrelative?: number;
    orderNote?: number;
    document: Document;
    documentSerial?: number;
    documentCorrelative: string;
    deliveryDate: number;
    proposedDate?: number;
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
    approvedBy?: string;
    approvedByUid?: string;
    approvedDate?: number;
}

export interface Quotation {
    id: string;
    correlative: number;
    deliveryDate: number;
    status: string;
    orderReference?: number;
    recommendations?: string;
    import?: number;
    proposedDate?: number;
    quantity: number;
    description: string;
    image1: string;
    image2: string;
    file1: string;
    file2: string;
    quotationPDF?: string;
    regDate: number;
    createdBy: string;
    createdByUid: string;
    approvedBy?: string;
    approvedByUid?: string;
    approvedDate?: number;
}

export interface RawMaterial {
    id: string;
    category: string;
    brand: string;
    code: string;
    name: string;
    unit: string;
    stock: number;
    purchase: number;
    sale: number;
}

export interface RawMaterialList {
    id: string;
    rawList: Array<RawMaterial>;
    otherResources: Array<OtherResource>;
    cost: number;
    regDate: number;
    createdBy: string;
    createdByUid: string;
    lastUpdateBy?: string;
    lastUpdateByUid?: string;
    lastUpdateDate?: number;
}

export interface OtherResource {
    id: string;
    description: string;
    cost: number;
    regDate: number;
    createdBy: string;
    createdByUid: string;
    lastUpdateBy?: string;
    lastUpdateByUid?: string;
    lastUpdateDate?: number;
    
}

export interface Category {
    id: string;
    name: string;
    source: string;
    regDate: number;
}

export interface Store {
    id: string;
    name: string;
    supervisor?: User;
    regDate: number;
}

export interface Unit {
    id: string;
    name: string;
    regDate: number;
}

export interface ProductionOrder {
    id: string;
    correlative: number;
    ORCorrelative?: number;
    OPeCorrelative?: number;
    quotationCorrelative?: number;
    orderNote?: number;
    product?: Product;
    document?: Document;
    documentSerial?: number;
    documentCorrelative?: string;
    deliveryDate?: number;
    status: string;
    color?: string;
    quantity: number;
    description: string;
    image1: string;
    image2: string;
    file1: string;
    file2: string;
    regDate: number;
    createdBy: string;
    createdByUid: string;
    approvedBy?: string;
    approvedByUid?: string;
    approvedDate?: number;
    startedBy?: string;
    startedByUid?: string;
    startedDate?: number;
    finalizedBy?: string;
    finalizedByUid?: string;
    finalizedDate?: number;
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
    canceledBy?: string;
    canceldByUid?: string;
    canceledDate?: number;
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
    canceledBy?: string;
    canceldByUid?: string;
    canceledDate?: number;
}

export interface TicketProduct {
    id: string;
    OPCorrelative: string;
    product: Product;
    quantity: number;
    source: string;
    regDate: number;
    createdBy: string;
    createdByUid: string;
    canceledBy?: string;
    canceldByUid?: string;
    canceledDate?: number;
}

export interface DepartureProduct {
    id: string;
    document: Document;
    documentSerial: number;
    documentCorrelative: number;
    product: Product;
    serie: number;
    color: string;
    quantity: number;
    price: number;
    discount: number;
    paymentType: string;
    location?: string | Store;
    dni: number;
    phone: number;
    source: string;
    regDate: number;
    createdBy: string;
    createdByUid: string;
    canceledBy?: string;
    canceldByUid?: string;
    canceledDate?: number;
}

export interface Transfer {
    id: string;
    correlative: string;
    origin: Store;
    destination: Store;
    serialList: Array<SerialNumber>;
    transferList?: Array<TransferList>;
    status: string;
    source: string;
    regDate: number;
    createdBy: string;
    createdByUid: string;
    approvedBy?: string;
    approvedByUid?: string;
    approvedDate?: number;
    canceledBy?: string;
    canceledByUid?: string;
    canceledDate?: number;
    carriedBy?: string;
    carriedByUid?: string;
    carriedDate?: number;
    receivedBy?: string;
    receivedByUid?: string;
    receivedDate?: number;
    rejectedBy?: string;
    rejectedByUid?: string;
    rejectedDate?: number;
}

export interface TransferList {
    product: Product;
    serialList: Array<SerialNumber>;
  }

export interface TransferItem {
    id: string;
    item: Product | RawMaterial;
    serie: number;
    regDate: number;
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

export interface Cash {
    id: string;
    currentOwner: User;
    name: string;
    location: Store;
    open: boolean;
    password: string;
    supervisor: User;
    lastOpening: number;
    lastClosure: number;
    regDate: number;
}