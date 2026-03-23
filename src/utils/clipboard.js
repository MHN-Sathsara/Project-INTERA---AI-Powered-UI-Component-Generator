/**
 * Clipboard utility functions
 *
 * Author: M.H. Nishan Sathsara
 * Project: AI-Powered UI Component Generator
 */

/**
 * Copies text to clipboard with visual feedback
 * @param {string} text - Text to copy
 * @param {string} buttonId - ID of the copy button for feedback
 * @param {HTMLElement} fallbackElement - Element to select for fallback copy
 */
export const copyToClipboard = async (
  text,
  buttonId = "copy-button",
  fallbackElement = null
) => {
  if (!text) return;

  try {
    await navigator.clipboard.writeText(text);
    showCopyFeedback(buttonId);
  } catch (err) {
    console.error("Failed to copy to clipboard:", err);
    // Fallback for older browsers
    if (fallbackElement) {
      fallbackElement.select();
      document.execCommand("copy");
      showCopyFeedback(buttonId);
    }
  }
};

/**
 * Shows visual feedback when text is copied
 * @param {string} buttonId - ID of the copy button
 */
const showCopyFeedback = (buttonId) => {
  const button = document.getElementById(buttonId);
  if (!button) return;

  const originalText = button.textContent;
  const originalClasses = button.className;

  button.textContent = "Copied!";
  button.classList.add("bg-green-500");
  button.classList.remove("bg-blue-600", "hover:bg-blue-700");

  setTimeout(() => {
    button.textContent = originalText;
    button.className = originalClasses;
  }, 2000);
};
