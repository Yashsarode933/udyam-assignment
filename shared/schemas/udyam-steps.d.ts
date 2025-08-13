export type ScrapedField = {
    name: string;
    label: string;
    type: string;
    required: boolean;
    pattern?: string;
    options?: string[];
};

export type ScrapedStep = {
    step: number;
    title: string;
    fields: ScrapedField[];
};

export type UdyamSchema = {
    steps: ScrapedStep[];
};


