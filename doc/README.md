# Verified Documents Package

## Overview

This repository contains **officially redacted and digitally signed documents**.  
All files include multiple, independent verification layers to ensure **authenticity, integrity, and provable signing time**, enabling legal repudiation of unauthorized modifications or copies.

Verification layers:

- **FNMT PAdES visible signatures** embedded in the PDF (with trusted timestamp)
- **PGP signatures** for cross-platform cryptographic verification
- **SHA-512 hash manifest**, protected by both PGP signature and TSA timestamp

---

## Directory Structure

- `pdf_signed/` — PDFs with visible FNMT digital signatures and timestamps
- `pgp_asc/` — PGP signatures (`.asc`) for each document
- `SHA512SUMS` — SHA-512 hash manifest of all published files
- `SHA512SUMS.asc` — PGP signature of the hash manifest
- `SHA512SUMS.tsr` — TSA timestamp token for the hash manifest
- `publickey.asc` — PGP public key of the signer
- `README.md` — This file

---

## 1. Verifying FNMT Signatures (PAdES – All Platforms)

### Recommended software

- **Windows / macOS / Linux**: Adobe Acrobat Reader
- Any **PAdES-compliant PDF reader** is acceptable

### Steps

1. Open the PDF from `pdf_signed/`
2. Open the **Signature Panel**
3. Confirm:
   - Signature status: **Valid**
   - Certificate holder: `CABEZAS NUÑEZ GONZALO`
   - Timestamp is present and valid
4. Confirm that only **explicitly redacted fields (DNI/NIF)** are hidden

This verification alone already provides legal validity under **EU eIDAS**.

---

## 2. Verifying PGP Signatures (All Platforms)

### Required software

- **Windows**: Gpg4win
- **macOS**: GPG Suite or Homebrew `gnupg`
- **Linux**: `gnupg`

### Import the public key

```shell
gpg --import publickey.asc
```

### Verify a document

```shell
gpg --verify <file>.asc <file>
```

Expected result:

- Signature is **good**
- Signer matches the imported public key

---

## 3. Verifying SHA-512 Hashes

### Linux / macOS

```bash
sha512sum -c SHA512SUMS
```

### Windows (PowerShell)

```cmd
certutil -hashfile <file> SHA512
```

Compare the output manually with `SHA512SUMS`, or use WSL for automatic checking.

---

## 4. Verifying the Timestamp (TSA)

Timestamp verification is performed on the **hash manifest**, not individual files.  
This anchors the **entire repository state** to a verifiable point in time.

### Required software (all platforms)

- **OpenSSL**

### Verification command

```shell
openssl ts -verify \
  -in SHA512SUMS.tsr \
  -data SHA512SUMS \
  -CAfile fnmt-tsa.pem
```

The TSA certificate (`fnmt-tsa.pem`) can be obtained from the official [FNMT TSA](https://www.sede.fnmt.gob.es/es/dpcs/tsa) documentation or certificate repository.

---

## Recommended Verification Order

For full technical and legal coverage:

1. **Verify FNMT PAdES signature** in the PDF
2. **Verify PGP signature** of the document
3. **Verify SHA-512 hashes**
4. **Verify TSA timestamp** of the hash manifest

Only documents that pass all applicable checks should be considered authentic.

---

## Notes

- Only **explicitly sensitive data (DNI/NIF)** have been redacted
- PDFs retain **visible, trusted FNMT signatures**
- PGP and SHA-512 provide **independent cryptographic verification**
- Timestamping ensures **provable existence at a specific time**
- Always verify the **published, signed documents**, not original sources

---

> **Contact**  
> Provided for exceptional verification-related issues only.  
> Gonzalo Cabezas Núñez — [dev@sandokan.cat](mailto:dev@sandokan.cat)
