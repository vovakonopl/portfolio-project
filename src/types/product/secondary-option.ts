export class SecondaryOption {
  public displayedName: string;
  public name: string; // + to the main name
  public priceInCents: number; // + to the main price

  constructor(displayedName: string, name: string, priceInCents: number) {
    this.displayedName = displayedName;
    this.name = name;
    this.priceInCents = priceInCents;
  }
}
