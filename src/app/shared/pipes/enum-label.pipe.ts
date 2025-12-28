import { Pipe, PipeTransform } from '@angular/core';
import { getEnumLabel } from '../utils/enum.utils';
import { TranslationService } from '@/core/services/translation.service';

@Pipe({
    name: 'enumLabel',
    standalone: true,
    pure: false
})
export class EnumLabelPipe implements PipeTransform {
    constructor(private readonly i18n: TranslationService) {}

    transform(value: number | string, enumObj: Record<string, any>): string {
        const label = getEnumLabel(enumObj, value);
        const translationKey = `enum.${label.toLowerCase()}`;
        return this.i18n.translate(translationKey);
    }
}
