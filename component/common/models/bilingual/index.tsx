interface IBilingual {
  language: ILanguage | string;
  value: string;
}

interface ILanguage {
  name: string;
  code: string;
}

export default IBilingual;
