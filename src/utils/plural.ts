// Word forms for Ukrainian pluralization rules (CLDR)
export interface PluralForms {
  one: string; //1, 21, 31… — квиток
  few: string; //2–4, 22–24… — квитки
  many: string; //0, 5–20, 25–30… — квитків
}

const pluralRules = new Intl.PluralRules('uk-UA');

// Selects the word
export function pluralize(count: number, forms: PluralForms): string {
  switch (pluralRules.select(count)) {
    case 'one':
      return forms.one;
    case 'few':
      return forms.few;
    default:
      return forms.many;
  }
}
