export class SecondaryOption {
  public displayedName: string;
  public name: string; // + to the main name
  public price: number; // + to the main price

  constructor(displayedName: string, name: string, price: number) {
    this.displayedName = displayedName;
    this.name = name;
    this.price = price;
  }
}
