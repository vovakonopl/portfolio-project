export class AdditionalService {
  public name: string;
  public price: number;
  public description?: string;
  public image?: File | null;

  constructor(
    name: string,
    price: number,
    description?: string,
    image?: File | null,
  ) {
    this.name = name;
    this.price = price;
    this.description = description;
    this.image = image;
  }
}

export type TServiceMap = Map<string, AdditionalService>;
