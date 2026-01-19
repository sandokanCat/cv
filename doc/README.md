# Verified Documents Package

## Overview

This repository contains **officially redacted and digitally signed documents**.  
All files have multiple layers of verification to ensure authenticity and integrity, allowing legal repudiation of unauthorized copies.  

- Documents are signed with **FNMT (PAdES) visible digital signatures** including timestamp.
- Documents are additionally signed with **PGP** for cross-platform verification.
- Hashes of all files are provided using **SHA-512**, with a **timestamp from a TSA**.

---

## Directory Structure

- `pdf_signed/`: PDFs with visible FNMT digital signatures and timestamps
- `pgp_asc/`: PGP-signed files (.asc)
- `SHA512SUMS`: SHA-512 hashes of all files
- `SHA512SUMS.asc`: PGP signature of SHA512SUMS
- `SHA512SUMS.tsr`: TSA timestamp of SHA512SUMS
- `publickey.asc`: PGP public key of the signer
- `README.md`: This file

---

## How to Verify FNMT Signatures (PAdES)

1. Open the PDF in **Adobe Acrobat Reader** or another PAdES-compliant reader.
2. Check the **signature panel**:
   - Signature is valid
   - Certificate matches `CABEZAS NUÑEZ GONZALO`
   - Timestamp matches the signing date
3. Verify that only the **specific redacted fields (DNI/NIF)** are hidden.

---

## How to Verify PGP Signatures

1. Import the public key of the signer:

```bash
gpg --import publickey.asc
```

2. Verify each signed .asc file:

```bash
gpg --verify <file>.asc <file>
```

3. The output should indicate a valid signature and match the signer.

---

## How to Verify Hashes (SHA-512) and Timestamp

1. Verify file hashes match the manifest:

```bash
sha512sum -c SHA512SUMS
```

2. Verify the PGP signature of the manifest:

```bash
gpg --verify SHA512SUMS.asc SHA512SUMS
```

3. Verify the TSA timestamp (optional, for legal proof of time) using the `.tsr` file:

```bash
tsscmp --verify SHA512SUMS.tsr SHA512SUMS
```

4. All checks must pass to ensure authenticity, integrity, and timestamp verification.

---

## Notes

- Only the **specific sensitive data (DNI/NIF)** have been redacted.
- Original documents are protected with visible **[FNMT](https://www.fnmt.es/ceres) signatures and timestamps**.
- PGP signatures and SHA-512 sums provide an **additional layer of verification**.
- Unauthorized modification or distribution **can be legally repudiated** using the timestamps and signatures.
- Make sure you have the **signer's public PGP key** imported to verify `.asc` files.

---

## Recommended Verification Flow

For full legal coverage, it is recommended to verify the documents in this order:

1. **FNMT PAdES signature**: Ensure the signature is valid and timestamp matches.
2. **PGP signature**: Verify each `.asc` file against the signer’s public key.
3. **SHA-512 hashes and TSA timestamp**: Verify that all files match the `SHA512SUMS` manifest and that the manifest’s TSA timestamp is valid.

Example combined verification:

```bash
# Verify FNMT signature in Adobe Acrobat
# Then verify PGP
gpg --verify pdf_signed/document.pdf.asc pdf_signed/document.pdf
# Verify SHA-512 hash
sha512sum -c SHA512SUMS
# Verify timestamp
tsscmp --verify SHA512SUMS.tsr SHA512SUMS
```

Always verify the **signed, redacted documents**, not the originals. Unauthorized modification or redistribution can be legally repudiated.

---

## Contact

For verification questions or issues, contact:

Gonzalo Cabezas Núñez — [dev@sandokan.cat](mailto:dev@sandokan.cat)
