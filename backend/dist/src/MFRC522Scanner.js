"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mfrc522Scanner = exports.ScanError = exports.ScanErrorType = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
// @ts-ignore
const mfrc522_rpi_1 = __importDefault(require("mfrc522-rpi"));
// @ts-ignore
const rpi_softspi_1 = __importDefault(require("rpi-softspi"));
const AlbumMapping_1 = require("./AlbumMapping");
var ScanErrorType;
(function (ScanErrorType) {
    ScanErrorType["IN_COOLDOWN"] = "IN_COOLDOWN";
    ScanErrorType["ALREADY_SCANNING"] = "ALREADY_SCANNING";
    ScanErrorType["NO_CARD"] = "NO_CARD";
    ScanErrorType["UID_READ_ERROR"] = "UID_READ_ERROR";
    ScanErrorType["UNKNOWN_ERROR"] = "UNKNOWN_ERROR";
})(ScanErrorType || (exports.ScanErrorType = ScanErrorType = {}));
class ScanError extends Error {
    constructor(type, message) {
        super(message);
        this.type = type;
        this.name = 'ScanError';
    }
}
exports.ScanError = ScanError;
class Mfrc522Scanner {
    constructor(cooldownPeriod = 3000) {
        this.lastScanTime = 0;
        this.cooldownPeriod = cooldownPeriod;
        this.isScanning = false;
        this.lastScannedCard = null;
        this.softSPI = new rpi_softspi_1.default({
            clock: 23,
            mosi: 19,
            miso: 21,
            client: 24,
        });
        // Initialize MFRC522 once
        this.mfrc522 = new mfrc522_rpi_1.default(this.softSPI).setResetPin(22).setBuzzerPin(18);
    }
    canScan() {
        return !this.isScanning && !this.isInCoolDown();
    }
    isInCoolDown() {
        return Date.now() < this.lastScanTime + this.cooldownPeriod;
    }
    getCooldownRemaining() {
        if (!this.isInCoolDown())
            return 0;
        return this.lastScanTime + this.cooldownPeriod - Date.now();
    }
    getLastScannedCard() {
        return this.lastScannedCard;
    }
    bufferToHex(buffer) {
        return Array.from(buffer)
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('');
    }
    /**
     * Attempts to read an RFID card, continuously polling until a card is found
     * @returns ScanResult object with success status, UID, and optional message
     */
    readCard() {
        // Check if already scanning
        if (this.isScanning) {
            const message = 'Scan already in progress';
            logger_1.default.warn(message);
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
            logger_1.default.info(message);
            return {
                success: false,
                uid: this.lastScannedCard || '',
                message,
            };
        }
        this.isScanning = true;
        try {
            logger_1.default.info('Scanning for RFID Card...');
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
                    logger_1.default.debug(`Still scanning... (${attempts} attempts)`);
                }
            }
            logger_1.default.info(`Card detected after ${attempts + 1} attempts!`);
            // Get the UID
            const uidResponse = this.mfrc522.getUid();
            if (!uidResponse.status) {
                logger_1.default.error('Error getting card UID');
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
            logger_1.default.info(`Card detected with UID: ${hexUid} (${uid.length} ${uid.albumName} bytes)`);
            return {
                success: true,
                uid: hexUid,
                message: 'Card read successfully',
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            logger_1.default.error(`Error during card scan: ${errorMessage}`);
            this.isScanning = false;
            return {
                success: false,
                uid: '',
                message: `Scan error: ${errorMessage}`,
            };
        }
    }
    async scanAlbum(albumMapping) {
        const scannedResult = this.readCard();
        if (scannedResult === null) {
            logger_1.default.error('Failed to scan tag');
            throw new Error('Failed to scan RFID tag');
        }
        logger_1.default.info('Tag scanned successfully', { tagId: scannedResult.uid });
        try {
            const mapping = albumMapping || (await AlbumMapping_1.AlbumMapping.create());
            const albumId = mapping.getAlbumByTagId(scannedResult.uid);
            if (albumId === null) {
                logger_1.default.error('No album found for tag', { tagId: scannedResult.uid });
                throw new Error(`Album not found for tag ID: ${scannedResult.uid}`);
            }
            logger_1.default.info('Found album for tag', { tagId: scannedResult.uid, albumId });
            return albumId;
        }
        catch (error) {
            logger_1.default.error('Error looking up album', {
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
    async readCardOrThrow() {
        if (this.isScanning) {
            throw new ScanError(ScanErrorType.ALREADY_SCANNING, 'Scan already in progress');
        }
        if (this.isInCoolDown()) {
            const remaining = Math.ceil(this.getCooldownRemaining() / 1000);
            throw new ScanError(ScanErrorType.IN_COOLDOWN, `Please wait ${remaining} seconds before scanning another card`);
        }
        const result = this.readCard();
        if (!result.success) {
            throw new ScanError(ScanErrorType.UNKNOWN_ERROR, result.message || 'Unknown error');
        }
        return result.uid;
    }
    /**
     * Resets the cooldown timer, allowing immediate next scan
     */
    resetCooldown() {
        this.lastScanTime = 0;
        logger_1.default.info('Cooldown timer reset');
    }
    /**
     * Cleanup method - call when shutting down
     */
    dispose() {
        this.mfrc522 = null;
        this.softSPI = null;
        logger_1.default.info('RFID scanner disposed');
    }
}
exports.Mfrc522Scanner = Mfrc522Scanner;
// // Initialize RFID reader
// function initializeRFIDReader();
// // Listen for card scans
// function onCardScanned(callback);
// // Handle card scan event
// async function handleCardScan(cardId);
// // Clean/format card ID
// function formatCardId(rawCardId);
