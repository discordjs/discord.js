#include <sodium.h>

int secretbox_easy(
  unsigned char* ciphertext,
  unsigned char* message,
  int message_len,
  unsigned char* nonce,
  unsigned char* key) {
  return crypto_secretbox_easy(ciphertext, message, message_len, nonce, key);
}
