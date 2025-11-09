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
      [FloorEnum.First]: 'apartments.floors.first',
      [FloorEnum.Second]: 'apartments.floors.second',
      [FloorEnum.Third]: 'apartments.floors.third',
      [FloorEnum.Fourth]: 'apartments.floors.fourth',
      [FloorEnum.Stores]: 'apartments.floors.stores',
      [FloorEnum.Kitnets]: 'apartments.floors.kitnets',
    };

    const key = floorTranslationKeys[floorValue];
    return key ? this.i18n.translate(key) : 'Unknown';
  }
}
