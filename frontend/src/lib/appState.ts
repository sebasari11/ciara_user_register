/**
 * Application state management
 * Handles UI visibility based on authentication state
 */

export function showApp(isAuthed: boolean): void {
  const authSection = document.getElementById("auth-section");
  const appSection = document.getElementById("app-section");
  
  if (!authSection || !appSection) return;

  if (isAuthed) {
    authSection.classList.add("hidden");
    appSection.classList.remove("hidden");
    // Trigger records load event for AppSection component
    window.dispatchEvent(new CustomEvent('app-shown'));
  } else {
    appSection.classList.add("hidden");
    authSection.classList.remove("hidden");
  }
}

