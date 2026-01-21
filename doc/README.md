# Verified Documents Package

## Overview

This repository contains **officially redacted and digitally signed documents**.  
All files include multiple, independent verification layers to ensure **authenticity, integrity, and provable signing time**, enabling legal repudiation of unauthorized modifications or copies.

Verification layers:

- **SHA-512 hash manifest**, protected by PGP signature and TSA timestamp
- **PGP signatures** for cross-platform cryptographic verification
- **FNMT PAdES visible signatures** embedded in the PDF (with trusted timestamp)

---

## Directory Structure

- `publickey.asc` — PGP public key of the signer
- `SHA512SUMS` — SHA-512 hash manifest of all published files
- `SHA512SUMS.asc` — PGP signature of the hash manifest
- `SHA512SUMS.tsr` — TSA timestamp token for the hash manifest
- `pdf_signed/` — PDFs with visible FNMT digital signatures and timestamps
- `pgp_asc/` — PGP signatures (`.asc`) for each document
- `README.md` — This file

---

## 0. Import PGP Public Key (All Platforms)

Before performing any PGP verification, import the signer’s public key:

```shell
gpg --import publickey.asc
```

---

## 1. Verifying Manifest PGP Signature & TSA (All Platforms)

1. Verify the manifest PGP signature:

```shell
gpg --verify SHA512SUMS.asc SHA512SUMS
```

2. Optional: verify the TSA timestamp of the manifest (requires `fnmt-tsa.pem`):

```shell
openssl ts -verify \
  -in SHA512SUMS.tsr \
  -data SHA512SUMS \
  -CAfile fnmt-tsa.pem
```

>- The TSA step anchors the repository state to a verifiable point in time.  
>- The TSA certificate can be obtained from the official [FNMT TSA](https://www.sede.fnmt.gob.es/es/dpcs/tsa) documentation or certificate repository.  
>- If you don’t have the TSA certificate, you can skip this step; the manifest PGP signature is sufficient for cryptographic integrity.

---

## 2. Verifying SHA-512 Hashes

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

## 3. Verifying PGP Signatures (All Platforms)

### Required software

- **Windows**: Gpg4win
- **macOS**: GPG Suite or Homebrew `gnupg`
- **Linux**: `gnupg`

### Verify a document

```shell
gpg --verify <file>.asc <file>
```

Expected result:

- Signature is **good**
- Signer **matches** the imported public key

---

## 4. Verifying FNMT Signatures (PAdES – All Platforms)

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

## 5. Automated Verification Script

You can use the provided script [`check-docs.sh`](https://github.com/sandokanCat/document-integrity-tools) to perform all verification steps automatically:

```bash
./check-docs.sh
```

This script will:

- Import the public PGP key (`publickey.asc`)
- Verify the PGP signature of the manifest (`SHA512SUMS.asc`)
- Verify the TSA timestamp of the hash manifest
- Verify SHA-512 hashes of all documents
- Verify the PGP signature of all documents

It implements the full verification workflow, equivalent to following steps 0–3 manually.

---

## Recommended Verification Order

For full technical and legal coverage:

1. **Verify PGP Manifest signature**
2. **Verify TSA timestamp** of the hash manifest (optional)
3. **Verify SHA-512 hashes** of the documents
4. **Verify PGP signature** of the documents
5. **Verify FNMT PAdES signature** in the PDF

> Using [`check-docs.sh`](https://github.com/sandokanCat/document-integrity-tools) automates this exact sequence (except 5th step).

Only documents that pass all applicable checks should be considered authentic.

---

## Notes

- Only **explicitly sensitive data (DNI/NIF)** have been redacted
- SHA-512 and PGP provide **independent cryptographic verification**
- Timestamping ensures **provable existence at a specific time**
- PDFs retain **visible, trusted FNMT signatures**
- Always verify the **published, signed documents**, not original sources

---

> **Contact**  
> Provided for exceptional verification-related issues only.  
> Gonzalo Cabezas Núñez — [dev@sandokan.cat](mailto:dev@sandokan.cat)
