declare function rgb2hex(color: string): HexColor;
export default rgb2hex;
export interface HexColor {
    hex: string;
    alpha: number;
}
