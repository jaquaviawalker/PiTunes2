import logger from '../utils/logger';
// @ts-ignore
import Mfrc522 from 'mfrc522-rpi';
// @ts-ignore
import SoftSPI from 'rpi-softspi';
import { AlbumMapping } from './AlbumMapping';
export type UID = string;

export interface ScanResult {
  success: boolean;
  uid: UID;
  message?: string;
}

export enum ScanErrorType {
  IN_COOLDOWN = 'IN_COOLDOWN',
  ALREADY_SCANNING = 'ALREADY_SCANNING',
  NO_CARD = 'NO_CARD',
  UID_READ_ERROR = 'UID_READ_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export class ScanError extends Error {
  constructor(public type: ScanErrorType, message: string) {
    super(message);
    this.name = 'ScanError';
  }
}

export class Mfrc522Scanner {
  private lastScanTime: number;
  private isScanning: boolean;
  private cooldownPeriod: number;
  private lastScannedCard: UID | null;
  private softSPI: any;
  private mfrc522: any;

  constructor(cooldownPeriod: number = 3000) {
    this.lastScanTime = 0;
    this.cooldownPeriod = cooldownPeriod;
    this.isScanning = false;
    this.lastScannedCard = null;

    this.softSPI = new SoftSPI({
      clock: 23,
      mosi: 19,
      miso: 21,
      client: 24,
    });

    // Initialize MFRC522 once
    this.mfrc522 = new Mfrc522(this.softSPI).setResetPin(22).setBuzzerPin(18);
  }

  public canScan(): boolean {
    return !this.isScanning && !this.isInCoolDown();
  }

  public isInCoolDown(): boolean {
    return Date.now() < this.lastScanTime + this.cooldownPeriod;
  }

  public getCooldownRemaining(): number {
    if (!this.isInCoolDown()) return 0;
    return this.lastScanTime + this.cooldownPeriod - Date.now();
  }

  public getLastScannedCard(): UID | null {
    return this.lastScannedCard;
  }

  private bufferToHex(buffer: number[]): string {
    return Array.from(buffer)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  /**
   * Attempts to read an RFID card, continuously polling until a card is found
   * @returns ScanResult object with success status, UID, and optional message
   */
  public readCard(): ScanResult {
    // Check if already scanning
    if (this.isScanning) {
      const message = 'Scan already in progress';
      logger.warn(message);
      return {
        success: false,
        uid: '',
        message,
      };
    }

    // Check cooldown
    if (this.isInCoolDown()) {
      const remaining = Math.ceil(this.getCooldownRemaining() / 1000);
      const message = `Please wait ${remaining} seconds before scanning another card`;
      logger.info(message);
      return {
        success: false,
        uid: this.lastScannedCard || '',
        message,
      };
    }

    this.isScanning = true;

    try {
      logger.info('Scanning for RFID Card...');

      // Reset the reader
      this.mfrc522.reset();

      // Continuously poll until a card is found
      let response;
      let attempts = 0;

      while (true) {
        response = this.mfrc522.findCard();

        if (response.status) {
          break; // Card found!
        }

        attempts++;

        // Optional: Log every 100 attempts to show it's still scanning
        if (attempts % 100 === 0) {
          logger.debug(`Still scanning... (${attempts} attempts)`);
        }
      }

      logger.info(`Card detected after ${attempts + 1} attempts!`);

      // Get the UID
      const uidResponse = this.mfrc522.getUid();

      if (!uidResponse.status) {
        logger.error('Error getting card UID');
        this.isScanning = false;
        return {
          success: false,
          uid: '',
          message: 'Error reading card UID',
        };
      }

      const uid = uidResponse.data;
      const hexUid = this.bufferToHex(uid);

      // Update state
      this.lastScanTime = Date.now();
      this.lastScannedCard = hexUid;
      this.isScanning = false;

      logger.info(
        `Card detected with UID: ${hexUid} (${uid.length} ${uid.albumName} bytes)`
      );

      return {
        success: true,
        uid: hexUid,
        message: 'Card read successfully',
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger.error(`Error during card scan: ${errorMessage}`);
      this.isScanning = false;

      return {
        success: false,
        uid: '',
        message: `Scan error: ${errorMessage}`,
      };
    }
  }

  public async scanAlbum(albumMapping?: AlbumMapping): Promise<string> {
    const scannedResult = this.readCard();
    if (scannedResult === null) {
      logger.error('Failed to scan tag');
      throw new Error('Failed to scan RFID tag');
    }

    logger.info('Tag scanned successfully', { tagId: scannedResult.uid });

    try {
      const mapping = albumMapping || (await AlbumMapping.create());
      const albumId = mapping.getAlbumByTagId(scannedResult.uid);

      if (albumId === null) {
        logger.error('No album found for tag', { tagId: scannedResult.uid });
        throw new Error(`Album not found for tag ID: ${scannedResult.uid}`);
      }

      logger.info('Found album for tag', { tagId: scannedResult.uid, albumId });
      return albumId;
    } catch (error: unknown) {
      logger.error('Error looking up album', {
        error,
        tagId: scannedResult.uid,
      });
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown error looking up album');
    }
  }

  /**
   * Alternative method that throws errors instead of returning result objects
   * Use this if you prefer error handling via try-catch
   */
  public async readCardOrThrow(): Promise<UID> {
    if (this.isScanning) {
      throw new ScanError(
        ScanErrorType.ALREADY_SCANNING,
        'Scan already in progress'
      );
    }

    if (this.isInCoolDown()) {
      const remaining = Math.ceil(this.getCooldownRemaining() / 1000);
      throw new ScanError(
        ScanErrorType.IN_COOLDOWN,
        `Please wait ${remaining} seconds before scanning another card`
      );
    }

    const result = this.readCard();

    if (!result.success) {
      throw new ScanError(
        ScanErrorType.UNKNOWN_ERROR,
        result.message || 'Unknown error'
      );
    }

    return result.uid;
  }

  /**
   * Resets the cooldown timer, allowing immediate next scan
   */
  public resetCooldown(): void {
    this.lastScanTime = 0;
    logger.info('Cooldown timer reset');
  }

  /**
   * Cleanup method - call when shutting down
   */
  public dispose(): void {
    this.mfrc522 = null;
    this.softSPI = null;
    logger.info('RFID scanner disposed');
  }
}

// // Initialize RFID reader
// function initializeRFIDReader();

// // Listen for card scans
// function onCardScanned(callback);

// // Handle card scan event
// async function handleCardScan(cardId);

// // Clean/format card ID
// function formatCardId(rawCardId);
