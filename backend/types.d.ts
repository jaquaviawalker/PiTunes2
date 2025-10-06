declare module 'mfrc522-rpi' {
  class Mfrc522 {
    constructor(spi: any);
    setResetPin(pin: number): this;
    setBuzzerPin(pin: number): this;
    reset(): void;
    findCard(): { status: boolean; bitSize: number };
    getUid(): { status: boolean; data: number[] };
    selectCard(uid: number[]): number;
    authenticate(blockNumber: number, key: number[], uid: number[]): boolean;
    getDataForBlock(blockNumber: number): number[];
    writeDataToBlock(blockNumber: number, data: number[]): void;
    stopCrypto(): void;
    // Add other methods as needed
  }

  export = Mfrc522;
}

declare module 'rpi-softspi' {
  class SoftSPI {
    constructor(config: {
      clock: number;
      mosi: number;
      miso: number;
      client: number;
    });
    open(): void;
    transfer(data: Uint8Array): Uint8Array;
    // Add other methods as needed
  }

  export = SoftSPI;
}
