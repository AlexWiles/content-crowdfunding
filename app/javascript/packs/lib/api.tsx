export const post = async (url: string, data: object) => {
  const token = (document.getElementsByName("csrf-token")[0] as HTMLMetaElement)
    .content;

  const response = await fetch(url, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-CSRF-Token": token
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *client
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });

  return await response.json();
};

export const patch = async (url: string, data: object) => {
  const token = (document.getElementsByName("csrf-token")[0] as HTMLMetaElement)
    .content;

  const response = await fetch(url, {
    method: "PATCH",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-CSRF-Token": token
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *client
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });

  return await response.json();
};

export const deleteReq = async (url: string, data: object) => {
  const token = (document.getElementsByName("csrf-token")[0] as HTMLMetaElement)
    .content;

  const response = await fetch(url, {
    method: "DELETE",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-CSRF-Token": token
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *client
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });

  return await response.json();
};

export const get = (
  url: string,
  { query }: { query?: { [k: string]: string } }
): {controller: AbortController, resp: Promise<any>}  => {
  const token = (document.getElementsByName("csrf-token")[0] as HTMLMetaElement)
    .content;

  const requrl = new URL(url);
  if (query) {
    const paramObj = new URLSearchParams(query);
    requrl.search = paramObj.toString();
  }

  const controller = new AbortController();

  const response = fetch(requrl.toString(), {
    signal: controller.signal,
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-CSRF-Token": token
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer" // no-referrer, *client
  }).then(resp => resp.json());

  return {controller: controller, resp: response}
};
