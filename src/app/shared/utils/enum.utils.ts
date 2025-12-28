export interface SelectOption {
    value: number | string;
    label: string;
}

export function enumToSelectOptions(enumObj: Record<string, any>): SelectOption[] {
    return Object.entries(enumObj)
        .filter(([key]) => isNaN(Number(key)))
        .map(([key, value]) => ({
            value,
            label: `${key.toLowerCase()}`
        }));
}

export function floorEnumToSelectOptions(enumObj: Record<string, any>, prefix: string = 'enum'): SelectOption[] {
    return enumToSelectOptions(enumObj).map(option => ({
        ...option,
        label: `${prefix}.${option.label}`
    }));
}

export function getEnumLabel(enumObj: Record<string, any>, value: number | string): string {
    for (const [key, enumValue] of Object.entries(enumObj)) {
        if (enumValue === value) {
            return key;
        }
    }
    return String(value);
}
