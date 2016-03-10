declare function parse(str: any): CssParse[];
export default parse;
export interface CssParse {
    type: string;
    quote?: string;
    unit?: string;
    string?: string;
    value?: any;
}
