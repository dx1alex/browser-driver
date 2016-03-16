export declare function cssParse(str: any): CssParse[];
export interface CssParse {
    type: string;
    quote?: string;
    unit?: string;
    string?: string;
    value?: any;
}
