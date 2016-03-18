import { BrowserSync } from './browser-sync';
export declare class ElementSync {
    browser: BrowserSync;
    id: string;
    query: Locator;
    selector: string;
    sessionId: string;
    private webdriver;
    constructor(selector: any, browser: BrowserSync, parent?: string | ElementSync, id?: string);
    readonly ELEMENT: string;
    click(): void;
    clear(): void;
    submit(): void;
    keys(keys: string | string[], submit?: boolean): void;
    text(): string;
    hasText(text: string | RegExp): boolean;
    name(): string;
    attr(name: string, value?: any): any;
    css(propertyName: string): parsedCss;
    size(): ElementSize;
    location(): ElementLocation;
    locationInView(): ElementLocation;
    isSelected(): boolean;
    isEnabled(): boolean;
    isReadonly(): boolean;
    isVisible(): boolean;
    isEqual(em: string | ElementSync): boolean;
    is(): boolean;
    prop(name: string, value?: any): any;
    val(value?: any): string;
    type(keys: any, submit?: boolean): void;
    select(options: any): void;
    check(): boolean;
    uncheck(): boolean;
    event(type: string, options?: any): any;
    on(type: string): any;
}
export interface Locator {
    using: 'name' | 'id' | 'xpath' | 'class name' | 'css selector' | 'tag name' | 'link text' | 'partial link text';
    value: string;
}
export interface parsedCss {
    property: string;
    value: any;
    parsed: any;
}
export interface ElementSize {
    width: number;
    height: number;
}
export interface ElementLocation {
    x: number;
    y: number;
}
