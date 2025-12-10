import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from '@/core/services/translation.service';
import { FloorEnum } from '@/shared/interfaces';

@Pipe({
  name: 'floorName',
  standalone: true,
  pure: false
})
export class FloorNamePipe implements PipeTransform {
  constructor(private readonly i18n: TranslationService) {}

  transform(floorValue: FloorEnum | number): string {
    const floorTranslationKeys: Record<number, string> = {
      [FloorEnum.First]: 'units.floors.first',
      [FloorEnum.Second]: 'units.floors.second',
      [FloorEnum.Third]: 'units.floors.third',
      [FloorEnum.Fourth]: 'units.floors.fourth',
      [FloorEnum.Stores]: 'units.floors.stores',
      [FloorEnum.Kitnets]: 'units.floors.kitnets',
    };

    const key = floorTranslationKeys[floorValue];
    return key ? this.i18n.translate(key) : 'Unknown';
  }
}
