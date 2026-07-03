export function isSameUrlNavigation(event: { destination?: { url?: string } }, currentUrl: string): boolean {
  return event?.destination?.url === currentUrl;
}
