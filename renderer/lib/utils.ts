import axios, { AxiosResponse } from "axios";
import { clsx, type ClassValue } from "clsx";
import toast from "react-hot-toast";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function api(path: string) {
  return `http://localhost:4000/api${path}`;
}

export async function prepare(
  fn: () => Promise<AxiosResponse>,
  successFn?: () => any
): Promise<AxiosResponse> {
  try {
    const res = await fn();
    // if we get here, we know it's a success
    if (successFn) {
      successFn();
    }

    return res;
  } catch (error) {
    // check if the error was thrown from axios
    console.log(error);

    if (axios.isAxiosError(error)) {
      if (error.response) {
        const stdReply = error.response.data;
        toast.error(stdReply.clientMessage ?? "An error occurred!");
      } else {
        toast.error(error.code ?? "An error occurred!!");
      }
    } else {
      toast.error("An error occurred!!!");
    }

    return null;
  }
}

export const fetcher = async (url: string) =>
  prepare(() =>
    axios
      .get(url, {
        withCredentials: true,
      })
      .then((res) => res.data)
  );
