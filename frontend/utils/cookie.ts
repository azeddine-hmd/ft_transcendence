export function getCookie(cName: string): string | null {
  let name = cName + "=";
  let cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    let c = cookies[i].trim();
    if (c.indexOf(name) == 0) {
      return c.substr(name.length);
    }
  }
  return null;
}

export function setCookie(cName: string, cValue: string, expDays: number) {
  const date = new Date();
  date.setTime(date.getTime() + (expDays * 24 * 60 * 60 * 1000));
  const expires = "expires=" + date.toUTCString();
  document.cookie = cName + "=" + cValue + "; " + expires + "; path=/";
}
