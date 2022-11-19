const DEF_DELAY = 1000;

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms || DEF_DELAY));
}
