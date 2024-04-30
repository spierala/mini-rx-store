export interface TodoFilter {
    search: string;
    category: {
        isBusiness: boolean;
        isPrivate: boolean;
    };
}
