export const copyToClipboard = (text: string, onSuccess?: Function) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      console.log('Text copied to clipboard:', text);
      onSuccess?.();
    })
    .catch((error) => {
      console.error('Failed to copy text to clipboard:', error);
    });
};
