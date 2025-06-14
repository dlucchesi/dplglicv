export class Glucose {
  id: number; // Unique identifier for the glucose record
  entry: number; // mg/dL
  entryDate: Date;
  obs: string; // Observations or notes about the glucose reading

  constructor(id: number, entry: number, entryDate: Date, obs: string) {
    this.id = id;
    this.entry = entry;
    this.entryDate = entryDate;
    this.obs = obs;
  }

  static fromJSON(json: any): Glucose {
    return new Glucose(
      json.id,
      json.entry,
      new Date(json.entryDate),
      json.obs
    );
  }
  toJSON(): any {
    return {
      id: this.id,
      entry: this.entry,
      entryDate: this.entryDate.toISOString(),
      obs: this.obs
    };
  }

  // Getters and Setters
  getId(): number {
    return this.id;
  }
  setId(id: number): void {
    this.id = id;
  }
  getEntry(): number {
    return this.entry;
  }
  setEntry(entry: number): void {
    this.entry = entry;
  }
  getEntryDate(): Date {
    return this.entryDate;
  }
  setEntryDate(entryDate: Date): void {
    this.entryDate = entryDate;
  }
  getObs(): string {
    return this.obs;
  }
  setObs(obs: string): void {
    this.obs = obs;
  }
  

}