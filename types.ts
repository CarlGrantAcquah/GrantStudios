// AOS is loaded via CDN, so we define it globally on window
export interface AOSInstance {
    init: (options?: any) => void;
    refresh: () => void;
}

declare global {
    interface Window {
        AOS: AOSInstance;
    }
}

export enum SectionId {
    Features = "features",
    Demo = "demo",
    Pricing = "pricing"
}