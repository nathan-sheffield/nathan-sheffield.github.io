#!/usr/bin/env python3
"""
Encrypts secret content for the static site.

Reads plaintext files from _secrets/ and a manifest from secrets_manifest.yml,
produces encrypted files and key envelopes in encrypted/.

Usage:
    python3 script/encrypt_secrets.py
"""

import hashlib
import json
import os
import re
import secrets
import sys

import yaml
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

SECRETS_DIR = "_secrets"
MANIFEST_FILE = "secrets_manifest.yml"
OUTPUT_DIR = "encrypted"
PBKDF2_ITERATIONS = 600_000


def normalize_password(password: str) -> str:
    """Normalize a password: strip non-alphabetic characters, lowercase."""
    return re.sub(r"[^a-zA-Z]", "", password).lower()


def derive_key(password: str, salt: bytes) -> bytes:
    """Derive a 256-bit key from a password using PBKDF2-SHA256."""
    return hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, PBKDF2_ITERATIONS)


def encrypt_aes_gcm(key: bytes, plaintext: bytes) -> dict:
    """Encrypt plaintext with AES-256-GCM. Returns {iv, ciphertext} (ciphertext includes tag)."""
    aesgcm = AESGCM(key)
    iv = secrets.token_bytes(12)
    ciphertext = aesgcm.encrypt(iv, plaintext, None)
    return {"iv": iv.hex(), "ciphertext": ciphertext.hex()}


def parse_front_matter(content: str) -> tuple[dict, str]:
    """Parse YAML front matter from a file. Returns (metadata_dict, body)."""
    match = re.match(r"^---\s*\n(.*?)\n---\s*\n(.*)", content, re.DOTALL)
    if match:
        try:
            metadata = yaml.safe_load(match.group(1)) or {}
        except yaml.YAMLError:
            metadata = {}
        body = match.group(2)
        return metadata, body
    return {}, content


def main():
    if not os.path.isdir(SECRETS_DIR):
        print(f"Error: {SECRETS_DIR}/ directory not found.", file=sys.stderr)
        print(f"Create it and add your secret content files.", file=sys.stderr)
        sys.exit(1)

    if not os.path.isfile(MANIFEST_FILE):
        print(f"Error: {MANIFEST_FILE} not found.", file=sys.stderr)
        print(f"Create it with your password-to-file mappings.", file=sys.stderr)
        sys.exit(1)

    # Read manifest
    with open(MANIFEST_FILE) as f:
        manifest = yaml.safe_load(f)

    if not manifest or "passwords" not in manifest:
        print(f"Error: {MANIFEST_FILE} must have a 'passwords' list.", file=sys.stderr)
        sys.exit(1)

    # Resolve file groups (aliases for sets of files)
    file_groups = manifest.get("groups", {})

    def resolve_files(file_list):
        """Expand a file list, replacing group references with their contents."""
        resolved = []
        for item in file_list:
            if item.startswith("@"):
                group_name = item[1:]
                if group_name not in file_groups:
                    print(f"Error: Unknown file group '@{group_name}' in manifest.", file=sys.stderr)
                    sys.exit(1)
                resolved.extend(resolve_files(file_groups[group_name]))
            else:
                resolved.append(item)
        return resolved

    # Collect all secret files referenced in the manifest
    all_files = set()
    for entry in manifest["passwords"]:
        entry["files"] = resolve_files(entry["files"])
        for file_path in entry["files"]:
            all_files.add(file_path)

    # Read and encrypt each secret file
    file_index = {}  # filename -> index
    file_keys = {}   # filename -> AES key (bytes)

    os.makedirs(os.path.join(OUTPUT_DIR, "files"), exist_ok=True)
    os.makedirs(os.path.join(OUTPUT_DIR, "envelopes"), exist_ok=True)

    file_metadata = {}  # filename -> metadata for the manifest

    for i, filename in enumerate(sorted(all_files)):
        filepath = os.path.join(SECRETS_DIR, filename)
        if not os.path.isfile(filepath):
            print(f"Error: Secret file not found: {filepath}", file=sys.stderr)
            sys.exit(1)

        # Read file content
        with open(filepath, "rb") as f:
            raw_content = f.read()

        # Parse front matter for metadata
        text_content = raw_content.decode("utf-8", errors="replace")
        metadata, body = parse_front_matter(text_content)

        # Generate a random key for this file
        file_key = secrets.token_bytes(32)
        file_keys[filename] = file_key
        file_index[filename] = i

        # Encrypt the file body (markdown content without front matter)
        encrypted = encrypt_aes_gcm(file_key, body.encode("utf-8"))

        # Write encrypted file
        enc_path = os.path.join(OUTPUT_DIR, "files", f"{i}.enc")
        with open(enc_path, "w") as f:
            json.dump(encrypted, f)

        # Store metadata (not encrypted — titles etc. go into the envelope)
        file_metadata[filename] = {
            "index": i,
            "title": metadata.get("title", filename),
            "type": metadata.get("type", "post"),  # "post" or "page"
            "date": str(metadata.get("date", "")),
            "tagline": metadata.get("tagline", ""),
            "subtitle": metadata.get("subtitle", ""),
            "excerpt": metadata.get("excerpt", ""),
            "category": metadata.get("category", ""),
            "layout": metadata.get("layout", "post"),
            "group": metadata.get("group", ""),
            "groupHash": hashlib.sha256(metadata["group"].encode()).hexdigest()[:12] if metadata.get("group") else "",
            "order": metadata.get("order", 999),
            "is_hub": metadata.get("is_hub", False),
            "list_style": metadata.get("list_style", ""),
            "permalink": metadata.get("permalink", ""),
            "feature": metadata.get("feature", ""),
            "form_endpoint": metadata.get("form_endpoint", ""),
            "form_entry_id": metadata.get("form_entry_id", ""),
            "nav_title": metadata.get("nav_title", ""),
            "nav_order": metadata.get("nav_order", 999),
            "dialogue_response": metadata.get("dialogue_response", ""),
            "dialogue_style": metadata.get("dialogue_style", ""),
        }

        print(f"  Encrypted: {filename} -> files/{i}.enc")

    # Create key envelopes — one per password
    envelope_manifest = []

    for j, entry in enumerate(manifest["passwords"]):
        password = normalize_password(entry["password"])
        files_for_password = entry["files"]
        label = entry.get("label", f"envelope-{j}")

        # Build the envelope payload: list of {fileIndex, fileKey (hex), metadata}
        envelope_data = []
        for filename in files_for_password:
            envelope_data.append({
                "fileIndex": file_index[filename],
                "fileKey": file_keys[filename].hex(),
                "metadata": file_metadata[filename],
            })

        # Encrypt the envelope under the password
        salt = secrets.token_bytes(32)
        derived_key = derive_key(password, salt)
        payload = json.dumps(envelope_data).encode("utf-8")
        encrypted_envelope = encrypt_aes_gcm(derived_key, payload)

        envelope_out = {
            "salt": salt.hex(),
            "iv": encrypted_envelope["iv"],
            "ciphertext": encrypted_envelope["ciphertext"],
        }

        env_path = os.path.join(OUTPUT_DIR, "envelopes", f"{j}.env")
        with open(env_path, "w") as f:
            json.dump(envelope_out, f)

        envelope_manifest.append({"index": j})
        print(f"  Envelope {j}: password '{password[:2]}***' -> {len(files_for_password)} file(s)")

    # Write the public manifest (just lists how many envelopes exist — no secrets)
    public_manifest = {
        "numFiles": len(all_files),
        "numEnvelopes": len(manifest["passwords"]),
        "envelopes": envelope_manifest,
        "pbkdf2Iterations": PBKDF2_ITERATIONS,
    }
    manifest_path = os.path.join(OUTPUT_DIR, "manifest.json")
    with open(manifest_path, "w") as f:
        json.dump(public_manifest, f, indent=2)

    print(f"\nDone! Encrypted {len(all_files)} files, {len(manifest['passwords'])} envelopes.")
    print(f"Output in {OUTPUT_DIR}/")


if __name__ == "__main__":
    main()
